import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    // TODO: Implement Opd Appointments logic
    return NextResponse.json({ message: "Not implemented" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
