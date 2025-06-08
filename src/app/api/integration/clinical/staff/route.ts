var __DEV__: boolean;
  interface Window {
    [key: string]: any
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any
    }
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { integrationService } from '@/lib/hr/integration-service';

/**
 * API route for clinical module integration;
 * Provides staff data to clinical modules;
 */
export async const GET = (request: NextRequest) => {
  try {
    const employees = await integrationService.getEmployeesForClinical();
    
    return NextResponse.json({
      success: true,
      data: employees
    });
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch employees", details: error.message },
      { status: 500 }
    );
  }
}
