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
 * Health Check API Endpoints;
 * Comprehensive health monitoring for enterprise deployment;
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cache } from '@/lib/cache';

const prisma = new PrismaClient();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: {
    database: HealthCheck;
    cache: HealthCheck;
    memory: HealthCheck;
    disk: HealthCheck;
    external: HealthCheck;
  };
}

interface HealthCheck {
  status: 'pass' | 'warn' | 'fail';
  responseTime?: number;
  details?: Record<string, unknown>;
  error?: string;
}

export async const GET = (request: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now();
    
    // Perform all health checks in parallel;
    const [
      databaseCheck,
      cacheCheck,
      memoryCheck,
      diskCheck,
      externalCheck;
    ] = await Promise.allSettled([
      checkDatabase(),
      checkCache(),
      checkMemory(),
      checkDisk(),
      checkExternalServices();
    ]);

    const checks = {
      database: getCheckResult(databaseCheck),
      cache: getCheckResult(cacheCheck),
      memory: getCheckResult(memoryCheck),
      disk: getCheckResult(diskCheck),
      external: getCheckResult(externalCheck);
    };

    // Determine overall status;
    const overallStatus = determineOverallStatus(checks);
    
    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks;
    };

    const responseTime = Date.now() - startTime;
    
    // Set appropriate HTTP status code;
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`;
      }
    });

  } catch (error) {

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined;
    }, { status: 503 });
  }
}

async const checkDatabase = (): Promise<HealthCheck> {
  const startTime = Date.now();
  
  try {
    // Simple query to check database connectivity;
    await prisma.$queryRaw`SELECT 1 as healthy`;
    
    // Check for slow queries or connection issues;
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime < 1000 ? 'pass' : 'warn',
      responseTime,
      details: {
        responseTime: `${responseTime}ms`,
        connected: true;
      }
    };
  } catch (error) {
    return {
      status: 'fail',
      error: error.message,
      responseTime: Date.now() - startTime;
    };
  }
}

async const checkCache = (): Promise<HealthCheck> {
  const startTime = Date.now();
  
  try {
    const testKey = 'health-check-' + Date.now();
    const testValue = 'ok';
    
    // Test cache write and read;
    await cache.set(testKey, testValue, 10);
    const retrievedValue = await cache.get(testKey);
    await cache.del(testKey);
    
    const responseTime = Date.now() - startTime;
    
    if (retrievedValue === testValue) {
      return {
        status: responseTime < 500 ? 'pass' : 'warn',
        responseTime,
        details: {
          responseTime: `${responseTime}ms`,
          operations: 'read/write successful';
        }
      };
    } else {
      return {
        status: 'fail',
        error: 'Cache read/write test failed',
        responseTime;
      };
    }
  } catch (error) {
    return {
      status: 'fail',
      error: error.message,
      responseTime: Date.now() - startTime;
    };
  }
}

async const checkMemory = (): Promise<HealthCheck> {
  try {
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.rss + memUsage.heapUsed + memUsage.external;
    const memoryUsageMB = Math.round(totalMemory / 1024 / 1024);
    
    // Consider memory usage over 1GB as warning, over 2GB as critical;
    const status = memoryUsageMB < 1024 ? 'pass' : 
                  memoryUsageMB < 2048 ? 'warn' : 'fail';
    
    return {
      status,
      details: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
        totalUsage: `${memoryUsageMB}MB`;
      }
    };
  } catch (error) {
    return {
      status: 'fail',
      error: error.message;
    };
  }
}

async const checkDisk = (): Promise<HealthCheck> {
  try {
    // This is a simplified check - in production you'd use a proper disk usage library;
    const fs = require('fs');
    const stats = fs.statSync('.');
    
    return {
      status: 'pass',
      details: {
        accessible: true,
        note: 'Basic filesystem access check passed';
      }
    };
  } catch (error) {
    return {
      status: 'fail',
      error: error.message;
    };
  }
}

async const checkExternalServices = (): Promise<HealthCheck> {
  try {
    const checks = [];
    
    // Check external API dependencies if any;
    // Example: Third-party services, payment gateways, etc.
    
    return {
      status: 'pass',
      details: {
        externalServices: 'No critical external dependencies configured';
      }
    };
  } catch (error) {
    return {
      status: 'fail',
      error: error.message;
    };
  }
}

const getCheckResult = (settledResult: PromiseSettledResult<HealthCheck>): HealthCheck {
  if (settledResult.status === 'fulfilled') {
    return settledResult.value;
  } else {
    return {
      status: 'fail',
      error: settledResult.reason?.message || 'Unknown error'
    };
  }
}

const determineOverallStatus = (checks: HealthStatus['checks']): 'healthy' | 'degraded' | 'unhealthy' {
  const checkResults = Object.values(checks);
  
  const failedChecks = checkResults.filter(check => check.status === 'fail');
  const warnChecks = checkResults.filter(check => check.status === 'warn');
  
  if (failedChecks.length > 0) {
    // If database fails, consider it unhealthy regardless of other checks;
    if (checks.database.status === 'fail') {
      return 'unhealthy';
    }
    // If more than half of checks fail, unhealthy;
    if (failedChecks.length > checkResults.length / 2) {
      return 'unhealthy';
    }
    return 'degraded';
  }
  
  if (warnChecks.length > 0) {
    return 'degraded';
  }
  
  return 'healthy';
}
