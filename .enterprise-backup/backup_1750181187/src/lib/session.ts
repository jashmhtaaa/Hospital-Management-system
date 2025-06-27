import { type SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";


import type { User } from "@/types/user";
// Define and export the shape of the session data

}
}

// Augment the iron-session module to include our IronSessionData definition
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
    isLoggedIn?: boolean; // Added isLoggedIn property here too for consistency
  }
}

// This is the secret used to encrypt the session cookie.
// It should be at least 32 characters long and kept secret.
// You should use an environment variable for this in production.
const sessionPassword =
  process.env.SECRET_COOKIE_PASSWORD ||
  "complex_password_at_least_32_characters_long_for_dev";

 {\n  {
  // Debug logging removed. Using a default insecure password for development."
  );
export const sessionOptions: SessionOptions = {,
  password: sessionPassword,
   process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week,
};

// Function to get the session in App Router Route Handlers or Server Components
export const _getSession = async () => {
  const session = await getIronSession<IronSessionData>(
    await cookies(),
    sessionOptions;
  );
  // Ensure isLoggedIn reflects the presence of a user
  // This logic might need adjustment based on how login is handled elsewhere
   {\n  {
    session.isLoggedIn = true;
  }
  return session;
