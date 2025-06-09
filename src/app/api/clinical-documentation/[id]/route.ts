import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';


import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../../lib/core/errors';
import { authOptions } from '../../../../lib/auth';
import { clinicalDocumentationService } from '../../../../services/clinical-documentation.service';
/**
 * GET /api/clinical-documentation/[id]
 *
 * Get a clinical document by ID;
 */
export const GET = async (
  request: NextRequest;
  { params }: { params: { id: string } }
) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get document
    const document = await clinicalDocumentationService.getDocumentById(
      params.id,
      session.user.id;
    );

    return NextResponse.json(document);
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
 * PUT /api/clinical-documentation/[id]
 *
 * Update a clinical document;
 */
export const PUT = async (
  request: NextRequest;
  { params }: { params: { id: string } }
) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Update document
    const document = await clinicalDocumentationService.updateDocument(
      params.id,
      body,
      session.user.id;
    );

    return NextResponse.json(document);
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
