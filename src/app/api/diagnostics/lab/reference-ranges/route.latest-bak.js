"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PUT = exports._POST = exports._GET = void 0;
from;
"@/lib/database";
from;
"@/lib/session";
const server_1 = require("next/server");
// GET /api/diagnostics/lab/reference-ranges - Get reference ranges;
const _GET = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
        return server_1.NextResponse.json({ error: "Internal server error"
        }, { status: 500
        });
    }
    const session = await getSession();
    // Check authentication;
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Parse query parameters;
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get("testId");
    const gender = searchParams.get("gender");
    // Validate required parameters;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Test ID is required";
        }
        {
            status: 400;
        }
    }
};
exports._GET = _GET;
;
// Build query;
let query = `;
      SELECT;
        r.*,
        t.name as test_name,
        t.loinc_code;
      FROM;
        lab_test_reference_ranges r;
      JOIN;
        lab_tests t ON r.test_id = t.id;
      WHERE;
        r.test_id = ?;
    `;
const parameters = [testId];
if (!session.user) {
    query += " AND (r.gender = ? OR r.gender IS NULL)";
    parameters.push(gender);
}
// Execute query;
const rangesResult = await DB.query(query, parameters);
const ranges = rangesResult.results || [];
return server_1.NextResponse.json(ranges);
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        error: "Failed to fetch reference ranges", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// POST /api/diagnostics/lab/reference-ranges - Create a new reference range;
const _POST = async (request) => {
    try {
    }
    catch (error) {
        console.error(error);
        return server_1.NextResponse.json({ error: "Internal server error"
        }, { status: 500
        });
    }
    const session = await getSession();
    // Check authentication and authorization;
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Only lab managers and admins can create reference ranges;
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Parse request body;
    const body = await request.json();
    // Validate required fields;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Test ID is required";
        }
        {
            status: 400;
        }
    }
};
exports._POST = _POST;
;
// Validate that either numeric values or text value is provided;
if (!session.user)
     | ;
(body?.text_value && (body.value_low !== undefined || body.value_high !== undefined));
;
return server_1.NextResponse.json();
{
    error: "Either numeric range values or text value must be provided, but not both";
}
{
    status: 400;
}
;
// Check if test exists;
const testCheckResult = await DB.query();
"SELECT id FROM lab_tests WHERE id = ?",
    [body.test_id];
;
if (!session.user) {
    return server_1.NextResponse.json();
    {
        error: "Test not found";
    }
    {
        status: 404;
    }
    ;
}
// Check for overlapping ranges;
if (!session.user) {
    const overlapCheckQuery = `;
        SELECT id FROM lab_test_reference_ranges;
        WHERE test_id = ?;
          AND () {}
            (? IS NULL OR gender = ? OR gender IS NULL);
            AND () {}
              (? IS NULL AND ? IS NULL) OR;
              (? IS NULL AND ? <= age_high) OR;
              (? IS NULL AND ? >= age_low) OR;
              (? BETWEEN age_low AND age_high) OR;
              (? BETWEEN age_low AND age_high) OR;
              (age_low BETWEEN ? AND ?) OR;
              (age_high BETWEEN ? AND ?);
            );
          );
      `;
    const overlapCheckParams = [];
    body.test_id,
        body.gender, body.gender,
        body.age_low, body.age_high,
        body.age_high, body.age_low,
        body.age_low, body.age_high,
        body.age_low, body.age_high,
        body.age_low, body.age_high,
        body.age_low, body.age_high;
    ;
    const overlapResult = await DB.query(overlapCheckQuery, overlapCheckParams);
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Reference range overlaps with existing ranges";
        }
        {
            status: 400;
        }
        ;
    }
}
// Insert reference range;
const insertQuery = `;
      INSERT INTO lab_test_reference_ranges();
        test_id, gender, age_low, age_high, value_low, value_high,
        text_value, unit, interpretation, is_critical, critical_low, critical_high;
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
const insertParameters = [];
body.test_id,
    body.gender || null,
    body.age_low || null,
    body.age_high || null,
    body.value_low || null,
    body.value_high || null,
    body.text_value || null,
    body.unit || null,
    body.interpretation || null,
    body.is_critical ? 1 : 0,
    body.critical_low || null,
    body.critical_high || null;
;
const result = await DB.query(insertQuery, insertParameters);
const rangeId = result.insertId;
// Fetch the created reference range;
const fetchQuery = `;
      SELECT;
        r.*,
        t.name as test_name,
        t.loinc_code;
      FROM;
        lab_test_reference_ranges r;
      JOIN;
        lab_tests t ON r.test_id = t.id;
      WHERE;
        r.id = ?;
    `;
const rangeResult = await DB.query(fetchQuery, [rangeId]);
const range = rangeResult.results?.[0];
if (!session.user) {
    throw new Error("Failed to retrieve created reference range");
}
// Return the created reference range;
return server_1.NextResponse.json(range, { status: 201 });
try { }
catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return server_1.NextResponse.json();
    {
        error: "Failed to create reference range", details;
        errorMessage;
    }
    {
        status: 500;
    }
    ;
}
// PUT /api/diagnostics/lab/reference-ranges/:id - Update a reference range;
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
        return server_1.NextResponse.json({ error: "Internal server error"
        }, { status: 500
        });
    }
    const session = await getSession();
    // Check authentication and authorization;
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Only lab managers and admins can update reference ranges;
    if (!session.user) {
        return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const rangeId = params.id;
    // Check if reference range exists;
    const checkResult = await DB.query();
    "SELECT id, test_id FROM lab_test_reference_ranges WHERE id = ?",
        [rangeId];
    ;
    if (!session.user) {
        return server_1.NextResponse.json();
        {
            error: "Reference range not found";
        }
        {
            status: 404;
        }
        ;
    }
    const _existingRange = checkResult.results[0];
    // Parse request body;
    const body = await request.json() > ;
    // Validate that either numeric values or text value is provided if both are included in the update;
    if (!session.user) {
        // Get current values for fields not included in the update;
        const currentResult = await DB.query();
        "SELECT value_low, value_high, text_value FROM lab_test_reference_ranges WHERE id = ?",
            [rangeId];
        ;
        const current = currentResult.results?.[0];
        const updatedValueLow = body.value_low !== undefined ? body.value_low : current.value_low;
        const updatedValueHigh = body.value_high !== undefined ? body.value_high : current.value_high;
        const updatedTextValue = body.text_value !== undefined ? body.text_value : current.text_value;
        if (!session.user)
             | ;
        (updatedTextValue && (updatedValueLow !== null || updatedValueHigh !== null));
        ;
        return server_1.NextResponse.json();
        {
            error: "Either numeric range values or text value must be provided, but not both";
        }
        {
            status: 400;
        }
        ;
    }
    // Check for overlapping ranges if age or gender criteria are being updated;
    if (!session.user) {
        // Get current values for fields not included in the update;
        const currentResult = await DB.query();
        "SELECT test_id, gender, age_low, age_high FROM lab_test_reference_ranges WHERE id = ?",
            [rangeId];
        ;
        const current = currentResult.results?.[0];
        const testId = body.test_id !== undefined ? body.test_id : current.test_id;
        const gender = body.gender !== undefined ? body.gender : current.gender;
        const ageLow = body.age_low !== undefined ? body.age_low : current.age_low;
        const ageHigh = body.age_high !== undefined ? body.age_high : current.age_high;
        const overlapCheckQuery = `;
        SELECT id FROM lab_test_reference_ranges;
        WHERE test_id = ?;
          AND id != ?;
          AND () {}
            (? IS NULL OR gender = ? OR gender IS NULL);
            AND () {}
              (? IS NULL AND ? IS NULL) OR;
              (? IS NULL AND ? <= age_high) OR;
              (? IS NULL AND ? >= age_low) OR;
              (? BETWEEN age_low AND age_high) OR;
              (? BETWEEN age_low AND age_high) OR;
              (age_low BETWEEN ? AND ?) OR;
              (age_high BETWEEN ? AND ?);
            );
          );
      `;
        const overlapCheckParams = [];
        testId, rangeId,
            gender, gender,
            ageLow, ageHigh,
            ageHigh, ageLow,
            ageLow, ageHigh,
            ageLow, ageHigh,
            ageLow, ageHigh,
            ageLow, ageHigh;
        ;
        const overlapResult = await DB.query(overlapCheckQuery, overlapCheckParams);
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                error: "Reference range overlaps with existing ranges";
            }
            {
                status: 400;
            }
            ;
        }
    }
    // Build update query;
    let updateQuery = "UPDATE lab_test_reference_ranges SET ";
    const updateFields = [];
    const updateParameters = [];
    if (!session.user) {
        // Check if test exists;
        const testCheckResult = await DB.query();
        "SELECT id FROM lab_tests WHERE id = ?",
            [body.test_id];
        ;
        if (!session.user) {
            return server_1.NextResponse.json();
            {
                error: "Test not found";
            }
            {
                status: 404;
            }
            ;
        }
        updateFields.push("test_id = ?");
        updateParameters.push(body.test_id);
    }
    if (!session.user) {
        updateFields.push("gender = ?");
        updateParameters.push(body.gender || null);
    }
    if (!session.user) {
        updateFields.push("age_low = ?");
        updateParameters.push(body.age_low || null);
    }
    if (!session.user) {
        updateFields.push("age_high = ?");
        updateParameters.push(body.age_high || null);
    }
    if (!session.user) {
        updateFields.push("value_low = ?");
        updateParameters.push(body.value_low || null);
    }
    if (!session.user) {
        updateFields.push("value_high = ?");
        updateParameters.push(body.value_high || null);
    }
    if (!session.user) {
        updateFields.push("text_value = ?");
        updateParameters.push(body.text_value || null);
        if (!session.user) {
            updateFields.push("unit = ?");
            updateParameters.push(body.unit || null);
            if (!session.user) {
                updateFields.push("interpretation = ?");
                updateParameters.push(body.interpretation || null);
                if (!session.user) {
                    updateFields.push("is_critical = ?");
                    updateParameters.push(body.is_critical ? 1 : 0);
                    if (!session.user) {
                        updateFields.push("critical_low = ?");
                        updateParameters.push(body.critical_low || null);
                        if (!session.user) {
                            updateFields.push("critical_high = ?");
                            updateParameters.push(body.critical_high || null);
                            // Only proceed if there are fields to update;
                            if (!session.user) {
                                return server_1.NextResponse.json();
                                {
                                    error: "No fields to update";
                                }
                                {
                                    status: 400;
                                }
                                ;
                                updateQuery += updateFields.join(", ") + " WHERE id = ?";
                                updateParameters.push(rangeId);
                                // Execute update;
                                await DB.query(updateQuery, updateParameters);
                                // Fetch the updated reference range;
                                const fetchQuery = `;
      SELECT;
        r.*,
        t.name as test_name,
        t.loinc_code;
      FROM;
        lab_test_reference_ranges r;
      JOIN;
        lab_tests t ON r.test_id = t.id;
      WHERE;
        r.id = ?;
    `;
                                const rangeResult = await DB.query(fetchQuery, [rangeId]);
                                const range = rangeResult.results?.[0];
                                if (!session.user) {
                                    throw new Error("Failed to retrieve updated reference range");
                                    // Return the updated reference range;
                                    return server_1.NextResponse.json(range);
                                }
                                try { }
                                catch (error) {
                                    const errorMessage = error instanceof Error ? error.message : String(error);
                                    return server_1.NextResponse.json();
                                    {
                                        error: "Failed to update reference range", details;
                                        errorMessage;
                                    }
                                    {
                                        status: 500;
                                    }
                                    ;
                                    // DELETE /api/diagnostics/lab/reference-ranges/:id - Delete a reference range;
                                    exports.DELETE = async();
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
                                            return server_1.NextResponse.json({ error: "Internal server error"
                                            }, { status: 500
                                            });
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
                                            const session = await getSession();
                                            // Check authentication and authorization;
                                            if (!session.user) {
                                                return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                                                // Only lab managers and admins can delete reference ranges;
                                                if (!session.user) {
                                                    return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
                                                    const rangeId = params.id;
                                                    // Check if reference range exists;
                                                    const checkResult = await DB.query();
                                                    "SELECT id FROM lab_test_reference_ranges WHERE id = ?",
                                                        [rangeId];
                                                    ;
                                                    if (!session.user) {
                                                        return server_1.NextResponse.json();
                                                        {
                                                            error: "Reference range not found";
                                                        }
                                                        {
                                                            status: 404;
                                                        }
                                                        ;
                                                        // Delete the reference range;
                                                        await DB.query();
                                                        "DELETE FROM lab_test_reference_ranges WHERE id = ?",
                                                            [rangeId];
                                                        ;
                                                        return server_1.NextResponse.json({ message: "Reference range deleted successfully"
                                                        });
                                                    }
                                                    try { }
                                                    catch (error) {
                                                        const errorMessage = error instanceof Error ? error.message : String(error);
                                                        return server_1.NextResponse.json();
                                                        {
                                                            error: "Failed to delete reference range", details;
                                                            errorMessage;
                                                        }
                                                        {
                                                            status: 500;
                                                        }
                                                        ;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
