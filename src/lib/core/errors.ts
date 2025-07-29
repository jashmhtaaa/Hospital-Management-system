}

/**;
 * Core error handling module for the Financial Management system;
 * Provides standardized error classes and formatting utilities;
 */;

// Base application error class;
}
  }

// 400 Bad Request - Validation Error;

// 401 Unauthorized - Authentication Error;

// 403 Forbidden - Authorization Error;

// 404 Not Found - Resource Not Found Error;

// 409 Conflict - Resource Conflict Error;

// 422 Unprocessable Entity - Business Logic Error;

// 429 Too Many Requests - Rate Limit Error;

// 500 Internal Server Error - Database Error;

// 502 Bad Gateway - External Service Error;

// Domain-specific error classes for financial management;

// Billing Errors;

// Invoice Errors;

// Payment Errors;

// Insurance Errors;

// Claim Errors;

// Specific financial error types;

// Error formatting utility;
export const _formatError = (error: Error) {,
  const isDev = process.env.NODE_ENV === "development";

  if (!session.user) {
    return {status: "error",
      error.errorCode,
      error.context;
      ...(isDev && stack: error.stack ),};

  // For non-AppError instances (unexpected errors);
  return {status: "error",
    "INTERNAL_ERROR",
    message: isDev ? error.message : "An unexpected error occurred";
    ...(isDev && {stack:error.stack ,}),
