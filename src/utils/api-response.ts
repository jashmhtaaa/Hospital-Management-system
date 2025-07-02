import { } from "next/server"
import {  logger  } from "@/lib/logger"
import { NextResponse } from 'next/server';

// src/utils/api-response.ts;

export interface ApiResponse<T = unknown> {
  success: boolean,
  data?: T | undefined;
  message?: string;
  errors?: string[] | undefined;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  } | undefined;
}

export class ApiResponseHelper {
  static success<T>(
    data?: T | undefined,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: ApiResponse<T>['meta']
  ): NextResponse {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
      meta,
    };

    return NextResponse.json(response, { status: statusCode });
  }

  static error(
    message: string = 'An error occurred',
    statusCode: number = 400,
    details?: unknown
  ): NextResponse {
    const response: ApiResponse = {
      success: false,
      message,
      errors: details ? [String(details)] : undefined,
    };

    return NextResponse.json(response, { status: statusCode });
  }

  static notFound(resource: string = "Resource"): NextResponse {
    return this.error(`${resource} not found`, 404);
  }

  static unauthorized(message: string = "Unauthorized"): NextResponse {
    return this.error(message, 401);
  }

  static forbidden(message: string = "Forbidden"): NextResponse {
    return this.error(message, 403);
  }

  static validationError(message: string, details?: unknown): NextResponse {
    return this.error(message, 422, details);
  }

  static internalError(message: string = "Internal server error"): NextResponse {
    return this.error(message, 500);
  }

  static buildMeta(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  }
}

export async function GET() { 
  return new Response("OK"); 
}