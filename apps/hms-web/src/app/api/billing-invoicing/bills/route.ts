// apps/hms-web/src/app/api/billing-invoicing/bills/route.ts
import { NextRequest } from 'next/server';
import { ApiResponseBuilder, PaginationBuilder } from '@/utils/api-response';
import { prisma } from '@/lib/prisma';
import { AuditService } from '@/lib/audit/audit-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, items, discountAmount = 0, notes } = body;
    
    // Calculate total
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0);
    const totalAmount = subtotal - discountAmount;
    
    // Generate bill number
    const lastBill = await prisma.bill.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { billNumber: true }
    });
    
    const nextBillNumber = lastBill ? 
      parseInt(lastBill.billNumber.substring(4)) + 1 : 1001;
    const billNumber = `BILL${nextBillNumber.toString().padStart(6, '0')}`;
    
    const bill = await prisma.bill.create({
      data: {
        billNumber,
        patientId,
        subtotal,
        discountAmount,
        totalAmount,
        status: 'PENDING',
        items,
        notes
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            mrn: true
          }
        }
      }
    });
    
    await AuditService.logUserAction(
      {
        userId: request.headers.get('x-user-id') || undefined,
        ipAddress: request.ip
      },
      'CREATE',
      'BILL',
      bill.id,
      `Bill generated: ${billNumber} - Amount: ${totalAmount}`
    );
    
    return ApiResponseBuilder.success(bill, 'Bill generated successfully');
    
  } catch (error) {
    return ApiResponseBuilder.internalError(error.message);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');
    
    const { skip, take, orderBy } = PaginationBuilder.buildPrismaArgs({ page, limit });
    
    const where: any = {};
    if (status) where.status = status;
    if (patientId) where.patientId = patientId;
    
    const [bills, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
              mrn: true
            }
          }
        }
      }),
      prisma.bill.count({ where })
    ]);
    
    const meta = PaginationBuilder.buildMeta(total, page, limit);
    
    return ApiResponseBuilder.success(bills, 'Bills retrieved successfully', meta);
    
  } catch (error) {
    return ApiResponseBuilder.internalError(error.message);
  }
}
