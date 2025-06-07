<<<<<<< HEAD
var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

/**
 * GraphQL Federation Configuration;
 * 
 * This module configures Apollo Federation to create a unified GraphQL schema;
 * across multiple microservices. It implements:
 * 
 * - Service discovery for GraphQL endpoints;
 * - Schema composition with conflict resolution;
 * - Type merging and references across services;
 * - Query planning and execution;
 * - Caching with invalidation;
=======
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
>>>>>>> master
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
  name: string;
  url: string;
}

export interface FederationConfig {
  services: ServiceDefinition[];
  redisConfig: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  enablePlayground: boolean;
  enableIntrospection: boolean;
  defaultQueryTimeout: number;
  logger: ILogger;
  metrics: MetricsCollector;
}

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
    
<<<<<<< HEAD
    // Initialize Redis;
=======
    // Initialize Redis
>>>>>>> master
    this.redis = new Redis({
      host: config.redisConfig.host,
      port: config.redisConfig.port,
      password: config.redisConfig.password,
      db: config.redisConfig.db || 0,
    });
    
<<<<<<< HEAD
    // Create authenticated data source class;
    class AuthenticatedDataSource extends RemoteGraphQLDataSource {
      willSendRequest({ request, context }: unknown) {
        // Pass user information to downstream services;
=======
    // Create authenticated data source class
    class AuthenticatedDataSource extends RemoteGraphQLDataSource {
      willSendRequest({ request, context }: any) {
        // Pass user information to downstream services
>>>>>>> master
        if (context.user) {
          request.http.headers.set('x-user-id', context.user.id);
          request.http.headers.set('x-user-roles', JSON.stringify(context.user.roles));
        }
        
<<<<<<< HEAD
        // Pass trace context for distributed tracing;
=======
        // Pass trace context for distributed tracing
>>>>>>> master
        if (context.trace) {
          request.http.headers.set('x-trace-id', context.trace.traceId);
          request.http.headers.set('x-span-id', context.trace.spanId);
        }
        
<<<<<<< HEAD
        // Set request timeout;
        request.http.timeout = config.defaultQueryTimeout;
      }
      
      async didReceiveResponse({ response, request, context }: unknown) {
        // Track timing metrics for downstream services;
=======
        // Set request timeout
        request.http.timeout = config.defaultQueryTimeout;
      }
      
      async didReceiveResponse({ response, request, context }: any) {
        // Track timing metrics for downstream services
>>>>>>> master
        const serviceName = this.url.split('/').pop() || 'unknown';
        const operationName = request.operationName || 'unknown';
        
        this.metrics.recordHistogram('graphql.service_response_time', response.extensions?.timing || 0, {
          service: serviceName,
<<<<<<< HEAD
          operation: operationName;
=======
          operation: operationName
>>>>>>> master
        });
        
        return response;
      }
      
<<<<<<< HEAD
      async didEncounterError({ error, request, context }: unknown) {
        // Track error metrics;
=======
      async didEncounterError({ error, request, context }: any) {
        // Track error metrics
>>>>>>> master
        const serviceName = this.url.split('/').pop() || 'unknown';
        const operationName = request.operationName || 'unknown';
        
        this.metrics.incrementCounter('graphql.service_errors', 1, {
          service: serviceName,
          operation: operationName,
<<<<<<< HEAD
          errorType: error.name || 'UnknownError';
=======
          errorType: error.name || 'UnknownError'
>>>>>>> master
        });
        
        this.logger.error('GraphQL federation service error', {
          service: serviceName,
          operation: operationName,
<<<<<<< HEAD
          error: error.message;
        });
        
        // Pass through the error;
=======
          error: error.message
        });
        
        // Pass through the error
>>>>>>> master
        return error;
      }
    }
    
<<<<<<< HEAD
    // Initialize Apollo Gateway;
=======
    // Initialize Apollo Gateway
>>>>>>> master
    this.gateway = new ApolloGateway({
      supergraphSdl: new IntrospectAndCompose({
        subgraphs: config.services.map(service => ({
          name: service.name,
<<<<<<< HEAD
          url: service.url;
        })),
        pollIntervalInMs: 60000, // Poll for schema changes every minute;
=======
          url: service.url
        })),
        pollIntervalInMs: 60000, // Poll for schema changes every minute
>>>>>>> master
      }),
      buildService: ({ url }) => new AuthenticatedDataSource({ url }),
      experimental_didUpdateComposition: ({ typeDefs, errors }) => {
        if (errors) {
          this.logger.error('Error composing GraphQL schema', { errors });
          return;
        }
        
        this.logger.info('GraphQL schema updated successfully');
      },
      experimental_didFailComposition: ({ errors }) => {
        this.logger.error('Failed to compose GraphQL schema', { errors });
      },
<<<<<<< HEAD
      __exposeQueryPlanExperimental: config.enablePlayground;
    });
    
    // Initialize Apollo Server;
=======
      __exposeQueryPlanExperimental: config.enablePlayground
    });
    
    // Initialize Apollo Server
>>>>>>> master
    this.server = new ApolloServer({
      gateway: this.gateway,
      plugins: [
        ApolloServerPluginCacheControl({
<<<<<<< HEAD
          defaultMaxAge: 30, // Default max age of 30 seconds;
=======
          defaultMaxAge: 30, // Default max age of 30 seconds
>>>>>>> master
        }),
        responseCachePlugin({
          cache: new RedisCache({
            client: this.redis,
<<<<<<< HEAD
            prefix: 'apollo-cache:';
          }),
          sessionId: (requestContext) => {
            // Create a cache key based on user and roles;
            if (requestContext.context.user) {
              return `${requestContext.context.user.id}:${requestContext.context.user.roles.join(',')}`;
            }
            return null; // No caching for unauthenticated requests;
=======
            prefix: 'apollo-cache:'
          }),
          sessionId: (requestContext) => {
            // Create a cache key based on user and roles
            if (requestContext.context.user) {
              return `${requestContext.context.user.id}:${requestContext.context.user.roles.join(',')}`;
            }
            return null; // No caching for unauthenticated requests
>>>>>>> master
          }
        }),
        config.enablePlayground ? ApolloServerPluginLandingPageGraphQLPlayground() : undefined,
        {
<<<<<<< HEAD
          // Plugin for metrics collection;
=======
          // Plugin for metrics collection
>>>>>>> master
          async serverWillStart() {
            config.logger.info('GraphQL Federation gateway starting...');
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
<<<<<<< HEAD
                const duration = Number(endTime - startTime) / 1_000_000; // Convert to ms;
                
                config.metrics.recordHistogram('graphql.request_duration', duration, {
                  operation: requestContext.operationName || 'unknown';
=======
                const duration = Number(endTime - startTime) / 1_000_000; // Convert to ms
                
                config.metrics.recordHistogram('graphql.request_duration', duration, {
                  operation: requestContext.operationName || 'unknown'
>>>>>>> master
                });
                
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
<<<<<<< HEAD
            spanId: req.headers['x-span-id'] || '';
=======
            spanId: req.headers['x-span-id'] || ''
>>>>>>> master
          }
        };
      },
      introspection: config.enableIntrospection,
      cache: new RedisCache({
        client: this.redis,
<<<<<<< HEAD
        prefix: 'apollo-schema:';
=======
        prefix: 'apollo-schema:'
>>>>>>> master
      }),
    });
  }
  
  /**
<<<<<<< HEAD
   * Initialize the federation gateway;
=======
   * Initialize the federation gateway
>>>>>>> master
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
<<<<<<< HEAD
   * Apply the Apollo Server to an Express app;
   * @param app Express application;
   * @param path URL path for the GraphQL endpoint;
   */
  public applyMiddleware(app: Express, path: string = '/graphql'): void {
    // Apply authentication middleware first;
    app.use(path, authMiddleware);
    
    // Apply Apollo Server;
=======
   * Apply the Apollo Server to an Express app
   * @param app Express application
   * @param path URL path for the GraphQL endpoint
   */
  public applyMiddleware(app: Express, path: string = '/graphql'): void {
    // Apply authentication middleware first
    app.use(path, authMiddleware);
    
    // Apply Apollo Server
>>>>>>> master
    this.server.applyMiddleware({
      app,
      path,
      cors: {
        origin: '*',
<<<<<<< HEAD
        credentials: true;
=======
        credentials: true
>>>>>>> master
      }
    });
    
    this.logger.info(`GraphQL Federation endpoint available at ${path}`);
  }
  
  /**
<<<<<<< HEAD
   * Shut down the federation gateway;
=======
   * Shut down the federation gateway
>>>>>>> master
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
<<<<<<< HEAD
   * Invalidate the cache for a specific type or entity;
   * @param typename The GraphQL type name;
   * @param id Optional entity ID to invalidate specific entity;
   */
  public async invalidateCache(typename: string, id?: string): Promise<void> {
    try {
      const pattern = id;
=======
   * Invalidate the cache for a specific type or entity
   * @param typename The GraphQL type name
   * @param id Optional entity ID to invalidate specific entity
   */
  public async invalidateCache(typename: string, id?: string): Promise<void> {
    try {
      const pattern = id 
>>>>>>> master
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