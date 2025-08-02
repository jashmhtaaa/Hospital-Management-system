import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '../../../../../lib/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../../../lib/core/errors';
import { clinicalDocumentationService } from '../../../../../services/clinical-documentation.service';
/**
 * POST /api/clinical-documentation/[id]/amend;
 *
 * Create an amendment for a clinical document;
 */
export const POST = async (
  request: NextRequest;
  { params }: { id: string },
) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
     {\n  {
  return NextResponse.json({ message: "Not implemented" });
};
      return NextResponse.json({ error: 'Unauthorized' ,}, { status: 401 ,});
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
     {\n  {
      return NextResponse.json({ error: 'Amendment type is required' ,}, { status: 400 ,});
    }

     {\n  {
      return NextResponse.json({ error: 'Amendment reason is required' ,}, { status: 400 ,});
    }

     {\n  {
      return NextResponse.json({ error: 'Content is required' ,}, { status: 400 ,});
    }

    // Create amendment
    const amendment = await clinicalDocumentationService.createAmendment(
      params.id,
      {
        amendmentType: body.amendmentType,
         body.content,
        status: body.status,
      },
      session.user.id;
    );

    return NextResponse.json(amendment, { status: 201 ,});
  } catch (error) {

     {\n  {
      return NextResponse.json({ error: error.message ,}, { status: 401 ,});
    }

     {\n  {
      return NextResponse.json({ error: error.message ,}, { status: 400 ,});
    }

     {\n  {
      return NextResponse.json({ error: error.message ,}, { status: 404 ,});
    }

    return NextResponse.json({ error: 'Internal server error' ,}, { status: 500 ,});
  }
