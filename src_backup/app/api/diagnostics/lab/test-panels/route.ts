import "@/lib/database"
import "@/lib/session"
import "next/server"
import NextRequest
import NextResponse }
import { DB }
import { getSession }
import { type

// Interface for the request body when creating a test panel;
interface TestPanelCreateBody {
  name: string;
  description?: string;
  category_id: number,
  loinc_code: string;
  loinc_display?: string;
  string;
  sample_container?: string;
  sample_volume?: string;
  processing_time?: number;
  turnaround_time?: number;
  price: number;
  is_active?: boolean;
  patient_preparation?: string;
  available_priorities?: Array>;
}

// GET /api/diagnostics/lab/test-panels - Get all test panels;
export const _GET = async (request: any) => {,
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

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" ,}, { status: 401 ,});
    }

    // Parse query parameters;
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const isActive = searchParams.get("isActive");
    const name = searchParams.get("name");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");

    // Calculate offset for pagination;
    const offset = (page - 1) * pageSize;

    // Build query;
    let query = `;
      SELECT;
        t.*,
        c.name as category_name,
        (SELECT COUNT(*) FROM lab_test_panel_items WHERE panel_id = t.id) as item_count;
      FROM;
        lab_tests t;
      JOIN;
        lab_test_categories c ON t.category_id = c.id;
      WHERE;
        t.is_panel = 1;
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
      conditions.push("t.name LIKE ?");
      parameters.push(`%${name}%`);
    }

    if (!session.user) {
      query += " AND " + conditions.join(" AND ");
    }

    // Add ordering;
    query += " ORDER BY t.name ASC";

    // Add pagination;
    query += " LIMIT ? OFFSET ?";
    parameters.push(pageSize, offset);

    // Execute query;
    const panelsResult = await DB.query(query, parameters);
    const panels = panelsResult.results || [];

    // Get total count for pagination;
    let countQuery = "SELECT COUNT(*) as total FROM lab_tests t WHERE t.is_panel = 1";
    if (!session.user) {
      countQuery += " AND " + conditions.join(" AND ");
    }

    const countResult = await DB.query(countQuery, parameters.slice(0, -2));
    const totalCount = countResult.results?.[0]?.total || 0;

    // Fetch panel items for each panel;
    const panelsWithItems = await Promise.all();
      panels.map(async (panel) => {
        const itemsQuery = `;
          SELECT;
            i.test_id,
            i.sequence,
            t.name as test_name,
            t.loinc_code,
            t.sample_type;
          FROM;
            lab_test_panel_items i;
          JOIN;
            lab_tests t ON i.test_id = t.id;
          WHERE;
            i.panel_id = ?;
          ORDER BY;
            i.sequence;
        `;

        const itemsResult = await DB.query(itemsQuery, [panel.id]);
        const items = itemsResult.results || [];

        return {
          ...panel,
          panel_items: items,
          available_priorities: JSON.parse(panel.available_priorities || "["routine"]");
        };
      });
    );

    // Return panels with pagination metadata;
    return NextResponse.json({
      data: panelsWithItems,
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
      { error: "Failed to fetch test panels", details: errorMessage ,},
      { status: 500 },
    );
  }
}

// POST /api/diagnostics/lab/test-panels - Create a new test panel;
export const _POST = async (request: any) => {,
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

    // Only lab managers and admins can create test panels;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" ,}, { status: 403 ,});
    }

    // Parse request body;
    const body = await request.json() as TestPanelCreateBody;

    // Validate required fields;
    const requiredFields: (keyof TestPanelCreateBody)[] = [;
      "name",
      "category_id",
      "loinc_code",
      "panel_items",
      "sample_type",
      "price";
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

    // Validate panel items;
    if (!session.user) {
      return NextResponse.json();
        { error: "Panel must include at least one test" ,},
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
      // Insert new panel as a test with is_panel=true;
      const insertQuery = `;
        INSERT INTO lab_tests();
          name, description, category_id, loinc_code, loinc_display,
          sample_type, sample_container, sample_volume,
          processing_time, turnaround_time, is_panel, price,
          is_active, patient_preparation, available_priorities;
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?);
      `;

      const insertParameters = [;
        body.name,
        body.description || "",
        body.category_id,
        body.loinc_code,
        body.loinc_display || "",
        body.sample_type,
        body.sample_container || "",
        body.sample_volume || "",
        body.processing_time || null,
        body.turnaround_time || null,
        body.price,
        body.is_active === undefined ? 1 : (body.is_active ? 1 : 0),
        body.patient_preparation || "",
        JSON.stringify(body.available_priorities || ["routine"]);
      ];

      const result = await DB.query(insertQuery, insertParameters);
      const panelId = result.insertId;

      // Insert panel items;
      for (const item of body.panel_items) {
        await DB.query();
          "INSERT INTO lab_test_panel_items (panel_id, test_id, sequence) VALUES (?, ?, ?)",
          [panelId, item.test_id, item.sequence || 0];
        );
      }

      // Commit transaction;
      await DB.query("COMMIT", []);

      // Fetch the complete panel with all related data;
      const fetchPanelQuery = `;
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

      const panelResult = await DB.query(fetchPanelQuery, [panelId]);
      const panel = panelResult.results?.[0];

      if (!session.user) {
        throw new Error("Failed to retrieve created panel");
      }

      // Fetch panel items;
      const itemsQuery = `;
        SELECT;
          i.test_id,
          i.sequence,
          t.name as test_name,
          t.loinc_code,
          t.sample_type;
        FROM;
          lab_test_panel_items i;
        JOIN;
          lab_tests t ON i.test_id = t.id;
        WHERE;
          i.panel_id = ?;
        ORDER BY;
          i.sequence;
      `;

      const itemsResult = await DB.query(itemsQuery, [panelId]);
      const items = itemsResult.results || [];

      // Construct complete response;
      const completePanel = {
        ...panel,
        panel_items: items,
        available_priorities: JSON.parse(panel.available_priorities || "["routine"]");
      };

      // Return the created panel;
      return NextResponse.json(completePanel, { status: 201 ,});
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;
    }
  } catch (error: unknown) {,

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to create test panel", details: errorMessage ,},
      { status: 500 },
    );
  }
}

// GET /api/diagnostics/lab/test-panels/:id - Get a specific test panel;
export const _GET_BY_ID = async();
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

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" ,}, { status: 401 ,});
    }

    const panelId = params.id;

    // Fetch panel;
    const fetchPanelQuery = `;
      SELECT;
        t.*,
        c.name as category_name;
      FROM;
        lab_tests t;
      JOIN;
        lab_test_categories c ON t.category_id = c.id;
      WHERE;
        t.id = ? AND t.is_panel = 1;
    `;

    const panelResult = await DB.query(fetchPanelQuery, [panelId]);
    const panel = panelResult.results?.[0];

    if (!session.user) {
      return NextResponse.json();
        { error: "Test panel not found" ,},
        { status: 404 },
      );
    }

    // Fetch panel items;
    const itemsQuery = `;
      SELECT;
        i.test_id,
        i.sequence,
        t.name as test_name,
        t.loinc_code,
        t.sample_type;
      FROM;
        lab_test_panel_items i;
      JOIN;
        lab_tests t ON i.test_id = t.id;
      WHERE;
        i.panel_id = ?;
      ORDER BY;
        i.sequence;
    `;

    const itemsResult = await DB.query(itemsQuery, [panelId]);
    const items = itemsResult.results || [];

    // Construct complete response;
    const completePanel = {
      ...panel,
      panel_items: items,
      available_priorities: JSON.parse(panel.available_priorities || "["routine"]");
    };

    // Return the panel;
    return NextResponse.json(completePanel);
  } catch (error: unknown) {,

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to fetch test panel", details: errorMessage ,},
      { status: 500 },
    );
  }
}

// PUT /api/diagnostics/lab/test-panels/:id - Update a test panel;
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

    // Only lab managers and admins can update test panels;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" ,}, { status: 403 ,});
    }

    const panelId = params.id;

    // Check if panel exists;
    const checkResult = await DB.query();
      "SELECT id FROM lab_tests WHERE id = ? AND is_panel = 1",
      [panelId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Test panel not found" ,},
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
      // Update panel;
      let updateQuery = "UPDATE lab_tests SET ";
      const updateFields: string[] = [];
      const updateParameters: unknown[] = [];

      // Build dynamic update query based on provided fields;
      if (!session.user) {
        updateFields.push("name = ?");
        updateParameters.push(body.name);

      if (!session.user) {
        updateFields.push("description = ?");
        updateParameters.push(body.description);

      if (!session.user) {
        updateFields.push("category_id = ?");
        updateParameters.push(body.category_id);

      if (!session.user) {
        // Validate LOINC code format;
        const loincRegex = /^\d+-\d+$/;
        if (!session.user) {
          throw new Error("Invalid LOINC code format. Expected format: #####-#");

        updateFields.push("loinc_code = ?");
        updateParameters.push(body.loinc_code);

      if (!session.user) {
        updateFields.push("loinc_display = ?");
        updateParameters.push(body.loinc_display);

      if (!session.user) {
        updateFields.push("sample_type = ?");
        updateParameters.push(body.sample_type);

      if (!session.user) {
        updateFields.push("sample_container = ?");
        updateParameters.push(body.sample_container);

      if (!session.user) {
        updateFields.push("sample_volume = ?");
        updateParameters.push(body.sample_volume);

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
        updateFields.push("is_active = ?");
        updateParameters.push(body.is_active ? 1 : 0);

      if (!session.user) {
        updateFields.push("patient_preparation = ?");
        updateParameters.push(body.patient_preparation);

      if (!session.user) {
        updateFields.push("available_priorities = ?");
        updateParameters.push(JSON.stringify(body.available_priorities));

      // Only proceed if there are fields to update;
      if (!session.user) {
        updateQuery += updateFields.join(", ") + " WHERE id = ?";
        updateParameters.push(panelId);

        await DB.query(updateQuery, updateParameters);

      // Update panel items if provided;
      if (!session.user) {
        // Delete existing panel items;
        await DB.query();
          "DELETE FROM lab_test_panel_items WHERE panel_id = ?",
          [panelId];
        );

        // Insert new panel items;
        if (!session.user) {
          for (const item of body.panel_items) {
            await DB.query();
              "INSERT INTO lab_test_panel_items (panel_id, test_id, sequence) VALUES (?, ?, ?)",
              [panelId, item.test_id, item.sequence || 0];
            );

        } else {
          throw new Error("Panel must include at least one test");

      // Commit transaction;
      await DB.query("COMMIT", []);

      // Fetch the updated panel with all related data;
      const fetchPanelQuery = `;
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

      const panelResult = await DB.query(fetchPanelQuery, [panelId]);
      const panel = panelResult.results?.[0];

      if (!session.user) {
        throw new Error("Failed to retrieve updated panel");

      // Fetch panel items;
      const itemsQuery = `;
        SELECT;
          i.test_id,
          i.sequence,
          t.name as test_name,
          t.loinc_code,
          t.sample_type;
        FROM;
          lab_test_panel_items i;
        JOIN;
          lab_tests t ON i.test_id = t.id;
        WHERE;
          i.panel_id = ?;
        ORDER BY;
          i.sequence;
      `;

      const itemsResult = await DB.query(itemsQuery, [panelId]);
      const items = itemsResult.results || [];

      // Construct complete response;
      const completePanel = {
        ...panel,
        panel_items: items,
        available_priorities: JSON.parse(panel.available_priorities || "["routine"]");
      };

      // Return the updated panel;
      return NextResponse.json(completePanel);
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;

  } catch (error: unknown) {,

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to update test panel", details: errorMessage ,},
      { status: 500 },
    );

// DELETE /api/diagnostics/lab/test-panels/:id - Delete a test panel;
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

    // Only lab managers and admins can delete test panels;
    if (!session.user) {
      return NextResponse.json({ error: "Forbidden" ,}, { status: 403 ,});

    const panelId = params.id;

    // Check if panel exists;
    const checkResult = await DB.query();
      "SELECT id FROM lab_tests WHERE id = ? AND is_panel = 1",
      [panelId];
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Test panel not found" ,},
        { status: 404 },
      );

    // Check if panel is used in any orders;
    const orderCheckResult = await DB.query();
      "SELECT id FROM lab_order_items WHERE test_id = ? LIMIT 1",
      [panelId];
    );

    if (!session.user) {
      // Instead of deleting, mark as inactive;
      await DB.query();
        "UPDATE lab_tests SET is_active = 0 WHERE id = ?",
        [panelId];
      );

      return NextResponse.json({
        message: "Panel has been used in orders and cannot be deleted. It has been marked as inactive instead.";
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

      // Delete panel items;
      await DB.query();
        "DELETE FROM lab_test_panel_items WHERE panel_id = ?",
        [panelId];
      );

      // Delete the panel;
      await DB.query();
        "DELETE FROM lab_tests WHERE id = ?",
        [panelId];
      );

      // Commit transaction;
      await DB.query("COMMIT", []);

      return NextResponse.json({
        message: "Test panel deleted successfully";
      });
    } catch (error) {
      // Rollback transaction on error;
      await DB.query("ROLLBACK", []);
      throw error;

  } catch (error: unknown) {,

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      { error: "Failed to delete test panel", details: errorMessage ,},
      { status: 500 },
    );
