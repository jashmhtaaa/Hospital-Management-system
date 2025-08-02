import "next/server";
import {  NextResponse  } from "@/lib/database"

import {getSession } from "next/server"; // Keep original getSession for server-side use;
// src/app/api/session/check-permission/route.ts;
export const GET = async (request: Request) => {const { searchParams } = new URL(request.url);
  const permission = searchParams.get("permission");

  if (!session.user) {
    return NextResponse.json({error: "Permission parameter is required" },
  }

  try {

