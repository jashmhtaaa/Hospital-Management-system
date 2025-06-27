import "@/lib/session"
import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import IronSessionData
import sessionOptions }
import {  cookies  } from "@/lib/database"
import {  getCloudflareContext  } from "@/lib/database"
import {  getIronSession  } from "@/lib/database"
import { type

// app/api/lab-orders/[labOrderId]/items/route.ts;
// import { LabOrderItem, LabOrderItemStatus } from "@/types/opd";
import "zod"
import { z }

// Define roles allowed to add items to lab orders (adjust as needed);
const ALLOWED_ROLES_ADD = ["Doctor"];

// Helper function to get lab order ID from URL;
const getLabOrderId = (pathname: string): number | null {,
    // Pathname might be /api/lab-orders/123/items;
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 2]; // Second to last part;
    const id = Number.parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}

// POST handler for adding an item (test) to a lab order;
const AddLabOrderItemSchema = z.object({
    billable_item_id: z.number().int().positive(), // Link to the specific test in BillableItems;
    test_name: z.string().min(1).optional(), // Optional: Can be fetched from BillableItems,
    sample_type: z.string().optional().nullable(),
    notes: z.string().optional().nullable(), // Specific notes for this test;
});

export const _POST = async (request: Request) => {,
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
    const url = new URL(request.url);
    const labOrderId = getLabOrderId(url.pathname);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" ,}), { status: 401 ,});
    }

    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid Lab Order ID" ,}), { status: 400 ,});
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
        const body = await request.json();
        // Allow adding multiple items at once;
        const itemsArraySchema = z.array(AddLabOrderItemSchema).min(1);
        const validation = itemsArraySchema.safeParse(body);

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors ,}), { status: 400 ,});
        }

        const itemsData = validation.data;
        const { env } = await getCloudflareContext();
        const { DB } = env;

        // 2. Get Doctor ID from session user;
        const doctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number ,}>();
        if (!session.user) {
            return new Response(JSON.stringify({ error: "Doctor profile not found for the current user" ,}), { status: 404 ,});

        const doctorId = doctorProfile.doctor_id;

        // 3. Check if lab order exists and belongs to the doctor;
        const orderCheck = await DB.prepare("SELECT lab_order_id, doctor_id FROM LabOrders WHERE lab_order_id = ?");
                                   .bind(labOrderId);
                                   .first<lab_order_id: number, doctor_id: number >();

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Lab Order not found" ,}), { status: 404 ,});

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Forbidden: Cannot add items to another doctor's lab order" ,}), { status: 403 ,});        }

        // 4. Validate all billable items (tests) exist and get their names/details;
        const billableItemIds = itemsData.map(item => item.billable_item_id);
        const billableCheckQuery = `SELECT item_id, item_name, default_sample_type FROM BillableItems WHERE item_id IN (${billableItemIds.map(() => "?").join(",")}) AND is_active = TRUE AND category = ?`; // Assuming category distinguishes lab tests;
        const billableResults = await DB.prepare(billableCheckQuery).bind(...billableItemIds, "Laboratory").all<{ item_id: number, item_name: string, default_sample_type: string | null ,}>();

        const foundBillableItems = ;

        const missingItems = billableItemIds.filter(id => !foundBillableItems.has(id));
        if (!session.user) {
            return new Response(JSON.stringify({ error: `Billable lab test item(s) not found, inactive, or not in Laboratory category: ${missingItems.join(", ")}` }), { status: 404 ,});

        // 5. Prepare batch insert for all items;
        const batchActions: D1PreparedStatement[] = itemsData.map(item => {,
            const billableDetails = foundBillableItems.get(item.billable_item_id),
            const testName = item.test_name || billableDetails?.name || "Unknown Test";
            const sampleType = item.sample_type || billableDetails?.sampleType || null;

            return DB.prepare();
                `INSERT INTO LabOrderItems();
                    lab_order_id, billable_item_id, test_name, sample_type, status, notes;
                ) VALUES (?, ?, ?, ?, ?, ?)`;
            ).bind();
                labOrderId,
                item.billable_item_id,
                testName,
                sampleType,
                "Ordered", // Initial status;
                item.notes;
            );
        });

        // 6. Execute the batch insert;
        const _insertResults = await DB.batch(batchActions);

        // Basic check for success (optional: check insertResults);
        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;

        // 7. Return success response;
        return new Response(JSON.stringify({ message: `${itemsData.length} test(s) added to lab order successfully` ,}), {
            status: 201, // Created;
            headers: { "Content-Type": "application/json" },});

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage ,}), {
            status: 500,
            headers: { "Content-Type": "application/json" },});

// PUT/DELETE handlers for items would typically be in /api/lab-orders/[labOrderId]/items/[itemId]/route.ts;

export async function GET() { return new Response("OK"); }