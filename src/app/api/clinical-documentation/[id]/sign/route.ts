import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';


import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../../../lib/core/errors';
import { authOptions } from '../../../../../lib/auth';
import { clinicalDocumentationService } from '../../../../../services/clinical-documentation.service';
/**
 * POST /api/clinical-documentation/[id]/sign;
 *
 * Sign a clinical document;
 */
export const POST = async (
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

    // Validate required fields
    if (!body.signerRole) {
      return NextResponse.json({ error: 'Signer role is required' }, { status: 400 });
    }

    if (!body.signatureType) {
      return NextResponse.json({ error: 'Signature type is required' }, { status: 400 });
    }

    // Sign document
    const signature = await clinicalDocumentationService.signDocument(
      params.id,
      {
        signerRole: body.signerRole;
        signatureType: body.signatureType;
        attestation: body.attestation;
        ipAddress: request.headers.get('x-forwarded-for') || request.ip;
        deviceInfo: request.headers.get('user-agent');
        notes: body.notes;
        finalize: body.finalize;
      },
      session.user.id;
    );

    return NextResponse.json(signature, { status: 201 });
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
