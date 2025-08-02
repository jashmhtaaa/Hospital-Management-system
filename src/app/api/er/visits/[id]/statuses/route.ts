import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

// GET /api/er/visits/[id]/statuses - Get status/location history for a visit
export const GET = async (request: NextRequest, context: RouteContext) => {
  try {
    const { id } = context.params;
    
    // TODO: Implement route logic to get status history for ER visit
    return NextResponse.json({ 
      visitId: id,
      statuses: [],
      message: "Not implemented" 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
