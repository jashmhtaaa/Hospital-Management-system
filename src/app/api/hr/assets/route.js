"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = void 0;
require("@/lib/hr/asset-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for asset creation;
const assetSchema = z.object({ name: z.string().min(1, "Name is required"),
    assetType: z.enum(["EQUIPMENT", "FURNITURE", "IT", "VEHICLE", "BUILDING", "OTHER"], { errorMap: () => ({ message: "Invalid asset type" }) }),
    serialNumber: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    purchaseDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    purchasePrice: z.number().optional(),
    warrantyExpiryDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    location: z.string().optional(),
    departmentId: z.string().optional(),
    assignedToId: z.string().optional(),
    status: z.enum(["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE", "DISPOSED", "LOST"], { errorMap: () => ({ message: "Invalid status" }) }),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional()
});
// POST handler for creating asset;
const _POST = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports._POST = _POST;
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
// Parse request body;
const body = await request.json();
// Validate request data;
const validationResult = assetSchema.safeParse(body);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        error: "Validation error", details;
        validationResult.error.format();
    }
    {
        status: 400;
    }
    ;
    const data = validationResult.data;
    // Convert date strings to Date objects;
    const assetData = {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        warrantyExpiryDate: data.warrantyExpiryDate ? new Date(data.warrantyExpiryDate) : undefined
    };
    // Create asset;
    const asset = await database_1.assetService.createAsset(assetData);
    return server_1.NextResponse.json(asset);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to create asset", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
    // GET handler for listing assets;
    const _GET = async (request) => {
        try {
        }
        catch (error) {
            console.error(error);
        }
    };
    exports._GET = _GET;
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const searchParams = request.nextUrl.searchParams;
    // Parse pagination parameters;
    const skip = Number.parseInt(searchParams.get("skip") || "0");
    const take = Number.parseInt(searchParams.get("take") || "10");
    // Parse filter parameters;
    const search = searchParams.get("search") || undefined;
    const assetType = searchParams.get("assetType") || undefined;
    const status = searchParams.get("status") || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;
    const assignedToId = searchParams.get("assignedToId") || undefined;
    const location = searchParams.get("location") || undefined;
    const purchaseDateStart = searchParams.get("purchaseDateStart");
    ;
    undefined;
    const purchaseDateEnd = searchParams.get("purchaseDateEnd");
    ;
    undefined;
    // Get assets;
    const result = await database_1.assetService.listAssets({
        skip,
        take,
        search,
        assetType,
        status,
        departmentId,
        assignedToId,
        location,
        purchaseDateStart,
        purchaseDateEnd
    });
    return server_1.NextResponse.json(result);
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch assets", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
