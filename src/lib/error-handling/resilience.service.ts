/**
 * Resilience Service
 * Comprehensive error handling and resilience patterns for enterprise-grade applications
 * Includes circuit breakers, retry mechanisms, dead letter queues, and contextual logging
 */

import { EventEmitter } from 'events';

// Circuit Breaker States
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

// Error Types
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  SYSTEM = 'SYSTEM',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT'
}

// Severity Levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Custom Error Classes
export class BaseError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly context: Record<string, any>;
  public readonly timestamp: Date;
  public readonly requestId?: string;
  public readonly userId?: string;
  public readonly retryable: boolean;

  constructor(
    message: string,
    type: ErrorType,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: Record<string, any> = {},
    retryable: boolean = false
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
    this.retryable = retryable;
    
    // Capture request context if available
    this.requestId = context.requestId;
    this.userId = context.userId;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.VALIDATION, ErrorSeverity.LOW, context, false);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.DATABASE, ErrorSeverity.HIGH, context, true);
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.NETWORK, ErrorSeverity.MEDIUM, context, true);
  }
}

export class ExternalServiceError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.EXTERNAL_SERVICE, ErrorSeverity.MEDIUM, context, true);
  }
}

export class TimeoutError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.TIMEOUT, ErrorSeverity.MEDIUM, context, true);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.AUTHENTICATION, ErrorSeverity.HIGH, context, false);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.AUTHORIZATION, ErrorSeverity.MEDIUM, context, false);
  }
}

export class BusinessLogicError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.BUSINESS_LOGIC, ErrorSeverity.MEDIUM, context, false);
  }
}

export class SystemError extends BaseError {
  constructor(message: string, context: Record<string, any> = {}) {
    super(message, ErrorType.SYSTEM, ErrorSeverity.CRITICAL, context, true);
  }
}

// Circuit Breaker Configuration
interface CircuitBreakerConfig {
  failureThreshold: number;
  timeout: number;
  resetTimeout: number;
  monitoringPeriod: number;
  expectedErrors?: ErrorType[];
}

// Retry Configuration
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableErrors?: ErrorType[];
}

// Contextual Logger Interface
interface ContextualLogger {
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
  critical(message: string, error?: Error, context?: Record<string, any>): void;
}

// Circuit Breaker Implementation
export class CircuitBreaker extends EventEmitter {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private lastFailureTime?: Date;
  private successCount: number = 0;
  private totalRequests: number = 0;
  private config: CircuitBreakerConfig;
  private name: string;

  constructor(name: string, config: CircuitBreakerConfig) {
    super();
    this.name = name;
    this.config = {
      failureThreshold: 5,
      timeout: 60000, // 1 minute
      resetTimeout: 30000, // 30 seconds
      monitoringPeriod: 60000, // 1 minute
      ...config
    };

    // Set up monitoring
    this.setupMonitoring();
  }

  async execute<T>(operation: () => Promise<T>, context?: Record<string, any>): Promise<T> {
    this.totalRequests++;

    if (this.state === CircuitBreakerState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitBreakerState.HALF_OPEN;
        this.emit('stateChange', { 
          from: CircuitBreakerState.OPEN, 
          to: CircuitBreakerState.HALF_OPEN,
          context 
        });
      } else {
        throw new ExternalServiceError(
          `Circuit breaker ${this.name} is OPEN`,
          { circuitBreaker: this.name, state: this.state, ...context }
        );
      }
    }

    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new TimeoutError(
            `Operation timed out after ${this.config.timeout}ms`,
            { circuitBreaker: this.name, timeout: this.config.timeout }
          ));
        }, this.config.timeout);
      })
    ]);
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.successCount++;
    
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.state = CircuitBreakerState.CLOSED;
      this.emit('stateChange', { 
        from: CircuitBreakerState.HALF_OPEN, 
        to: CircuitBreakerState.CLOSED 
      });
    }
  }

  private onFailure(error: Error): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    // Only count expected errors towards circuit breaker
    if (error instanceof BaseError && 
        this.config.expectedErrors && 
        !this.config.expectedErrors.includes(error.type)) {
      return;
    }

    if (this.state === CircuitBreakerState.HALF_OPEN || 
        this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
      this.emit('stateChange', { 
        from: this.state === CircuitBreakerState.HALF_OPEN ? CircuitBreakerState.HALF_OPEN : CircuitBreakerState.CLOSED,
        to: CircuitBreakerState.OPEN,
        error: error.message 
      });
    }
  }

  private shouldAttemptReset(): boolean {
    return this.lastFailureTime && 
           (Date.now() - this.lastFailureTime.getTime()) >= this.config.resetTimeout;
  }

  private setupMonitoring(): void {
    setInterval(() => {
      const metrics = this.getMetrics();
      this.emit('metrics', metrics);
    }, this.config.monitoringPeriod);
  }

  getMetrics(): Record<string, any> {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalRequests: this.totalRequests,
      failureRate: this.totalRequests > 0 ? this.failureCount / this.totalRequests : 0,
      lastFailureTime: this.lastFailureTime
    };
  }
}

// Retry Mechanism Implementation
export class RetryHandler {
  private config: RetryConfig;
  private logger: ContextualLogger;

  constructor(config: RetryConfig, logger: ContextualLogger) {
    this.config = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffMultiplier: 2,
      jitter: true,
      retryableErrors: [ErrorType.NETWORK, ErrorType.TIMEOUT, ErrorType.DATABASE, ErrorType.EXTERNAL_SERVICE],
      ...config
    };
    this.logger = logger;
  }

  async execute<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        const result = await operation();
        
        if (attempt > 1) {
          this.logger.info(`Operation succeeded on attempt ${attempt}`, {
            attempt,
            totalAttempts: this.config.maxAttempts,
            ...context
          });
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (!this.shouldRetry(error as Error, attempt)) {
          this.logger.error(
            `Operation failed and will not be retried`,
            error as Error,
            { attempt, maxAttempts: this.config.maxAttempts, ...context }
          );
          throw error;
        }

        if (attempt < this.config.maxAttempts) {
          const delay = this.calculateDelay(attempt);
          this.logger.warn(
            `Operation failed, retrying in ${delay}ms`,
            { 
              attempt, 
              maxAttempts: this.config.maxAttempts, 
              delay,
              error: (error as Error).message,
              ...context 
            }
          );
          await this.sleep(delay);
        }
      }
    }

    this.logger.error(
      `Operation failed after ${this.config.maxAttempts} attempts`,
      lastError!,
      { maxAttempts: this.config.maxAttempts, ...context }
    );
    
    throw lastError;
  }

  private shouldRetry(error: Error, attempt: number): boolean {
    if (attempt >= this.config.maxAttempts) {
      return false;
    }

    if (error instanceof BaseError) {
      return error.retryable && 
             this.config.retryableErrors!.includes(error.type);
    }

    // For non-BaseError instances, use conservative approach
    return false;
  }

  private calculateDelay(attempt: number): number {
    let delay = this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
    delay = Math.min(delay, this.config.maxDelay);

    if (this.config.jitter) {
      // Add jitter to prevent thundering herd
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Contextual Logger Implementation
export class StructuredLogger implements ContextualLogger {
  private serviceName: string;
  private defaultContext: Record<string, any>;

  constructor(serviceName: string, defaultContext: Record<string, any> = {}) {
    this.serviceName = serviceName;
    this.defaultContext = defaultContext;
  }

  debug(message: string, context: Record<string, any> = {}): void {
    this.log('DEBUG', message, undefined, context);
  }

  info(message: string, context: Record<string, any> = {}): void {
    this.log('INFO', message, undefined, context);
  }

  warn(message: string, context: Record<string, any> = {}): void {
    this.log('WARN', message, undefined, context);
  }

  error(message: string, error?: Error, context: Record<string, any> = {}): void {
    this.log('ERROR', message, error, context);
  }

  critical(message: string, error?: Error, context: Record<string, any> = {}): void {
    this.log('CRITICAL', message, error, context);
    
    // In production, this would trigger alerts
    this.triggerAlert(message, error, context);
  }

  private log(
    level: string, 
    message: string, 
    error?: Error, 
    context: Record<string, any> = {}
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      ...this.defaultContext,
      ...context
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof BaseError ? {
          type: error.type,
          severity: error.severity,
          retryable: error.retryable,
          requestId: error.requestId,
          userId: error.userId,
          context: error.context
        } : {})
      };
    }

    // In production, use proper logging framework (Winston, Bunyan, etc.)
    console.log(JSON.stringify(logEntry, null, 2));
  }

  private triggerAlert(message: string, error?: Error, context: Record<string, any> = {}): void {
    // In production, integrate with alerting systems (PagerDuty, Slack, etc.)
    console.error('🚨 CRITICAL ALERT:', { message, error: error?.message, context });
  }

  setDefaultContext(context: Record<string, any>): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }
}

// Dead Letter Queue Interface
export interface DeadLetterQueue {
  enqueue(message: any, error: Error, context: Record<string, any>): Promise<void>;
  dequeue(): Promise<any>;
  getQueueSize(): Promise<number>;
  reprocess(messageId: string): Promise<void>;
}

// Simple In-Memory Dead Letter Queue Implementation
export class InMemoryDeadLetterQueue implements DeadLetterQueue {
  private queue: Array<{
    id: string;
    message: any;
    error: Error;
    context: Record<string, any>;
    enqueuedAt: Date;
    attempts: number;
  }> = [];
  
  private logger: ContextualLogger;

  constructor(logger: ContextualLogger) {
    this.logger = logger;
  }

  async enqueue(message: any, error: Error, context: Record<string, any>): Promise<void> {
    const id = `dlq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.queue.push({
      id,
      message,
      error,
      context,
      enqueuedAt: new Date(),
      attempts: 0
    });

    this.logger.warn('Message added to dead letter queue', {
      messageId: id,
      error: error.message,
      queueSize: this.queue.length,
      ...context
    });
  }

  async dequeue(): Promise<any> {
    return this.queue.shift();
  }

  async getQueueSize(): Promise<number> {
    return this.queue.length;
  }

  async reprocess(messageId: string): Promise<void> {
    const messageIndex = this.queue.findIndex(item => item.id === messageId);
    if (messageIndex === -1) {
      throw new Error(`Message with ID ${messageId} not found in dead letter queue`);
    }

    const message = this.queue[messageIndex];
    message.attempts++;

    this.logger.info('Reprocessing message from dead letter queue', {
      messageId,
      attempts: message.attempts,
      enqueuedAt: message.enqueuedAt
    });

    // In production, this would trigger reprocessing logic
  }
}

// Resilience Service - Main Orchestrator
export class ResilienceService {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private retryHandler: RetryHandler;
  private logger: StructuredLogger;
  private deadLetterQueue: DeadLetterQueue;

  constructor(
    serviceName: string,
    retryConfig?: Partial<RetryConfig>,
    defaultContext?: Record<string, any>
  ) {
    this.logger = new StructuredLogger(serviceName, defaultContext);
    this.retryHandler = new RetryHandler(retryConfig || {}, this.logger);
    this.deadLetterQueue = new InMemoryDeadLetterQueue(this.logger);

    this.setupGlobalErrorHandling();
  }

  // Circuit Breaker Management
  createCircuitBreaker(name: string, config: Partial<CircuitBreakerConfig> = {}): CircuitBreaker {
    const circuitBreaker = new CircuitBreaker(name, config as CircuitBreakerConfig);
    
    circuitBreaker.on('stateChange', (event) => {
      this.logger.warn('Circuit breaker state changed', {
        circuitBreaker: name,
        ...event
      });
    });

    circuitBreaker.on('metrics', (metrics) => {
      this.logger.debug('Circuit breaker metrics', { metrics });
    });

    this.circuitBreakers.set(name, circuitBreaker);
    return circuitBreaker;
  }

  getCircuitBreaker(name: string): CircuitBreaker | undefined {
    return this.circuitBreakers.get(name);
  }

  // Execute with full resilience patterns
  async executeWithResilience<T>(
    operation: () => Promise<T>,
    options: {
      circuitBreakerName?: string;
      retryConfig?: Partial<RetryConfig>;
      context?: Record<string, any>;
      fallback?: () => Promise<T>;
    } = {}
  ): Promise<T> {
    const context = {
      requestId: this.generateRequestId(),
      ...options.context
    };

    try {
      // Set context for this request
      this.logger.setDefaultContext(context);

      let wrappedOperation = operation;

      // Wrap with circuit breaker if specified
      if (options.circuitBreakerName) {
        const circuitBreaker = this.getCircuitBreaker(options.circuitBreakerName);
        if (!circuitBreaker) {
          throw new Error(`Circuit breaker ${options.circuitBreakerName} not found`);
        }
        
        wrappedOperation = () => circuitBreaker.execute(operation, context);
      }

      // Wrap with retry logic
      const retryHandler = options.retryConfig ? 
        new RetryHandler(options.retryConfig, this.logger) : 
        this.retryHandler;

      return await retryHandler.execute(wrappedOperation, context);
    } catch (error) {
      this.logger.error('Operation failed after all resilience patterns', error as Error, context);

      // Try fallback if available
      if (options.fallback) {
        this.logger.info('Attempting fallback operation', context);
        try {
          return await options.fallback();
        } catch (fallbackError) {
          this.logger.error('Fallback operation also failed', fallbackError as Error, context);
          
          // Send to dead letter queue for later processing
          await this.deadLetterQueue.enqueue(
            { operation: operation.toString(), options },
            error as Error,
            context
          );
        }
      }

      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    circuitBreakers: Record<string, any>;
    deadLetterQueueSize: number;
    timestamp: string;
  }> {
    const circuitBreakerStatus: Record<string, any> = {};
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    for (const [name, cb] of this.circuitBreakers) {
      const metrics = cb.getMetrics();
      circuitBreakerStatus[name] = metrics;

      if (metrics.state === CircuitBreakerState.OPEN) {
        overallStatus = 'unhealthy';
      } else if (metrics.state === CircuitBreakerState.HALF_OPEN && overallStatus === 'healthy') {
        overallStatus = 'degraded';
      }
    }

    const deadLetterQueueSize = await this.deadLetterQueue.getQueueSize();
    if (deadLetterQueueSize > 10 && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      circuitBreakers: circuitBreakerStatus,
      deadLetterQueueSize,
      timestamp: new Date().toISOString()
    };
  }

  // Utility Methods
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandling(): void {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.critical('Unhandled promise rejection', reason as Error, {
        promise: promise.toString()
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.logger.critical('Uncaught exception', error);
      // In production, gracefully shutdown the application
    });
  }

  // Graceful Degradation Helper
  async executeWithGracefulDegradation<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    options: {
      circuitBreakerName?: string;
      context?: Record<string, any>;
    } = {}
  ): Promise<T> {
    return this.executeWithResilience(primaryOperation, {
      ...options,
      fallback: fallbackOperation
    });
  }

  // Get Logger
  getLogger(): StructuredLogger {
    return this.logger;
  }

  // Get Dead Letter Queue
  getDeadLetterQueue(): DeadLetterQueue {
    return this.deadLetterQueue;
  }
}

// Export singleton instance
let resilienceServiceInstance: ResilienceService | null = null;

export const getResilienceService = (
  serviceName: string = 'hms',
  retryConfig?: Partial<RetryConfig>,
  defaultContext?: Record<string, any>
): ResilienceService => {
  if (!resilienceServiceInstance) {
    resilienceServiceInstance = new ResilienceService(serviceName, retryConfig, defaultContext);
  }
  return resilienceServiceInstance;
};

// Convenience decorators for common patterns
export function withCircuitBreaker(circuitBreakerName: string) {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const resilience = getResilienceService();
      const circuitBreaker = resilience.getCircuitBreaker(circuitBreakerName) || 
                            resilience.createCircuitBreaker(circuitBreakerName);
      
      return circuitBreaker.execute(() => method.apply(this, args));
    };
  };
}

export function withRetry(retryConfig?: Partial<RetryConfig>) {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const resilience = getResilienceService();
      return resilience.executeWithResilience(() => method.apply(this, args), {
        retryConfig
      });
    };
  };
}
