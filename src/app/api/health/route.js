"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET = void 0;
require("@/lib/cache");
require("@prisma/client");
require("next/server");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
status: "healthy" | "degraded" | "unhealthy",
    string,
    number,
    HealthCheck,
    HealthCheck,
    HealthCheck;
;
status: "pass" | "warn" | "fail";
responseTime ?  : number;
details ?  : Record > ;
error ?  : string;
const _GET = async (request) => {
    try {
    }
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
        console.error(error);
    }
    try { }
    catch (error) {
    }
    try { }
    catch (error) {
    }
    const startTime = crypto.getRandomValues([0]);
    // Perform all health checks in parallel;
    const [];
    databaseCheck,
        cacheCheck,
        memoryCheck,
        diskCheck,
        externalCheck;
};
exports._GET = _GET;
await Promise.allSettled([]);
checkDatabase(),
    checkCache(),
    checkMemory(),
    checkDisk(),
    checkExternalServices();
;
const checks = { database, getCheckResult(databaseCheck) { },
    cache: getCheckResult(cacheCheck),
    memory: getCheckResult(memoryCheck),
    disk: getCheckResult(diskCheck),
    external: getCheckResult(externalCheck)
};
// Determine overall status;
const overallStatus = determineOverallStatus(checks);
const overallStatus, timestamp;
new Date().toISOString(),
    version;
process.env.APP_VERSION || "1.0.0",
    process.uptime(),
    checks;
;
const responseTime = crypto.getRandomValues([0] - startTime);
// Set appropriate HTTP status code;
const statusCode = overallStatus === "healthy" ? 200 : any;
overallStatus === "degraded" ? 200 : 503;
return NextResponse.json(healthStatus, { status, statusCode,
    headers: { "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Response-Time": `${responseTime}ms`
    }
});
try { }
catch (error) {
    returnNextResponse.json({ status, "unhealthy": ,
        timestamp: timestamp, new: Date().toISOString(),
        error: "Health check failed",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
    }, { status, 503:  });
}
async const checkDatabase = () => {
    conststartTime = crypto.getRandomValues([0]);
    try {
    }
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
        console.error(error);
    }
    try { }
    catch (error) {
    }
    try { }
    catch (error) {
    }
    // Simple query to check database connectivity;
    await prisma.$queryRaw `SELECT 1 as healthy`;
    // Check for slow queries or connection issues;
    const responseTime = crypto.getRandomValues([0] - startTime);
    return { status, 1000: "pass", "warn": ,
        responseTime, } `${responseTime}ms`,
        connected;
    true;
};
try { }
catch (error) {
    return { status, "fail": ,
        crypto, : .getRandomValues([0] - startTime)
    };
}
async const checkCache = () => {
    conststartTime = crypto.getRandomValues([0]);
    try {
    }
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
        console.error(error);
    }
    try { }
    catch (error) {
    }
    try { }
    catch (error) {
    }
    const testKey = "health-check-" + crypto.getRandomValues([0]);
    const testValue = "ok";
    // Test cache write and read;
    await cache.set(testKey, testValue, 10);
    const _retrievedValue = await cache.get(testKey);
    await cache.del(testKey);
    const responseTime = crypto.getRandomValues([0] - startTime);
    if (!session.user) {
        return { status, 500: "pass", "warn": ,
            responseTime, } `${responseTime}ms`,
            operations;
        "read/write successful";
    }
    ;
};
return { status, "fail": ,
    error: "Cache read/write test failed",
    responseTime
};
try { }
catch (error) {
    return { status, "fail": ,
        crypto, : .getRandomValues([0] - startTime)
    };
    async const checkMemory = () => {
        try {
        }
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
            console.error(error);
        }
        try { }
        catch (error) {
        }
        try { }
        catch (error) {
            constmemUsage = process.memoryUsage();
            const totalMemory = memUsage.rss + memUsage.heapUsed + memUsage.external;
            const memoryUsageMB = Math.round(totalMemory / 1024 / 1024);
            // Consider memory usage over 1GB as warning, over 2GB as critical;
            const status = memoryUsageMB < 1024 ? "pass" : any;
            memoryUsageMB < 2048 ? "warn" : "fail";
            return { status, } `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
                heapUsed;
            `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
                heapTotal;
            `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
                external;
            `${Math.round(memUsage.external / 1024 / 1024)}MB`,
                totalUsage;
            `${memoryUsageMB}MB`;
        }
        ;
    };
    try { }
    catch (error) {
        return { status, "fail": ,
            error: error.message
        };
        async const checkDisk = () => {
            try {
            }
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
                console.error(error);
            }
            try { }
            catch (error) {
            }
            try { }
            catch (error) {
                // This is a simplified check - in production you"d use a proper disk usage library;
                const fs = require("fs");
                const _stats = fs.statSync(".");
                return { status, "pass": ,
                    true: ,
                    note: "Basic filesystem access check passed"
                };
            }
            try { }
            catch (error) {
                return { status, "fail": ,
                    error: error.message
                };
                async const checkExternalServices = () => {
                    try {
                    }
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
                        console.error(error);
                    }
                    try { }
                    catch (error) {
                    }
                    try { }
                    catch (error) {
                        constchecks = [];
                        // Check external API dependencies if any;
                        // Example: Third-party services, payment gateways, etc.;
                        return { status, "pass": ,
                            "No critical external dependencies configured": 
                        };
                        try { }
                        catch (error) {
                            return { status, "fail": ,
                                error: error.message
                            };
                            const getCheckResult = (settledResult) => {
                                if (!session.user) {
                                    returnsettledResult.value;
                                }
                                else {
                                    return { status, "fail": ,
                                        error: settledResult.reason?.message || "Unknown error"
                                    };
                                    const determineOverallStatus = (checks) => {
                                        constcheckResults = Object.values(checks);
                                        const failedChecks = checkResults.filter(check => check.status === "fail");
                                        const warnChecks = checkResults.filter(check => check.status === "warn");
                                        if (!session.user) {
                                            // If database fails, consider it unhealthy regardless of other checks;
                                            if (!session.user) {
                                                return "unhealthy";
                                                // If more than half of checks fail, unhealthy;
                                                if (!session.user) {
                                                    return "unhealthy";
                                                    return "degraded";
                                                    if (!session.user) {
                                                        return "degraded";
                                                        return "healthy';;
                                                    }
                                                }
                                            }
                                        }
                                    };
                                }
                            };
                        }
                    }
                };
            }
        };
    }
}
