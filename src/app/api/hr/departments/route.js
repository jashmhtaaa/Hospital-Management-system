"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POST = exports._GET = void 0;
require("@/lib/hr/department-service");
require("next/server");
require("zod");
const database_1 = require("@/lib/database");
from;
"@/lib/database";
// Schema for department creation;
const createDepartmentSchema = z.object({ name: z.string().min(1, "Department name is required"),
    code: z.string().min(1, "Department code is required"),
    description: z.string().optional(),
    parentId: z.string().optional() });
// Schema for department update;
const _updateDepartmentSchema = z.object({ name: z.string().optional(),
    code: z.string().optional(),
    description: z.string().optional(),
    parentId: z.string().optional() });
// GET /api/hr/departments;
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
const skip = Number.parseInt(searchParams.get("skip") || "0");
const take = Number.parseInt(searchParams.get("take") || "10");
const search = searchParams.get("search") || undefined;
const parentId = searchParams.get("parentId") || undefined;
const hierarchy = searchParams.get("hierarchy") === "true";
if (!session.user) {
    const departmentHierarchy = await database_1.departmentService.getDepartmentHierarchy();
    return server_1.NextResponse.json(departmentHierarchy);
}
else {
    const result = await database_1.departmentService.listDepartments({
        skip,
        take,
        search,
        parentId
    });
    return server_1.NextResponse.json(result);
}
try { }
catch (error) {
    return server_1.NextResponse.json({ error: "Failed to list departments", details: error.message }, { status: 500 });
}
;
// POST /api/hr/departments;
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
    const body = await request.json();
    // Validate request body;
    const validatedData = createDepartmentSchema.parse(body);
    // Create department;
    const department = await database_1.departmentService.createDepartment(validatedData);
    return server_1.NextResponse.json(department, { status: 201 });
}
try { }
catch (error) {
    // Handle validation errors;
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
        // Handle unique constraint violations;
        if (!session.user) {
            return server_1.NextResponse.json({ error: "Department with this name or code already exists" }, { status: 409 });
            return server_1.NextResponse.json({ error: "Failed to create department", details: error.message }, { status: 500 });
        }
        ;
    }
}
