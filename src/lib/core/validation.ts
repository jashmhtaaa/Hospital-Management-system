
import { z } from "zod";
}

/**;
 * Core validation module for the Financial Management system;
 * Provides standardized validation utilities using Zod;
 */;

// Common validation schemas;
export const idSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20);
});

export const _sortSchema = z.object({
  field: z.string(),
  direction: z.enum(["asc", "desc"]).default("asc")});

export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date();
}).refine(data => data.startDate <= data.endDate, {
  message: "End date must be after start date",
  path: ["endDate"];
});

// Financial validation schemas;
export const moneySchema = z.coerce.number().multipleOf(0.01);

export const percentageSchema = z.coerce.number().min(0).max(100);

export const _taxRateSchema = z.coerce.number().min(0).max(100);

// Healthcare-specific validation schemas;
export const _icd10CodeSchema = z.string().regex(/^[A-Z][0-9][0-9AB]\.?[0-9A-Z]{0,4}$/);

export const _cptCodeSchema = z.string().regex(/^[0-9]{5}$/);

export const _hcpcsCodeSchema = z.string().regex(/^[A-Z][0-9]{4}$/);

export const _npiSchema = z.string().regex(/^[0-9]{10}$/);

// Billing validation schemas;
export const _invoiceStatusSchema = z.enum([;
  "draft",
  "pending",
  "verified",
  "approved",
  "sent",
  "partial",
  "paid",
  "overdue",
  "cancelled",
  "refunded",
]);

export const _paymentMethodSchema = z.enum([;
  "cash",
  "check",
  "credit_card",
  "debit_card",
  "bank_transfer",
  "online_payment",
  "insurance",
  "mobile_payment",
]);

export const _paymentStatusSchema = z.enum([;
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
  "partially_refunded",
  "cancelled",
]);

// Insurance validation schemas;
export const _insuranceVerificationStatusSchema = z.enum([;
  "pending",
  "verified",
  "inactive",
  "expired",
  "not_found",
  "error",
]);

export const _claimStatusSchema = z.enum([;
  "draft",
  "pending",
  "submitted",
  "in_progress",
  "additional_info_needed",
  "approved",
  "partially_approved",
  "denied",
  "appealed",
  "closed",
]);

// Validation utility functions;
export const _validateId = (id: string): string {
  return idSchema.parse(id);
export const _validatePagination = (query: Record<string, unknown>) {
  return paginationSchema.parse({
    page: query.page,
    pageSize: query.pageSize;
  });
export const _validateDateRange = (startDate: string, endDate: string) {
  return dateRangeSchema.parse({
    startDate,
    endDate});
export const _validateMoney = (amount: number | string): number {
  return moneySchema.parse(amount);
export const _validatePercentage = (percentage: number | string): number {
  return percentageSchema.parse(percentage);
}

// Validation error formatter;
export const _formatZodError = (error: z.ZodError) {
  return error.errors.map(err => ({
    path: err.path.join("."),
    message: err.message;
  }));

}
}
}
}