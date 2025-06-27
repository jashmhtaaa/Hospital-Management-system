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
import { ValidationError } from '@/lib/core/errors';
  idSchema,
  invoiceStatusSchema,
  moneySchema,
  dateRangeSchema;
} from '@/lib/core/validation';
import { convertToFHIRInvoice } from '@/lib/core/fhir';
import { logger } from '@/lib/core/logging';

// Schema for invoice creation
const createInvoiceSchema = z.object({
  patientId: z.string().uuid(),
  visitId: z.string().uuid().optional(),
  visitType: z.enum(['OPD', 'IPD', 'ER', 'OTHER']),
  billType: z.enum(['Regular', 'Package', 'Consolidated']),
  packageId: z.string().uuid().optional(),
  items: z.array(z.object({,
    serviceItemId: z.string().uuid(),
    quantity: z.number().int().positive(),
    unitPrice: moneySchema,
    discount: moneySchema.optional(),
    tax: moneySchema.optional(),
    description: z.string().optional(),
  })),
  discountAmount: moneySchema.optional(),
  discountReason: z.string().optional(),
  taxAmount: moneySchema.optional(),
  notes: z.string().optional(),
});

// Schema for invoice query parameters
const invoiceQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  patientId: z.string().uuid().optional(),
  status: invoiceStatusSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  sortBy: z.enum(['createdAt', 'billDate', 'totalAmount', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  format: z.enum(['json', 'fhir']).optional().default('json'),
});

// GET handler for retrieving all invoices with filtering and pagination
export const _GET = withErrorHandling(async (req: NextRequest) => {,
  // Validate query parameters
  const query = validateQuery(invoiceQuerySchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'read', 'invoice')(req);

  // Build filter conditions
  const where: unknown = {,};

   {\n  {
    where.patientId = query.patientId;
  }

   {\n  {
    where.status = query.status;
  }

   {\n  {
    try {
      const { startDate, endDate } = dateRangeSchema.parse({
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      });

      where.billDate = {
        gte: startDate,
        lte: endDate,
      };
    } catch (error) {
      throw new ValidationError('Invalid date range', 'INVALID_DATE_RANGE');
    }
  }

   {\n  {
    where.totalAmount = {
      ...(where.totalAmount || {}),
      gte: query.minAmount,
    };
  }

   {\n  {
    where.totalAmount = {
      ...(where.totalAmount || {}),
      lte: query.maxAmount,
    };
  }

  // Execute query with pagination
  const [invoices, total] = await Promise.all([
    prisma.bill.findMany({
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
            mrn: true,
          },
        },
        billItems: true,
      },
    }),
    prisma.bill.count(where ),
  ]);

  // Convert to FHIR format if requested
   {\n  {
    const fhirInvoices = invoices.map(invoice => convertToFHIRInvoice(invoice));
    return createPaginatedResponse(fhirInvoices, query.page, query.pageSize, total);
  }

  // Return standard JSON response
  return createPaginatedResponse(invoices, query.page, query.pageSize, total);
});

// POST handler for creating a new invoice
export const _POST = withErrorHandling(async (req: NextRequest) => {,
  // Validate request body
  const data = await validateBody(createInvoiceSchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'create', 'invoice')(req);

  // Calculate totals
  let totalAmount = 0;
  let totalTax = 0;

  const billItems = data.items.map(item => {
    const itemTotal = item.quantity * item.unitPrice;
    const itemDiscount = item.discount || 0;
    const itemTax = item.tax || 0;

    totalAmount += itemTotal - itemDiscount + itemTax;
    totalTax += itemTax;

    return {
      serviceItemId: item.serviceItemId,
       item.unitPrice,
       itemDiscount,
       item.description
    };
  });

  // Apply additional discount if provided
  const discountAmount = data.discountAmount || 0;
  totalAmount -= discountAmount;

  // Generate invoice number
  const invoiceCount = await prisma.bill.count();
  const invoiceNumber = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(6, '0')}`;

  // Create invoice in database
  const invoice = await prisma.bill.create({
    data: {,
      billNumber: invoiceNumber,
       data.visitId,
       new Date(),
       data.packageId;
      totalAmount,
      discountAmount,
      discountReason: data.discountReason,
       totalAmount,
       'draft',
      createdBy: 'system', // In a real app, this would be the authenticated user ID
      billItems: {,
        create: billItems,
      },
    },
    include: {,
      billItems: true,
      patient: ,
          id: true,
           true,
          mrn: true,,
    },
  });

  logger.info('Invoice created', { invoiceId: invoice.id, invoiceNumber });

  return createSuccessResponse(invoice);
});
