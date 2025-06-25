"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._GET = void 0;
require("@/lib/hr/employee-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for employee update;
const updateEmployeeSchema = z.object({ firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),
    birthDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    address: z.any().optional(),
    departmentId: z.string().optional(),
    photo: z.string().optional(),
    emergencyContact: z.any().optional(),
    active: z.boolean().optional(),
    terminationDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
});
// GET /api/hr/staff/[id];
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
const employee = await database_1.employeeService.getEmployeeById(params.id);
if (!session.user) {
    return server_1.NextResponse.json();
    {
        error: "Employee not found";
    }
    {
        status: 404;
    }
    ;
}
return server_1.NextResponse.json(employee);
try { }
catch (error) {
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch employee", details;
        error.message;
    }
    {
        status: 500;
    }
    ;
}
// PUT /api/hr/staff/[id];
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
    const body = await request.json();
    // Validate request body;
    const validatedData = updateEmployeeSchema.parse(body);
    // Update employee;
    const employee = await database_1.employeeService.updateEmployee(params.id, validatedData);
    return server_1.NextResponse.json(employee);
}
try { }
catch (error) {
    // Handle validation errors;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Validation error", details;
            error.errors;
        }
        {
            status: 400;
        }
        ;
        // Handle not found errors;
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                error: "Employee not found";
            }
            {
                status: 404;
            }
            ;
            return server_1.NextResponse.json();
            {
                error: "Failed to update employee", details;
                error.message;
            }
            {
                status: 500;
            }
            ;
            // DELETE /api/hr/staff/[id] - Soft delete by setting active to false;
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
    // Soft delete by setting active to false and recording termination date;
    const employee = await database_1.employeeService.updateEmployee(params.id, { active: false,
        terminationDate: new Date()
    });
    return server_1.NextResponse.json({ success: true });
}
try { }
catch (error) {
    // Handle not found errors;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Employee not found";
        }
        {
            status: 404;
        }
        ;
        return server_1.NextResponse.json();
        {
            error: "Failed to delete employee", details;
            error.message;
        }
        {
            status: 500;
        }
        ;
    }
}
