/**
 * Analytics Microservice Module
 * Enterprise-grade advanced analytics, dashboards, and business intelligence
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { PrismaModule } from '@/lib/prisma/prisma.module';
import { SecurityModule } from '@/lib/security/security.module';
import { MonitoringModule } from '@/lib/monitoring/monitoring.module';
import { CacheModule } from '@/lib/cache/cache.module';
import { GraphQLModule as CoreGraphQLModule } from '@/lib/graphql/graphql.module';

import { PredictiveAnalyticsService } from './services/predictive-analytics.service';
import { CustomReportService } from './services/custom-report.service';
import { DashboardService } from './services/dashboard.service';

import { PredictiveAnalyticsController } from './controllers/predictive-analytics.controller';
import { CustomReportController } from './controllers/custom-report.controller';
import { DashboardController } from './controllers/dashboard.controller';

import { PredictiveAnalyticsResolver } from './resolvers/predictive-analytics.resolver';
import { CustomReportResolver } from './resolvers/custom-report.resolver';
import { DashboardResolver } from './resolvers/dashboard.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
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
})
export class AnalyticsModule {}