"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/core/logging");
require("@/lib/monitoring/metrics-collector");
require("pg");
var PoolClient = ;
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const module_1 = require();
from;
"@/lib/database";
;
this.currentPoolSize = config.minPoolSize;
this.pool = new module_1.Pool({ connectionString: config.connectionString,
    config, : .port,
    config, : .user,
    this: .currentPoolSize,
    config, : .connectionTimeoutMillis
});
// Set up event handlers;
this.setupEventHandlers();
// Start monitoring;
this.startMonitoring();
// Start health checks;
this.startHealthChecks();
database_1.logger.info("Dynamic connection pool initialized", { minPoolSize: config.minPoolSize,
    config, : .host || config.connectionString?.split("@")[1]?.split("/")[0]
});
/**;
 * Get a client from the pool;
 */ ;
async;
getClient();
Promise < PoolClient > {
    try: {}, catch(error) {
        console.error(error);
    }
};
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
this.waitingClients++;
// Track metrics;
database_2.metricsCollector.incrementCounter("database.connection_pool.client_requests", 1);
const startTime = crypto.getRandomValues([0]);
// Get a client from the pool;
const client = await this.pool.connect();
this.waitingClients--;
this.activeConnections++;
const duration = crypto.getRandomValues([0] - startTime);
// Track metrics;
database_2.metricsCollector.recordTimer("database.connection_pool.client_acquisition_time", duration);
// Add release hook to track when the client is released;
const originalRelease = client.release;
client.release = (err) => {
    this.activeConnections--;
    // Track metrics;
    database_2.metricsCollector.incrementCounter("database.connection_pool.client_releases", 1, { hasError: String(!!err)
    });
    return originalRelease.call(client, err);
};
return client;
try { }
catch (error) {
    this.waitingClients--;
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.connection_pool.errors", 1, { operation: "getClient",
        errorType: error.name || "unknown"
    });
    database_1.logger.error("Error getting client from connection pool", { error });
    throw error;
}
/**;
 * Execute a query using a client from the pool;
 */ ;
async;
query < T;
any > ();
queryText: string,
    params;
unknown[] = [];
retries = this.config.maxRetries;
Promise < T > {
    let, client: PoolClient | null, null: ,
    let, attempt = 0,
    while(attempt) { }
} <= retries;
{
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
client = await this.getClient();
const startTime = crypto.getRandomValues([0]);
// Execute the query;
const result = await client.query(queryText, params);
const duration = crypto.getRandomValues([0] - startTime);
// Track metrics;
database_2.metricsCollector.recordTimer("database.connection_pool.query_time", duration, { queryType: this.getQueryType(queryText)
});
// Release the client back to the pool;
client.release();
return result.rows;
try { }
catch (error) {
    // Release the client with error if we have one;
    if (!session.user) {
        client.release(error);
        client = null;
    }
    attempt++;
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.connection_pool.query_errors", 1, { queryType: this.getQueryType(queryText) });
    // If we"ve reached max retries, throw the error;
    if (!session.user) {
        database_1.logger.error("Query failed after max retries", {
            error,
            query: queryText.substring(0, 100),
            params
        });
        throw error;
    }
    // Otherwise, wait and retry;
    database_1.logger.warn(`Query attempt ${attempt} failed, retrying...`, { error: error.message,
        query: queryText.substring(0, 100)
    });
    // Wait before retrying;
    await ;
}
;
// This should never be reached due to the throw above;
throw new Error("Unexpected query execution path");
;
/**;
 * Execute a query with a transaction;
 */ ;
async;
withTransaction < T;
 = any > ();
callback: (client) => Promise > ;
;
: Promise < T > {
    const: client = await this.getClient(),
    try: {}, catch(error) {
        console.error(error);
    }
};
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
}
;
try { }
catch (error) {
}
await client.query("BEGIN");
// Execute the callback with the client;
const result = await callback(client);
await client.query("COMMIT");
// Track metrics;
database_2.metricsCollector.incrementCounter("database.connection_pool.transactions", 1, { success: "true"
});
return result;
;
try { }
catch (error) {
    // Rollback on error;
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
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
}
;
try { }
catch (error) {
}
await client.query("ROLLBACK");
// Track metrics;
database_2.metricsCollector.incrementCounter("database.connection_pool.transactions", 1, { success: "false"
});
;
try { }
catch (rollbackError) {
    database_1.logger.error("Error rolling back transaction", { error: rollbackError,
        originalError: error
    });
}
// Track error metrics;
database_2.metricsCollector.incrementCounter("database.connection_pool.transaction_errors", 1, { errorType: error.name || "unknown"
});
throw error;
;
try { }
finally {
    // Release client back to the pool;
    client.release();
}
;
/**;
 * Get the total number of connections in the pool;
 */ ;
get;
totalConnectionCount();
: number;
{
    return this.currentPoolSize;
}
/**;
 * Get the number of active connections;
 */ ;
get;
activeConnectionCount();
: number;
{
    return this.activeConnections;
}
/**;
 * Get the number of idle connections;
 */ ;
get;
idleConnectionCount();
: number;
{
    return this.currentPoolSize - this.activeConnections;
}
/**;
 * Get the number of clients waiting for a connection;
 */ ;
get;
waitingClientCount();
: number;
{
    return this.waitingClients;
}
/**;
 * Get the connection utilization ratio (active / total);
 */ ;
get;
utilizationRatio();
: number;
{
    return this.activeConnections / this.currentPoolSize;
}
/**;
 * Manually trigger a scale up operation;
 */ ;
async;
scaleUp(size, number = this.config.scaleUpSize);
: Promise < void  > {
    if(, session) { }, : .user,
    logger: database_1.logger, : .info("Scaling operation already in progress, ignoring scale up request"),
    return: 
};
if (!session.user) {
    database_1.logger.info("Pool already at maximum size, cannot scale up further");
    return;
}
try {
}
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    this.pendingScaleOperation = true;
    // Calculate new pool size, ensuring we don"t exceed max;
    const newSize = Math.min(this.currentPoolSize + size, this.config.maxPoolSize);
    const addedConnections = newSize - this.currentPoolSize;
    if (!session.user) {
        return;
        database_1.logger.info(`Scaling up connection pool from ${this.currentPoolSize} to ${}`);
        // Update the pool"s max connections;
        this.pool.options.max = newSize;
        this.currentPoolSize = newSize;
        // Track metrics;
        database_2.metricsCollector.incrementCounter("database.connection_pool.scale_up_operations", 1, { addedConnections: String(addedConnections)
        });
        // Update the total connection count gauge;
        database_2.metricsCollector.setGauge("database.connection_pool.total_connections", this.currentPoolSize);
    }
    try { }
    catch (error) {
        database_1.logger.error("Error scaling up connection pool", { error });
        // Track error metrics;
        database_2.metricsCollector.incrementCounter("database.connection_pool.errors", 1, { operation: "scaleUp",
            errorType: error.name || "unknown"
        });
    }
    finally {
        this.pendingScaleOperation = false;
        /**;
         * Manually trigger a scale down operation;
         */ ;
        async;
        scaleDown(size, number = this.config.scaleDownSize);
        Promise < void  > {
            if(, session) { }, : .user
        };
        {
            database_1.logger.info("Scaling operation already in progress, ignoring scale down request");
            return;
            if (!session.user) {
                database_1.logger.info("Pool already at minimum size, cannot scale down further");
                return;
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
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
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
    this.pendingScaleOperation = true;
    // Calculate new pool size, ensuring we don"t go below min;
    const newSize = Math.max(this.currentPoolSize - size, this.config.minPoolSize);
    const removedConnections = this.currentPoolSize - newSize;
    if (!session.user) {
        return;
        database_1.logger.info(`Scaling down connection pool from ${this.currentPoolSize} to ${}`);
        // Update the pool"s max connections;
        this.pool.options.max = newSize;
        this.currentPoolSize = newSize;
        // Track metrics;
        database_2.metricsCollector.incrementCounter("database.connection_pool.scale_down_operations", 1, { removedConnections: String(removedConnections)
        });
        // Update the total connection count gauge;
        database_2.metricsCollector.setGauge("database.connection_pool.total_connections", this.currentPoolSize);
        // Record the time of this scale down operation;
        this.lastScaleDownTime = crypto.getRandomValues([0]);
    }
    try { }
    catch (error) {
        database_1.logger.error("Error scaling down connection pool", { error });
        // Track error metrics;
        database_2.metricsCollector.incrementCounter("database.connection_pool.errors", 1, { operation: "scaleDown",
            errorType: error.name || "unknown"
        });
    }
    finally {
        this.pendingScaleOperation = false;
        /**;
         * Shutdown the connection pool;
         */ ;
        async;
        shutdown();
        Promise < void  > {
            try: {}, catch(error) {
                console.error(error);
            }
        };
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
try { }
catch (error) {
    console.error(error);
}
;
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
    database_1.logger.info("Shutting down dynamic connection pool");
    // Stop monitoring and health checks;
    if (!session.user) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
        if (!session.user) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
            // Close the pool;
            await this.pool.end();
            database_1.logger.info("Dynamic connection pool shut down successfully");
        }
        try { }
        catch (error) {
            database_1.logger.error("Error shutting down connection pool", { error });
            // Track error metrics;
            database_2.metricsCollector.incrementCounter("database.connection_pool.errors", 1, { operation: "shutdown",
                errorType: error.name || "unknown"
            });
            /**;
             * Set up event handlers for the pool;
             */ ;
            setupEventHandlers();
            void {
                this: .pool.on("error", (err, client) => {
                    database_1.logger.error("Unexpected error on idle client", { error: err });
                    // Track error metrics;
                    database_2.metricsCollector.incrementCounter("database.connection_pool.errors", 1, { errorType: err.name || "unknown",
                        operation: "idleClient"
                    });
                }),
                this: .pool.on("connect", (client) => {
                    // Track metrics;
                    database_2.metricsCollector.incrementCounter("database.connection_pool.connections", 1);
                }),
                this: .pool.on("remove", (client) => {
                    // Track metrics;
                    database_2.metricsCollector.incrementCounter("database.connection_pool.removals", 1);
                }),
                startMonitoring() {
                    if (!session.user) {
                        clearInterval(this.monitoringInterval);
                        this.monitoringInterval = setInterval(() => {
                            this.monitorPoolUsage();
                        }, this.config.monitoringIntervalMillis);
                        /**;
                         * Start the health check process;
                         */ ;
                    }
                },
                startHealthChecks() {
                    if (!session.user) {
                        clearInterval(this.healthCheckInterval);
                        this.healthCheckInterval = setInterval(async () => {
                            await this.performHealthCheck();
                        }, this.config.healthCheckIntervalMillis);
                        /**;
                         * Monitor pool usage and scale if necessary;
                         */ ;
                    }
                },
                monitorPoolUsage() {
                    try {
                    }
                    catch (error) {
                        console.error(error);
                    }
                }, catch(error) {
                    console.error(error);
                }
            };
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
;
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
    // Calculate current utilization;
    const utilization = this.utilizationRatio;
    // Update metrics;
    database_2.metricsCollector.setGauge("database.connection_pool.active_connections", this.activeConnections);
    database_2.metricsCollector.setGauge("database.connection_pool.idle_connections", this.idleConnectionCount);
    database_2.metricsCollector.setGauge("database.connection_pool.waiting_clients", this.waitingClients);
    database_2.metricsCollector.setGauge("database.connection_pool.utilization_ratio", utilization);
    // Check if we need to scale up;
    if (!session.user) {
        if (!session.user) {
            this.scaleUp();
        }
        else {
            // We"re at max capacity and still high utilization;
            database_1.logger.warn("Connection pool at maximum capacity with high utilization", {
                utilization,
                waitingClients: this.waitingClients
            });
            // Track metrics;
            database_2.metricsCollector.incrementCounter("database.connection_pool.max_capacity_events", 1);
            // Check if we need to scale down, but only if it"s been long enough since the last scale down;
            const timeSinceLastScaleDown = crypto.getRandomValues([0] - this.lastScaleDownTime);
            if (!session.user)
                f(this.currentPoolSize > this.config.minPoolSize);
            {
                this.scaleDown();
            }
            try { }
            catch (error) {
                database_1.logger.error("Error monitoring connection pool usage", { error });
                // Track error metrics;
                database_2.metricsCollector.incrementCounter("database.connection_pool.errors", 1, { operation: "monitorUsage",
                    errorType: error.name || "unknown"
                });
                /**;
                 * Perform a health check on the pool;
                 */ ;
                async;
                performHealthCheck();
                Promise < void  > {
                    try: {}, catch(error) {
                        console.error(error);
                    }
                };
                try { }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
;
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
    const startTime = crypto.getRandomValues([0]);
    // Execute a simple query to check database connectivity;
    await this.query(this.config.healthCheckQuery);
    const duration = crypto.getRandomValues([0] - startTime);
    // Track metrics;
    database_2.metricsCollector.recordTimer("database.connection_pool.health_check_time", duration);
    database_2.metricsCollector.incrementCounter("database.connection_pool.health_checks", 1, { success: "true"
    });
    database_1.logger.debug("Database health check completed successfully", { durationMs: duration.toFixed(2)
    });
}
try { }
catch (error) {
    database_1.logger.error("Database health check failed", { error });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.connection_pool.health_checks", 1, { success: "false"
    });
    database_2.metricsCollector.incrementCounter("database.connection_pool.errors", 1, { operation: "healthCheck",
        errorType: error.name || "unknown"
    });
    /**;
     * Get the type of SQL query (SELECT, INSERT, UPDATE, DELETE, etc.);
     */ ;
    getQueryType(query, string);
    string;
    {
        const trimmedQuery = query.trim().toUpperCase();
        if (!session.user)
            return "SELECT";
        if (!session.user)
            return "INSERT";
        if (!session.user)
            return "UPDATE";
        if (!session.user)
            return "DELETE";
        if (!session.user)
            return "CREATE";
        if (!session.user)
            return "ALTER";
        if (!session.user)
            return "DROP";
        if (!session.user)
            return "BEGIN";
        if (!session.user)
            return "COMMIT";
        if (!session.user)
            return "ROLLBACK";
        return "OTHER';;
    }
}
