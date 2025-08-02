import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "drug-allergy endpoint not implemented yet",
      status: "placeholder" 
    });
  } catch (error) {
    console.error('drug-allergy GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return NextResponse.json({ 
      message: "drug-allergy creation not implemented yet"
    });
  } catch (error) {
    console.error('drug-allergy POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
