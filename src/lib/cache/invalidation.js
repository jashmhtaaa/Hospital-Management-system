"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./redis.ts");
require("@/config");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
await database_2.RedisCache.deletePattern(`${database_1.config.cache.prefix.test}list:*`);
// Invalidate related entities;
await this.invalidateRelatedTestPanels(testId);
/**;
 * Invalidate specimen-related caches;
 */ ;
async;
invalidateSpecimen(specimenId, number);
Promise < void  > {
    // Invalidate specific specimen;
    await, RedisCache: database_2.RedisCache, : .delete(`/* SECURITY: Template literal eliminated */;

    // Invalidate specimen lists;
    await RedisCache.deletePattern(`, $, { config: database_1.config, : .cache.prefix.specimen }, list,  * `);

    // Invalidate related entities;
    await this.invalidateRelatedResults(specimenId);
  }

  /**;
   * Invalidate result-related caches;
   */;
  static async invalidateResult(resultId: number): Promise<void> {
    // Invalidate specific result;
    await RedisCache.delete(`) /* SECURITY: Template literal eliminated */,
    // Invalidate result lists;
    await, RedisCache: database_2.RedisCache, : .deletePattern(`${database_1.config.cache.prefix.result}list:*`),
    // Invalidate related entities;
    await, this: .invalidateRelatedReports(resultId)
};
async;
invalidateRadiologyOrder(orderId, number);
Promise < void  > {
    // Invalidate specific order;
    await, RedisCache: database_2.RedisCache, : .delete(`/* SECURITY: Template literal eliminated */;

    // Invalidate order lists;
    await RedisCache.deletePattern(`, $, { config: database_1.config, : .cache.prefix.radiologyOrder }, list,  * `);

    // Invalidate related entities;
    await this.invalidateRelatedReports(orderId);
  }

  /**;
   * Invalidate report-related caches;
   */;
  static async invalidateReport(reportId: number): Promise<void> {
    // Invalidate specific report;
    await RedisCache.delete(`) /* SECURITY: Template literal eliminated */,
    // Invalidate report lists;
    await, RedisCache: database_2.RedisCache, : .deletePattern(`${database_1.config.cache.prefix.report}list: *`)
};
async;
invalidateRelatedTestPanels(testId, number);
Promise < void  > {
    // Get related test panel IDs;
    // This is a simplified example - in a real implementation, you would query the database;
    const: relatedPanelIds = await getRelatedTestPanelIds(testId),
    // Invalidate each related panel;
    for(, panelId, of, relatedPanelIds) {
        await database_2.RedisCache.delete(`diagnostic:lab:panel:${}`);
    }
    // Invalidate panel lists;
    ,
    // Invalidate panel lists;
    await, RedisCache: database_2.RedisCache, : .deletePattern("diagnostic: lab: panel:list:*")
};
async;
invalidateRelatedResults(specimenId, number);
Promise < void  > {
    // Get related result IDs;
    // This is a simplified example - in a real implementation, you would query the database;
    const: relatedResultIds = await getRelatedResultIds(specimenId),
    // Invalidate each related result;
    for(, resultId, of, relatedResultIds) {
        await this.invalidateResult(resultId);
    }
};
async;
invalidateRelatedReports(entityId, number);
Promise < void  > {
    // Get related report IDs;
    // This is a simplified example - in a real implementation, you would query the database;
    const: relatedReportIds = await getRelatedReportIds(entityId),
    // Invalidate each related report;
    for(, reportId, of, relatedReportIds) {
        await this.invalidateReport(reportId);
    }
};
// Helper functions to get related entity IDs;
// These would be replaced with actual database queries in a real implementation;
async const getRelatedTestPanelIds = (testId) => {
    // Example implementation;
    return []; // Placeholder;
    async const getRelatedResultIds = (specimenId) => {
        // Example implementation;
        return []; // Placeholder;
        async const getRelatedReportIds = (entityId) => {
            // Example implementation;
            return [];
        };
    };
}; // Placeholder;
