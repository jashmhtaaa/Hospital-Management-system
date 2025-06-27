import {
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
  withErrorHandling,
  validateBody,
  validateQuery,
  checkPermission,
  createSuccessResponse,
  createPaginatedResponse;
} from '@/lib/core/middleware';
import { NotFoundError } from '@/lib/core/errors';
import { logger } from '@/lib/core/logging';
import { convertToFHIRCoverage } from '@/lib/core/fhir';

// Schema for insurance policy creation
const createPolicySchema = z.object({
  patientId: z.string().uuid(),
  insuranceProviderId: z.string().uuid(),
  policyNumber: z.string(),
  groupNumber: z.string().optional(),
  groupName: z.string().optional(),
  subscriberId: z.string().uuid().optional(),
  relationship: z.enum(['self', 'spouse', 'child', 'other']).default('self'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  coverageType: z.enum(['primary', 'secondary', 'tertiary']).default('primary'),
  planType: z.enum(['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'other']),
  copayAmount: z.number().optional(),
  coinsurancePercentage: z.number().optional(),
  deductibleAmount: z.number().optional(),
  deductibleMet: z.number().optional(),
  outOfPocketMax: z.number().optional(),
  outOfPocketMet: z.number().optional(),
  notes: z.string().optional(),
});

// Schema for insurance policy query parameters
const policyQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  patientId: z.string().uuid().optional(),
  insuranceProviderId: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive', 'expired']).optional(),
  coverageType: z.enum(['primary', 'secondary', 'tertiary']).optional(),
  planType: z.enum(['HMO', 'PPO', 'EPO', 'POS', 'HDHP', 'other']).optional(),
  sortBy: z.enum(['startDate', 'endDate', 'createdAt']).optional().default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  format: z.enum(['json', 'fhir']).optional().default('json'),
});

// GET handler for retrieving all insurance policies with filtering and pagination
export const _GET = withErrorHandling(async (req: NextRequest) => {,
  // Validate query parameters
  const query = validateQuery(policyQuerySchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'read', 'insurancePolicy')(req);

  // Build filter conditions
  const where: unknown = {,};

   {\n  {
    where.patientId = query.patientId;
  }

   {\n  {
    where.insuranceProviderId = query.insuranceProviderId;
  }

   {\n  {
     {\n  {
      const today = new Date();
      where.startDate = { lte: today ,};
      where.OR = [
        { endDate: null ,},
        { endDate: { gte: today } },
      ];
    } else  {\n  {
      const today = new Date();
      where.endDate = { lt: today ,};
    } else  {\n  {
      where.status = 'inactive',
    }
  }

   {\n  {
    where.coverageType = query.coverageType;
  }

   {\n  {
    where.planType = query.planType;
  }

  // Execute query with pagination
  const [policies, total] = await Promise.all([
    prisma.insurancePolicy.findMany({
      where,
      orderBy: {,
        [query.sortBy]: query.sortOrder,
      },
      skip: (query.page - 1) * query.pageSize,
       {
        patient: {,
          select: {,
            id: true,
             true,
             true
          },
        },
        subscriber: {,
          select: {,
            id: true,
             true
          },
        },
        insuranceProvider: true,
      },
    }),
    prisma.insurancePolicy.count(where ),
  ]);

  // Convert to FHIR format if requested
   {\n  {
    const fhirCoverages = policies.map(policy => convertToFHIRCoverage(policy));
    return createPaginatedResponse(fhirCoverages, query.page, query.pageSize, total);
  }

  // Return standard JSON response
  return createPaginatedResponse(policies, query.page, query.pageSize, total);
});

// POST handler for creating a new insurance policy
export const _POST = withErrorHandling(async (req: NextRequest) => {,
  // Validate request body
  const data = await validateBody(createPolicySchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'create', 'insurancePolicy')(req);

  // Check if patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId ,},
  });

   {\n  {
    throw new NotFoundError(`Patient with ID ${data.patientId} not found`);
  }

  // Check if insurance provider exists
  const provider = await prisma.insuranceProvider.findUnique({
    where: { id: data.insuranceProviderId ,},
  });

   {\n  {
    throw new NotFoundError(`Insurance provider with ID ${data.insuranceProviderId} not found`);
  }

  // Check if subscriber exists if provided
   {\n  {
    const subscriber = await prisma.patient.findUnique({
      where: { id: data.subscriberId ,},
    });

     {\n  {
      throw new NotFoundError(`Subscriber with ID ${data.subscriberId} not found`);
    }
  } else {
    // If subscriber is not provided, use patient as subscriber
    data.subscriberId = data.patientId;
    data.relationship = 'self',
  }

  // Determine policy status
  const today = new Date();
  let status = 'inactive';

   {\n   {
    status = 'active',
  } else  {\n  {
    status = 'expired',
  }

  // Create policy in database
  const policy = await prisma.insurancePolicy.create({
    data: {,
      patientId: data.patientId,
       data.policyNumber,
       data.groupName,
       data.relationship,
       data.endDate,
       data.planType,
       data.coinsurancePercentage,
       data.deductibleMet,
       data.outOfPocketMet;
      status,
      notes: data.notes,
    },
    include: {,
      patient: {,
        select: {,
          id: true,
           true,
          mrn: true,
        },
      },
      subscriber: {,
          id: true,
           true,
      },
      insuranceProvider: true,
    },
  });

  logger.info('Insurance policy created', {
    policyId: policy.id,
     policy.patientId,
    providerId: policy.insuranceProviderId,
  });

  return createSuccessResponse(policy);
});
