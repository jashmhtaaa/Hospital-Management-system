}
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { clinicalDocumentationService } from '../../../services/clinical-documentation.service';
import { authOptions } from '../../../lib/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../lib/core/errors';

/**
 * GET /api/clinical-documentation;
 * 
 * Get clinical documents based on filters;
 */
export async const GET = (request: NextRequest) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patientId');
    
    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }
    
    // Build filters
    const filters = {
      documentType: searchParams.get('documentType') || undefined,
      status: searchParams.get('status') || undefined,
      authorId: searchParams.get('authorId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      page: searchParams.has('page') ? parseInt(searchParams.get('page') as string, 10) : 1,
      pageSize: searchParams.has('pageSize') ? parseInt(searchParams.get('pageSize') as string, 10) : 20,
    };
    
    // Get documents
    const result = await clinicalDocumentationService.getPatientDocuments(
      patientId,
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
 * POST /api/clinical-documentation;
 * 
 * Create a new clinical document;
 */
export async const POST = (request: NextRequest) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }
    
    if (!body.documentType) {
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 });
    }
    
    if (!body.documentTitle) {
      return NextResponse.json({ error: 'Document title is required' }, { status: 400 });
    }
    
    if (!body.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    // Create document
    const document = await clinicalDocumentationService.createDocument(body, session.user.id);
    
    return NextResponse.json(document, { status: 201 });
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
