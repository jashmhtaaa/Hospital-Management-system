
import {  config  } from "@/config"
import {  createClient  } from "@/lib/database"

// Create Redis client;
const redisClient = createClient({url:config.redis.url,
  password: config.redis.password,

// Connect to Redis;
redisClient.connect().catch((err) => {

});

// Handle Redis errors;
redisClient.on("error", (err) => {

});

// Cache wrapper class;
}
    } catch (error) { console.error(error); }
  }

  /**;
   * Set data in cache;
   */;
  static async set<T>(key: string, data: T, }
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
      await redisClient.set(key, JSON.stringify(data), {EX: ttlSeconds });
    } catch (error) { console.error(error); }
  }

  /**;
   * Delete data from cache;
   */;
  static async delete(key: string): Promise<void> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } catch (error) {

  /**;
   * Delete multiple keys matching a pattern;
   */;
  static async deletePattern(pattern: string): Promise<void> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } catch (error) {

  /**;
   * Get data from cache or fetch from source;
   */;
  static async getOrSet<T>(;
    key: string,
    fetchFn: () => Promise>,
  ): Promise<T> {
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

      // If cache operations fail, fall back to direct fetch;
      return fetchFn();
