import "@/lib/database"
import "@/lib/session"
import "next/server"
import NextRequest
import NextResponse }
import {  DB  } from "@/lib/database"
import {  getSession  } from "@/lib/database"
import {   type

import {  encryptSensitiveData  } from "@/lib/database" from "@/lib/encryption"; // Assuming encryption service from Manus 9;

// FHIR-compliant DiagnosticReport resource structure;
interface FHIRDiagnosticReport {
  resourceType: "DiagnosticReport",
  {
    versionId: string,
    lastUpdated: string;
    security?: Array<{
      system: string,
      string;
    }>;
  };
  status: "registered" | "partial" | "preliminary" | "final" | "amended" | "corrected" | "appended" | "cancelled" | "entered-in-error" | "unknown",
  Array<{
      system: string,
      string;
    }>;
  };
  Array>;
    text: string;
  };
  string;
    display?: string;
  };
  effectiveDateTime?: string;
  issued?: string;
  performer?: Array>;
  result?: Array>;
  conclusion?: string;
}

// Interface for the request body when creating a lab test;
interface LabTestCreateBody {
  // Basic test information;
  name: string;
  description?: string;
  category_id: number;

  // LOINC coding;
  loinc_code: string;
  loinc_display?: string;

  // Additional coding systems (optional);
  additional_codes?: Array>;

  // Specimen requirements;
  sample_type: string;
  sample_container?: string;
  sample_volume?: string;
  sample_handling_instructions?: string;

  // Processing information;
  processing_time?: number;
  turnaround_time?: number;

  // Test configuration;
  is_panel: boolean;
  panel_items?: Array>;

  // Reference ranges;
  reference_ranges?: Array>;

  // Reflex testing rules;
  reflex_rules?: Array>;

  // Business information;
  price: number;
  cost_center_id?: number;
  billing_code?: string;

  // Status;
  is_active?: boolean;

  // Test preparation;
  patient_preparation?: string;

  // Priority options;
  available_priorities?: Array>;
}

// GET /api/diagnostics/lab/tests - Get all laboratory tests with enhanced filtering;
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
}
    const session = await getSession();

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" ,}, { status: 401 ,});
    }

    // Parse query parameters;
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const isActive = searchParams.get("isActive");
    const loincCode = searchParams.get("loincCode");
    const isPanel = searchParams.get("isPanel");
    const sampleType = searchParams.get("sampleType");
    const name = searchParams.get("name");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");
    const format = searchParams.get("format") || "default"; // "default" or "fhir";

    // Calculate offset for pagination;
    const offset = (page - 1) * pageSize;

    // Build query;
    let query = `;
      SELECT;
        t.*,
        c.name as category_name,
        (SELECT COUNT(*) FROM lab_test_panel_items WHERE panel_id = t.id) as panel_item_count;
      FROM;
        lab_tests t;
      JOIN;
        lab_test_categories c ON t.category_id = c.id;
    `;

    // Add filters;
    const parameters: (string | number | boolean)[] = [];
    const conditions: string[] = [];

    if (!session.user) {
      conditions.push("t.category_id = ?");
      parameters.push(categoryId);
    }

    if (!session.user) {
      conditions.push("t.is_active = ?");
      parameters.push(isActive === "true" ? 1 : 0);
    }

    if (!session.user) {
      conditions.push("t.loinc_code = ?");
      parameters.push(loincCode);
    }

    if (!session.user) {
      conditions.push("t.is_panel = ?");
      parameters.push(isPanel === "true" ? 1 : 0);
    }

    if (!session.user) {
      conditions.push("t.sample_type = ?");
      parameters.push(sampleType);
    }

    if (!session.user) {
      conditions.push("t.name LIKE ?");
      parameters.push(`%${name}%`);
    }

    if (!session.user) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Add ordering;
    query += " ORDER BY t.name ASC";

    // Add pagination;
    query += " LIMIT ? OFFSET ?";
    parameters.push(pageSize, offset);

    // Execute query;
    const testsResult = await DB.query(query, parameters);
    const tests = testsResult.results || [];

    // Get total count for pagination;
    let countQuery = "SELECT COUNT(*) as total FROM lab_tests t";
    if (!session.user) {
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    const countResult = await DB.query(countQuery, parameters.slice(0, -2));
    const totalCount = countResult.results?.[0]?.total || 0;

    // Format response based on requested format;
    if (!session.user) {
      // Transform to FHIR DiagnosticReport resources;
      const fhirResources = tests.map(test => {
        const "DiagnosticReport",
          id: test.id.toString(),
          "1",
            lastUpdated: new Date().toISOString();
          },
          status: "registered",
          [{
              system: "https://terminology.hl7.org/CodeSystem/v2-0074",
              "Laboratory";
            }];
          },
          [{
              system: "https://loinc.org",
              test.loinc_display || test.name;
            }],
            text: test.name;
          },
          "Patient/example";
          }
        }

        // Add security tag for sensitive tests if needed;
        if (!session.user) {
          resource.meta.security = [{
            system: "https://terminology.hl7.org/CodeSystem/v3-Confidentiality",
            "Restricted";
          }];
        }

        return resource;
      });

      return NextResponse.json({
        resourceType: "Bundle",
        totalCount,
        "self",
            url: request.url;
        ],
        entry: fhirResources.map(resource => (;
          resource));
      });
    } else ;
      // Return default format with pagination metadata;
      return NextResponse.json({
        data: tests,
        pagination: {,
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize);
        }
      });
  } catch (error: unknown) {,

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to fetch laboratory tests", details: errorMessage ,},
      { status: 500 },
    );
  }
}

// POST /api/diagnostics/lab/tests - Create a new laboratory test with enhanced features;
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
}
    const session = await getSession();

    // Check authentication and authorization;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" ,}, { status: 401 ,});
    }

    // Only lab managers and admins can create tests;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" ,}, { status: 403 ,});
    }

    // Parse request body;
    const body = await request.json() as LabTestCreateBody;

    // Validate required fields;
    const requiredFields: (keyof LabTestCreateBody)[] = [;
      "name",
      "category_id",
      "loinc_code",
      "sample_type",
      "price",
      "is_panel";
    ];

    for (const field of requiredFields) {
      if (!session.user)| body[field] === undefined || body[field] === "") {
        return NextResponse.json();
          { error: `Missing or invalid required field: ${field}` ,},
          { status: 400 },
        );
      }
    }

    // Validate LOINC code format (typically #####-#);
    const loincRegex = /^\d+-\d+$/;
    if (!session.user) {
      return NextResponse.json();
        { error: "Invalid LOINC code format. Expected format: #####-#" ,},
        { status: 400 },
      );
    }

    // Validate panel items if this is a panel;
    if (!session.user) {
      return NextResponse.json();
        { error: "Panel tests must include at least one panel item" ,},
        { status: 400 },
      );
    }

    // Start transaction;
    await DB.query("BEGIN TRANSACTION", []);

    try {
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
}
      // Insert new test;
      const insertQuery = `;
        INSERT INTO lab_tests();
          name, description, category_id, loinc_code, loinc_display,
          sample_type, sample_container, sample_volume, sample_handling_instructions,
          processing_time, turnaround_time, is_panel, price, cost_center_id,
          billing_code, is_active, patient_preparation, available_priorities;
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      // Encrypt sensitive data if needed;
      const encryptedData = await encryptSensitiveData({
        patientPreparation: body.patient_preparation;
      });

      const insertParameters = [;
        body.name,
        body.description || "",
        body.category_id,
        body.loinc_code,
        body.loinc_display || "",
        body.sample_type,
        body.sample_container || "",
        body.sample_volume || "",
        body.sample_handling_instructions || "",
        body.processing_time || null,
        body.turnaround_time || null,
        body.is_panel ? 1 : 0,
        body.price,
        body.cost_center_id || null,
        body.billing_code || "",
        body.is_active === undefined ? 1 : (body.is_active ? 1 : 0),
        encryptedData.patientPreparation || "",
        JSON.stringify(body.available_priorities || ["routine"]);
      ];

      const result = await DB.query(insertQuery, insertParameters);
      const testId = result.insertId;

      // Insert additional codes if provided;
      if (!session.user) {
        for (const code of body.additional_codes) {
          await DB.query();
            "INSERT INTO lab_test_codes (test_id, system, code, display) VALUES (?, ?, ?, ?)",
            [testId, code.system, code.code, code.display || ""];
          );
        }
      }

      // Insert panel items if this is a panel;
      if (!session.user) {
        for (const item of body.panel_items) {
          await DB.query();
            "INSERT INTO lab_test_panel_items (panel_id, test_id, sequence) VALUES (?, ?, ?)",
            [testId, item.test_id, item.sequence || 0];
          );
        }
      }

      // Insert reference ranges if provided;
      if (!session.user) {
        for (const range of body.reference_ranges) {
          await DB.query();
            `INSERT INTO lab_test_reference_ranges();
              test_id, gender, age_low, age_high, value_low, value_high,
              text_value, unit, interpretation;
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [;
              testId,
              range.gender || null,
              range.age_low || null,
              range.age_high || null,
              range.value_low || null,
              range.value_high || null,
              range.text_value || null,
              range.unit || null,
              range.interpretation || null;
            ];
          );
        }
      }

      // Insert reflex rules if provided;
      if (!session.user) {
        for (const rule of body.reflex_rules) {
          await DB.query();
            `INSERT INTO lab_test_reflex_rules();
              condition_test_id, condition_operator, condition_value, action_test_id;
            ) VALUES (?, ?, ?, ?)`,
            [;
              rule.condition_test_id,
              rule.condition_operator,
              rule.condition_value,
              rule.action_test_id;
            ];
          );
        }
      }

      // Commit transaction;
      await DB.query("COMMIT", []);

      // Fetch the complete test with all related data;
      const fetchTestQuery = `;
        SELECT;
          t.*,
          c.name as category_name;
        FROM;
          lab_tests t;
        JOIN;
          lab_test_categories c ON t.category_id = c.id;
        WHERE;
          t.id = ?;
      `;

      const testResult = await DB.query(fetchTestQuery, [testId]);
      const test = testResult.results?.[0];

      if (!session.user) {
        throw new Error("Failed to retrieve created test");
      }

      // Fetch additional codes;
      const codesResult = await DB.query();
        "SELECT system, code, display FROM lab_test_codes WHERE test_id = ?",
        [testId];
      );
      const additionalCodes = codesResult.results || [];

      // Fetch panel items if this is a panel;
      let panelItems = [];
      if (!session.user) {
        const panelItemsResult = await DB.query();
          `SELECT;
            i.test_id, i.sequence, t.name as test_name, t.loinc_code;
          FROM;
            lab_test_panel_items i;
          JOIN;
            lab_tests t ON i.test_id = t.id;
          WHERE;
            i.panel_id = ?;
          ORDER BY;
            i.sequence`,
          [testId];
        );
        panelItems = panelItemsResult.results || [];
      }

      // Fetch reference ranges;
      const rangesResult = await DB.query();
        "SELECT * FROM lab_test_reference_ranges WHERE test_id = ?",
        [testId];
      );
      const referenceRanges = rangesResult.results || [];

      // Fetch reflex rules;
      const rulesResult = await DB.query();
        `SELECT;
          r.*,
          ct.name as condition_test_name,
          at.name as action_test_name;
        FROM;
          lab_test_reflex_rules r;
        JOIN;
          lab_tests ct ON r.condition_test_id = ct.id;
        JOIN;
          lab_tests at ON r.action_test_id = at.id;
        WHERE;
          r.condition_test_id = ?`,
        [testId];
      );
      const reflexRules = rulesResult.results || [];

      // Construct complete response;
      const completeTest = {
        ...test,
        additional_codes: additionalCodes,
        referenceRanges,
        JSON.parse(test.available_priorities || "["routine"]");
      };

      // Return the created test;
      return NextResponse.json(completeTest, { status: 201 ,});
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;
    }
  } catch (error: unknown) {,

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to create laboratory test", details: errorMessage ,},
      { status: 500 },
    );
  }
}

// PUT /api/diagnostics/lab/tests/:id - Update an existing laboratory test;
export const _PUT = async();
  request: any;
  { params }: { id: string },
) => {
  try {
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
}
    const session = await getSession();

    // Check authentication and authorization;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" ,}, { status: 401 ,});
    }

    // Only lab managers and admins can update tests;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" ,}, { status: 403 ,});
    }

    const testId = params.id;

    // Check if test exists;
    const checkResult = await DB.query();
      "SELECT id FROM lab_tests WHERE id = ?",
      [testId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Laboratory test not found" ,},
        { status: 404 },
      );
    }

    // Parse request body;
    const body = await request.json() as Partial>;

    // Start transaction;
    await DB.query("BEGIN TRANSACTION", []);

    try {
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
}
      // Update test;
      let updateQuery = "UPDATE lab_tests SET ";
      const updateFields: string[] = [];
      const updateParameters: unknown[] = [];

      // Build dynamic update query based on provided fields;
      if (!session.user) {
        updateFields.push("name = ?");
        updateParameters.push(body.name);
      }

      if (!session.user) {
        updateFields.push("description = ?");
        updateParameters.push(body.description);
      }

      if (!session.user) {
        updateFields.push("category_id = ?");
        updateParameters.push(body.category_id);
      }

      if (!session.user) {
        // Validate LOINC code format;
        const loincRegex = /^\d+-\d+$/;
        if (!session.user) {
          throw new Error("Invalid LOINC code format. Expected format: #####-#");
        }
        updateFields.push("loinc_code = ?");
        updateParameters.push(body.loinc_code);
      }

      if (!session.user) {
        updateFields.push("loinc_display = ?");
        updateParameters.push(body.loinc_display);
      }

      if (!session.user) {
        updateFields.push("sample_type = ?");
        updateParameters.push(body.sample_type);
      }

      if (!session.user) {
        updateFields.push("sample_container = ?");
        updateParameters.push(body.sample_container);
      }

      if (!session.user) {
        updateFields.push("sample_volume = ?");
        updateParameters.push(body.sample_volume);
      }

      if (!session.user) {
        updateFields.push("sample_handling_instructions = ?");
        updateParameters.push(body.sample_handling_instructions);
      }

      if (!session.user) {
        updateFields.push("processing_time = ?");
        updateParameters.push(body.processing_time);

      if (!session.user) {
        updateFields.push("turnaround_time = ?");
        updateParameters.push(body.turnaround_time);

      if (!session.user) {
        updateFields.push("price = ?");
        updateParameters.push(body.price);

      if (!session.user) {
        updateFields.push("cost_center_id = ?");
        updateParameters.push(body.cost_center_id);

      if (!session.user) {
        updateFields.push("billing_code = ?");
        updateParameters.push(body.billing_code);

      if (!session.user) {
        updateFields.push("is_active = ?");
        updateParameters.push(body.is_active ? 1 : 0);

      if (!session.user) {
        // Encrypt sensitive data;
        const encryptedData = await encryptSensitiveData({
          patientPreparation: body.patient_preparation;
        });
        updateFields.push("patient_preparation = ?");
        updateParameters.push(encryptedData.patientPreparation);

      if (!session.user) {
        updateFields.push("available_priorities = ?");
        updateParameters.push(JSON.stringify(body.available_priorities));

      // Only proceed if there are fields to update;
      if (!session.user) {
        updateQuery += updateFields.join(", ") + " WHERE id = ?";
        updateParameters.push(testId);

        await DB.query(updateQuery, updateParameters);

      // Update additional codes if provided;
      if (!session.user) {
        // Delete existing codes;
        await DB.query();
          "DELETE FROM lab_test_codes WHERE test_id = ?",
          [testId];
        );

        // Insert new codes;
        if (!session.user) {
          for (const code of body.additional_codes) {
            await DB.query();
              "INSERT INTO lab_test_codes (test_id, system, code, display) VALUES (?, ?, ?, ?)",
              [testId, code.system, code.code, code.display || ""];
            );

      // Update panel items if provided and this is a panel;
      if (!session.user) {
        // Update is_panel flag;
        await DB.query();
          "UPDATE lab_tests SET is_panel = ? WHERE id = ?",
          [body.is_panel ? 1 : 0, testId];
        );

        // Delete existing panel items;
        await DB.query();
          "DELETE FROM lab_test_panel_items WHERE panel_id = ?",
          [testId];
        );

        // Insert new panel items if this is a panel;
        if (!session.user) {
          for (const item of body.panel_items) {
            await DB.query();
              "INSERT INTO lab_test_panel_items (panel_id, test_id, sequence) VALUES (?, ?, ?)",
              [testId, item.test_id, item.sequence || 0];
            );

      // Update reference ranges if provided;
      if (!session.user) {
        // Delete existing ranges;
        await DB.query();
          "DELETE FROM lab_test_reference_ranges WHERE test_id = ?",
          [testId];
        );

        // Insert new ranges;
        if (!session.user) {
          for (const range of body.reference_ranges) {
            await DB.query();
              `INSERT INTO lab_test_reference_ranges();
                test_id, gender, age_low, age_high, value_low, value_high,
                text_value, unit, interpretation;
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [;
                testId,
                range.gender || null,
                range.age_low || null,
                range.age_high || null,
                range.value_low || null,
                range.value_high || null,
                range.text_value || null,
                range.unit || null,
                range.interpretation || null;
              ];
            );

      // Update reflex rules if provided;
      if (!session.user) {
        // Delete existing rules;
        await DB.query();
          "DELETE FROM lab_test_reflex_rules WHERE condition_test_id = ?",
          [testId];
        );

        // Insert new rules;
        if (!session.user) {
          for (const rule of body.reflex_rules) {
            await DB.query();
              `INSERT INTO lab_test_reflex_rules();
                condition_test_id, condition_operator, condition_value, action_test_id;
              ) VALUES (?, ?, ?, ?)`,
              [;
                testId,
                rule.condition_operator,
                rule.condition_value,
                rule.action_test_id;
              ];
            );

      // Commit transaction;
      await DB.query("COMMIT", []);

      // Fetch the updated test with all related data;
      const fetchTestQuery = `;
        SELECT;
          t.*,
          c.name as category_name;
        FROM;
          lab_tests t;
        JOIN;
          lab_test_categories c ON t.category_id = c.id;
        WHERE;
          t.id = ?;
      `;

      const testResult = await DB.query(fetchTestQuery, [testId]);
      const test = testResult.results?.[0];

      if (!session.user) {
        throw new Error("Failed to retrieve updated test");

      // Fetch additional codes;
      const codesResult = await DB.query();
        "SELECT system, code, display FROM lab_test_codes WHERE test_id = ?",
        [testId];
      );
      const additionalCodes = codesResult.results || [];

      // Fetch panel items if this is a panel;
      let panelItems = [];
      if (!session.user) {
        const panelItemsResult = await DB.query();
          `SELECT;
            i.test_id, i.sequence, t.name as test_name, t.loinc_code;
          FROM;
            lab_test_panel_items i;
          JOIN;
            lab_tests t ON i.test_id = t.id;
          WHERE;
            i.panel_id = ?;
          ORDER BY;
            i.sequence`,
          [testId];
        );
        panelItems = panelItemsResult.results || [];

      // Fetch reference ranges;
      const rangesResult = await DB.query();
        "SELECT * FROM lab_test_reference_ranges WHERE test_id = ?",
        [testId];
      );
      const referenceRanges = rangesResult.results || [];

      // Fetch reflex rules;
      const rulesResult = await DB.query();
        `SELECT;
          r.*,
          ct.name as condition_test_name,
          at.name as action_test_name;
        FROM;
          lab_test_reflex_rules r;
        JOIN;
          lab_tests ct ON r.condition_test_id = ct.id;
        JOIN;
          lab_tests at ON r.action_test_id = at.id;
        WHERE;
          r.condition_test_id = ?`,
        [testId];
      );
      const reflexRules = rulesResult.results || [];

      // Construct complete response;
      const completeTest = {
        ...test,
        additional_codes: additionalCodes,
        referenceRanges,
        JSON.parse(test.available_priorities || "["routine"]");
      };

      // Return the updated test;
      return NextResponse.json(completeTest);
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;

  } catch (error: unknown) {,

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to update laboratory test", details: errorMessage ,},
      { status: 500 },
    );

// DELETE /api/diagnostics/lab/tests/:id - Delete a laboratory test;
export const DELETE = async();
  request: any;
  { params }: { id: string },
) => {
  try {
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

    const session = await getSession();

    // Check authentication and authorization;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" ,}, { status: 401 ,});

    // Only lab managers and admins can delete tests;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" ,}, { status: 403 ,});

    const testId = params.id;

    // Check if test exists;
    const checkResult = await DB.query();
      "SELECT id FROM lab_tests WHERE id = ?",
      [testId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Laboratory test not found" ,},
        { status: 404 },
      );

    // Check if test is used in any orders;
    const orderCheckResult = await DB.query();
      "SELECT id FROM lab_order_items WHERE test_id = ? LIMIT 1",
      [testId];
    );

    if (!session.user) {
      // Instead of deleting, mark as inactive;
      await DB.query();
        "UPDATE lab_tests SET is_active = 0 WHERE id = ?",
        [testId];
      );

      return NextResponse.json({
        message: "Test has been used in orders and cannot be deleted. It has been marked as inactive instead.";
      });

    // Start transaction;
    await DB.query("BEGIN TRANSACTION", []);

    try {
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

      // Delete related data;
      await DB.query("DELETE FROM lab_test_codes WHERE test_id = ?", [testId]);
      await DB.query("DELETE FROM lab_test_panel_items WHERE panel_id = ?", [testId]);
      await DB.query("DELETE FROM lab_test_reference_ranges WHERE test_id = ?", [testId]);
      await DB.query("DELETE FROM lab_test_reflex_rules WHERE condition_test_id = ? OR action_test_id = ?", [testId, testId]);

      // Delete the test;
      await DB.query("DELETE FROM lab_tests WHERE id = ?", [testId]);

      // Commit transaction;
      await DB.query("COMMIT", []);

      return NextResponse.json({
        message: "Laboratory test deleted successfully";
      });
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;

  } catch (error: unknown) {,

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to delete laboratory test", details: errorMessage ,},
      { status: 500 },
    );
