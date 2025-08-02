import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "ambulance endpoint not implemented yet",
      status: "placeholder" 
    });
  } catch (error) {
    console.error('ambulance GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "ambulance creation not implemented yet"
    });
  } catch (error) {
    console.error('ambulance POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
