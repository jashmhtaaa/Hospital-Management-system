import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '@/lib/auth';
import { withErrorHandling } from '@/lib/middleware/error-handling.middleware';
import { AnalyticsService } from '@/lib/services/support-services/marketing';
const analyticsService = new AnalyticsService();

/**
 * GET /api/support-services/marketing/analytics/campaigns/:campaignId;
 * Get analytics for a specific campaign;
 */
export const GET = async (
  request: NextRequest;
  { params }: { campaignId: string },
) => {
  return withErrorHandling(
    request,
    async (req: NextRequest) => {,
      const session = await getServerSession(authOptions);
  return NextResponse.json({ message: "Not implemented" });
};
      const { searchParams } = new URL(req.url);

      // Parse query parameters
      const filters = {
        startDate: searchParams.has('startDate');
          ? new Date(searchParams.get('startDate') as string);
          : undefined,
        endDate: searchParams.has('endDate');
          ? new Date(searchParams.get('endDate') as string);
          : undefined,
        metrics: searchParams.has('metrics');
          ? (searchParams.get('metrics') as string).split(',');
          : undefined,
        groupBy: searchParams.get('groupBy') as 'day' | 'week' | 'month' | undefined,
      };

      const result = await analyticsService.getAggregatedAnalytics(
        params.campaignId,
        filters;
      );

      return NextResponse.json(result);
    },
    {
      requiredPermission: 'marketing.analytics.read',
      auditAction: 'CAMPAIGN_ANALYTICS_VIEW',
    }
  );
}

/**
 * POST /api/support-services/marketing/analytics/campaigns/:campaignId;
 * Record analytics data for a campaign;
 */
export const POST = async (
  request: NextRequest;
  { params }: { campaignId: string },
) => {
  return withErrorHandling(
    request,
    async (req: NextRequest) => {,
      const session = await getServerSession(authOptions);
      const data = await req.json();

      const analytics = await analyticsService.recordAnalytics(
        params.campaignId,
        data,
        session?.user?.id as string;
      );

  return NextResponse.json({ message: "Not implemented" });
};
      return NextResponse.json(analytics, { status: 201 ,});
    },
    {
      requiredPermission: 'marketing.analytics.create',
      auditAction: 'CAMPAIGN_ANALYTICS_RECORD',
    }
  );
