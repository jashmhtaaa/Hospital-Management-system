"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._GET = void 0;
require("@/lib/hr/biomedical-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// GET handler for retrieving a specific biomedical equipment;
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
const equipment = await database_1.biomedicalService.getBiomedicalEquipment(params.id);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        error: "Biomedical equipment not found";
    }
    {
        status: 404;
    }
    ;
}
return server_1.NextResponse.json(equipment);
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch biomedical equipment", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
// Schema for biomedical equipment update;
const biomedicalUpdateSchema = z.object({ name: z.string().min(1, "Name is required").optional(),
    equipmentType: z.enum(["DIAGNOSTIC", "THERAPEUTIC", "MONITORING", "LABORATORY", "SURGICAL", "LIFE_SUPPORT", "OTHER"], { errorMap: () => ({ message: "Invalid equipment type" }) }).optional(),
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
    tags: z.array(z.string()).optional(),
    // Biomedical specific fields;
    deviceIdentifier: z.string().optional(),
    regulatoryClass: z.enum(["CLASS_I", "CLASS_II", "CLASS_III"], { errorMap: () => ({ message: "Invalid regulatory class" }) }).optional(),
    riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], { errorMap: () => ({ message: "Invalid risk level" }) }).optional(),
    lastCalibrationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    nextCalibrationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date format"
    }),
    calibrationFrequency: z.number().optional(),
    certifications: z.array(z.string()).optional(),
    isReusable: z.boolean().optional(),
    sterilizationRequired: z.boolean().optional(),
    lastSterilizationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid date format"
    }) });
// PUT handler for updating biomedical equipment;
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
    const validationResult = biomedicalUpdateSchema.safeParse(body);
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
        const biomedicalData = {
            ...data,
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
            data, : .lastCalibrationDate ? new Date(data.lastCalibrationDate) : undefined,
            data, : .lastSterilizationDate ? new Date(data.lastSterilizationDate) : undefined
        };
        // Update biomedical equipment;
        const equipment = await database_1.biomedicalService.updateBiomedicalEquipment(params.id, biomedicalData);
        return server_1.NextResponse.json(equipment);
    }
    try { }
    catch (error) {
        return server_1.NextResponse.json();
        {
            error: "Failed to update biomedical equipment", details;
            error.message;
        }
        {
            status: 500;
        }
        ;
        // DELETE handler for deleting biomedical equipment;
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
    await database_1.biomedicalService.deleteBiomedicalEquipment(params.id);
    return server_1.NextResponse.json({ success: true });
}
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to delete biomedical equipment", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
