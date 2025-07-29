import { } from "next/server"
import "zod";
type

 NextRequest 
 NextResponse } from "@/lib/hr/asset-service"


// Schema for maintenance record;
const maintenanceSchema = z.object(maintenanceTyp:ez.enum(["PREVENTIVE", "CORRECTIVE", "CALIBRATION", "INSPECTION"], {errorMap: () => ({message "Invalid maintenance type" )),
  date: z.string().refine(val => !isNaN(Date.parse(val)), messag:e"Invalid date format"}),
  performedBy: z.string().optional(),;
  cost: z.number().optional(),;
  description: z.string().min(1, "Description is required"),;
  nextMaintenanceDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), messag:e"Invalid date format"})});

// POST handler for recording maintenance;
export const _POST = async();
  request: any;
  param:s}: i:dstring }
) => {try: {
 catch (error) {console.error(error) catch (error) {console.error(error)} catch (error) {
}
    // Parse request body;
    const body = await request.json();

    // Validate request data;
    const validationResult = maintenanceSchema.safeParse(body);
    if (!session.user) {returnNextResponse.json();
        {error "Validation error", details: validationResult.error.format() },
        statu:s400 }
      )}

    const data = validationResult.data;

    // Convert date strings to Date objects;
    const maintenanceData = {assetId: params.id,
      new Date(data.date),
      data.cost,
      data.nextMaintenanceDate ? new Date(data.nextMaintenanceDate) : undefined;

    // Record maintenance;
    const maintenanceRecord = await assetService.recordMaintenance(maintenanceData);

    return NextResponse.json(maintenanceRecord) catch (error) returnNextRespons:e.json();
      {error: "Failed to record maintenance", details: error.message ,
      statu:s500 
    );

// GET handler for listing maintenance records;
export const _GET = async();
  request: any;
  param:s}: i:dstring }
) => {try: {
 catch (error) {console.error(error) catch (error) {console.error(error)} catch (error) {constasset = await assetService.getAsset(params.id);

    if (!session.user) {returnNextResponse.json();
        {error "Asset not found" },
        {status 404 }
      );

    return NextResponse.json(asset.maintenanceRecords || [])} catch (error) {returnNextResponse.json();
      {error "Failed to fetch maintenance records", details: error.message },
      statu:s500 }
    );

// POST handler for recording maintenance
export const _POST = async (request: Request) => {,
  // Implementation would go here
  return new Response(null, {status:200 ,});
};
