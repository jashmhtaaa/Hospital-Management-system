"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._GET = void 0;
require("@/lib/hr/asset-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// GET handler for retrieving a specific asset;
exports._GET = async();
request: any;
{
    params;
}
{
    id: string;
}
{
    try {
    }
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
const asset = await database_1.assetService.getAsset(params.id);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        error: "Asset not found";
    }
    {
        status: 404;
    }
    ;
}
return server_1.NextResponse.json(asset);
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch asset", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
// Schema for asset update;
const assetUpdateSchema = z.object({ name: z.string().min(1, "Name is required").optional(),
    assetType: z.enum(["EQUIPMENT", "FURNITURE", "IT", "VEHICLE", "BUILDING", "OTHER"], { errorMap: () => ({ message: "Invalid asset type" }) }).optional(),
    serialNumber: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    purchaseDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    purchasePrice: z.number().optional(),
    warrantyExpiryDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    location: z.string().optional(),
    departmentId: z.string().optional().nullable(),
    assignedToId: z.string().optional().nullable(),
    status: z.enum(["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE", "DISPOSED", "LOST"], { errorMap: () => ({ message: "Invalid status" }) }).optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional()
});
// PUT handler for updating an asset;
exports._PUT = async();
request: any;
{
    params;
}
{
    id: string;
}
{
    try {
    }
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
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    // Parse request body;
    const body = await request.json();
    // Validate request data;
    const validationResult = assetUpdateSchema.safeParse(body);
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
        // Update asset;
        const asset = await database_1.assetService.updateAsset(params.id, assetData);
        return server_1.NextResponse.json(asset);
    }
    try { }
    catch (error) {
        return server_1.NextResponse.json();
        {
            error: "Failed to update asset", details;
            error.message;
        }
        {
            status: 500;
        }
        ;
        // DELETE handler for deleting an asset;
        exports._DELETE = async();
        request: any;
        {
            params;
        }
        {
            id: string;
        }
        {
            try {
            }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
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
}
try { }
catch (error) {
    await database_1.assetService.deleteAsset(params.id);
    return server_1.NextResponse.json({ success: true });
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to delete asset", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
