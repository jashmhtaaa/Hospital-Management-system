  var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { clinicalDocumentationService } from '../../../../services/clinical-documentation.service';
import { authOptions } from '../../../../lib/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../../lib/core/errors';

/**
 * GET /api/clinical-documentation/templates;
 * 
 * Get document templates based on filters;
 */
export async const GET = (request: NextRequest) {
  try {
    // Get session;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters;
    const searchParams = request.nextUrl.searchParams;
    
    // Build filters;
    const filters = {
      templateType: searchParams.get('templateType') || undefined,
      specialtyType: searchParams.get('specialtyType') || undefined,
      page: searchParams.has('page') ? parseInt(searchParams.get('page') as string, 10) : 1,
      pageSize: searchParams.has('pageSize') ? parseInt(searchParams.get('pageSize') as string, 10) : 20,
    };
    
    // Get templates;
    const result = await clinicalDocumentationService.getDocumentTemplates(
      filters,
      session.user.id;
    );
    
    return NextResponse.json(result);
  } catch (error) {

    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/clinical-documentation/templates;
 * 
 * Create a new document template;
 */
export async const POST = (request: NextRequest) {
  try {
    // Get session;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body;
    const body = await request.json();
    
    // Validate required fields;
    if (!body.templateName) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }
    
    if (!body.templateType) {
      return NextResponse.json({ error: 'Template type is required' }, { status: 400 });
    }
    
    if (!body.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    // Create template;
    const template = await clinicalDocumentationService.createDocumentTemplate(body, session.user.id);
    
    return NextResponse.json(template, { status: 201 });
  } catch (error) {

    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}