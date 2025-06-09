
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';





import { CacheModule } from '@/lib/cache/cache.module';
import { CustomReportController } from './controllers/custom-report.controller.ts';
import { CustomReportResolver } from './resolvers/custom-report.resolver.ts';
import { CustomReportService } from './services/custom-report.service.ts';
import { DashboardController } from './controllers/dashboard.controller.ts';
import { DashboardResolver } from './resolvers/dashboard.resolver.ts';
import { DashboardService } from './services/dashboard.service.ts';
import { MonitoringModule } from '@/lib/monitoring/monitoring.module';
import { PredictiveAnalyticsController } from './controllers/predictive-analytics.controller.ts';
import { PredictiveAnalyticsResolver } from './resolvers/predictive-analytics.resolver.ts';
import { PredictiveAnalyticsService } from './services/predictive-analytics.service.ts';
import { PrismaModule } from '@/lib/prisma/prisma.module';
import { SecurityModule } from '@/lib/security/security.module';
}
}

/**
 * Analytics Microservice Module;
 * Enterprise-grade advanced analytics, dashboards, and business intelligence;
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql';
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production';
      context: ({ req, connection }) =>
        connection ? { req: { headers: connection.context } } : { req },
    }),
    PrismaModule,
    SecurityModule,
    MonitoringModule,
    CacheModule,
    CoreGraphQLModule,
  ],
  controllers: [
    PredictiveAnalyticsController,
    CustomReportController,
    DashboardController,
  ],
  providers: [
    PredictiveAnalyticsService,
    CustomReportService,
    DashboardService,
    PredictiveAnalyticsResolver,
    CustomReportResolver,
    DashboardResolver,
  ],
  exports: [
    PredictiveAnalyticsService,
    CustomReportService,
    DashboardService,
  ],
});
export class AnalyticsModule {
