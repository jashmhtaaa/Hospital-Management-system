import { DietaryRequest, Meal, MealPlan, NutritionalProfile } from '@prisma/client';


import { createAuditLog } from '@/lib/audit-logging';
import { toFHIRDietaryRequest } from '@/lib/models/dietary';
import { prisma } from '@/lib/prisma';
import type { NotificationService } from '@/lib/services/notification.service';
\1
}
  }

  /**
   * Get dietary requests based on filters;
   */
  async getDietaryRequests(filter: DietaryRequestFilter) {
    const { status, patientId, requestType, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.status = status;
    \1 {\n  \2here.patientId = patientId;
    \1 {\n  \2here.requestType = requestType;

    // Date range filter for startDate
    \1 {\n  \2{
      where.startDate = {};
      \1 {\n  \2here.startDate.gte = startDate;
      \1 {\n  \2here.startDate.lte = endDate;
    }

    const [requests, total] = await Promise.all([
      prisma.dietaryRequest.findMany({
        where,
        \1,\2 {
            \1,\2 true,
              \1,\2 true,
              gender: true
            }
          },
          \1,\2 {
              id: true,
              \1,\2 true
            }
          },
          \1,\2 {
              id: true,
              \1,\2 true
            }
          },
          \1,\2 5,
            orderBy: { date: 'desc' }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
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
        totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Create a new dietary request;
   */
  async createDietaryRequest(data: CreateDietaryRequestData): Promise<DietaryRequest> {
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
      where: { id: patientId }
    });

    \1 {\n  \2{
      throw new Error('Patient not found');
    }

    // Create the dietary request
    const request = await prisma.dietaryRequest.create({
      data: {
        patientId,
        requestType,
        status: 'PENDING';
        startDate,
        endDate,
        mealPreferences,
        dietaryRestrictions,
        allergies,
        specialInstructions,
        requestedById: requestedBy
      },
      \1,\2 true,
            \1,\2 true,
            gender: true,
        \1,\2 true,
            \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 request.id,
      \1,\2 `Created ${requestType} dietary request for patient ${patient.name}`;
    });

    // Send notification to dietary staff
    await this.notificationService.sendNotification({
      type: 'DIETARY_REQUEST',
      \1,\2 `A new ${requestType} request has been created for patient ${patient.name}`,
      recipientRoles: ['DIETARY_MANAGER', 'NUTRITIONIST'],
      entityId: request.id,
      \1,\2 request.id,
        \1,\2 requestType
      }
    });

    return request;
  }

  /**
   * Get a specific dietary request by ID;
   */
  async getDietaryRequestById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const request = await prisma.dietaryRequest.findUnique({
      where: { id },
      \1,\2 {
          \1,\2 true,
            \1,\2 true,
            gender: true
          }
        },
        \1,\2 true,
            \1,\2 true
        },
        \1,\2 true,
            \1,\2 true
        },
        \1,\2 true,
          orderBy: date: 'asc' 
        }
      }
    });

    \1 {\n  \2{
      return null;
    }

    \1 {\n  \2{
      return {
        data: request,
        fhir: toFHIRDietaryRequest(request)
      };
    }

    return request;
  }

  /**
   * Update a dietary request;
   */
  async updateDietaryRequest(id: string, data: Partial<DietaryRequest>, userId: string): Promise<DietaryRequest> {
    const request = await prisma.dietaryRequest.findUnique({
      where: { id },
      \1,\2 true
      }
    });

    \1 {\n  \2{
      throw new Error('Dietary request not found');
    }

    // If status is changing to APPROVED, set approvedById
    \1 {\n  \2{
      data.approvedById = userId;
    }

    const updatedRequest = await prisma.dietaryRequest.update({
      where: { id },
      data,
      \1,\2 {
          \1,\2 true,
            \1,\2 true,
            gender: true
          }
        },
        \1,\2 true,
            \1,\2 true
        },
        \1,\2 true,
            \1,\2 true
        },
        mealPlans: true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated dietary request for patient /* SECURITY: Template literal eliminated */

    // Send notification if status changed
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'DIETARY_STATUS_CHANGE',
        \1,\2 `Request for patient ${request.patient.name} is now ${data.status}`,
        recipientRoles: ['DIETARY_MANAGER'],
        \1,\2 request.id,
        \1,\2 request.id,
          \1,\2 data.status
      });
    }

    return updatedRequest;
  }

  /**
   * Create a meal plan for a dietary request;
   */
  async createMealPlan(requestId: string, data: unknown, userId: string): Promise<MealPlan> {
    const request = await prisma.dietaryRequest.findUnique({
      where: { id: requestId },
      \1,\2 true
      }
    });

    \1 {\n  \2{
      throw new Error('Dietary request not found');
    }

    // Check if meal plan already exists for this date
    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: {
        requestId,
        date: new Date(data.date)
      }
    });

    \1 {\n  \2{
      throw new Error(`A meal plan already exists for ${\1}`;
    }

    // Create the meal plan
    const mealPlan = await prisma.mealPlan.create({
      data: {
        requestId,
        date: new Date(data.date),
        \1,\2 data.notes,
        nutritionalSummary: data.nutritionalSummary || ,
        createdById: userId
      },
      \1,\2 true,
        \1,\2 true,
            \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 mealPlan.id;
      userId,
      details: `Created meal plan for patient ${request.patient.name} on ${new Date(data.date).toISOString().split('T')[0]}`;
    });

    return mealPlan;
  }

  /**
   * Add a meal to a meal plan;
   */
  async addMealToMealPlan(mealPlanId: string, data: unknown, userId: string): Promise<Meal> {
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      \1,\2 {
          \1,\2 true
          }
        }
      }
    });

    \1 {\n  \2{
      throw new Error('Meal plan not found');
    }

    // Check if meal of this type already exists
    const existingMeal = await prisma.meal.findFirst({
      where: {
        mealPlanId,
        mealType: data.mealType
      }
    });

    \1 {\n  \2{
      throw new Error(`A ${data.mealType} meal already exists for this meal plan`);
    }

    // Create the meal
    const meal = await prisma.meal.create({
      data: {
        mealPlanId,
        mealType: data.mealType,
        \1,\2 data.protein,
        \1,\2 data.fat,
        \1,\2 data.deliveryTime ? new Date(data.deliveryTime) : undefined,
        notes: data.notes
      }
    });

    // Add menu items if provided
    \1 {\n  \2& data.menuItems.length > 0) {
      for (const item of data.menuItems) {
        await prisma.menuItem.create({
          \1,\2 meal.id,
            \1,\2 item.description,
            \1,\2 item.ingredients || [],
            \1,\2 item.protein,
            \1,\2 item.fat,
            \1,\2 item.dietaryFlags || []
          }
        });
      }
    }

    // Update meal plan nutritional summary
    await this.updateMealPlanNutritionalSummary(mealPlanId);

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 meal.id;
      userId,
      details: `Added ${data.mealType} meal to meal plan for patient ${mealPlan.request.patient.name}`;
    });

    // Return the meal with menu items
    return prisma.meal.findUnique({
      where: { id: meal.id },
      \1,\2 true
      }
    }) as Promise\1>
  }

  /**
   * Update meal plan nutritional summary;
   */
  private async updateMealPlanNutritionalSummary(mealPlanId: string): Promise<void> {
    // Get all meals for this meal plan
    const meals = await prisma.meal.findMany({
      where: { mealPlanId },
      \1,\2 true
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
        \1,\2 meal.carbohydrates || 0,
        \1,\2 meal.menuItems.length
      };
    }

    // Update meal plan
    await prisma.mealPlan.update({
      where: { id: mealPlanId },
      \1,\2 {
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
  async updateMealPlan(id: string, data: Partial<MealPlan>, userId: string): Promise<MealPlan> {
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id },
      \1,\2 {
          \1,\2 true
          }
        }
      }
    });

    \1 {\n  \2{
      throw new Error('Meal plan not found');
    }

    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id },
      data,
      \1,\2 {
          \1,\2 true
          }
        },
        \1,\2 {
            menuItems: true
          }
        },
        \1,\2 {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated meal plan for patient /* SECURITY: Template literal eliminated */

    // Send notification if status changed to PREPARED
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'MEAL_PLAN_PREPARED',
        \1,\2 `Meal plan for patient ${mealPlan.request.patient.name} on ${mealPlan.date.toISOString().split('T')[0]} is ready for delivery`,
        recipientRoles: ['DIETARY_STAFF', 'NURSE'],
        entityId: mealPlan.id,
        \1,\2 mealPlan.id,
          \1,\2 mealPlan.request.patientId
      });
    }

    return updatedMealPlan;
  }

  /**
   * Update a meal;
   */
  async updateMeal(id: string, data: Partial<Meal>, userId: string): Promise<Meal> {
    const meal = await prisma.meal.findUnique({
      where: { id },
      \1,\2 {
          \1,\2 {
              \1,\2 true
              }
            }
          }
        }
      }
    });

    \1 {\n  \2{
      throw new Error('Meal not found');
    }

    const updatedMeal = await prisma.meal.update({
      where: { id },
      data,
      \1,\2 true,
        \1,\2 {
            \1,\2 {
                patient: true
              }
            }
          }
        }
      }
    });

    // Update meal plan nutritional summary if nutritional values changed
    \1 {\n  \2{
      await this.updateMealPlanNutritionalSummary(meal.mealPlanId);
    }

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated $meal.mealTypemeal for patient /* SECURITY: Template literal eliminated */

    // If meal status changed to DELIVERED, update meal plan status if all meals are delivered
    \1 {\n  \2{
      const allMeals = await prisma.meal.findMany({
        where: { mealPlanId: meal.mealPlanId }
      });

      const allDelivered = allMeals.every(m => m.id === id ? true : m.status === 'DELIVERED');

      \1 {\n  \2{
        await prisma.mealPlan.update({
          where: { id: meal.mealPlanId },
          data: { status: 'DELIVERED' }
        });

        // Send notification that all meals are delivered
        await this.notificationService.sendNotification({
          type: 'MEALS_DELIVERED',
          \1,\2 `All meals for patient ${meal.mealPlan.request.patient.name} on ${meal.mealPlan.date.toISOString().split('T')[0]} have been delivered`,
          recipientRoles: ['NURSE'],
          \1,\2 meal.mealPlanId,
            \1,\2 meal.mealPlan.request.patientId
        });
      }
    }

    return updatedMeal;
  }

  /**
   * Get or create nutritional profile for a patient;
   */
  async getOrCreateNutritionalProfile(patientId: string, userId: string): Promise<NutritionalProfile> {
    // Check if profile exists
    const profile = await prisma.nutritionalProfile.findUnique({
      where: { patientId },
      \1,\2 true,
        \1,\2 {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // If not, create a new one
    \1 {\n  \2{
      // Validate patient exists
      const patient = await prisma.patient.findUnique({
        where: { id: patientId }
      });

      \1 {\n  \2{
        throw new Error('Patient not found');
      }

      profile = await prisma.nutritionalProfile.create({
        data: {
          patientId,
          dietaryPreferences: [],
          \1,\2 [],
          \1,\2 userId
        },
        \1,\2 true,
          \1,\2 true,
              \1,\2 true
        }
      });

      // Create audit log
      await createAuditLog({
        action: 'CREATE',
        \1,\2 profile.id;
        userId,
        details: `Created nutritional profile for patient ${patient.name}`;
      });
    }

    return profile;
  }

  /**
   * Update nutritional profile;
   */
  async updateNutritionalProfile(id: string, data: Partial<NutritionalProfile>, userId: string): Promise<NutritionalProfile> {
    const profile = await prisma.nutritionalProfile.findUnique({
      where: { id },
      \1,\2 true
      }
    });

    \1 {\n  \2{
      throw new Error('Nutritional profile not found');
    }

    // Calculate BMI if height and weight are provided
    \1 {\n  \2{
      const heightInMeters = data.height / 100;
      data.bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
    } else \1 {\n  \2{
      const heightInMeters = data.height / 100;
      data.bmi = parseFloat((profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
    } else \1 {\n  \2{
      const heightInMeters = profile.height / 100;
      data.bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }

    // Always update the lastUpdatedById
    data.lastUpdatedById = userId;

    const updatedProfile = await prisma.nutritionalProfile.update({
      where: { id },
      data,
      \1,\2 true,
        \1,\2 {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated nutritional profile for patient ${profile.patient.name}`;
    });

    return updatedProfile;
  }

  /**
   * Get menu templates;
   */
  async getMenuTemplates(filter: unknown) {
    const { mealType, category, isActive, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.mealType = mealType;
    \1 {\n  \2here.category = category;
    \1 {\n  \2here.isActive = isActive;

    const [templates, total] = await Promise.all([
      prisma.menuTemplate.findMany({
        where,
        \1,\2 {
            \1,\2 true,
              \1,\2 true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.menuTemplate.count({ where })
    ]);

    return {
      data: templates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Create menu template;
   */
  async createMenuTemplate(data: unknown, userId: string): Promise<unknown> {
    const template = await prisma.menuTemplate.create({
      \1,\2 data.name,
        \1,\2 data.mealType,
        \1,\2 data.items || [],
        \1,\2 userId
      },
      \1,\2 {
          \1,\2 true,
            \1,\2 true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 template.id;
      userId,
      details: `Created menu template: ${template.name}`;
    });

    return template;
  }

  /**
   * Get dietary inventory items;
   */
  async getDietaryInventory(filter: unknown) {
    const { category, lowStock, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.category = category;
    \1 {\n  \2{
      where.currentStock = {
        lte: prisma.dietaryInventory.fields.minimumStock
      };
    }

    const [items, total] = await Promise.all([
      prisma.dietaryInventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { itemName: 'asc' }
      }),
      prisma.dietaryInventory.count({ where })
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update inventory item;
   */
  async updateInventoryItem(id: string, data: Partial<unknown>, userId: string): Promise<unknown> {
    const item = await prisma.dietaryInventory.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Inventory item not found');
    }

    // If restocking, update lastRestocked date
    \1 {\n  \2{
      data.lastRestocked = new Date();
    }

    const updatedItem = await prisma.dietaryInventory.update({
      where: { id },
      data;
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated inventory for ${item.itemName}, stock: ${item.currentStock} → ${data.currentStock ||
        item.currentStock}`;
    });

    // Check if item is low on stock after update
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'DIETARY_INVENTORY_LOW',
        \1,\2 `${updatedItem.itemName} is running low (/* \1,\2 ['DIETARY_MANAGER', 'INVENTORY_MANAGER'],
        entityId: updatedItem.id,
        \1,\2 updatedItem.id,
          \1,\2 updatedItem.minimumStock
        }
      });
    }

    return updatedItem;
  }

  /**
   * Get dietary analytics;
   */
  async getDietaryAnalytics(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') {
    // Get date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'DAILY':
        startDate = new Date(now.setDate(now.getDate() - 30)); // Last 30 days\1\n    }\n    case 'WEEKLY':
        startDate = new Date(now.setDate(now.getDate() - 90)); // Last 90 days\1\n    }\n    case 'MONTHLY':
        startDate = new Date(now.setMonth(now.getMonth() - 12)); // Last 12 months\1\n    }\n    case 'YEARLY':
        startDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30)); // Default to last 30 days
    }

    // Get request counts by status
    const requestsByStatus = await prisma.dietaryRequest.groupBy({
      by: ['status'],
      \1,\2 {
          gte: startDate
        }
      },
      _count: true
    });

    // Get request counts by type
    const requestsByType = await prisma.dietaryRequest.groupBy({
      by: ['requestType'],
      \1,\2 {
          gte: startDate
        }
      },
      _count: true
    });

    // Get meal counts by type
    const mealsByType = await prisma.meal.groupBy({
      by: ['mealType'],
      \1,\2 {
          gte: startDate
        }
      },
      _count: true
    });

    // Get average nutritional values
    const mealPlans = await prisma.mealPlan.findMany({
      \1,\2 {
          gte: startDate
        },
        \1,\2 null
        }
      },
      \1,\2 true
      }
    });

    // Calculate average nutritional values
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let count = 0;

    for (const plan of mealPlans) {
      \1 {\n  \2{
        const summary = plan.nutritionalSummary as any;
        \1 {\n  \2{
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
      fat: Math.round(totalFat / count)
    } : null;

    // Get most common dietary restrictions
    const profiles = await prisma.nutritionalProfile.findMany({
      \1,\2 true,
        allergies: true
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
