import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "doctors endpoint not implemented yet",
      status: "placeholder" 
    });
  } catch (error) {
    console.error('doctors GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "doctors creation not implemented yet"
    });
  } catch (error) {
    console.error('doctors POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
