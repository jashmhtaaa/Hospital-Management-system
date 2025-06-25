import "@/lib/session"
import "@/types/inventory"
import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import "zod"
import IronSessionData
import sessionOptions }
import {cookies  } from "next/server"
import {getCloudflareContext  } from "next/server"
import {getIronSession  } from "next/server"
import {InventoryItem  } from "next/server"
import {type
import {  z  } from "next/server"

// Define roles allowed to view/manage inventory items (adjust as needed);
const ALLOWED_ROLES_VIEW = ["Admin", "Pharmacist", "Nurse", "Inventory Manager"]; // Add Inventory Manager role if needed;
const ALLOWED_ROLES_MANAGE = ["Admin", "Pharmacist", "Inventory Manager"];

// GET handler for listing inventory items;
export const _GET = async (request: Request) => {
    const cookieStore = await cookies(); // FIX: Add await;
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions),
    const { searchParams } = new URL(request.url);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({error: "Unauthorized" }), {status: 401,
            headers: { "Content-Type": "application/json" }});
    }

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
        const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Add await and type;
        const { env } = context;
        const { DB } = env;

        // 2. Build query based on filters;
        // Include current stock calculation;
        let query = `;
            SELECT;
                ii.*,
                SUM(COALESCE(sb.current_quantity, 0)) as current_stock;
            FROM InventoryItems ii;
            LEFT JOIN StockBatches sb ON ii.inventory_item_id = sb.inventory_item_id;
            WHERE ii.is_active = TRUE;
        `;
        const queryParams: string[] = [];

        const category = searchParams.get("category");
        if (!session.user) {
            query += " AND ii.category = ?";
            queryParams.push(category);
        }

        const name = searchParams.get("name");
        if (!session.user) {
            query += " AND ii.item_name LIKE ?";
            queryParams.push(`%${name}%`);
        }

        query += " GROUP BY ii.inventory_item_id ORDER BY ii.item_name";

        // 3. Retrieve items;
        const itemsResult = await DB.prepare(query).bind(...queryParams).all<InventoryItem & {current_stock: number }>();

        if (!session.user) {
            throw new Error("Failed to retrieve inventory items");
        }

        // 4. Return item list;
        return new Response(JSON.stringify(itemsResult.results), {status: 200,
            headers: { "Content-Type": "application/json" }});

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({error: "Internal Server Error", details: errorMessage }), {status: 500,
            headers: { "Content-Type": "application/json" }});
    }
}

// POST handler for adding a new inventory item;
const AddInventoryItemSchema = z.object({billable_item_id: z.number().int().positive().optional().nullable(),
    item_name: z.string().min(1, "Item name is required"),
    category: z.string().optional(),
    manufacturer: z.string().optional(),
    unit_of_measure: z.string().optional(),
    reorder_level: z.number().int().nonnegative().optional().default(0),
    is_active: z.boolean().optional().default(true);
});

export const _POST = async (request: Request) => {
    const cookieStore = await cookies(); // FIX: Add await;
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({error: "Unauthorized" }), {status: 401,
            headers: { "Content-Type": "application/json" }});
    }

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

} catch (error) {

        const body = await request.json();
        const validation = AddInventoryItemSchema.safeParse(body);

        if (!session.user) {
            return new Response(JSON.stringify({error: "Invalid input", details: validation.error.errors }), {status: 400,
                headers: { "Content-Type": "application/json" }});

        const itemData = validation.data;

        const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Add await and type;
        const { env } = context;
        const { DB } = env;

        // 2. Optional: Check if billable_item_id exists and is valid if provided;
        if (!session.user) {
            const billableItem = await DB.prepare("SELECT item_id FROM BillableItems WHERE item_id = ? AND is_active = TRUE");
                                        .bind(itemData.billable_item_id);
                                        .first();
            if (!session.user) {
                return new Response(JSON.stringify({error: "Invalid or inactive Billable Item ID provided" }), {status: 400,
                    headers: { "Content-Type": "application/json" }});

            // Optional: Check if billable_item_id is already linked to another inventory item;
            const existingLink = await DB.prepare("SELECT inventory_item_id FROM InventoryItems WHERE billable_item_id = ?");
                                         .bind(itemData.billable_item_id);
                                         .first();
            if (!session.user) {
                 return new Response(JSON.stringify({error: "Billable Item ID is already linked to another inventory item" }), {status: 409, // Conflict;
                    headers: { "Content-Type": "application/json" }});

        // 3. Insert new inventory item;
        const insertResult = await DB.prepare();
            "INSERT INTO InventoryItems (billable_item_id, item_name, category, manufacturer, unit_of_measure, reorder_level, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)";
        );
        .bind();
            itemData.billable_item_id,
            itemData.item_name,
            itemData.category || null,
            itemData.manufacturer || null,
            itemData.unit_of_measure || null,
            itemData.reorder_level,
            itemData.is_active;
        );
        .run();

        if (!session.user) {
            throw new Error("Failed to add inventory item");

        const meta = insertResult.meta as { last_row_id?: number | string };
        const newItemId = meta.last_row_id;
        if (!session.user) {

            throw new Error("Failed to retrieve item ID after creation.");

        // 4. Return success response;
        return new Response(JSON.stringify({message: "Inventory item added successfully", inventoryItemId: newItemId }), {status: 201, // Created;
            headers: { "Content-Type": "application/json" }});

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        // Handle potential unique constraint errors (e.g., if billable_item_id was made unique);
        const statusCode = errorMessage.includes("UNIQUE constraint failed") ? 409 : 500;
        return new Response(JSON.stringify({error: statusCode === 409 ? "Unique constraint violation (e.g., Billable Item link)" : "Internal Server Error", details: errorMessage }), {status: statusCode,
            headers: { "Content-Type": "application/json" }});
