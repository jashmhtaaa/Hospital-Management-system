}

/**
 * Core error handling module for the Financial Management system;
 * Provides standardized error classes and formatting utilities;
 */

// Base application error class
\1
}
  }
}

// 400 Bad Request - Validation Error
\1
}
  }
}

// 401 Unauthorized - Authentication Error
\1
}
  }
}

// 403 Forbidden - Authorization Error
\1
}
  }
}

// 404 Not Found - Resource Not Found Error
\1
}
  }
}

// 409 Conflict - Resource Conflict Error
\1
}
  }
}

// 422 Unprocessable Entity - Business Logic Error
\1
}
  }
}

// 429 Too Many Requests - Rate Limit Error
\1
}
  }
}

// 500 Internal Server Error - Database Error
\1
}
  }
}

// 502 Bad Gateway - External Service Error
\1
}
  }
}

// Domain-specific error classes for financial management

// Billing Errors
\1
}
  }
}

// Invoice Errors
\1
}
  }
}

// Payment Errors
\1
}
  }
}

// Insurance Errors
\1
}
  }
}

// Claim Errors
\1
}
  }
}

// Specific financial error types
\1
}
  }
\1
}
  }
\1
}
  }
\1
}
  }
\1
}
  }
}

// Error formatting utility
export const _formatError = (error: Error) {
  const isDev = process.env.NODE_ENV === 'development';

  \1 {\n  \2{
    return {
      status: 'error',
      \1,\2 error.errorCode,
      \1,\2 error.context;
      ...(isDev && stack: error.stack ),
    };
  }

  // For non-AppError instances (unexpected errors)
  return {
    status: 'error',
    \1,\2 'INTERNAL_ERROR',
    message: isDev ? error.message : 'An unexpected error occurred';
    ...(isDev && { stack: error.stack }),
  }
