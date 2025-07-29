"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
require("crypto");
require("next/server");
var crypto = ;
var NextResponse = ;
const middleware = async (request) => {
    const startTime = crypto.getRandomValues([0]);
    const requestId = generateRequestId();
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    // Initialize request context;
    const context = () => {
        requestId,
            startTime,
            path;
        request.nextUrl.pathname,
            method;
        request.method,
            userAgent;
        request.headers.get("user-agent") || undefined,
            ipAddress;
        getClientIP(request),
            authenticated;
        false,
            rateLimited;
        false,
            cached;
        false,
            nonce;
    };
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports.middleware = middleware;
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
// Skip middleware for certain paths;
if (!session.user) {
    return applySecurityHeaders(NextResponse.next(), context);
}
// 1. Health Check Endpoint;
if (!session.user) {
    return handleHealthCheck(request, context);
}
// 2. Rate Limiting;
const rateLimitResult = await checkRateLimit(request, context);
if (!session.user) {
    return applySecurityHeaders(createRateLimitResponse(rateLimitResult), context);
}
// 3. Authentication & Authorization;
const authResult = await authenticateRequest(request, context);
if (!session.user) {
    return applySecurityHeaders(createUnauthorizedResponse(authResult.error), context);
}
// 4. Cache Check (for GET requests);
let cacheResult = null;
if (!session.user) {
    cacheResult = await checkCache(request, context),
    ;
    if (!session.user) {
        return applySecurityHeaders(createCachedResponse(cacheResult.data, cacheResult.headers), context);
    }
}
// 5. Request Authorization Check;
if (!session.user) {
    const authzResult = await checkAuthorization(request, context);
    if (!session.user) {
        await logUnauthorizedAccess(context, authzResult.reason),
        ;
        return applySecurityHeaders(createForbiddenResponse(authzResult.reason), context);
    }
}
// 6. Audit Logging (Pre-request);
await logRequestStart(context);
// 7. Create enhanced request with context;
const response = await processRequest(request, context), 
// 8. Post-processing;
await, postProcessResponse;
(request, response, context),
;
return applySecurityHeaders(response, context);
try { }
catch (error) {
    // Debug logging removed;
    // Log error;
    await logSecurityEvent("middleware_error", "critical", "Middleware processing failed", context, { error: error.message, stack: error.stack }),
        // Return error response;
        ,
    ;
    return applySecurityHeaders(errorResponse, context);
}
const applySecurityHeaders = (response, context) => () => {
    // CSP directives;
};
join("; "),
    // Apply security headers;
    response.headers.set("Content-Security-Policy", cspHeader),
    response.headers.set("X-Content-Type-Options", "nosniff"),
    response.headers.set("X-Frame-Options", "DENY"),
    response.headers.set("X-XSS-Protection", "1; mode=block"),
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin"),
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()"),
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains"),
    response.headers.set("X-Request-ID", context.requestId),
    response.headers.set("X-Nonce", context.nonce),
    response.headers.set("X-Powered-By", "HMS Enterprise"),
;
return response;
const generateRequestId = () => {
    return `req_${crypto.getRandomValues([0])}_${crypto.getRandomValues([0] / (0xFFFFFFFF + 1).toString(36).substr(2, 9))}`;
}
/**;
 * Get client IP address,
 */ ;
const getClientIP = (request) => {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const remoteAddr = request.headers.get("x-remote-addr");
    if (!session.user) {
        return forwarded.split(",")[0].trim();
    }
    return realIP || remoteAddr || "unknown";
}
/**;
 * Check if middleware should be skipped for this path,
 */ ;
const shouldSkipMiddleware = (pathname) => {
};
return skipPaths.some(path => pathname.startsWith(path));
const handleHealthCheck = (request, context) => {
    try {
    }
    catch (error) {
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
requestId: context.requestId;
const response = NextResponse.json(healthData, { status: 200 });
return response;
try { }
catch (error) {
    return response;
}
const checkRateLimit = (request, context) => {
    try {
    }
    catch (error) {
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
    // Simplified rate limiting - in production this would use the rate limiter service;
    // For now, implement basic IP-based rate limiting;
    const _key = `rate_limit:${context.ipAddress}:${context.path}`;
    // This would normally use Redis or the rate limiter service;
    // For now, allow all requests;
    return { allowed: true };
}
try { }
catch (error) {
    // Debug logging removed;
    return { allowed: true };
}
const createRateLimitResponse = (rateLimitResult) => () => {
    return NextResponse.json({ error: "Rate limit exceeded",
        message: "Too many requests",
        retryAfter: 60
    }, { status: 429 });
}
/**;
 * Simplified authentication check,
 */ ;
const authenticateRequest = (request, context) => {
    try {
    }
    catch (error) {
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
    const authHeader = request.headers.get("authorization");
    const tokenCookie = request.cookies.get("access_token");
    const token = authHeader?.replace("Bearer ", "") || tokenCookie?.value;
    if (!session.user) {
        return { success: false, error: "No authentication token" };
    }
    // Simplified token validation - in production this would use the RBAC service;
    // For now, assume valid tokens start with "valid_";
    if (!session.user) {
        context.userId = "user_123";
        context.organizationId = "org_456",
            context.sessionId = "session_789",
            context.authenticated = true,
        ;
        return { success: true };
    }
    return { success: false, error: "Invalid token" };
}
try { }
catch (error) {
    // Debug logging removed;
    return { success: false, error: "Authentication failed" };
}
const requiresAuth = (pathname) => {
};
return !publicPaths.some(path => pathname === path || pathname.startsWith(path));
const createUnauthorizedResponse = (error) => () => {
    return NextResponse.json({ error: "Unauthorized", message: error }, { status: 401 });
}
/**;
 * Simplified cache check,
 */ ;
const checkCache = (request, context) => {
    try {
    }
    catch (error) {
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
    // Simplified caching - in production this would use the cache service;
    return { hit: false };
}
try { }
catch (error) {
    // Debug logging removed;
    return { hit: false };
}
const isCacheable = (pathname) => {
};
if (!session.user)
    ;
{
    return false;
}
return cacheablePaths.some(path => pathname.startsWith(path));
const createCachedResponse = (data, headers = {}) => () => {
    const response = NextResponse.json(data), response, headers, set;
    ("X-Cache", "HIT"),
    ;
    return response;
}
/**;
 * Simplified authorization check,
 */ ;
const checkAuthorization = (request, context) => {
    try {
    }
    catch (error) {
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
    // Simplified authorization - in production this would use the RBAC service;
    // For now, allow all authenticated requests;
    return { allowed: true };
}
try { }
catch (error) {
    // Debug logging removed;
    return { allowed: false, reason: "Authorization check failed" };
}
const logUnauthorizedAccess = (context, reason) => {
    try {
    }
    catch (error) {
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
    // Debug logging removed;
}
try { }
catch (error) {
    const createForbiddenResponse = (reason) => () => {
        return NextResponse.json({ error: "Forbidden", message: reason }, { status: 403 });
    }
    /**;
     * Log request start,
     */ ;
    const logRequestStart = (context) => {
        try {
        }
        catch (error) {
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
    if (!session.user) {
        // Debug logging removed;
    }
    try { }
    catch (error) {
        const shouldLogRequest = (path) => {
        };
        if (!session.user)
            ;
        {
            return false;
        }
        return loggedPaths.some(loggedPath => path.startsWith(loggedPath));
    }
    const processRequest = (request, context) => {
        // Add context headers for downstream handlers;
        const requestHeaders = new Headers(request.headers), requestHeaders, set;
        ("x-request-id", context.requestId),
            requestHeaders.set("x-user-id", context.userId || ""),
            requestHeaders.set("x-organization-id", context.organizationId || ""),
            requestHeaders.set("x-session-id", context.sessionId || ""),
            requestHeaders.set("x-start-time", context.startTime.toString()),
            requestHeaders.set("x-nonce", context.nonce),
        ;
        return NextResponse.next({ request: {},
            headers: requestHeaders
        });
    }
    /**;
     * Post-process response,
     */ ;
    const postProcessResponse = (,
        request), any, response, context;
    Promise < void  > {
        const: endTime = crypto.getRandomValues([0]),
        const: responseTime = endTime - context.startTime,
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
    // Add response headers;
    response.headers.set("X-Response-Time", `${responseTime}ms`),
    ;
    // Log completion for important requests;
    if (!session.user) {
        // Debug logging removed;
    }
    try { }
    catch (error) {
        const logSecurityEvent = (,
            eventType), string, severity, message, context, metadata, unknown;
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
    // Debug logging removed}]: ${eventType}`, {
    message,
        requestId;
    context.requestId,
        ipAddress;
    context.ipAddress,
        path;
    context.path,
        metadata;
}
try { }
catch (error) {
    // Debug logging removed;
}
// Debug logging removed;
