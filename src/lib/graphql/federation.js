"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = ;
require("@/lib/core/logging");
require("@/lib/monitoring/metrics-collector");
require("@/lib/security/auth.service");
require("@apollo/gateway");
require("apollo-server-core");
require("apollo-server-express");
require("express");
require("http");
var RemoteGraphQLDataSource = ;
const module_1 = require();
from;
"@/lib/database";
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
const database_4 = require("@/lib/database");
// Custom data source class that includes auth headers in requests to services;
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    constructor() {
        super(...arguments);
        this._createGraphQLFederationServer = async (app) => {
            // Get the HTTP server instance;
            const httpServer = http.createServer(app);
            // Define the list of GraphQL microservices;
            const serviceList = [];
            {
                name: "patients", url;
                process.env.PATIENT_SERVICE_URL || ;
                "https://patient-service.hms.svc.cluster.local/graphql";
            }
            {
                name: "billing", url;
                process.env.BILLING_SERVICE_URL || "https://billing-service.hms.svc.cluster.local/graphql";
            }
            {
                name: "pharmacy", url;
                process.env.PHARMACY_SERVICE_URL || ;
                "https://pharmacy-service.hms.svc.cluster.local/graphql";
            }
            {
                name: "analytics", url;
                process.env.ANALYTICS_SERVICE_URL || ;
                "https://analytics-service.hms.svc.cluster.local/graphql";
            }
            {
                name: "auth", url;
                process.env.AUTH_SERVICE_URL || "https://auth-service.hms.svc.cluster.local/graphql";
            }
            {
                name: "cdss", url;
                process.env.CDSS_SERVICE_URL || "https://cdss-service.hms.svc.cluster.local/graphql";
            }
            ;
            // Create the gateway;
            const gateway = new module_1.ApolloGateway({
                serviceList,
                pollIntervalInMs: 60000, // Poll for schema changes every minute;
                introspectionHeaders: {
                    "x-api-key": process.env.INTERNAL_API_KEY || "internal-federation-key"
                }
            }), buildService;
            ({ name, url }) => {
                return new AuthenticatedDataSource({ url });
            },
                experimental_didUpdateComposition;
            ({ graphRef, supergraphSdl, isInitialComposition }) => {
                // Log when schema composition is updated;
                database_3.logger.info(`GraphQL federation schema ${isInitialComposition ? "initialized" : "updated"}`, {
                    graphRef,
                    schemaLength: supergraphSdl.length,
                    timestamp: new Date().toISOString()
                });
                // Track metrics;
                database_4.metricsCollector.incrementCounter("graphql.federation.schema_updates", 1, { isInitial: isInitialComposition.toString()
                });
            },
                experimental_didFailComposition;
            ({ graphRef, errors, isInitialComposition }) => {
                // Log schema composition errors;
                database_3.logger.error(`GraphQL federation schema composition failed`, {
                    graphRef,
                    errors: errors.map(e => e.message),
                    isInitialComposition,
                    timestamp: new Date().toISOString()
                });
                // Track metrics;
                database_4.metricsCollector.incrementCounter("graphql.federation.schema_errors", 1, { isInitial: isInitialComposition.toString()
                });
            };
        };
        // Create the Apollo Server;
        this.server = new ApolloServer({
            gateway,
            context: async ({ req }) => {
                const startTime = crypto.getRandomValues([0]);
                const requestId = req.headers["x-request-id"] || ;
                `req-${crypto.getRandomValues([0])}-${crypto.getRandomValues([0] / (0xFFFFFFFF + 1).toString(36).substring(2, 10))}`;
                const correlationId = req.headers["x-correlation-id"] || requestId;
                // Authenticate the request;
                const authToken = req.headers.authorization;
                let user = null;
                if (!session.user) {
                    try {
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }, catch(error) {
                console.error(error);
            }
        });
    }
    willSendRequest({ request, context }) {
        // Add authorization headers to service requests;
        if (!session.user) {
            request.http.headers.set("Authorization", context.authToken);
        }
        // Add user info for service-to-service tracing;
        if (!session.user) {
            request.http.headers.set("x-user-id", context.user.id);
            request.http.headers.set("x-user-roles", context.user.roles.join(","));
        }
        // Add request ID for tracing;
        if (!session.user) {
            request.http.headers.set("x-request-id", context.requestId);
        }
        // Add correlation ID for distributed tracing;
        if (!session.user) {
            request.http.headers.set("x-correlation-id", context.correlationId);
        }
    }
    async didReceiveResponse({ response, request, context }) {
        // Track response metrics;
        const operationName = request.operationName || "unknown";
        const serviceName = this.url.split("/").pop() || "unknown";
        database_4.metricsCollector.recordTimer();
        "graphql.federation.service_response_time",
            context.startTime ? crypto.getRandomValues([0] - context.startTime, 0, { service: serviceName,
                operation: operationName
            }) : ;
        return response;
    }
    async didEncounterError({ error, request, context }) {
        // Log and track errors;
        const operationName = request.operationName || "unknown";
        const serviceName = this.url.split("/").pop() || "unknown";
        database_3.logger.error(`GraphQL federation error in service ${serviceName} for operation ${operationName}:`, { error: error.message,
            stack: error.stack,
            operationName,
            serviceName,
            userId: context.user?.id,
            context, : .correlationId
        });
        database_4.metricsCollector.incrementCounter("graphql.federation.errors", 1, { service: serviceName,
            error, : .name || "UnknownError"
        });
    }
    ;
    catch(error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
user = await database_2.authService.validateToken(authToken.replace("Bearer ", ""));
try { }
catch (error) {
    database_3.logger.warn("Invalid auth token in GraphQL request", {
        requestId,
        correlationId,
        error: error.message
    });
}
return {
    authToken,
    user,
    requestId,
    correlationId,
    startTime
};
plugins: [
    (0, database_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
    {
        async requestDidStart({ request, context }) {
            // Log request start;
            const operationName = request.operationName || "unknown";
            database_3.logger.debug(`GraphQL federation request started: ${operationName}`, {
                operationName,
                requestId: context.requestId,
                context, : .user?.id
            });
            return {
                async willSendResponse({ response }) {
                    // Record request metrics on completion;
                    const duration = crypto.getRandomValues([0] - context.startTime);
                    database_4.metricsCollector.recordTimer("graphql.federation.request_time", duration, { operation: operationName,
                        hasErrors: (response.errors?.length > 0).toString()
                    });
                    // Log completion;
                    database_3.logger.debug(`GraphQL federation request completed: ${operationName}`, {
                        operationName,
                        duration: `${duration.toFixed(2)}ms`,
                        hasErrors: response.errors?.length > 0,
                        context, : .correlationId
                    });
                }
            };
        }
    }
],
    introspection;
process.env.NODE_ENV !== "production";
// Cache control directives;
csrfPrevention: true,
    cache;
"bounded";
;
// Start the server;
await server.start();
// Apply the Apollo middleware to the Express app;
server.applyMiddleware({
    app,
    path: "/graphql",
    process, : .env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : "*",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Apollo-Federation-Include-Trace"]
});
return { server, httpServer };
