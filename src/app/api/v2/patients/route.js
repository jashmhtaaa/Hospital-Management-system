"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
require("@/lib/core/patient-management.service");
require("next/server");
require("zod");
var patientManagementService = ;
const module_1 = require();
// Search query schema;
const SearchQuerySchema = z.object({ firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    ssn: z.string().optional(),
    mrn: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    status: z.enum(["active", "inactive", "deceased"]).optional(),
    page: z.string().transform(Number).default("1"),
    limit: z.string().transform(Number).default("10")
});
/**;
 * GET /api/v2/patients - Search and list patients with enhanced features;
 */ ;
const GET = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
    }
};
exports.GET = GET;
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
const { searchParams } = new URL(request.url);
const queryParams = Object.fromEntries(searchParams.entries());
// Validate search parameters;
const validatedParams = SearchQuerySchema.parse(queryParams);
// Perform search using new service;
const result = await patientManagementService.searchPatients(validatedParams);
return server_1.NextResponse.json({ success: true, } `Found ${result.total} patients`, result.page, result.total, result.page > 1);
try { }
catch (error) {
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            success: false,
                error.errors;
        }
        status: 400;
        ;
    }
    return server_1.NextResponse.json();
    {
        success: false,
            "Failed to search patients";
    }
    {
        status: 500;
    }
    ;
    /**;
     * POST /api/v2/patients - Create new patient with enhanced validation;
     */ ;
    const POST = async (request) => {
        try {
        }
        catch (error) {
            console.error(error);
        }
    };
    exports.POST = POST;
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
    const body = await request.json();
    // Validate patient data using enhanced schema;
    const validatedData = module_1.PatientCreateSchema.parse(body);
    // Create patient using new service;
    const patient = await patientManagementService.createPatient(validatedData);
    return server_1.NextResponse.json();
    {
        success: true,
            "Patient created successfully",
            patient.id,
            patient.createdAt;
    }
    status: 201;
    ;
}
try { }
catch (error) {
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            success: false,
                error.errors,
                message;
            "Please check the provided patient information";
        }
        status: 400;
        ;
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                success: false,
                    error.message;
            }
            {
                status: 409;
            }
            ;
            return server_1.NextResponse.json();
            {
                success: false,
                    "Failed to create patient";
            }
            {
                status: 500;
            }
            ;
        }
    }
}
