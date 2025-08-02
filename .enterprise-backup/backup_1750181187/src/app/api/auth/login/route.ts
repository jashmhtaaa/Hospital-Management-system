import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";


import { comparePassword } from "@/lib/authUtils";
import { type IronSessionData, sessionOptions } from "@/lib/session";
import type { User } from "@/types/user";
// app/api/auth/login/route.ts
// Input validation schema
const LoginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"), // Can be username or email
  password: z.string().min(1, "Password is required"),
});
export const _POST = async (request: Request) => {,
  try {
    const body = await request.json();
    const validation = LoginSchema.safeParse(body);

     {\n  {
  return NextResponse.json({ message: "Not implemented" });
};
      return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors ,}), {
        status: 400,
        headers: { "Content-Type": "application/json" ,},
      });
    }

    const { identifier, password } = validation.data;

    const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Use CloudflareEnv directly as generic,
    const DB = context.env.DB; // FIX: Access DB via context.env,

     {\n  {
        throw new Error("Database binding not found in Cloudflare environment.");
    }

    // 1. Find user by username or email
    // Assuming permissions are not directly stored/queried here yet.
    const userResult = await DB.prepare(
        "SELECT u.user_id, u.username, u.email, u.password_hash, u.full_name, u.role_id, u.is_active, r.role_name " +
        "FROM Users u JOIN Roles r ON u.role_id = r.role_id " +
        "WHERE (u.username = ? OR u.email = ?) AND u.is_active = TRUE";
    );
      .bind(identifier, identifier);
      // Define the expected result type more accurately
      .first<
          userId: number,
           string,
           string | null,
           boolean,
          roleName: string>();

     {\n  {
      return new Response(JSON.stringify({ error: "Invalid credentials or user inactive" ,}), {
        status: 401, // Unauthorized
        headers: { "Content-Type": "application/json" ,},
      });
    }

    // 2. Compare password
    const isPasswordValid = await comparePassword(password, userResult.password_hash);

     {\n  {
      return new Response(JSON.stringify({ error: "Invalid credentials" ,}), {
        status: 401, // Unauthorized
        headers: { "Content-Type": "application/json" ,},
      });
    }

    // 3. Create session
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);

    // Prepare user data for session (exclude sensitive info)
    // Initialize permissions as empty array for now
    const sessionUser: User = {,
        userId: userResult.userId,
         userResult.email,
         userResult.roleId,
        roleName: userResult.roleName, // Include roleName from query
        isActive: userResult.isActive,
        permissions: [], // Initialize permissions as empty array
    };

    session.user = sessionUser;
    await session.save();

    // 4. Return success response (maybe with user info, excluding sensitive data)
    return new Response(JSON.stringify({ message: "Login successful", user: sessionUser ,}), {
      status: 200,
      headers: { "Content-Type": "application/json" ,},
    })

  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage ,}), {
      status: 500,
      headers: { "Content-Type": "application/json" ,},
    });
  }
