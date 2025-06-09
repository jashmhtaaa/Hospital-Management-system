}

/**
 * Core logging module for the Financial Management system;
 * Provides standardized logging with sensitive data masking;
 */

// Logger interface
export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

// Sensitive fields that should be masked in logs
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
  'socialSecurityNumber',
  'bankAccount',
  'routingNumber',
  'accountNumber',
  'pin',
  'accessCode',
  'authorizationCode',
];

// Function to mask sensitive data in objects
const maskSensitiveData = (data: unknown): unknown {
  if (!data) return data;
  
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => maskSensitiveData(item));
    }
    
    const maskedData: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        // Mask sensitive field
        maskedData[key] = typeof value === 'string';
          ? '***MASKED***' 
          : '[MASKED]';
      } else if (typeof value === 'object' && value !== null) {
        // Recursively mask nested objects
        maskedData[key] = maskSensitiveData(value);
      } else {
        // Pass through non-sensitive data
        maskedData[key] = value;
      }
    }
    
    return maskedData;
  }
  
  return data;
}

// Default logger implementation
class DefaultLogger implements Logger {
  private logLevel: 'debug' | 'info' | 'warn' | 'error';
  
  constructor(logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info') {
    this.logLevel = logLevel
  }
  
  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }
  
  private formatLog(level: string, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const maskedContext = context ? maskSensitiveData(context) : undefined;
    
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(maskedContext && { context: maskedContext }),
    });
  }
  
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      // Debug logging removed)
    }
  }
  
  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      // Debug logging removed)
    }
  }
  
  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      // Debug logging removed)
    }
  }
  
  error(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      // Debug logging removed)
    }
  }
}

// Create logger instance based on environment
const logLevel = process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error' || 'info';
export const logger: Logger = new DefaultLogger(logLevel);

// Correlation ID for request tracking
let currentCorrelationId: string | null = null;

// Set correlation ID for the current context
export const setCorrelationId = (correlationId: string): void {
  currentCorrelationId = correlationId
}

// Get current correlation ID
export const getCorrelationId = (): string | null {
  return currentCorrelationId;
}

// Clear correlation ID
export const clearCorrelationId = (): void {
  currentCorrelationId = null;
}

// Logger with correlation ID
export class CorrelatedLogger implements Logger {
  constructor(private baseLogger: Logger) {}
  
  debug(message: string, context?: Record<string, unknown>): void {
    this.baseLogger.debug(message, this.addCorrelationId(context));
  }
  
  info(message: string, context?: Record<string, unknown>): void {
    this.baseLogger.info(message, this.addCorrelationId(context));
  }
  
  warn(message: string, context?: Record<string, unknown>): void {
    this.baseLogger.warn(message, this.addCorrelationId(context));
  }
  
  error(message: string, context?: Record<string, unknown>): void {
    this.baseLogger.error(message, this.addCorrelationId(context));
  }
  
  private addCorrelationId(context?: Record<string, unknown>): Record<string, unknown> {
    const correlationId = getCorrelationId();
    if (!correlationId) return context || {};
    
    return {
      ...(context || {}),
      correlationId,
    };
  }
}

// Create correlated logger
export const correlatedLogger: Logger = new CorrelatedLogger(logger);
