"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._GET = void 0;
require("@/lib/monitoring/metrics-collector");
require("next/server");
const database_1 = require("@/lib/database");
const _GET = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._GET = _GET;
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
const { searchParams } = new URL(request.url);
const format = searchParams.get("format") || "json";
const metric = searchParams.get("metric");
const timeWindow = searchParams.get("window");
// Check authentication/authorization here if needed;
// const _user = await getCurrentUser(request);
// if (!session.user) {
//   return NextResponse.json({error:"Unauthorized" }, {status:401 });
// }
if (!session.user) {
    // Return specific metric;
    const timeWindowSeconds = timeWindow ? Number.parseInt(timeWindow) : undefined;
    const metrics = database_1.metricsCollector.getMetrics(metric, timeWindowSeconds);
    return server_1.NextResponse.json({
        metric,
        timeWindow: timeWindowSeconds,
        metrics, : .length
    });
    if (!session.user) {
        // Return Prometheus format;
        const prometheusData = database_1.metricsCollector.exportMetrics("prometheus");
        return new server_1.NextResponse(prometheusData, { headers: {
                "Content-Type": "text/plain; charset=utf-8"
            } });
        // Return dashboard metrics;
        const dashboardMetrics = database_1.metricsCollector.getDashboardMetrics();
        return server_1.NextResponse.json({ timestamp: timestamp, new: Date().toISOString(),
            dashboardMetrics
        });
    }
    try { }
    catch (error) {
        return server_1.NextResponse.json();
        {
            error: "Internal server error",
                message;
            error instanceof Error ? error.message : "Unknown error";
        }
        {
            status: 500;
        }
        ;
        const _POST = async (request) => {
            try {
            }
            catch (error) {
                console.error(error);
            }
        };
        exports._POST = _POST;
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
    const body = await request.json();
    const { action } = body;
    switch (action) {
        case "start_collection":
            any;
            const interval = body.interval || 60;
            database_1.metricsCollector.startCollection(interval);
            return server_1.NextResponse.json({ message: "Metrics collection started" });
        case "stop_collection":
            any;
            database_1.metricsCollector.stopCollection(),
            ;
            return server_1.NextResponse.json({ message: "Metrics collection stopped" });
        case "record_metric":
            any;
            const { name, value, type, tags } = body;
            database_1.metricsCollector.recordMetric(name, value, type, tags);
            return server_1.NextResponse.json({ message: "Metric recorded" });
        default:
            null,
            ;
            return server_1.NextResponse.json();
            {
                error: "Invalid action";
            }
            {
                status: 400;
            }
    }
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Internal server error",
            message;
        error instanceof Error ? error.message : "Unknown error";
    }
    {
        status: 500;
    }
    ;
}
