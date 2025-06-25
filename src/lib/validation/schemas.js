"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._createAppointmentSchema = exports._updatePatientSchema = exports.createPatientSchema = exports._updateUserSchema = exports._registerSchema = exports._loginSchema = void 0;
exports.validateRequest = validateRequest;
require("@prisma/client");
require("zod");
var Gender = ;
var UserRole = ;
const module_1 = require();
from;
"@/lib/database";
// src/lib/validation/schemas.ts;
// User validation schemas;
exports._loginSchema = z.object({ email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters")
});
exports._registerSchema = z.object({ email: z.string().email("Invalid email format"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    role: z.nativeEnum(UserRole).optional()
});
exports._updateUserSchema = z.object({ firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    phone: z.string().optional(),
    departmentId: z.string().cuid().optional(),
    designation: z.string().optional(),
    specialization: z.string().optional()
});
// Patient validation schemas;
exports.createPatientSchema = z.object({ firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    dateOfBirth: z.string().transform((str) => , gender, z.nativeEnum(Gender), phone, z.string().optional(), email, z.string().email().optional(), address, z.string().optional(), bloodGroup, z.nativeEnum(module_1.BloodGroup).optional(), allergies, z.string().optional(), emergencyContact, z.string().min(1, "Emergency contact is required"), emergencyPhone, z.string().min(1, "Emergency phone is required"), insuranceProvider, z.string().optional(), insuranceNumber, z.string().optional())
});
exports._updatePatientSchema = exports.createPatientSchema.partial();
// Appointment validation schemas;
exports._createAppointmentSchema = z.object({ patientId: z.string().cuid("Invalid patient ID"),
    doctorId: z.string().cuid("Invalid doctor ID"),
    departmentId: z.string().cuid("Invalid department ID"),
    z, : .string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    type: z.enum(["CONSULTATION", "FOLLOW_UP", "EMERGENCY", "PROCEDURE", "SURGERY"]),
    chiefComplaint: z.string().optional(),
    consultationFee: z.number().positive().optional()
});
// Validation middleware;
function validateRequest(schema) {
    return (data) => {
        try {
        }
        catch (error) {
            console.error(error);
        }
    };
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
    return schema.parse(data);
}
try { }
catch (error) {
    if (!session.user) {
        const formattedErrors = error.errors.map(err => ({ field: err.path.join("."),
            message: err.message
        }));
        throw new Error(`Validation failed: ${}`);
        throw error;
    }
    ;
}
