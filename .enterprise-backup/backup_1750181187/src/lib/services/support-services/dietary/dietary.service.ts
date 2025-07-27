import { DietaryRequest, Meal, MealPlan, NutritionalProfile } from '@prisma/client';


import { createAuditLog } from '@/lib/audit-logging';
import { toFHIRDietaryRequest } from '@/lib/models/dietary';
import { prisma } from '@/lib/prisma';
import type { NotificationService } from '@/lib/services/notification.service';

}
  }

  /**
   * Get dietary requests based on filters;
   */
  async getDietaryRequests(filter: DietaryRequestFilter) {,
    const { status, patientId, requestType, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {,};
     {\n  here.status = status;
     {\n  here.patientId = patientId;
     {\n  here.requestType = requestType;

    // Date range filter for startDate
     {\n  {
      where.startDate = {};
       {\n  here.startDate.gte = startDate;
       {\n  here.startDate.lte = endDate;
    }

    const [requests, total] = await Promise.all([
      prisma.dietaryRequest.findMany({
        where,
        include: {,
          patient: {,
            select: {,
              id: true,
               true,
              gender: true,
            }
          },
          requestedByUser: {,
            select: {,
              id: true,
               true
            }
          },
          approvedByUser: {,
            select: {,
              id: true,
               true
            }
          },
          mealPlans: {,
            take: 5,
            orderBy: { date: 'desc' },
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.dietaryRequest.count(where )
    ]);

    // Convert to FHIR format
    const fhirRequests = requests.map(request => toFHIRDietaryRequest(request));

    return {
      data: requests,
      fhir: fhirRequests;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create a new dietary request;
   */
  async createDietaryRequest(data: CreateDietaryRequestData): Promise<DietaryRequest> {,
    const {
      patientId,
      requestType,
      startDate,
      endDate,
      mealPreferences,
      dietaryRestrictions,
      allergies,
      specialInstructions,
      requestedBy;
    } = data;

    // Validate patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

     {\n  {
      throw new Error('Patient not found');
    }

    // Create the dietary request
    const request = await prisma.dietaryRequest.create({
      data: {,
        patientId,
        requestType,
        status: 'PENDING';
        startDate,
        endDate,
        mealPreferences,
        dietaryRestrictions,
        allergies,
        specialInstructions,
        requestedById: requestedBy,
      },
      include: {,
            id: true,
             true,
            gender: true,
        requestedByUser: ,
            id: true,
             true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
       request.id,
       `Created ${requestType} dietary request for patient ${patient.name}`;
    });

    // Send notification to dietary staff
    await this.notificationService.sendNotification({
      type: 'DIETARY_REQUEST',
       `A new ${requestType} request has been created for patient ${patient.name}`,
      recipientRoles: ['DIETARY_MANAGER', 'NUTRITIONIST'],
      entityId: request.id,
      metadata: {,
        requestId: request.id,
         requestType
      }
    });

    return request;
  }

  /**
   * Get a specific dietary request by ID;
   */
  async getDietaryRequestById(id: string, includeFHIR: boolean = false): Promise<unknown> {,
    const request = await prisma.dietaryRequest.findUnique({
      where: { id ,},
      include: {,
        patient: {,
          select: {,
            id: true,
             true,
            gender: true,
          }
        },
        requestedByUser: {,
            id: true,
             true
        },
        approvedByUser: {,
            id: true,
             true
        },
        mealPlans: {,
                menuItems: true,
          orderBy: date: 'asc' ,
        }
      }
    });

     {\n  {
      return null;
    }

     {\n  {
      return {
        data: request,
        fhir: toFHIRDietaryRequest(request),
      };
    }

    return request;
  }

  /**
   * Update a dietary request;
   */
  async updateDietaryRequest(id: string, data: Partial<DietaryRequest>, userId: string): Promise<DietaryRequest> {,
    const request = await prisma.dietaryRequest.findUnique({
      where: { id ,},
      include: {,
        patient: true,
      }
    });

     {\n  {
      throw new Error('Dietary request not found');
    }

    // If status is changing to APPROVED, set approvedById
     {\n  {
      data.approvedById = userId;
    }

    const updatedRequest = await prisma.dietaryRequest.update({
      where: { id ,},
      data,
      include: {,
        patient: {,
          select: {,
            id: true,
             true,
            gender: true,
          }
        },
        requestedByUser: {,
            id: true,
             true
        },
        approvedByUser: {,
            id: true,
             true
        },
        mealPlans: true,
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       id;
      userId,
      details: `Updated dietary request for patient /* SECURITY: Template literal eliminated */,

    // Send notification if status changed
     {\n  {
      await this.notificationService.sendNotification({
        type: 'DIETARY_STATUS_CHANGE',
         `Request for patient ${request.patient.name} is now ${data.status}`,
        recipientRoles: ['DIETARY_MANAGER'],
         request.id,
        metadata: ,
          requestId: request.id,
           data.status
      });
    }

    return updatedRequest;
  }

  /**
   * Create a meal plan for a dietary request;
   */
  async createMealPlan(requestId: string, data: unknown, userId: string): Promise<MealPlan> {,
    const request = await prisma.dietaryRequest.findUnique({
      where: { id: requestId ,},
      include: {,
        patient: true,
      }
    });

     {\n  {
      throw new Error('Dietary request not found');
    }

    // Check if meal plan already exists for this date
    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: {,
        requestId,
        date: new Date(data.date),
      }
    });

     {\n  {
      throw new Error(`A meal plan already exists for ${}`;
    }

    // Create the meal plan
    const mealPlan = await prisma.mealPlan.create({
      data: {,
        requestId,
        date: new Date(data.date),
         data.notes,
        nutritionalSummary: data.nutritionalSummary || ,
        createdById: userId,
      },
      include: {,
            patient: true,
        createdByUser: ,
            id: true,
             true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
       mealPlan.id;
      userId,
      details: `Created meal plan for patient ${request.patient.name} on ${new Date(data.date).toISOString().split('T')[0],}`;
    });

    return mealPlan;
  }

  /**
   * Add a meal to a meal plan;
   */
  async addMealToMealPlan(mealPlanId: string, data: unknown, userId: string): Promise<Meal> {,
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId ,},
      include: {,
        request: {,
          include: {,
            patient: true,
          }
        }
      }
    });

     {\n  {
      throw new Error('Meal plan not found');
    }

    // Check if meal of this type already exists
    const existingMeal = await prisma.meal.findFirst({
      where: {,
        mealPlanId,
        mealType: data.mealType,
      }
    });

     {\n  {
      throw new Error(`A ${data.mealType} meal already exists for this meal plan`);
    }

    // Create the meal
    const meal = await prisma.meal.create({
      data: {,
        mealPlanId,
        mealType: data.mealType,
         data.protein,
         data.fat,
         data.deliveryTime ? new Date(data.deliveryTime) : undefined,
        notes: data.notes,
      }
    });

    // Add menu items if provided
     {\n  & data.menuItems.length > 0) {
      for (const item of data.menuItems) {
        await prisma.menuItem.create({
          data: {,
            mealId: meal.id,
             item.description,
             item.ingredients || [],
             item.protein,
             item.fat,
             item.dietaryFlags || []
          }
        });
      }
    }

    // Update meal plan nutritional summary
    await this.updateMealPlanNutritionalSummary(mealPlanId);

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
       meal.id;
      userId,
      details: `Added ${data.mealType} meal to meal plan for patient ${mealPlan.request.patient.name,}`;
    });

    // Return the meal with menu items
    return prisma.meal.findUnique({
      where: { id: meal.id ,},
      include: {,
        menuItems: true,
      }
    }) as Promise<Meal>;
  }

  /**
   * Update meal plan nutritional summary;
   */
  private async updateMealPlanNutritionalSummary(mealPlanId: string): Promise<void> {,
    // Get all meals for this meal plan
    const meals = await prisma.meal.findMany({
      where: { mealPlanId ,},
      include: {,
        menuItems: true,
      }
    });

    // Calculate totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalFat = 0;

    for (const meal of meals) {
      totalCalories += meal.calories || 0;
      totalProtein += meal.protein || 0;
      totalCarbohydrates += meal.carbohydrates || 0;
      totalFat += meal.fat || 0;
    }

    // Create summary by meal type
    const mealSummary: Record<string, unknown> = {};
    for (const meal of meals) {
      mealSummary[meal.mealType] = {
        calories: meal.calories || 0,
         meal.carbohydrates || 0,
         meal.menuItems.length
      };
    }

    // Update meal plan
    await prisma.mealPlan.update({
      where: { id: mealPlanId ,},
      data: {,
        nutritionalSummary: {,
          totalCalories,
          totalProtein,
          totalCarbohydrates,
          totalFat,
          mealSummary;
        }
      }
    });
  }

  /**
   * Update a meal plan;
   */
  async updateMealPlan(id: string, data: Partial<MealPlan>, userId: string): Promise<MealPlan> {,
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id ,},
      include: {,
        request: {,
          include: {,
            patient: true,
          }
        }
      }
    });

     {\n  {
      throw new Error('Meal plan not found');
    }

    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id ,},
      data,
      include: {,
        request: {,
          include: {,
            patient: true,
          }
        },
        meals: {,
          include: {,
            menuItems: true,
          }
        },
        createdByUser: {,
          select: {,
            id: true,
             true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       id;
      userId,
      details: `Updated meal plan for patient /* SECURITY: Template literal eliminated */,

    // Send notification if status changed to PREPARED
     {\n  {
      await this.notificationService.sendNotification({
        type: 'MEAL_PLAN_PREPARED',
         `Meal plan for patient ${mealPlan.request.patient.name} on ${mealPlan.date.toISOString().split('T')[0]} is ready for delivery`,
        recipientRoles: ['DIETARY_STAFF', 'NURSE'],
        entityId: mealPlan.id,
        metadata: ,
          mealPlanId: mealPlan.id,
           mealPlan.request.patientId
      });
    }

    return updatedMealPlan;
  }

  /**
   * Update a meal;
   */
  async updateMeal(id: string, data: Partial<Meal>, userId: string): Promise<Meal> {,
    const meal = await prisma.meal.findUnique({
      where: { id ,},
      include: {,
        mealPlan: {,
          include: {,
            request: {,
              include: {,
                patient: true,
              }
            }
          }
        }
      }
    });

     {\n  {
      throw new Error('Meal not found');
    }

    const updatedMeal = await prisma.meal.update({
      where: { id ,},
      data,
      include: {,
        menuItems: true,
        mealPlan: {,
          include: {,
            request: {,
              include: {,
                patient: true,
              }
            }
          }
        }
      }
    });

    // Update meal plan nutritional summary if nutritional values changed
     {\n  {
      await this.updateMealPlanNutritionalSummary(meal.mealPlanId);
    }

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       id;
      userId,
      details: `Updated $meal.mealTypemeal for patient /* SECURITY: Template literal eliminated */,

    // If meal status changed to DELIVERED, update meal plan status if all meals are delivered
     {\n  {
      const allMeals = await prisma.meal.findMany({
        where: { mealPlanId: meal.mealPlanId },
      });

      const allDelivered = allMeals.every(m => m.id === id ? true : m.status === 'DELIVERED');

       {\n  {
        await prisma.mealPlan.update({
          where: { id: meal.mealPlanId ,},
          data: { status: 'DELIVERED' },
        });

        // Send notification that all meals are delivered
        await this.notificationService.sendNotification({
          type: 'MEALS_DELIVERED',
           `All meals for patient ${meal.mealPlan.request.patient.name} on ${meal.mealPlan.date.toISOString().split('T')[0]} have been delivered`,
          recipientRoles: ['NURSE'],
           meal.mealPlanId,
             meal.mealPlan.request.patientId
        });
      }
    }

    return updatedMeal;
  }

  /**
   * Get or create nutritional profile for a patient;
   */
  async getOrCreateNutritionalProfile(patientId: string, userId: string): Promise<NutritionalProfile> {,
    // Check if profile exists
    const profile = await prisma.nutritionalProfile.findUnique({
      where: { patientId ,},
      include: {,
        patient: true,
        lastUpdatedByUser: {,
          select: {,
            id: true,
             true
          }
        }
      }
    });

    // If not, create a new one
     {\n  {
      // Validate patient exists
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });

       {\n  {
        throw new Error('Patient not found');
      }

      profile = await prisma.nutritionalProfile.create({
        data: {,
          patientId,
          dietaryPreferences: [],
           [],
           userId
        },
        include: {,
          patient: true,
          lastUpdatedByUser: ,
              id: true,
               true
        }
      });

      // Create audit log
      await createAuditLog({
        action: 'CREATE',
         profile.id;
        userId,
        details: `Created nutritional profile for patient ${patient.name,}`;
      });
    }

    return profile;
  }

  /**
   * Update nutritional profile;
   */
  async updateNutritionalProfile(id: string, data: Partial<NutritionalProfile>, userId: string): Promise<NutritionalProfile> {,
    const profile = await prisma.nutritionalProfile.findUnique({
      where: { id ,},
      include: {,
        patient: true,
      }
    });

     {\n  {
      throw new Error('Nutritional profile not found');
    }

    // Calculate BMI if height and weight are provided
     {\n  {
      const heightInMeters = data.height / 100;
      data.bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
    } else  {\n  {
      const heightInMeters = data.height / 100;
      data.bmi = parseFloat((profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
    } else  {\n  {
      const heightInMeters = profile.height / 100;
      data.bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }

    // Always update the lastUpdatedById
    data.lastUpdatedById = userId;

    const updatedProfile = await prisma.nutritionalProfile.update({
      where: { id ,},
      data,
      include: {,
        patient: true,
        lastUpdatedByUser: {,
          select: {,
            id: true,
             true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       id;
      userId,
      details: `Updated nutritional profile for patient ${profile.patient.name,}`;
    });

    return updatedProfile;
  }

  /**
   * Get menu templates;
   */
  async getMenuTemplates(filter: unknown) {,
    const { mealType, category, isActive, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {,};
     {\n  here.mealType = mealType;
     {\n  here.category = category;
     {\n  here.isActive = isActive;

    const [templates, total] = await Promise.all([
      prisma.menuTemplate.findMany({
        where,
        include: {,
          createdByUser: {,
            select: {,
              id: true,
               true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.menuTemplate.count({ where })
    ]);

    return {
      data: templates,
      pagination: {,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Create menu template;
   */
  async createMenuTemplate(data: unknown, userId: string): Promise<unknown> {,
    const template = await prisma.menuTemplate.create({
      data: {,
        name: data.name,
         data.mealType,
         data.items || [],
         userId
      },
      include: {,
        createdByUser: {,
          select: {,
            id: true,
             true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
       template.id;
      userId,
      details: `Created menu template: ${template.name,}`;
    });

    return template;
  }

  /**
   * Get dietary inventory items;
   */
  async getDietaryInventory(filter: unknown) {,
    const { category, lowStock, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {,};
     {\n  here.category = category;
     {\n  {
      where.currentStock = {
        lte: prisma.dietaryInventory.fields.minimumStock,
      };
    }

    const [items, total] = await Promise.all([
      prisma.dietaryInventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { itemName: 'asc' },
      }),
      prisma.dietaryInventory.count({ where })
    ]);

    return {
      data: items,
      pagination: {,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Update inventory item;
   */
  async updateInventoryItem(id: string, data: Partial<unknown>, userId: string): Promise<unknown> {,
    const item = await prisma.dietaryInventory.findUnique({
      where: { id },
    });

     {\n  {
      throw new Error('Inventory item not found');
    }

    // If restocking, update lastRestocked date
     {\n  {
      data.lastRestocked = new Date();
    }

    const updatedItem = await prisma.dietaryInventory.update({
      where: { id ,},
      data;
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       id;
      userId,
      details: `Updated inventory for ${item.itemName,}, stock: ${item.currentStock} → ${data.currentStock ||,
        item.currentStock}`;
    });

    // Check if item is low on stock after update
     {\n  {
      await this.notificationService.sendNotification({
        type: 'DIETARY_INVENTORY_LOW',
         `${updatedItem.itemName} is running low (/* SECURITY: Template literal eliminated */,
        recipientRoles: ['DIETARY_MANAGER', 'INVENTORY_MANAGER'],
        entityId: updatedItem.id,
        metadata: {,
          itemId: updatedItem.id,
           updatedItem.minimumStock
        }
      });
    }

    return updatedItem;
  }

  /**
   * Get dietary analytics;
   */
  async getDietaryAnalytics(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') {,
    // Get date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'DAILY':
        startDate = new Date(now.setDate(now.getDate() - 30)); // Last 30 days\n    }\n    case 'WEEKLY':
        startDate = new Date(now.setDate(now.getDate() - 90)); // Last 90 days\n    }\n    case 'MONTHLY':
        startDate = new Date(now.setMonth(now.getMonth() - 12)); // Last 12 months\n    }\n    case 'YEARLY':
        startDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30)); // Default to last 30 days
    }

    // Get request counts by status
    const requestsByStatus = await prisma.dietaryRequest.groupBy({
      by: ['status'],
      where: {,
        createdAt: {,
          gte: startDate,
        }
      },
      _count: true,
    });

    // Get request counts by type
    const requestsByType = await prisma.dietaryRequest.groupBy({
      by: ['requestType'],
      where: {,
        createdAt: {,
          gte: startDate,
        }
      },
      _count: true,
    });

    // Get meal counts by type
    const mealsByType = await prisma.meal.groupBy({
      by: ['mealType'],
      where: {,
        createdAt: {,
          gte: startDate,
        }
      },
      _count: true,
    });

    // Get average nutritional values
    const mealPlans = await prisma.mealPlan.findMany({
      where: {,
        createdAt: {,
          gte: startDate,
        },
        nutritionalSummary: {,
          not: null,
        }
      },
      select: {,
        nutritionalSummary: true,
      }
    });

    // Calculate average nutritional values
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let count = 0;

    for (const plan of mealPlans) {
       {\n  {
        const summary = plan.nutritionalSummary as any;
         {\n  {
          totalCalories += summary.totalCalories;
          totalProtein += summary.totalProtein || 0;
          totalCarbs += summary.totalCarbohydrates || 0;
          totalFat += summary.totalFat || 0;
          count++;
        }
      }
    }

    const averageNutrition = count > 0 ? {
      calories: Math.round(totalCalories / count),
      protein: Math.round(totalProtein / count),
      carbohydrates: Math.round(totalCarbs / count),
      fat: Math.round(totalFat / count),
    } : null;

    // Get most common dietary restrictions
    const profiles = await prisma.nutritionalProfile.findMany({
      select: {,
        dietaryRestrictions: true,
        allergies: true,
      }
    });

    const restrictionCounts: Record<string, number> = {};
    const allergyCounts: Record<string, number> = {};

    for (const profile of profiles) {
      for (const restriction of profile.dietaryRestrictions) {
        restrictionCounts[restriction] = (restrictionCounts[restriction] || 0) + 1;
      }

      for (const allergy of profile.allergies) {
        allergyCounts[allergy] = (allergyCounts[allergy] || 0) + 1;
      }
    }

    // Sort restrictions and allergies by frequency
    const topRestrictions = Object.entries(restrictionCounts);
      .sort((a, b) => b[1] - a[1]);
      .slice(0, 10);
      .map(([name, count]) => (name, count ));

    const topAllergies = Object.entries(allergyCounts);
      .sort((a, b) => b[1] - a[1]);
      .slice(0, 10);
      .map(([name, count]) => (name, count ));

    return {
      requestsByStatus,
      requestsByType,
      mealsByType,
      averageNutrition,
      topRestrictions,
      topAllergies,
      period
    };
  }
