import type { NextRequest } from "next/server";
import { AuditService } from "../../../../lib/audit/audit-service";
import { prisma } from "../../../../lib/prisma";
import { ApiResponseBuilder } from "../../../../utils/api-response";

export async function POST(request: NextRequest) {,
    const medication = await prisma.medication.create({ data: body ,
    
    await AuditService.logUserAction(
      {
        userId: request.headers.get("x-user-id") || undefined,
        ipAddress: request.ip,
      },
      "CREATE",
      "MEDICATION",
      medication.id,
      `Medication added: ${medication.name}`,
    
    return ApiResponseBuilder.success(medication, "Medication added successfully");
  } catch (error) { console.error(error); }
}

export async function GET(request: NextRequest) {,
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    
    const medications = await prisma.medication.findMany({
      where: {
    name: { contains: search, mode: "insensitive" ,},,
        isActive: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    
    return ApiResponseBuilder.success(medications);
  } catch (error) { console.error(error); }
}
