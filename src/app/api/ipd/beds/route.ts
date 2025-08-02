import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "beds endpoint not implemented yet",
      status: "placeholder" 
    });
  } catch (error) {
    console.error('beds GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "beds creation not implemented yet"
    });
  } catch (error) {
    console.error('beds POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
