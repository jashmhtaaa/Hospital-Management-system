import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "biomedical endpoint not implemented yet",
      status: "placeholder" 
    });
  } catch (error) {
    console.error('biomedical GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "biomedical creation not implemented yet"
    });
  } catch (error) {
    console.error('biomedical POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
