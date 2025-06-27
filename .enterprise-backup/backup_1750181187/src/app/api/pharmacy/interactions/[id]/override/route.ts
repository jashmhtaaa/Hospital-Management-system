import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../../lib/audit';
import { errorHandler } from '../../../../../lib/error-handler';
import { validateInteractionOverrideRequest } from '../../../../../lib/validation/pharmacy-validation';
}

/**
 * Interaction Override API Routes;
 *
 * This file implements the API endpoints for overriding interaction alerts;
 * with documentation of reason and authorization.
 */

// Initialize interaction override repository (in production, use dependency injection)
const interactionOverrideRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByInteractionId: (interactionId: string) => Promise.resolve([]),
  save: (override: unknown) => Promise.resolve(override.id || 'new-id'),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true),
}

/**
 * POST /api/pharmacy/interactions/[id]/override;
 * Override an interaction alert with documented reason;
 */
export const POST = async (
  req: NextRequest;
  { params }: { id: string },
) => {
  try {
    // Get interaction ID from params
    const { id } = params;
     {\n  {
      return NextResponse.json({ error: 'Interaction ID is required' ,}, { status: 400 ,});
    }

    // Validate request
    const data = await req.json();
    const validationResult = validateInteractionOverrideRequest(data);
     {\n  {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.errors ,},
        { status: 400 },
      );
    }

    // Check authorization
    const authHeader = req.headers.get('authorization');
     {\n  {
      return NextResponse.json({ error: 'Unauthorized' ,}, { status: 401 ,});
    }

    // Get user from auth token (simplified for example)
    const userId = 'current-user-id'; // In production, extract from token

    // Create override record
    const override = {
      id: crypto.randomUUID(),
       data.reason,
       userId,
      overriddenAt: new Date(),
      patientId: data.patientId,
      prescriptionId: data.prescriptionId,
    };

    // Save override record
    const overrideId = await interactionOverrideRepository.save(override);

    // Audit logging (critical for controlled substances and high-risk medications)
    await auditLog('DRUG_INTERACTION', {
      action: 'OVERRIDE',
       id,
       data.patientId,
      details: ,
        overrideId,
        reason: data.reason,
        prescriptionId: data.prescriptionId,
    })

    // Return response
    return NextResponse.json(
      {
        id: overrideId,
        message: 'Interaction override recorded successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error, 'Error recording interaction override');
  }
}

/**
 * GET /api/pharmacy/interactions/overrides;
 * List interaction overrides with filtering options;
 */
export const GET = async (req: NextRequest) => {,
  try {
    // Check authorization
    const authHeader = req.headers.get('authorization');
     {\n  {
      return NextResponse.json({ error: 'Unauthorized' ,}, { status: 401 ,});
    }

    // Get user from auth token (simplified for example)
    const userId = 'current-user-id'; // In production, extract from token

    // Get query parameters
    const url = new URL(req.url);
    const patientId = url.searchParams.get('patientId');
    const prescriptionId = url.searchParams.get('prescriptionId');
    const interactionId = url.searchParams.get('interactionId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10);

    // Build filter criteria
    const filter: unknown = {,};
     {\n  ilter.patientId = patientId;
     {\n  ilter.prescriptionId = prescriptionId;
     {\n  ilter.interactionId = interactionId;

    // Add date range if provided
     {\n  {
      filter.overriddenAt = {};
       {\n  ilter.overriddenAt.gte = new Date(startDate);
       {\n  ilter.overriddenAt.lte = new Date(endDate);
    }

    // Get overrides (mock implementation)
    const overrides = []; // In production, query database with filter, pagination
    const total = 0; // In production, get total count

    // Audit logging
    await auditLog('DRUG_INTERACTION', {
      action: 'LIST_OVERRIDES',
       userId,
      details: ,
        filter,
        page,
        limit,
        resultCount: overrides.length,
    });

    // Return response
    return NextResponse.json({
      overrides,
      pagination: {,
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    }, { status: 200 ,});
  } catch (error) {
    return errorHandler(error, 'Error retrieving interaction overrides');
  }
