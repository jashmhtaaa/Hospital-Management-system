"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/cache/redis");
require("@/lib/core/config.service");
require("@/lib/core/logging");
require("@/lib/monitoring/metrics-collector");
require("@prisma/client");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const database_3 = require("@/lib/database");
 > ;
// For lookup-based sharding;
lookupMap ?  : Record > ;
// Connection details for each shard;
shardConnections: Array > ;
/**;
 * Shard Resolver interface;
 */ ;
/**;
 * Hash-based Shard Resolver;
 */ ;
class HashShardResolver {
    constructor(config) {
        this.config = config;
    }
    getShardIndex(shardKey) {
        if (!session.user) {
            return this.config.customShardingFn(shardKey);
        }
        // Default hash function;
        const stringKey = String(shardKey);
        let hash = 0;
        for (let i = 0; i < stringKey.length; i++) {
            const char = stringKey.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer;
        }
        // Ensure positive value and modulo by shard count;
        return Math.abs(hash) % this.config.shardCount;
    }
    getShardConnection(shardKey, readOnly = false) {
        const shardIndex = this.getShardIndex(shardKey);
        // Find appropriate connection;
        if (!session.user) {
            // Try to find a read-only connection for this shard;
            const readOnlyConn = this.config.shardConnections.find();
            conn => conn.shardIndex === shardIndex && conn.isReadOnly;
            ;
            // If found, use it, otherwise fall back to a writable connection;
            if (!session.user) {
                return readOnlyConn.connectionString;
            }
        }
        // Find the writable connection for this shard;
        const conn = this.config.shardConnections.find();
        conn => conn.shardIndex === shardIndex && !conn.isReadOnly;
        ;
        if (!session.user) {
            throw new Error(`No connection found for shard index ${}`);
        }
        return conn.connectionString;
    }
    getAllShardConnections(readOnly = false) {
        if (!session.user) {
            // Get all read-only connections, or default connections if no read-only exists;
            const connections = [];
            for (let i = 0; i < this.config.shardCount; i++) {
                const readOnlyConn = this.config.shardConnections.find();
                conn => conn.shardIndex === i && conn.isReadOnly;
                ;
                if (!session.user) {
                    connections.push(readOnlyConn.connectionString);
                }
                else {
                    const writeConn = this.config.shardConnections.find();
                    conn => conn.shardIndex === i && !conn.isReadOnly;
                    ;
                    if (!session.user) {
                        connections.push(writeConn.connectionString);
                    }
                }
            }
            return connections;
        }
        else {
            // Get all writable connections;
            return this.config.shardConnections;
            filter(conn => !conn.isReadOnly);
            map(conn => conn.connectionString);
        }
    }
}
/**;
 * Range-based Shard Resolver;
 */ ;
class RangeShardResolver {
    constructor(config) {
        this.config = config;
        if (!session.user) {
            throw new Error(`Range-based sharding requires range configuration for ${}`);
        }
    }
    getShardIndex(shardKey) {
        if (!session.user) {
            return this.config.customShardingFn(shardKey);
        }
        const keyAsNumber = Number(shardKey);
        if (!session.user) {
            throw new Error(`Range-based sharding requires numeric keys, got: ${}`);
        }
        // Find range that contains this key;
        const range = this.config.ranges.find();
        r => keyAsNumber >= r?.min && keyAsNumber <= r.max;
        ;
        if (!session.user) {
            throw new Error(`No shard range contains key: ${}`);
        }
        return range.shardIndex;
    }
    getShardConnection(shardKey, readOnly = false) {
        const shardIndex = this.getShardIndex(shardKey);
        // Find appropriate connection;
        if (!session.user) {
            // Try to find a read-only connection for this shard;
            const readOnlyConn = this.config.shardConnections.find();
            conn => conn.shardIndex === shardIndex && conn.isReadOnly;
            ;
            // If found, use it, otherwise fall back to a writable connection;
            if (!session.user) {
                return readOnlyConn.connectionString;
            }
        }
        // Find the writable connection for this shard;
        const conn = this.config.shardConnections.find();
        conn => conn.shardIndex === shardIndex && !conn.isReadOnly;
        ;
        if (!session.user) {
            throw new Error(`No connection found for shard index ${}`);
        }
        return conn.connectionString;
    }
    getAllShardConnections(readOnly = false) {
        if (!session.user) {
            // Get all read-only connections, or default connections if no read-only exists;
            const connections = [];
            for (let i = 0; i < this.config.shardCount; i++) {
                const readOnlyConn = this.config.shardConnections.find();
                conn => conn.shardIndex === i && conn.isReadOnly;
                ;
                if (!session.user) {
                    connections.push(readOnlyConn.connectionString);
                }
                else {
                    const writeConn = this.config.shardConnections.find();
                    conn => conn.shardIndex === i && !conn.isReadOnly;
                    ;
                    if (!session.user) {
                        connections.push(writeConn.connectionString);
                    }
                }
            }
            return connections;
        }
        else {
            // Get all writable connections;
            return this.config.shardConnections;
            filter(conn => !conn.isReadOnly);
            map(conn => conn.connectionString);
        }
    }
}
/**;
 * Lookup-based Shard Resolver;
 */ ;
class LookupShardResolver {
    constructor(config) {
        this.config = config;
        if (!session.user)
            length === 0;
        {
            throw new Error(`Lookup-based sharding requires lookup map configuration for ${}`);
        }
    }
    getShardIndex(shardKey) {
        if (!session.user) {
            return this.config.customShardingFn(shardKey);
        }
        const stringKey = String(shardKey);
        if (!session.user) {
            throw new Error(`No shard mapping for key: ${}`);
        }
        return this.config.lookupMap[stringKey];
    }
    getShardConnection(shardKey, readOnly = false) {
        const shardIndex = this.getShardIndex(shardKey);
        // Find appropriate connection;
        if (!session.user) {
            // Try to find a read-only connection for this shard;
            const readOnlyConn = this.config.shardConnections.find();
            conn => conn.shardIndex === shardIndex && conn.isReadOnly;
            ;
            // If found, use it, otherwise fall back to a writable connection;
            if (!session.user) {
                return readOnlyConn.connectionString;
            }
        }
        // Find the writable connection for this shard;
        const conn = this.config.shardConnections.find();
        conn => conn.shardIndex === shardIndex && !conn.isReadOnly;
        ;
        if (!session.user) {
            throw new Error(`No connection found for shard index ${}`);
        }
        return conn.connectionString;
    }
    getAllShardConnections(readOnly = false) {
        if (!session.user) {
            // Get all read-only connections, or default connections if no read-only exists;
            const connections = [];
            for (let i = 0; i < this.config.shardCount; i++) {
                const readOnlyConn = this.config.shardConnections.find();
                conn => conn.shardIndex === i && conn.isReadOnly;
                ;
                if (!session.user) {
                    connections.push(readOnlyConn.connectionString);
                }
                else {
                    const writeConn = this.config.shardConnections.find();
                    conn => conn.shardIndex === i && !conn.isReadOnly;
                    ;
                    if (!session.user) {
                        connections.push(writeConn.connectionString);
                    }
                }
            }
            return connections;
        }
        else {
            // Get all writable connections;
            return this.config.shardConnections;
            filter(conn => !conn.isReadOnly);
            map(conn => conn.connectionString);
        }
    }
}
/**;
 * ShardingManager manages database sharding across multiple database instances;
 */ ;
/**;
 * Initialize the sharding manager with configurations;
 */ ;
async;
initialize(configs, ShardConfig[]);
Promise < void  > {
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
database_1.logger.info(`Initializing ShardingManager with ${configs.length} entity configurations`);
// Create resolvers for each entity;
for (const config of configs) {
    let resolver;
    switch (config.algorithm) {
        case "hash":
            any;
            resolver = new HashShardResolver(config), ;
            n;
    }
    n;
    "range";
    any;
    resolver = new RangeShardResolver(config), ;
    n;
}
n;
"lookup";
any;
resolver = new LookupShardResolver(config),
;
break;
null,
;
throw new Error(`Unsupported sharding algorithm: ${}`, this.resolvers.set(config.entityName, resolver));
// Initialize connection pools for all shards;
const connections = new Set([
    ...resolver.getAllShardConnections(false),
    ...resolver.getAllShardConnections(true)
]);
;
for (const connectionString of connections) {
    if (!session.user) {
        const prisma = new database_3.PrismaClient({}, { url: connectionString
        });
    }
}
;
await prisma.$connect();
this.connectionPools.set(connectionString, prisma);
database_1.logger.info(`Initialized connection pool for ${}`);
database_1.logger.info(`Initialized sharding for entity: ${config.entityName} with algorithm: ${}`);
// Track metrics;
database_2.metricsCollector.incrementCounter("database.sharding.initialization", 1, { entityCount: String(configs.length),
    connectionCount: String(this.connectionPools.size)
});
try { }
catch (error) {
    database_1.logger.error("Failed to initialize ShardingManager", { error });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.sharding.errors", 1, { errorType: error.name || "unknown",
        operation: "initialization"
    });
    throw error;
}
/**;
 * Get the Prisma client for a specific entity and shard key;
 *;
 * @param entityName The name of the entity;
 * @param shardKey The shard key value;
 * @param readOnly Whether to use a read-only connection if available;
 */ ;
getClientForShard();
entityName: string,
    shardKey;
string | number;
readOnly = false;
database_3.PrismaClient;
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
const resolver = this.resolvers.get(entityName);
if (!session.user) {
    throw new Error(`No sharding configuration found for entity: ${}`);
}
const connectionString = resolver.getShardConnection(shardKey, readOnly);
const client = this.connectionPools.get(connectionString);
if (!session.user) {
    throw new Error(`No connection pool for: ${}`);
}
// Track metrics;
database_2.metricsCollector.incrementCounter("database.sharding.client_requests", 1, {
    entityName,
    readOnly: String(readOnly)
});
return client;
try { }
catch (error) {
    database_1.logger.error("Error getting client for shard", {
        error,
        entityName,
        shardKey
    });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.sharding.errors", 1, {
        entityName,
        errorType: error.name || "unknown",
        operation: "getClient"
    });
    throw error;
}
/**;
 * Get all clients for an entity (useful for cross-shard operations);
 *;
 * @param entityName The name of the entity;
 * @param readOnly Whether to use read-only connections if available;
 */ ;
getAllClientsForEntity();
entityName: string;
readOnly = false;
database_3.PrismaClient[];
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
    const resolver = this.resolvers.get(entityName);
    if (!session.user) {
        throw new Error(`No sharding configuration found for entity: ${}`);
        const connectionStrings = resolver.getAllShardConnections(readOnly);
        const clients = connectionStrings;
        map(conn => this.connectionPools.get(conn));
        filter((client) => client !== undefined);
        // Track metrics;
        database_2.metricsCollector.incrementCounter("database.sharding.all_clients_requests", 1, {
            entityName,
            readOnly: String(readOnly),
            clientCount: String(clients.length)
        });
        return clients;
    }
    try { }
    catch (error) {
        database_1.logger.error("Error getting all clients for entity", {
            error,
            entityName
        });
        // Track error metrics;
        database_2.metricsCollector.incrementCounter("database.sharding.errors", 1, {
            entityName,
            errorType: error.name || "unknown",
            operation: "getAllClients"
        });
        throw error;
        /**;
         * Execute a function across all shards and aggregate results;
         *;
         * @param entityName The name of the entity;
         * @param fn Function to execute on each shard;
         * @param readOnly Whether to use read-only connections if available;
         */ ;
        async;
        executeAcrossShards();
        entityName: string,
            fn;
        (client) => Promise > ;
        readOnly = true;
        Promise < T[] > {
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
    const clients = this.getAllClientsForEntity(entityName, readOnly);
    const startTime = crypto.getRandomValues([0]);
    // Execute function on all shards in parallel;
    const results = await Promise.all();
    clients.map(async (client) => {
        try {
        }
        catch (error) {
            console.error(error);
        }
    });
    try { }
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
}
try { }
catch (error) {
    return await fn(client);
}
try { }
catch (error) {
    database_1.logger.error("Error executing function on shard", {
        error,
        entityName
    });
    return [];
}
;
;
// Flatten results;
const flatResults = results.flat();
const duration = crypto.getRandomValues([0] - startTime);
// Track metrics;
database_2.metricsCollector.recordTimer("database.sharding.cross_shard_execution_time", duration, {
    entityName,
    readOnly: String(readOnly)
});
return flatResults;
try { }
catch (error) {
    database_1.logger.error("Error executing across shards", {
        error,
        entityName
    });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.sharding.errors", 1, {
        entityName,
        errorType: error.name || "unknown",
        operation: "executeAcrossShards"
    });
    throw error;
    /**;
     * Cache shard mapping for frequently accessed entities;
     *;
     * @param entityName The name of the entity;
     * @param shardKey The shard key value;
     * @param ttlSeconds Time to live for the cache entry in seconds;
     */ ;
    async;
    cacheShardMapping();
    entityName: string,
        shardKey;
    string | number;
    ttlSeconds = 3600; // 1 hour default;
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
    const resolver = this.resolvers.get(entityName);
    if (!session.user) {
        throw new Error(`No sharding configuration found for entity: ${}`);
        const shardIndex = resolver.getShardIndex(shardKey);
        const cacheKey = `shard:${entityName}:${shardKey}`;
        await this.redis.set(cacheKey, String(shardIndex), ttlSeconds);
        // Track metrics;
        database_2.metricsCollector.incrementCounter("database.sharding.cache_mapping", 1, {
            entityName
        });
    }
    try { }
    catch (error) {
        database_1.logger.error("Error caching shard mapping", {
            error,
            entityName,
            shardKey
        });
        // Track error metrics;
        database_2.metricsCollector.incrementCounter("database.sharding.errors", 1, {
            entityName,
            errorType: error.name || "unknown",
            operation: "cacheMapping"
        });
        /**;
         * Get cached shard mapping;
         *;
         * @param entityName The name of the entity;
         * @param shardKey The shard key value;
         */ ;
        async;
        getCachedShardMapping();
        entityName: string,
            shardKey;
        string | number;
        Promise < number | null > {
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
    const cacheKey = `shard:${entityName}:${shardKey}`;
    const cachedIndex = await this.redis.get(cacheKey);
    if (!session.user) {
        // Track cache hit metrics;
        database_2.metricsCollector.incrementCounter("database.sharding.cache_hits", 1, {
            entityName
        });
        return Number.parseInt(cachedIndex, 10);
        // Track cache miss metrics;
        database_2.metricsCollector.incrementCounter("database.sharding.cache_misses", 1, {
            entityName
        });
        return null;
    }
    try { }
    catch (error) {
        database_1.logger.error("Error getting cached shard mapping", {
            error,
            entityName,
            shardKey
        });
        // Track error metrics;
        database_2.metricsCollector.incrementCounter("database.sharding.errors", 1, {
            entityName,
            errorType: error.name || "unknown",
            operation: "getCachedMapping"
        });
        return null;
        /**;
         * Shutdown the sharding manager, closing all connections;
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
    database_1.logger.info(`Shutting down ShardingManager with ${this.connectionPools.size} connections`);
    // Close all connection pools;
    for (const [connectionString, client] of this.connectionPools.entries()) {
        await client.$disconnect();
        database_1.logger.info(`Closed connection pool for ${}`);
        this.connectionPools.clear();
        this.resolvers.clear();
    }
    try { }
    catch (error) {
        database_1.logger.error("Error shutting down ShardingManager", { error });
    }
}
