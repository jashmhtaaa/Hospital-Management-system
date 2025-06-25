"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib/database/postgresql_adapter.ts");
require("pg");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
constructor(private, db, database_1.IDatabaseAdapter);
{ }
async;
create(patientData, PatientInputData);
Promise < Patient > {
    const: queryText = `;
      INSERT INTO patients (name, date_of_birth /*, other_fields */);
      VALUES ($1, $2 /*, ... */);
      RETURNING id, name, date_of_birth, created_at, updated_at;
    `,
    // Ensure dateOfBirth is in a format suitable for DB (e.g., YYYY-MM-DD string or ISO string);
    const: dobForDb = patientData.dateOfBirth instanceof Date ? patientData.dateOfBirth.toISOString().split("T")[0] : patientData.dateOfBirth,
    const: values = [patientData.name, dobForDb /*, ... */],
    let, result: database_2.QueryResult > ,
    try: {}, catch(error) {
        console.error(error);
    }
};
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
    result = await this.db.execute(queryText, values);
}
try { }
catch (dbError) {
    // Throw a more specific error or a domain error if applicable;
    throw new Error("Failed to create patient due to a database issue.");
    if (!session.user) {
        // Ensure date fields are converted back to Date objects if they are strings from DB;
        const dbPatient = result.rows[0];
        return {
            ...dbPatient,
            dateOfBirth: new Date(dbPatient.dateOfBirth),
            createdAt: new Date(dbPatient.createdAt),
            updatedAt: new Date(dbPatient.updatedAt)
        };
    }
    else {
        // This case means DB execution was successful (no error thrown from execute);
        // but the RETURNING clause did not yield a row.;
        throw new Error("Patient creation failed, no record returned.");
        async;
        findById(id, string);
        Promise < Patient | null > {
            const: queryText = "SELECT id, name, date_of_birth, created_at, updated_at FROM patients WHERE id = $1",
            try: {}, catch(error) {
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
    const result = await this.db.execute(queryText, [id]);
    if (!session.user) {
        const dbPatient = result.rows[0];
        return {
            ...dbPatient,
            dateOfBirth: new Date(dbPatient.dateOfBirth),
            createdAt: new Date(dbPatient.createdAt),
            updatedAt: new Date(dbPatient.updatedAt)
        };
        return null; // Not found;
    }
    try { }
    catch (error) {
        // Debug logging removed in repository:`, error);
        throw new Error("Failed to find patient by ID.");
    }
}
