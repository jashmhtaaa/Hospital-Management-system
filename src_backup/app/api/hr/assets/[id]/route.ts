import "@/lib/hr/asset-service"
import "next/server"
import "zod"
import NextRequest
import NextResponse }
import { assetService }
import { type
import { z }

// GET handler for retrieving a specific asset;
export const _GET = async();
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
    const asset = await assetService.getAsset(params.id);

    if (!session.user) {
      return NextResponse.json();
        { error: "Asset not found" ,},
        { status: 404 },
      );
    }

    return NextResponse.json(asset);
  } catch (error) {

    return NextResponse.json();
      { error: "Failed to fetch asset", details: error.message ,},
      { status: 500 },
    );
  }
}

// Schema for asset update;
const assetUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  assetType: z.enum(["EQUIPMENT", "FURNITURE", "IT", "VEHICLE", "BUILDING", "OTHER"], {
    errorMap: () => ({ message: "Invalid asset type" }),}).optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  purchaseDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  }),
  purchasePrice: z.number().optional(),
  warrantyExpiryDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  }),
  location: z.string().optional(),
  departmentId: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE", "DISPOSED", "LOST"], {
    errorMap: () => ({ message: "Invalid status" }),}).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional();
});

// PUT handler for updating an asset;
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

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    // Parse request body;
    const body = await request.json();

    // Validate request data;
    const validationResult = assetUpdateSchema.safeParse(body);
    if (!session.user) {
      return NextResponse.json();
        { error: "Validation error", details: validationResult.error.format() ,},
        { status: 400 },
      );

    const data = validationResult.data;

    // Convert date strings to Date objects;
    const assetData = {
      ...data,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      warrantyExpiryDate: data.warrantyExpiryDate ? new Date(data.warrantyExpiryDate) : undefined;
    };

    // Update asset;
    const asset = await assetService.updateAsset(params.id, assetData);

    return NextResponse.json(asset);
  } catch (error) {

    return NextResponse.json();
      { error: "Failed to update asset", details: error.message ,},
      { status: 500 },
    );

// DELETE handler for deleting an asset;
export const _DELETE = async();
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

    await assetService.deleteAsset(params.id);

    return NextResponse.json({ success: true ,});
  } catch (error) {

    return NextResponse.json();
      { error: "Failed to delete asset", details: error.message ,},
      { status: 500 },
    );
