import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "procedure-types endpoint not implemented yet",
      status: "placeholder" 
    });
  } catch (error) {
    console.error('procedure-types GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "procedure-types creation not implemented yet"
    });
  } catch (error) {
    console.error('procedure-types POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
