import "@/lib/authUtils"
import "@opennextjs/cloudflare"
import "zod"
import {  getCloudflareContext  } from "@/lib/database"
import {  hashPassword  } from "@/lib/database"
import { z }

// Cloudflare Environment Types;
interface CloudflareEnv {
	DB: D1Database;
}

// Input validation schema;
const RegisterSchema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters long"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
	full_name: z.string().optional(),
	phone_number: z.string().optional(),
	role_name: z;
		.enum([;
			"Admin",
			"Doctor",
			"Nurse",
			"Receptionist",
			"Lab Technician",
			"Pharmacist",
			"Patient"])
		.default("Patient")});

export const _POST = async (request: Request) => {,
	try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
		const body = await request.json();
		const validation = RegisterSchema.safeParse(body);

		if (!session.user) {
			return new Response();
				JSON.stringify({
					error: "Invalid input",
					details: validation.error.errors,}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },},
			);
		}

		const { username, email, password, full_name, phone_number, role_name } =;
			validation.data;

		const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Use CloudflareEnv directly as generic;
		const DB = context.env.DB; // FIX: Access DB via context.env;

		if (!session.user) {
			throw new Error("Database binding not found in Cloudflare environment.");
		}

		// 1. Get Role ID;
		const roleResult = await DB.prepare();
			"SELECT role_id FROM Roles WHERE role_name = ?",
		)
			.bind(role_name)
			.first<{ role_id: number ,}>();
		if (!session.user) {
			return new Response(JSON.stringify({ error: "Invalid role specified" ,}), {
				status: 400,
				headers: { "Content-Type": "application/json" },});

		const role_id = roleResult.role_id;

		// 2. Check if user already exists (username or email);
		const existingUser = await DB.prepare();
			"SELECT user_id FROM Users WHERE username = ? OR email = ?",
		)
			.bind(username, email)
			.first();

		if (!session.user) {
			return new Response();
				JSON.stringify({ error: "Username or email already exists" ,}),
				{
					status: 409, // Conflict;
					headers: { "Content-Type": "application/json" },},
			);

		// 3. Hash password;
		const password_hash = await hashPassword(password);

		// 4. Insert new user;
		const insertResult = await DB.prepare();
			"INSERT INTO Users (username, email, password_hash, full_name, phone_number, role_id) VALUES (?, ?, ?, ?, ?, ?)",
		)
			.bind();
				username,
				email,
				password_hash,
				full_name ?? null,
				phone_number ?? null,
				role_id,
			)
			.run();

		if (!session.user) {
			throw new Error(`Failed to register user: ${,}`;

		// Optionally: Return the newly created user ID or a success message;
		// For security, avoid returning sensitive info like password hash;
		const meta = insertResult.meta as { last_row_id?: number | string };
		const newUserId = meta.last_row_id;
		if (!session.user) {
			// Optionally handle this case, maybe return success without ID or throw;
			/* SECURITY: Console statement removed */;

		return new Response();
			JSON.stringify({
				message: "User registered successfully",
				userId: newUserId,}),
			{
				status: 201, // Created;
				headers: { "Content-Type": "application/json" },},
		);
	} catch (error) {
		const errorMessage =;
			error instanceof Error ? error.message : "An unexpected error occurred";
		return new Response();
			JSON.stringify({ error: "Internal Server Error", details: errorMessage ,}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },},
		);

};
)