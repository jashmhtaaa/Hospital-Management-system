import { NextRequest, NextResponse } from 'next/server';
import { employeeService } from '@/lib/hr/employee-service';
import { z } from 'zod';

// Schema for employee update
const updateEmployeeSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']).optional(),
  birthDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  address: z.any().optional(),
  departmentId: z.string().optional(),
  photo: z.string().optional(),
  emergencyContact: z.any().optional(),
  active: z.boolean().optional(),
  terminationDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

// GET /api/hr/staff/[id]
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const employee = await employeeService.getEmployeeById(params.id)
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error: unknown) {

    return NextResponse.json(
      { error: 'Failed to fetch employee', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/hr/staff/[id]
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateEmployeeSchema.parse(body);
    
    // Update employee
    const employee = await employeeService.updateEmployee(params.id, validatedData);
    
    return NextResponse.json(employee);
  } catch (error: unknown) {

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    // Handle not found errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update employee', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/staff/[id] - Soft delete by setting active to false
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    // Soft delete by setting active to false and recording termination date
    const employee = await employeeService.updateEmployee(params.id, {
      active: false,
      terminationDate: new Date(),
    });
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {

    // Handle not found errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete employee', details: error.message },
      { status: 500 }
    );
  }
