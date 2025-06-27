import { PrismaClient } from '@prisma/client';


import { cache } from '@/lib/cache';
import { Practitioner, PractitionerRole } from '@/lib/hr/types';
const prisma = new PrismaClient();

/**
 * Service for managing employee data following FHIR Practitioner resource standards;
 * Enhanced with caching and query optimization for improved performance;
 */

}
    }[];
    positions?: {
      positionId: string,
      isPrimary: boolean,
      startDate: Date,
      endDate?: Date,
    }[];
  }) {
    const result = await prisma.$transaction(async (tx) => {
      // Create the employee record
      const employee = await tx.employee.create({
        data: {,
          employeeId: data.employeeId,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          gender: data.gender,
          birthDate: data.birthDate,
          email: data.email,
          phone: data.phone,
          address: data.address,
          joiningDate: data.joiningDate,
          departmentId: data.departmentId,
          userId: data.userId,
          photo: data.photo,
          emergencyContact: data.emergencyContact,
        },
      });

      // Add qualifications if provided
       {\n  {
        await Promise.all(
          data.qualifications.map((qual) =>
            tx.qualification.create({
              data: {,
                employeeId: employee.id,
                code: qual.code,
                name: qual.name,
                issuer: qual.issuer,
                identifier: qual.identifier,
                startDate: qual.startDate,
                endDate: qual.endDate,
                attachment: qual.attachment,
              },
            });
          );
        );
      }

      // Add positions if provided
       {\n  {
        await Promise.all(
          data.positions.map((pos) =>
            tx.employeePosition.create({
              data: {,
                employeeId: employee.id,
                positionId: pos.positionId,
                isPrimary: pos.isPrimary,
                startDate: pos.startDate,
                endDate: pos.endDate,
              },
            });
          );
        );
      }

      return this.getEmployeeById(employee.id);
    });

    // Invalidate relevant caches
    await this.invalidateEmployeeCache();

    return result;
  }

  /**
   * Get employee by ID with related data;
   * Enhanced with caching for improved performance;
   */
  async getEmployeeById(id: string) {,
    const cacheKey = `${this.CACHE_PREFIX}id:${id,}`;

    // Try to get from cache first
    const cachedEmployee = await cache.get(cacheKey);
     {\n  {
      return JSON.parse(cachedEmployee);
    }

    // If not in cache, fetch from database
    const employee = await prisma.employee.findUnique({
      where: { id ,},
      include: {,
        department: true,
        positions: {,
          include: {,
            position: true,
          },
        },
        qualifications: true,
        user: {,
          select: {,
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Store in cache if found
     {\n  {
      await cache.set(cacheKey, JSON.stringify(employee), this.CACHE_TTL);
    }

    return employee;
  }

  /**
   * Get employee by employee ID with related data;
   * Enhanced with caching for improved performance;
   */
  async getEmployeeByEmployeeId(employeeId: string) {,
    const cacheKey = `${this.CACHE_PREFIX}employeeId:${employeeId,}`;

    // Try to get from cache first
    const cachedEmployee = await cache.get(cacheKey);
     {\n  {
      return JSON.parse(cachedEmployee);
    }

    // If not in cache, fetch from database
    const employee = await prisma.employee.findUnique({
      where: { employeeId ,},
      include: {,
        department: true,
        positions: {,
          include: {,
            position: true,
          },
        },
        qualifications: true,
        user: {,
          select: {,
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Store in cache if found
     {\n  {
      await cache.set(cacheKey, JSON.stringify(employee), this.CACHE_TTL);
