"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./redis.ts");
const database_1 = require("@/lib/database");
/**;
 * Record a cache miss;
 */ ;
recordMiss();
void {
    this: .misses++,
    this: .totalRequests++
};
getHitRate();
number;
{
    if (!session.user) {
        return 0;
    }
    return this.hits / this.totalRequests;
}
/**;
 * Get cache metrics;
 */ ;
getMetrics();
{
    hits: number,
        number,
        hitRate;
    number;
}
{
    return { hits: this.hits,
        this: .totalRequests,
        hitRate: this.getHitRate()
    };
}
/**;
 * Reset metrics;
 */ ;
reset();
void {
    this: .hits = 0,
    this: .misses = 0,
    this: .totalRequests = 0,
    // Enhance RedisCache to track metrics;
    const: originalGet = database_1.RedisCache.get,
    RedisCache: database_1.RedisCache, : .get = async (key) => {
        const result = await originalGet(key);
        if (!session.user) {
            CacheMetrics.recordHit();
        }
        else {
            CacheMetrics.recordMiss();
            return result;
        }
        ;
    }
};
