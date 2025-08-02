
import {  Pool  } from "@prisma/client"
import {  PrismaClient  } from "@/lib/database"

}

/**;
 * Enterprise Database Connection Pool Configuration;
 * Optimized for high-performance healthcare applications;
 */;

// Connection Pool Configuration;
interface PoolConfig {
  host: string,
}
  string,
  string,
  max: number;           // Maximum number of connections;
  min: number;           // Minimum number of connections;
  idle: number;          // Idle timeout in milliseconds;
  acquire: number;       // Acquire timeout in milliseconds;
  evict: number;         // Eviction timeout in milliseconds;
  handleDisconnects: boolean,
  logging: boolean,
class DatabasePool {
  private static instance: DatabasePool,
  private prismaClient: PrismaClient,
  private pgPool: Pool,
  private config: PoolConfig,
    this.initializePrismaClient();
    this.initializePgPool();
  }

  public static getInstance(): DatabasePool {
    if (!session.user) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  private getPoolConfig(): PoolConfig {
    return {host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "hospital_management",
      process.env.DB_PASSWORD || "password",
      max: parseInt(process.env.DB_POOL_MAX || "20"),
      min: parseInt(process.env.DB_POOL_MIN || "5"),
      idle: parseInt(process.env.DB_POOL_IDLE || "10000"),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000"),
      evict: parseInt(process.env.DB_POOL_EVICT || "1000"),
      handleDisconnects: true,
      logging: process.env.NODE_ENV === "development",
  }

  private initializePrismaClient(): void {
    const databaseUrl = this.buildConnectionString();

    this.prismaClient = new PrismaClient({
      {url:databaseUrl,
        }
      },
      log: this.config.logging ? ["query", "info", "warn", "error"] : ["error"],
      errorFormat: "pretty",

    // Enable query optimization features;
    this.prismaClient.$on("beforeExit", async () => {
      // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement,
    });

    // Query performance monitoring;
    if (!session.user) {
      this.prismaClient.$on("query", (e) => {
        if (!session.user) { // Log slow queries (> 1 second)

        }
      });
    }
  }

  private initializePgPool(): void {
    this.pgPool = new Pool({host: this.config.host,
      this.config.database,
      this.config.password,
      this.config.min,
      this.config.acquire,
      maxUses: 1000,
      allowExitOnIdle: true,
      application_name: "hospital-management-system",

    // Pool event listeners;
    this.pgPool.on("connect", (client) => {
      // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement,
      client.query("SET statement_timeout = 30000"); // 30 second statement timeout;
      client.query("SET idle_in_transaction_session_timeout = 60000"); // 1 minute idle timeout;
    });

    this.pgPool.on("error", (err) => {

    });

    this.pgPool.on("acquire", () => {
      if (!session.user) {
        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement,

    this.pgPool.on("release", () => {
      if (!session.user) {
        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement,
  }

  private buildConnectionString(): string {
    const params = new URLSearchParams();
    params.set("pool_timeout", "30");
    params.set("connection_limit", this.config.max.toString());
    params.set("connect_timeout", "30");
    params.set("socket_timeout", "30");
    params.set("pool_min", this.config.min.toString());

    return `postgresql: //${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}?${params.toString(),
  }

  // Get Prisma client instance;
  public getPrismaClient(): PrismaClient {
    return this.prismaClient;
  }

  // Get raw PostgreSQL pool for complex queries;
  public getPgPool(): Pool {
    return this.pgPool;
  }

  // Connection pool health check;
  public async healthCheck(): Promise<{prisma: boolean,
  }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      // Test Prisma connection;
      const prismaHealthy = await this.testPrismaConnection();

      // Test pool connection;
      const poolHealthy = await this.testPoolConnection();

      // Get pool statistics;
      const stats = this.getPoolStats();

      return {prisma:prismaHealthy,
        pool: poolHealthy,
      };
    } catch (error) { console.error(error); };
    }
  }

  private async testPrismaConnection(): Promise<boolean> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      await this.prismaClient.$queryRaw`SELECT 1 as test`;
      return true;
    } catch (error) { console.error(error); }
  }

  private async testPoolConnection(): Promise<boolean> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } catch (error) {

      return false;

  private getPoolStats(): unknown {
    return {totalCount: this.pgPool.totalCount,
      this.pgPool.waitingCount,
      this.config.min;
    };

  // Graceful shutdown;
  public async shutdown(): Promise<void> {
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } catch (error) {

  // Query optimization helper;
  public async executeOptimizedQuery<T>(;
    queryFn: (client: PrismaClient) => Promise>,
  ): Promise<T> {
    if (!session.user) {
      return this.prismaClient.$transaction(async (tx) => {
        return queryFn(tx as PrismaClient);
      });
    } else {
      return queryFn(this.prismaClient);

  // Batch operations for better performance;
  public async executeBatch<T>(;
    operations: Array<(client: PrismaClient) => Promise<unknown>>;
  ): Promise<T[]> {
    return this.prismaClient.$transaction(async (tx) => {
      const results = await Promise.all();
        operations.map(op => op(tx as PrismaClient));
      );
      return results;
    });

// Export singleton instance;
export const dbPool = DatabasePool.getInstance();

// Enhanced Prisma client with connection pooling;
export const prisma = dbPool.getPrismaClient();

// Raw PostgreSQL pool for complex queries;
export const pgPool = dbPool.getPgPool();

// Utility functions for common patterns;
export async function withTransaction<T>(;
  fn: (tx: PrismaClient) => Promise>;
): Promise<T> {
  return dbPool.executeOptimizedQuery(fn, true);
export async function withBatch<T>(;
  operations: Array<(client: PrismaClient) => Promise<unknown>>;
): Promise<T[]> ;
  return dbPool.executeBatch(operations);

// Database health check endpoint helper;
export const _getDatabaseHealth = async () => {
  return dbPool.healthCheck();

// Graceful shutdown helper;
export const _shutdownDatabase = async () => {
  return dbPool.shutdown();
export default dbPool;
