import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    // TODO: Implement Radiology Procedure Types logic
    return NextResponse.json({ message: "Not implemented" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
