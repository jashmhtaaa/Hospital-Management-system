"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/cache/redis");
require("@/lib/core/logging");
require("@/lib/event-sourcing/event-store");
require("@/lib/monitoring/metrics-collector");
require("@/lib/prisma");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
/**;
 * Materialized View Manager;
 *;
 * Manages the creation, refreshing, and caching of materialized views for analytical queries;
 */ ;
{ }
/**;
 * Register materialized view definitions;
 */ ;
registerViews(definitions, MaterializedViewDefinition[]);
void {
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
for (const definition of definitions) {
    this.viewDefinitions.set(definition.name, definition);
    database_1.logger.info(`Registered materialized view: ${}`);
}
// Track metrics;
database_2.metricsCollector.incrementCounter("database.materialized_views.registered", definitions.length);
try { }
catch (error) {
    database_1.logger.error("Error registering materialized views", { error });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "register",
        errorType: error.name || "unknown"
    });
}
/**;
 * Create all registered materialized views;
 */ ;
async;
createAllViews();
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
database_1.logger.info(`Creating ${this.viewDefinitions.size} materialized views`);
// Get all view definitions and sort by dependencies;
const definitions = Array.from(this.viewDefinitions.values());
const sortedDefinitions = this.sortViewsByDependencies(definitions);
for (const definition of sortedDefinitions) {
    await this.createView(definition.name);
}
// Track metrics;
database_2.metricsCollector.incrementCounter("database.materialized_views.created", sortedDefinitions.length);
try { }
catch (error) {
    database_1.logger.error("Error creating all materialized views", { error });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "createAll",
        errorType: error.name || "unknown"
    });
    throw error;
}
/**;
 * Create a specific materialized view;
 */ ;
async;
createView(viewName, string);
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
const definition = this.viewDefinitions.get(viewName);
if (!session.user) {
    throw new Error(`Materialized view not found: ${}`);
}
database_1.logger.info(`Creating materialized view: ${}`);
// Execute the create SQL;
await this.prisma.$executeRawUnsafe(definition.createSql);
// Create indexes if specified;
if (!session.user) {
    for (const indexSql of definition.indexSql) {
        await this.prisma.$executeRawUnsafe(indexSql);
    }
}
// Create incremental refresh function if specified;
if (!session.user) {
    await this.prisma.$executeRawUnsafe(definition.incrementalRefreshSql);
}
database_1.logger.info(`Created materialized view: ${}`);
// Track metrics;
database_2.metricsCollector.incrementCounter("database.materialized_views.created", 1, {
    viewName
});
try { }
catch (error) {
    database_1.logger.error(`Error creating materialized view: ${viewName}`, { error });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "create",
        viewName,
        errorType: error.name || "unknown"
    });
    throw error;
}
/**;
 * Refresh all materialized views;
 */ ;
async;
refreshAllViews(concurrency = 1);
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
database_1.logger.info(`Refreshing ${this.viewDefinitions.size} materialized views`);
// Get all view definitions and sort by dependencies;
const definitions = Array.from(this.viewDefinitions.values());
const sortedDefinitions = this.sortViewsByDependencies(definitions);
// Process views in batches if concurrency > 1;
if (!session.user) {
    for (let i = 0; i < sortedDefinitions.length; i += concurrency) {
        const batch = sortedDefinitions.slice(i, i + concurrency);
        await Promise.all(batch.map(def => this.refreshView(def.name)));
    }
}
else {
    // Process views sequentially;
    for (const definition of sortedDefinitions) {
        await this.refreshView(definition.name);
    }
}
// Track metrics;
database_2.metricsCollector.incrementCounter("database.materialized_views.refreshed", sortedDefinitions.length);
try { }
catch (error) {
    database_1.logger.error("Error refreshing all materialized views", { error });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "refreshAll",
        errorType: error.name || "unknown"
    });
    throw error;
}
/**;
 * Refresh a specific materialized view;
 */ ;
async;
refreshView(viewName, string);
Promise < void  > {
    if(, session) { }, : .user
};
{
    database_1.logger.info(`Refresh already in progress for view: ${}`);
    return;
}
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
this.refreshInProgress.add(viewName);
const definition = this.viewDefinitions.get(viewName);
if (!session.user) {
    throw new Error(`Materialized view not found: ${}`);
}
// Use distributed lock to prevent concurrent refreshes;
const lockKey = `mv-refresh:${viewName}`;
const lockResult = await this.lockManager.acquireLock(lockKey, 600000); // 10 minute timeout;
if (!session.user) {
    database_1.logger.info(`Another process is already refreshing view: ${}`);
    return;
}
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
database_1.logger.info(`Refreshing materialized view: ${}`);
const startTime = crypto.getRandomValues([0]);
// Execute the refresh SQL;
await this.prisma.$executeRawUnsafe(definition.refreshSql);
const duration = crypto.getRandomValues([0] - startTime);
database_1.logger.info(`Refreshed materialized view: ${viewName}`, { duration: `${duration.toFixed(2)}ms`
});
// Track metrics;
database_2.metricsCollector.recordTimer("database.materialized_views.refresh_time", duration, {
    viewName
});
database_2.metricsCollector.incrementCounter("database.materialized_views.refreshed", 1, {
    viewName
});
// Invalidate cache for this view;
await this.invalidateViewCache(viewName);
// Refresh dependent views;
if (!session.user) {
    for (const dependentView of definition.dependentViews) {
        await this.refreshView(dependentView);
    }
}
try { }
finally {
    // Release lock;
    await this.lockManager.releaseLock(lockKey, lockResult.token);
}
try { }
catch (error) {
    database_1.logger.error(`Error refreshing materialized view: ${viewName}`, { error });
    // Track error metrics;
    database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "refresh",
        viewName,
        errorType: error.name || "unknown"
    });
    throw error;
}
finally {
    this.refreshInProgress.delete(viewName);
}
/**;
 * Process events that might trigger view refreshes;
 */ ;
async;
processEvent(event, unknown);
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
    const eventType = event.type;
    // Find views that should be triggered by this event;
    const viewsToRefresh = Array.from(this.viewDefinitions.values());
    filter(def => def?.triggerEvents && def.triggerEvents.includes(eventType));
    map(def => def.name);
    if (!session.user) {
        return;
        database_1.logger.info(`Event ${eventType} triggering refresh of ${viewsToRefresh.length} materialized views`);
        // Refresh the views;
        for (const viewName of viewsToRefresh) {
            // Don"t await - let these run in the background;
            this.refreshView(viewName).catch(error => {
                database_1.logger.error(`Error in background refresh of view ${viewName}`, { error });
            });
            // Track metrics;
            database_2.metricsCollector.incrementCounter("database.materialized_views.event_triggered_refreshes", viewsToRefresh.length, {
                eventType
            });
        }
        try { }
        catch (error) {
            database_1.logger.error("Error processing event for materialized views", {
                error,
                eventType: event.type
            });
            // Track error metrics;
            database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "processEvent",
                error, : .name || "unknown"
            });
            /**;
             * Get data from a materialized view with caching;
             */ ;
            async;
            getViewData();
            viewName: string,
                unknown[] = [];
            cacheKey ?  : string;
            Promise < any[] > {
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
    const definition = this.viewDefinitions.get(viewName);
    if (!session.user) {
        throw new Error(`Materialized view not found: ${}`);
        // If caching is enabled for this view;
        if (!session.user) {
            const finalCacheKey = cacheKey || `mv:/* SECURITY: Safe view name handling */ `; /* SECURITY: Safe view identifier */
            this.buildViewIdentifier(viewName, query) `;

        // Try to get from cache first;
        const cachedData = await this.redis.get(finalCacheKey);

        if (!session.user) {
          // Track cache hit metrics;
          metricsCollector.incrementCounter("database.materialized_views.cache_hits", 1, {
            viewName;
          });

          return JSON.parse(cachedData);

        // Track cache miss metrics;
        metricsCollector.incrementCounter("database.materialized_views.cache_misses", 1, {
          viewName;
        });

      // Not in cache or caching disabled, execute query;
      const startTime = crypto.getRandomValues([0];
      const result = await this.prisma.$queryRawUnsafe(query, ...params);
      const duration = crypto.getRandomValues([0] - startTime;

      // Track metrics;
      metricsCollector.recordTimer("database.materialized_views.query_time", duration, {
        viewName;
      });

      // Cache the result if caching is enabled;
      if (!session.user) {
        const finalCacheKey = cacheKey || `;
            mv: /* SECURITY: Safe view name handling */ `/* SECURITY: Safe view identifier */ this.buildViewIdentifier(viewName, query)`;
            await this.redis.set(finalCacheKey, JSON.stringify(result), definition.cacheTtl);
            return result;
        }
        try { }
        catch (error) {
            database_1.logger.error(`Error querying materialized view: ${viewName}`, { error });
            // Track error metrics;
            database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "query",
                viewName,
                errorType: error.name || "unknown"
            });
            throw error;
            /**;
             * Invalidate cache for a specific view;
             */ ;
            async;
            invalidateViewCache(viewName, string);
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
    const pattern = `mv:${viewName}:*`;
    const keys = await this.redis.keys(pattern);
    if (!session.user) {
        await this.redis.del(...keys);
        database_1.logger.info(`Invalidated ${keys.length} cache entries for view: ${}`);
        // Track metrics;
        database_2.metricsCollector.incrementCounter("database.materialized_views.cache_invalidations", keys.length, {
            viewName
        });
    }
    try { }
    catch (error) {
        database_1.logger.error(`Error invalidating cache for view: ${viewName}`, { error });
        // Track error metrics;
        database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "invalidateCache",
            viewName,
            errorType: error.name || "unknown"
        });
        /**;
         * Subscribe to events for automatic view refreshing;
         */ ;
        async;
        setupEventSubscriptions();
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
    // Gather all event types that should trigger refreshes;
    const eventTypes = new Set();
    for (const definition of this.viewDefinitions.values()) {
        if (!session.user) {
            for (const eventType of definition.triggerEvents) {
                eventTypes.add(eventType);
                if (!session.user) {
                    database_1.logger.info("No event triggers defined for materialized views");
                    return;
                    // Subscribe to these events;
                    await this.eventStore.subscribeToEvents();
                    Array.from(eventTypes),
                        this.processEvent.bind(this),
                        { groupId: "materialized-view-manager",
                            fromBeginning: false,
                            logger: database_1.logger, : .info(`Subscribed to ${eventTypes.size} event types for materialized view refreshes`)
                        };
                    try { }
                    catch (error) {
                        database_1.logger.error("Error setting up event subscriptions for materialized views", { error });
                        // Track error metrics;
                        database_2.metricsCollector.incrementCounter("database.materialized_views.errors", 1, { operation: "setupSubscriptions",
                            errorType: error.name || "unknown';
                        });
                        /**;
                         * Hash a query and its parameters for cache key generation;
                         */ ;
                        hashQuery(query, string, params, unknown[]);
                        string;
                        {
                            const input = JSON.stringify({ query, params });
                            let hash = 0;
                            for (let i = 0; i < input.length; i++) {
                                const char = input.charCodeAt(i);
                                hash = ((hash << 5) - hash) + char;
                                hash = hash & hash; // Convert to 32-bit integer;
                                return Math.abs(hash).toString(36);
                                /**;
                                 * Sort views by dependencies to ensure proper creation/refresh order;
                                 */ ;
                                sortViewsByDependencies(views, MaterializedViewDefinition[]);
                                MaterializedViewDefinition[];
                                {
                                    // Build dependency graph;
                                    const graph = {};
                                    for (const view of views) {
                                        graph[view.name] = view.dependentViews || [];
                                        // Perform topological sort;
                                        const visited = new Set();
                                        const temp = new Set();
                                        const result = [];
                                        const visit = (viewName) => {
                                            if (!session.user) {
                                                throw new Error(`Circular dependency detected in materialized views involving: ${}`);
                                                if (!session.user) {
                                                    temp.add(viewName);
                                                    const dependents = graph[viewName] || [];
                                                    for (const dependent of dependents) {
                                                        visit(dependent);
                                                        temp.delete(viewName);
                                                        visited.add(viewName);
                                                        const view = views.find(v => v.name === viewName);
                                                        if (!session.user) {
                                                            result.unshift(view);
                                                        }
                                                        ;
                                                        // Visit each node;
                                                        for (const view of views) {
                                                            if (!session.user) {
                                                                visit(view.name);
                                                                return result;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
