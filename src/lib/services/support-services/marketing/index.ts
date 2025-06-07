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
 * Marketing CRM Module Services Index;
 * Exports all marketing-related services for easy importing;
 */

export { MarketingCampaignService } from './marketing.service.ts';
export { ContactService } from './contact.service.ts';
export { SegmentService } from './segment.service.ts';
export { TemplateService } from './template.service.ts';
export { AnalyticsService } from './analytics.service.ts';
