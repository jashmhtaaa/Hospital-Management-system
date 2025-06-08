// apps/hms-web/src/app/api/pharmacy-management/medications/route.ts
import { NextRequest } from 'next/server';
import { ApiResponseBuilder, PaginationBuilder } from '@/utils/api-response';
import { prisma } from '@/lib/prisma';
import { AuditService } from '@/lib/audit/audit-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const medicationData = body;
    
    const medication = await prisma.medication.create({
      data: medicationData
    });
    
    await AuditService.logUserAction(
      {
        userId: request.headers.get('x-user-id') || undefined,
        ipAddress: request.ip
      },
      'CREATE',
      'MEDICATION',
      medication.id,
      `Medication added: ${medication.name}`
    );
    
    return ApiResponseBuilder.success(medication, 'Medication added successfully');
    
  } catch (error) {
    return ApiResponseBuilder.internalError(error.message);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const lowStock = searchParams.get('lowStock') === 'true';
    
    const { skip, take, orderBy } = PaginationBuilder.buildPrismaArgs({ page, limit });
    
    const where: any = { isActive: true };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) where.category = category;
    
    if (lowStock) {
      where.currentStock = { lte: { minimumStock: true } };
    }
    
    const [medications, total] = await Promise.all([
      prisma.medication.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.medication.count({ where })
    ]);
    
    const meta = PaginationBuilder.buildMeta(total, page, limit);
    
    return ApiResponseBuilder.success(medications, 'Medications retrieved successfully', meta);
    
  } catch (error) {
    return ApiResponseBuilder.internalError(error.message);
  }
}
