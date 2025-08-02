import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    // TODO: Implement Ot Theatres logic
    return NextResponse.json({ message: "Not implemented" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
