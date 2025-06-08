/**
 * GraphQL Federation Configuration
 * 
 * This module configures Apollo Federation to create a unified GraphQL schema
 * across multiple microservices. It implements:
 * 
 * - Service discovery for GraphQL endpoints
 * - Schema composition with conflict resolution
 * - Type merging and references across services
 * - Query planning and execution
 * - Caching with invalidation
 */

import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginCacheControl, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';
import { Express } from 'express';
import { RedisCache } from 'apollo-server-cache-redis';
import Redis from 'ioredis';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { authMiddleware } from '../middleware/auth';
import { ILogger } from '../../lib/core/logging';
import { MetricsCollector } from '../../lib/monitoring/metrics-collector';

export interface ServiceDefinition {
  name: string,
  url: string
export interface FederationConfig {
  services: ServiceDefinition[],
  redisConfig: {
    host: string,
    port: number;
    password?: string;
    db?: number;
  };
  enablePlayground: boolean,
  enableIntrospection: boolean,
  defaultQueryTimeout: number,
  logger: ILogger,
  metrics: MetricsCollector
export class GraphQLFederation {
  private gateway: ApolloGateway;
  private server: ApolloServer;
  private schema: GraphQLSchema | null = null;
  private redis: Redis.Redis;
  private config: FederationConfig;
  private logger: ILogger;
  private metrics: MetricsCollector;
  
  constructor(config: FederationConfig) {
    this.config = config;
    this.logger = config.logger;
    this.metrics = config.metrics;
    
    // Initialize Redis
    this.redis = new Redis({
      host: config.redisConfig.host,
      port: config.redisConfig.port,
      password: config.redisConfig.password,
      db: config.redisConfig.db || 0,
    })
    
    // Create authenticated data source class
    class AuthenticatedDataSource extends RemoteGraphQLDataSource {
      willSendRequest({ request, context }: any) {
        // Pass user information to downstream services
        if (context.user) {
          request.http.headers.set('x-user-id', context.user.id)
          request.http.headers.set('x-user-roles', JSON.stringify(context.user.roles));
        }
        
        // Pass trace context for distributed tracing
        if (context.trace) {
          request.http.headers.set('x-trace-id', context.trace.traceId)
          request.http.headers.set('x-span-id', context.trace.spanId);
        }
        
        // Set request timeout
        request.http.timeout = config.defaultQueryTimeout
      }
      
      async didReceiveResponse({ response, request, context }: any) {
        // Track timing metrics for downstream services
        const serviceName = this.url.split('/').pop() || 'unknown'
        const operationName = request.operationName || 'unknown';
        
        this.metrics.recordHistogram('graphql.service_response_time', response.extensions?.timing || 0, {
          service: serviceName,
          operation: operationName
        });
        
        return response;
      }
      
      async didEncounterError({ error, request, context }: any) {
        // Track error metrics
        const serviceName = this.url.split('/').pop() || 'unknown'
        const operationName = request.operationName || 'unknown';
        
        this.metrics.incrementCounter('graphql.service_errors', 1, {
          service: serviceName,
          operation: operationName,
          errorType: error.name || 'UnknownError'
        });
        
        this.logger.error('GraphQL federation service error', {
          service: serviceName,
          operation: operationName,
          error: error.message
        });
        
        // Pass through the error
        return error
      }
    }
    
    // Initialize Apollo Gateway
    this.gateway = new ApolloGateway({
      supergraphSdl: new IntrospectAndCompose({
        subgraphs: config.services.map(service => ({
          name: service.name,
          url: service.url
        })),
        pollIntervalInMs: 60000, // Poll for schema changes every minute
      }),
      buildService: ({ url }) => new AuthenticatedDataSource({ url }),
      experimental_didUpdateComposition: ({ typeDefs, errors }) => {
        if (errors) {
          this.logger.error('Error composing GraphQL schema', { errors })
          return;
        }
        
        this.logger.info('GraphQL schema updated successfully');
      },
      experimental_didFailComposition: ({ errors }) => {
        this.logger.error('Failed to compose GraphQL schema', { errors });
      },
      __exposeQueryPlanExperimental: config.enablePlayground
    });
    
    // Initialize Apollo Server
    this.server = new ApolloServer({
      gateway: this.gateway,
      plugins: [
        ApolloServerPluginCacheControl({
          defaultMaxAge: 30, // Default max age of 30 seconds
        }),
        responseCachePlugin({
          cache: new RedisCache({
            client: this.redis,
            prefix: 'apollo-cache:'
          }),
          sessionId: (requestContext) => {
            // Create a cache key based on user and roles
            if (requestContext.context.user) {
              return `${requestContext.context.user.id}:${requestContext.context.user.roles.join(',')}`
            }
            return null; // No caching for unauthenticated requests
          }
        }),
        config.enablePlayground ? ApolloServerPluginLandingPageGraphQLPlayground() : undefined,
        {
          // Plugin for metrics collection
          async serverWillStart() {
            config.logger.info('GraphQL Federation gateway starting...')
            return {
              async serverWillStop() {
                config.logger.info('GraphQL Federation gateway stopping...');
              }
            };
          },
          async requestDidStart() {
            const startTime = process.hrtime.bigint();
            return {
              async willSendResponse(requestContext) {
                const endTime = process.hrtime.bigint();
                const duration = Number(endTime - startTime) / 1_000_000; // Convert to ms
                
                config.metrics.recordHistogram('graphql.request_duration', duration, {
                  operation: requestContext.operationName || 'unknown'
                })
                
                config.metrics.incrementCounter('graphql.requests', 1, {
                  operation: requestContext.operationName || 'unknown',
                  status: requestContext.errors ? 'error' : 'success'
                });
              },
              async didEncounterError(requestContext) {
                config.metrics.incrementCounter('graphql.errors', 1, {
                  operation: requestContext.operationName || 'unknown',
                  errorType: requestContext.errors?.[0]?.extensions?.code || 'UNKNOWN'
                });
              }
            };
          }
        }
      ],
      context: ({ req }) => {
        // Get user from request (set by authMiddleware)
        return {
          user: req.user,
          trace: {
            traceId: req.headers['x-trace-id'] || '',
            spanId: req.headers['x-span-id'] || ''
          }
        }
      },
      introspection: config.enableIntrospection,
      cache: new RedisCache({
        client: this.redis,
        prefix: 'apollo-schema:'
      }),
    });
  }
  
  /**
   * Initialize the federation gateway
   */
  public async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing GraphQL Federation...');
      await this.gateway.load();
      this.logger.info('GraphQL Federation initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize GraphQL Federation', { error });
      throw error;
    }
  }
  
  /**
   * Apply the Apollo Server to an Express app
   * @param app Express application
   * @param path URL path for the GraphQL endpoint
   */
  public applyMiddleware(app: Express, path: string = '/graphql'): void {
    // Apply authentication middleware first
    app.use(path, authMiddleware)
    
    // Apply Apollo Server
    this.server.applyMiddleware({
      app,
      path,
      cors: {
        origin: '*',
        credentials: true
      }
    })
    
    this.logger.info(`GraphQL Federation endpoint available at ${path}`);
  }
  
  /**
   * Shut down the federation gateway
   */
  public async shutdown(): Promise<void> {
    try {
      this.logger.info('Shutting down GraphQL Federation...');
      await this.server.stop();
      await this.redis.quit();
      this.logger.info('GraphQL Federation shut down successfully');
    } catch (error) {
      this.logger.error('Error during GraphQL Federation shutdown', { error });
      throw error;
    }
  }
  
  /**
   * Invalidate the cache for a specific type or entity
   * @param typename The GraphQL type name
   * @param id Optional entity ID to invalidate specific entity
   */
  public async invalidateCache(typename: string, id?: string): Promise<void> {
    try {
      const pattern = id 
        ? `apollo-cache:${typename}:${id}:*` 
        : `apollo-cache:${typename}:*`;
      
      const keys = await this.redis.keys(pattern);
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.logger.debug(`Invalidated ${keys.length} cache entries for ${typename}${id ? ':' + id : ''}`);
      }
    } catch (error) {
      this.logger.error('Error invalidating GraphQL cache', { error, typename, id });
      throw error;
    }
  }
}
