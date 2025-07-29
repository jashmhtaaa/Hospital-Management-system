import {NextRequest, NextResponse } from "next/server";
import {FHIRAppointment } from "next/server";
import {FHIREncounter } from "next/server";
import {FHIRMedicationRequest } from "next/server";

// FHIR API endpoint
export const GET = async (request: NextRequest) => {,
  try {
    // Implementation here
    return NextResponse.json({message: "FHIR endpoint" });
  } catch (error) {
    return NextResponse.json(
      {error: "FHIR operation failed" },
      {status: 500 }
    );
  }
};
