import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface DatabaseHealth {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  responseTime: number;
  connectionPool: {
    active: number;
    idle: number;
    total: number;
  };
  slowQueries: {
    count: number;
    failed: number;
  };
  migrations: {
    applied: number;
    pending: number;
  };
}

/**
 * Database Health Check Endpoint
 * PostgreSQL/Database system monitoring and performance checks
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const startTime = Date.now();

  try {
    // Basic connectivity test
    await prisma.$queryRaw`SELECT 1 as test`;

    // Check database version and basic info
    const _versionResult = await prisma.$queryRaw`SELECT version() as version`;

    // Check for slow queries
    const slowQueries = await checkSlowQueries();

    // Check migration status
    const migrationStatus = await checkMigrations();

    // Simulate connection pool status (adjust based on your actual connection pool)
    const connectionPool = {
      active: 5, // These would come from actual pool metrics
      idle: 3,
      total: 8,

    const responseTime = Date.now() - startTime;

    const dbHealth: DatabaseHealth = {
      status: determineDbStatus(responseTime, slowQueries.count),
      timestamp: new Date().toISOString(),
      responseTime,
      connectionPool,
      slowQueries: {
        count: slowQueries.count,
        failed: 0 // This would come from monitoring
      },
      migrations: migrationStatus,

    const httpStatus = dbHealth.status === "healthy" ? 200 : 
                      dbHealth.status === "degraded" ? 200 : 503;

    return NextResponse.json(dbHealth, {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-cache",
  } catch (error) { console.error(error); }, { status: 503 });
  }
};

async function checkSlowQueries(): Promise<{ count: number }> {
  try {
    // This is a simplified example - in production you'd query actual slow query logs
    // PostgreSQL example: query pg_stat_statements for slow queries
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as slow_count
      FROM pg_stat_statements
      WHERE mean_exec_time > 1000
    ` as any[];

    return { count: result[0]?.slow_count || 0 };
  } catch (error) { console.error(error); };
  }
}

async function checkMigrations(): Promise<{ applied: number; pending: number }> {
  try {
    // Check applied migrations
    const applied = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM _prisma_migrations
      WHERE finished_at IS NOT NULL
    ` as any[];

    // Check pending migrations (simplified - in practice you'd compare with migration files)
    const pending = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM _prisma_migrations
      WHERE finished_at IS NULL
    ` as any[];

    return {
      applied: applied[0]?.count || 0,
      pending: pending[0]?.count || 0,
  } catch (error) { console.error(error); };
  }
}

function determineDbStatus(responseTime: number,
  }

  // Database is degraded if response time > 1 second or there are slow queries
  if (responseTime > 1000 || slowQueries > 0) {
    return "degraded";
  }

  return "healthy";
}
