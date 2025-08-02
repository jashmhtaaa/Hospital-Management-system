import { type NextRequest, NextResponse } from 'next/server';


import { integrationService } from '@/lib/hr/integration-service';
/**
 * API route for clinical module integration;
 * Provides staff data to clinical modules;
 */
export const _GET = async (request: NextRequest) => {,
  try {
    const employees = await integrationService.getEmployeesForClinical();

    return NextResponse.json({
      success: true,
      data: employees,
  return NextResponse.json({ message: "Not implemented" });
};
    });
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch employees", details: error.message ,},
      { status: 500 },
    );
  }
