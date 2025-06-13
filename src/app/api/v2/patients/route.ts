import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


import { PatientCreateSchema, patientManagementService } from '@/lib/core/patient-management.service';
}

/**
 * Enhanced Patient Management API (v2) - Using new service layer;
 */

// Search query schema
const SearchQuerySchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  ssn: z.string().optional(),
  mrn: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  status: z.enum(['active', 'inactive', 'deceased']).optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10')
});

/**
 * GET /api/v2/patients - Search and list patients with enhanced features;
 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate search parameters
    const validatedParams = SearchQuerySchema.parse(queryParams);

    // Perform search using new service
    const result = await patientManagementService.searchPatients(validatedParams);

    return NextResponse.json({
      success: true,
      data: result;
      message: `Found ${result.total} patients`,
      metadata: 
        currentPage: result.page,
        totalPages: result.totalPages;
        totalResults: result.total,
        hasNextPage: result.page < result.totalPages;
        hasPreviousPage: result.page > 1,
    });
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid search parameters';
          details: error.errors
        },status: 400 
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error';
        message: 'Failed to search patients'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v2/patients - Create new patient with enhanced validation;
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate patient data using enhanced schema
    const validatedData = PatientCreateSchema.parse(body);

    // Create patient using new service
    const patient = await patientManagementService.createPatient(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: patient;
        message: 'Patient created successfully',
        metadata: 
          patientId: patient.id,
          mrn: patient.mrn;
          createdAt: patient.createdAt,
      },status: 201 
    );
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid patient data';
          details: error.errors,
          message: 'Please check the provided patient information'
        },status: 400 
      );
    }

    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate patient';
          message: error.message
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error';
        message: 'Failed to create patient'
      },
      { status: 500 }
    );
  }
