import "@/lib/hr/employee-service"
import "next/server"
import "zod"
import NextRequest
import NextResponse }
import {  employeeService  } from "@/lib/database"
import {   type
import {  z  } from "@/lib/database"

// Schema for employee creation;
const createEmployeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),
  birthDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  address: z.any().optional(),
  joiningDate: z.string().transform(val => ,
  departmentId: z.string().optional(),
  userId: z.string().optional(),
  photo: z.string().optional(),
  emergencyContact: z.any().optional(),
  qualifications: z.array();
    z.object({
      code: z.string(),
      name: z.string(),
      issuer: z.string().optional(),
      identifier: z.string().optional(),
      startDate: z.string().transform(val => ,
      z.string().optional();
    });
  ).optional(),
  positions: z.array();
    z.object({
      positionId: z.string(),
      isPrimary: z.boolean(),
      startDate: z.string().transform(val => ,
      endDate: z.string().optional().transform(val => val ? new Date(val) : undefined);
    });
  ).optional()});

// Schema for employee update;
const _updateEmployeeSchema = z.object({
  firstName: z.string().optional(),
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
  terminationDate: z.string().optional().transform(val => val ? new Date(val) : undefined);
});

// GET /api/hr/staff;
export const _GET = async (request: any) => {,
  try {
  return NextResponse.json({ message: "Not implemented" });
};
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

    const { searchParams } = new URL(request.url);

    const skip = Number.parseInt(searchParams.get("skip") || "0");
    const take = Number.parseInt(searchParams.get("take") || "10");
    const departmentId = searchParams.get("departmentId") || undefined;
    const positionId = searchParams.get("positionId") || undefined;
    const search = searchParams.get("search") || undefined;
    const active = searchParams.get("active") !== "false"; // Default to true;

    const result = await employeeService.listEmployees({
      skip,
      take,
      departmentId,
      positionId,
      search,
      active});

    return NextResponse.json(result);
  } catch (error: unknown) {,

    return NextResponse.json();
      { error: "Failed to list employees", details: error.message ,},
      { status: 500 },
    );

// POST /api/hr/staff;
export const _POST = async (request: any) => {,
  try {
  return NextResponse.json({ message: "Not implemented" });
};
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

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    const body = await request.json();

    // Validate request body;
    const validatedData = createEmployeeSchema.parse(body);

    // Create employee;
    const employee = await employeeService.createEmployee(validatedData);

    return NextResponse.json(employee, { status: 201 ,});
  } catch (error: unknown) {,

    // Handle validation errors;
    if (!session.user) {
      return NextResponse.json();
        { error: "Validation error", details: error.errors ,},
        { status: 400 },
      );

    return NextResponse.json();
      { error: "Failed to create employee", details: error.message ,},
      { status: 500 },
    );

})))