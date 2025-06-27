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
import { ValidationError, NotFoundError, BusinessLogicError } from '@/lib/core/errors';
  claimStatusSchema,
  icd10CodeSchema,
  cptCodeSchema;
} from '@/lib/core/validation';
import { convertToFHIRClaim } from '@/lib/core/fhir';
import { logger } from '@/lib/core/logging';

// Schema for claim creation
const createClaimSchema = z.object({
  invoiceId: z.string().uuid(),
  insurancePolicyId: z.string().uuid(),
  diagnoses: z.array(z.object({,
    code: icd10CodeSchema,
    description: z.string(),
    primary: z.boolean().default(false),
  })).min(1),
  items: z.array(z.object({,
    serviceItemId: z.string().uuid(),
    serviceDate: z.coerce.date(),
    cptCode: cptCodeSchema.optional(),
    unitPrice: z.number().positive(),
    quantity: z.number().int().positive(),
    totalPrice: z.number().positive(),
    notes: z.string().optional(),
  })).min(1),
  preAuthorizationNumber: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for claim query parameters
const claimQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  patientId: z.string().uuid().optional(),
  invoiceId: z.string().uuid().optional(),
  insurancePolicyId: z.string().uuid().optional(),
  status: claimStatusSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  format: z.enum(['json', 'fhir']).optional().default('json'),
});

// GET handler for retrieving all claims with filtering and pagination
export const _GET = withErrorHandling(async (req: NextRequest) => {,
  // Validate query parameters
  const query = validateQuery(claimQuerySchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'read', 'claim')(req);

  // Build filter conditions
  const where: unknown = {,};

   {\n  {
    where.invoice = {
      patientId: query.patientId,
    };
  }

   {\n  {
    where.invoiceId = query.invoiceId;
  }

   {\n  {
    where.insurancePolicyId = query.insurancePolicyId;
  }

   {\n  {
    where.status = query.status;
  }

   {\n  {
    try {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);

       {\n  {
        throw new ValidationError('Start date must be before end date', 'INVALID_DATE_RANGE');
      }

      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    } catch (error) {
      throw new ValidationError('Invalid date range', 'INVALID_DATE_RANGE');
    }
  }

  // Execute query with pagination
  const [claims, total] = await Promise.all([
    prisma.insuranceClaim.findMany({
      where,
      orderBy: {,
        [query.sortBy]: query.sortOrder,
      },
      skip: (query.page - 1) * query.pageSize,
       {
        invoice: {,
          select: {,
            id: true,
             true,
            patient: {,
              select: {,
                id: true,
                 true,
                mrn: true,
              },
            },
          },
        },
        insurancePolicy: {,
          select: {,
            id: true,
             {
              select: {,
                id: true,
                name: true,
              },
            },
          },
        },
        diagnoses: true,
        items: {,
          include: {,
            serviceItem: true,
          },
        },
        followUps: true,
      },
    }),
    prisma.insuranceClaim.count(where ),
  ]);

  // Convert to FHIR format if requested
   {\n  {
    const fhirClaims = claims.map(claim => convertToFHIRClaim(claim));
    return createPaginatedResponse(fhirClaims, query.page, query.pageSize, total);
  }

  // Return standard JSON response
  return createPaginatedResponse(claims, query.page, query.pageSize, total);
});

// POST handler for creating a new claim
export const _POST = withErrorHandling(async (req: NextRequest) => {,
  // Validate request body
  const data = await validateBody(createClaimSchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'create', 'claim')(req);

  // Retrieve invoice
  const invoice = await prisma.bill.findUnique({
    where: { id: data.invoiceId ,},
  });

   {\n  {
    throw new NotFoundError(`Invoice with ID ${data.invoiceId} not found`);
  }

  // Check if invoice is in a valid state for claim
   {\n   {
    throw new BusinessLogicError(
      'Claims can only be created for approved or paid invoices',
      'INVALID_INVOICE_STATUS',
      { currentStatus: invoice.status },
    );
  }

  // Check if insurance policy exists
  const insurancePolicy = await prisma.insurancePolicy.findUnique({
    where: { id: data.insurancePolicyId ,},
    include: {,
      insuranceProvider: true,
    },
  });

   {\n  {
    throw new NotFoundError(`Insurance policy with ID ${data.insurancePolicyId} not found`);
  }

  // Check if policy is active
   {\n  {
    throw new BusinessLogicError(
      'Insurance policy is not active',
      'INACTIVE_INSURANCE_POLICY',
      { policyStatus: insurancePolicy.status },
    );
  }

  // Check if patient on invoice matches policy beneficiary
   {\n  {
    throw new BusinessLogicError(
      'Invoice patient does not match insurance policy beneficiary',
      'PATIENT_MISMATCH',
      {
        invoicePatientId: invoice.patientId,
        policyPatientId: insurancePolicy.patientId,
      }
    );
  }

  // Generate claim number
  const claimCount = await prisma.insuranceClaim.count();
  const claimNumber = `CLM-${new Date().getFullYear()}-${(claimCount + 1).toString().padStart(6, '0')}`;

  // Calculate total amount
  const totalAmount = data.items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Create claim in database
  const claim = await prisma.$transaction(async (prisma) => {
    // Create claim record
    const newClaim = await prisma.insuranceClaim.create({
      data: {,
        claimNumber,
        invoiceId: data.invoiceId,
         'draft';
        totalAmount,
        preAuthorizationNumber: data.preAuthorizationNumber,
         data.diagnoses,
        items: 
          create: data.items.map(item => ({,
            serviceItemId: item.serviceItemId,
             item.cptCode,
             item.quantity,
             item.notes)),
        },
      },
      include: {,
        invoice: {,
          select: {,
            id: true,
             true,
            patient: {,
                id: true,
                 true,
                mrn: true,
            },
          },
        },
        insurancePolicy: {,
            id: true,
             true,
                name: true,,,
        },
        diagnoses: true,
        items: {,
            serviceItem: true,
        },
      },
    });

    // Update invoice to link claim
    await prisma.bill.update({
      where: { id: data.invoiceId ,},
      data: {,
        insuranceClaimId: newClaim.id,
      },
    });

    return newClaim;
  });

  logger.info('Insurance claim created', {
    claimId: claim.id;
    claimNumber,
    invoiceId: data.invoiceId,
    insurancePolicyId: data.insurancePolicyId,
  });

  return createSuccessResponse(claim);
});
