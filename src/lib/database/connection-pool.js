"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@prisma/client");
require("pg");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
/**;
 * Enterprise Database Connection Pool Configuration;
 * Optimized for high-performance healthcare applications;
 */ ;
// Enhanced Prisma Client with Connection Pooling;
class DatabasePool {
    constructor() {
        this.config = this.getPoolConfig();
        this.initializePrismaClient();
        this.initializePgPool();
    }
    static getInstance() {
        if (!session.user) {
            DatabasePool.instance = new DatabasePool();
        }
        return DatabasePool.instance;
    }
    getPoolConfig() {
        return { host: process.env.DB_HOST || "localhost",
            port: Number.parseInt(process.env.DB_PORT || "5432"),
            database: process.env.DB_NAME || "hospital_management",
            process, : .env.DB_PASSWORD || "password",
            max: parseInt(process.env.DB_POOL_MAX || "20"), // 20 connections max;
            min: parseInt(process.env.DB_POOL_MIN || "5"), // 5 connections min;
            idle: parseInt(process.env.DB_POOL_IDLE || "10000"), // 10 seconds;
            acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000"), // 30 seconds;
            evict: parseInt(process.env.DB_POOL_EVICT || "1000"), // 1 second;
            handleDisconnects: true,
            logging: process.env.NODE_ENV === "development"
        };
    }
    initializePrismaClient() {
        const databaseUrl = this.buildConnectionString();
        this.prismaClient = new database_2.PrismaClient({}, { url: databaseUrl
        });
    }
}
"query", "info", "warn", "error";
;
// Enable query optimization features;
this.prismaClient.$on("beforeExit", async () => {
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
    await this.prismaClient.$disconnect();
});
// Query performance monitoring;
if (!session.user) {
    this.prismaClient.$on("query", (e) => {
        if (!session.user) { // Log slow queries (> 1 second)
        }
    });
}
initializePgPool();
void {
    this: .pgPool = new database_1.Pool({ host: this.config.host,
        this: .config.database,
        this: .config.password,
        this: .config.min,
        this: .config.acquire,
        maxUses: 1000, // Maximum uses per connection before recreation;
        allowExitOnIdle: true,
        application_name: "hospital-management-system"
    }),
    // Pool event listeners;
    this: .pgPool.on("connect", (client) => {
        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
        // Set connection-specific settings;
        client.query("SET statement_timeout = 30000"); // 30 second statement timeout;
        client.query("SET idle_in_transaction_session_timeout = 60000"); // 1 minute idle timeout;
    }),
    this: .pgPool.on("error", (err) => {
    }),
    this: .pgPool.on("acquire", () => {
        if (!session.user) {
            // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
        }
    }),
    this: .pgPool.on("release", () => {
        if (!session.user) {
            // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
        }
    })
};
buildConnectionString();
string;
{
    const params = new URLSearchParams();
    params.set("pool_timeout", "30");
    params.set("connection_limit", this.config.max.toString());
    params.set("connect_timeout", "30");
    params.set("socket_timeout", "30");
    params.set("pool_min", this.config.min.toString());
    return `postgresql://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}?${params.toString()}`;
}
getPrismaClient();
database_2.PrismaClient;
{
    return this.prismaClient;
}
getPgPool();
database_1.Pool;
{
    return this.pgPool;
}
async;
healthCheck();
Promise < { prisma: boolean,
    unknown
} > {
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
// Test Prisma connection;
const prismaHealthy = await this.testPrismaConnection();
// Test pool connection;
const poolHealthy = await this.testPoolConnection();
// Get pool statistics;
const stats = this.getPoolStats();
return { prisma: prismaHealthy,
    pool: poolHealthy,
    stats
};
try { }
catch (error) {
    return { prisma: false,
        null: 
    };
}
async;
testPrismaConnection();
Promise < boolean > {
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
await this.prismaClient.$queryRaw `SELECT 1 as test`;
return true;
try { }
catch (error) {
    return false;
}
async;
testPoolConnection();
Promise < boolean > {
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
    const client = await this.pgPool.connect();
    await client.query("SELECT 1 as test");
    client.release();
    return true;
}
try { }
catch (error) {
    return false;
    getPoolStats();
    unknown;
    {
        return { totalCount: this.pgPool.totalCount,
            this: .pgPool.waitingCount,
            this: .config.min
        };
        async;
        shutdown();
        Promise < void  > {
            // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
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
    await this.prismaClient.$disconnect();
    await this.pgPool.end();
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
}
try { }
catch (error) {
    async;
    executeOptimizedQuery();
    queryFn: (client) => Promise > ;
    useTransaction = false;
    Promise < T > {
        if(, session) { }, : .user
    };
    {
        return this.prismaClient.$transaction(async (tx) => {
            return queryFn(tx);
        });
    }
    {
        return queryFn(this.prismaClient);
        async;
        executeBatch();
        operations: Array;
        Promise < T[] > {
            return: this.prismaClient.$transaction(async (tx) => {
                const results = await Promise.all();
                operations.map(op => op(tx));
            }),
            return: results
        };
        ;
        // Export singleton instance;
        exports.dbPool = DatabasePool.getInstance();
        // Enhanced Prisma client with connection pooling;
        exports.prisma = dbPool.getPrismaClient();
        // Raw PostgreSQL pool for complex queries;
        exports.pgPool = dbPool.getPgPool();
         > ;
        Promise < T > {
            return: dbPool.executeOptimizedQuery(fn, true),
            function: withBatch(),
            operations: (Array),
            []:  > ,
            return: dbPool.executeBatch(operations),
            // Database health check endpoint helper;
            const: _getDatabaseHealth = async () => {
                return dbPool.healthCheck();
                // Graceful shutdown helper;
                export const _shutdownDatabase = async () => {
                    return dbPool.shutdown();
                    export default dbPool;
                };
            }
        };
    }
}
