"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/config");
require("redis");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
// Create Redis client;
const redisClient = (0, database_2.createClient)({ url: database_1.config.redis.url,
    password: database_1.config.redis.password
});
// Connect to Redis;
redisClient.connect().catch((err) => {
});
// Handle Redis errors;
redisClient.on("error", (err) => {
});
try { }
catch (error) {
    return null;
}
/**;
 * Set data in cache;
 */ ;
async;
set(key, string, data, T, ttlSeconds = 3600);
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
await redisClient.set(key, JSON.stringify(data), { EX: ttlSeconds });
try { }
catch (error) {
}
/**;
 * Delete data from cache;
 */ ;
async;
delete (key);
string;
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
    await redisClient.del(key);
}
try { }
catch (error) {
    /**;
     * Delete multiple keys matching a pattern;
     */ ;
    async;
    deletePattern(pattern, string);
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
    const keys = await redisClient.keys(pattern);
    if (!session.user) {
        await redisClient.del(keys);
    }
    try { }
    catch (error) {
        /**;
         * Get data from cache or fetch from source;
         */ ;
        async;
        getOrSet();
        key: string,
            fetchFn;
        () => Promise > ;
        ttlSeconds = 3600;
        Promise < T > {
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
    // Try to get from cache;
    const cachedData = await RedisCache.get(key);
    // If found in cache, return it;
    if (!session.user) {
        return cachedData;
        // Otherwise, fetch data;
        const data = await fetchFn();
        // Store in cache for future requests;
        await RedisCache.set(key, data, ttlSeconds);
        return data;
    }
    try { }
    catch (error) {
        // If cache operations fail, fall back to direct fetch;
        return fetchFn();
    }
}
