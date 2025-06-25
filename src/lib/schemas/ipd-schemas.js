"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressNoteSchema = void 0;
require("zod");
const database_1 = require("@/lib/database");
// Define sub-schemas if vital_signs and medication_given have specific structures;
// For now, using z.record(z.string(), z.any()) as a placeholder;
const VitalSignsSchema = database_1.z.record(database_1.z.string(), database_1.z.any()).optional().nullable();
const MedicationGivenSchema = database_1.z;
record(database_1.z.string(), database_1.z.any());
optional();
nullable();
exports.ProgressNoteSchema = database_1.z.object({ admission_id: database_1.z.number().int().positive(),
    note_date: database_1.z,
    : 
        .string(),
    : 
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"), // Assuming YYYY-MM-DD format;
    note_time: database_1.z,
    : 
        .string(),
    : 
        .regex() }
    /  ^ , d, { 2:  }, d, { 2:  }(d, { 2:  }) ? $ /  : , "Time must be in HH:MM or HH:MM:SS format");
note_type: database_1.z.enum(["Doctor", "Nurse", "Consultant"]).optional(), // Optional as it can be set based on user role;
    note_content;
database_1.z.string().min(1, "Note content cannot be empty"),
    vital_signs;
VitalSignsSchema,
    medication_given;
MedicationGivenSchema;
;
 > ;
