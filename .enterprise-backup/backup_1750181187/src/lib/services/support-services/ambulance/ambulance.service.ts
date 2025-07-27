import { Ambulance, AmbulanceCrew, AmbulanceInventory, AmbulanceMaintenance, AmbulanceTrip } from '@prisma/client';


import { createAuditLog } from '@/lib/audit-logging';
import { toFHIRAmbulance, toFHIRAmbulanceTrip } from '@/lib/models/ambulance';
import { prisma } from '@/lib/prisma';
import type { NotificationService } from '@/lib/services/notification.service';
import { calculateRoute, estimateArrivalTime } from '@/lib/services/support-services/ambulance/routing.service';

}
  }

  /**
   * Get ambulances based on filters;
   */
  async getAmbulances(filter: AmbulanceFilter) {,
    const { status, vehicleType, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {,};
     {\n  here.status = status;
     {\n  here.vehicleType = vehicleType;

    const [ambulances, total] = await Promise.all([
      prisma.ambulance.findMany({
        where,
        include: {,
          currentLocation: true,
          crew: {,
            include: {,
              user: {,
                select: {,
                  id: true,
                   true
                }
              }
            },
            where: {,
              status: 'ON_DUTY',
            }
          },
          _count: {,
            select: {,
              trips: {,
                where: {,
                  status: {,
                    in: ['SCHEDULED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'EN_ROUTE_TO_DESTINATION']
                  }
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { registrationNumber: 'asc' },
      }),
      prisma.ambulance.count(where )
    ]);

    // Convert to FHIR format
    const fhirAmbulances = ambulances.map(ambulance => toFHIRAmbulance(ambulance));

    return {
      data: ambulances,
      fhir: fhirAmbulances;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get ambulance by ID;
   */
  async getAmbulanceById(id: string, includeFHIR: boolean = false): Promise<unknown> {,
    const ambulance = await prisma.ambulance.findUnique({
      where: { id ,},
      include: {,
        currentLocation: true,
        crew: {,
          include: {,
            user: {,
              select: {,
                id: true,
                 true
              }
            }
          }
        },
        trips: {,
              in: ['SCHEDULED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'EN_ROUTE_TO_DESTINATION', 'ARRIVED_AT_DESTINATION'],
          include: ,
            patient: true,
             true,
          orderBy: scheduledTime: 'asc' ,
        },
        maintenanceRecords: {,
              in: ['SCHEDULED', 'IN_PROGRESS'],
          orderBy: scheduledDate: 'asc' ,
        }
      }
    });

     {\n  {
      return null;
    }

     {\n  {
      return {
        data: ambulance,
        fhir: toFHIRAmbulance(ambulance),
      };
    }

    return ambulance;
  }

  /**
   * Create a new ambulance;
   */
  async createAmbulance(data: CreateAmbulanceData, userId: string): Promise<Ambulance> {,
    // Check if registration number is already in use
    const existingAmbulance = await prisma.ambulance.findUnique({
      where: { registrationNumber: data.registrationNumber },
    });

     {\n  {
      throw new Error(`An ambulance with registration number ${data.registrationNumber} already exists`);
    }

    // Create the ambulance
    const ambulance = await prisma.ambulance.create({
      data: {,
        registrationNumber: data.registrationNumber,
         'AVAILABLE',
         data.features,
         data.lastMaintenanceDate,
        nextMaintenanceDate: data.nextMaintenanceDate,
      },
      include: {,
        currentLocation: true,
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
       ambulance.id;
      userId,
      details: `Created ambulance with registration number ${ambulance.registrationNumber,}`;
    });

    return ambulance;
  }

  /**
   * Update an ambulance;
   */
  async updateAmbulance(id: string, data: Partial<Ambulance>, userId: string): Promise<Ambulance> {,
    const ambulance = await prisma.ambulance.findUnique({
      where: { id },
    });

     {\n  {
      throw new Error('Ambulance not found');
    }

    // If registration number is being updated, check if it's already in use
     {\n  {
      const existingAmbulance = await prisma.ambulance.findUnique({
        where: { registrationNumber: data.registrationNumber },
      });

       {\n  {
        throw new Error(`An ambulance with registration number ${data.registrationNumber} already exists`);
      }
    }

    // Update the ambulance
    const updatedAmbulance = await prisma.ambulance.update({
      where: { id ,},
      data,
      include: {,
        currentLocation: true,
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       id;
      userId,
      details: `Updated ambulance /* SECURITY: Template literal eliminated */,

    // Send notification if status changed to UNDER_MAINTENANCE
     {\n  {
      await this.notificationService.sendNotification({
        type: 'AMBULANCE_MAINTENANCE',
         `Ambulance ${ambulance.registrationNumber} is now under maintenance`,
        recipientRoles: ['MAINTENANCE_MANAGER', 'AMBULANCE_COORDINATOR'],
        entityId: ambulance.id,
        metadata: ,
          ambulanceId: ambulance.id,
          registrationNumber: ambulance.registrationNumber,
      });
    }

    return updatedAmbulance;
  }

  /**
   * Get ambulance trips based on filters;
   */
  async getAmbulanceTrips(filter: AmbulanceTripFilter) {,
    const { status, tripType, priority, ambulanceId, patientId, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {,};
     {\n  here.status = status;
     {\n  here.tripType = tripType;
     {\n  here.priority = priority;
     {\n  here.ambulanceId = ambulanceId;
     {\n  here.patientId = patientId;

    // Date range filter for scheduledTime
     {\n  {
      where.scheduledTime = {};
       {\n  here.scheduledTime.gte = startDate;
       {\n  here.scheduledTime.lte = endDate;
    }

    const [trips, total] = await Promise.all([
      prisma.ambulanceTrip.findMany({
        where,
        include: {,
          ambulance: true,
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
          pickupLocation: true,
           {
            include: {,
              user: {,
                select: {,
                  id: true,
                   true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { scheduledTime: 'desc' },
      }),
      prisma.ambulanceTrip.count(where )
    ]);

    // Convert to FHIR format
    const fhirTrips = trips.map(trip => toFHIRAmbulanceTrip(trip));

    return {
      data: trips,
      fhir: fhirTrips;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get ambulance trip by ID;
   */
  async getAmbulanceTripById(id: string, includeFHIR: boolean = false): Promise<unknown> {,
    const trip = await prisma.ambulanceTrip.findUnique({
      where: { id ,},
      include: {,
        ambulance: true,
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
        pickupLocation: true,
        dropLocation: true;
        {
                id: true,
                 true
        },
        route: true,
      }
    });

     {\n  {
      return null;
    }

     {\n  {
      return {
        data: trip,
        fhir: toFHIRAmbulanceTrip(trip),
      };
    }

    return trip;
  }

  /**
   * Create a new ambulance trip;
   */
  async createAmbulanceTrip(data: CreateAmbulanceTripData, userId: string): Promise<AmbulanceTrip> {,
    // Validate ambulance exists and is available
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: data.ambulanceId },
    });

     {\n  {
      throw new Error('Ambulance not found');
    }

     {\n  {
      throw new Error(`Ambulance ${ambulance.registrationNumber} is not available (current status: ${ambulance.status,})`);
    }

    // Validate locations if provided
     {\n  {
      const pickupLocation = await prisma.location.findUnique({
        where: { id: data.pickupLocationId },
      });

       {\n  {
        throw new Error('Pickup location not found');
      }
    }

     {\n  {
      const dropLocation = await prisma.location.findUnique({
        where: { id: data.dropLocationId },
      });

       {\n  {
        throw new Error('Drop location not found');
      }
    }

    // Validate patient if provided
     {\n  {
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId },
      });

       {\n  {
        throw new Error('Patient not found');
      }
    }

    // Create the trip
    const trip = await prisma.ambulanceTrip.create({
      data: {,
        ambulanceId: data.ambulanceId,
         'SCHEDULED',
         data.patientId,
         data.pickupLocationId,
         data.scheduledTime,
         data.medicalDetails || {}
      },
      include: {,
        ambulance: true,
         true,
        dropLocation: true,
      }
    });

    // If both pickup and drop locations are provided, calculate route
     {\n  {
      try {
        const routeData = await calculateRoute(data.pickupLocationId, data.dropLocationId);

        await prisma.ambulanceRoute.create({
          data: {,
            tripId: trip.id,
             routeData.distance,
            estimatedDuration: routeData.duration,
          }
        });
      } catch (error) {

        // Continue without route data
      }
    }

    // Assign crew if provided
     {\n  {
      for (const crewId of data.crewIds) {
        try {
          await prisma.ambulanceCrew.update({
            where: {,
              id: crewId,
            },
            data: {,
              trips: {,
                connect: { id: trip.id },
              }
            }
          });
        } catch (error) {

          // Continue with other crew assignments
        }
      }
    }

    // Update ambulance status to ON_DUTY
    await prisma.ambulance.update({
      where: { id: data.ambulanceId ,},
      data: { status: 'ON_DUTY' },
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
       trip.id;
      userId,
      details: `Created ${data.tripType} ambulance trip with ${ambulance.registrationNumber,}`;
    });

    // Send notification to ambulance crew
    await this.notificationService.sendNotification({
      type: 'AMBULANCE_TRIP_ASSIGNED',
       `A new ${data.tripType} trip has been assigned to ambulance ${ambulance.registrationNumber}`,
      recipientRoles: ['AMBULANCE_DRIVER', 'PARAMEDIC'],
      entityId: trip.id,
      metadata: {,
        tripId: trip.id,
         data.priority
      }
    });

    return trip;
  }

  /**
   * Update ambulance trip status;
   */
  async updateAmbulanceTripStatus(id: string, status: string, userId: string, locationData?: unknown): Promise<AmbulanceTrip> {
    const trip = await prisma.ambulanceTrip.findUnique({
      where: { id ,},
      include: {,
        ambulance: true,
        patient: true,
      }
    });

     {\n  {
      throw new Error('Ambulance trip not found');
    }

    const updateData: unknown = { status ,};

    // Handle status-specific updates
    switch (status) {
      case 'EN_ROUTE_TO_PICKUP':
        updateData.startTime = new Date(),\n    }\n    case 'ARRIVED_AT_DESTINATION':
        // No specific updates needed\n    }\n    case 'COMPLETED':
        updateData.endTime = new Date(),
         {\n  {
          const duration = Math.round((crypto.getRandomValues(new Uint32Array(1))[0] - trip.startTime.getTime()) / (60 * 1000)); // in minutes
          updateData.duration = duration;
        }
        break;
    }

    // Update the trip
    const updatedTrip = await prisma.ambulanceTrip.update({
      where: { id ,},
      data: updateData,
      include: {,
        ambulance: true,
         true,
         {
          select: {,
            id: true,
             true
          }
        }
      }
    });

    // If trip is completed or cancelled, update ambulance status to AVAILABLE
     {\n  {
      // Check if ambulance has other active trips
      const _activeTrips = await prisma.ambulanceTrip.count({
        where: {,
          ambulanceId: trip.ambulanceId,
          id: { not: id ,},
          status: {,
            in: ['SCHEDULED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'EN_ROUTE_TO_DESTINATION', 'ARRIVED_AT_DESTINATION']
          }
        }
      });

       {\n  {
        await prisma.ambulance.update({
          where: { id: trip.ambulanceId ,},
          data: { status: 'AVAILABLE' },
        });
      }
    }

    // If location data is provided, update the route
     {\n   {
      try {
        // Update route with actual data
        await prisma.ambulanceRoute.upsert({
          where: { tripId: id ,},
          update: {,
            routeData: {,
              ...locationData,
              lastUpdated: new Date().toISOString(),
            }
          },
          create: {,
            tripId: id,
            routeData: {,
              ...locationData,
              lastUpdated: new Date().toISOString(),
            },
            estimatedDistance: locationData.distance || 0,
            estimatedDuration: locationData.duration || 0,
          }
        });
      } catch (error) {

        // Continue without route update
      }
    }

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       id;
      userId,
      details: `Updated ambulance trip status to ${status,}`;
    });

    // Send notifications based on status
    switch (status) {
      case 'EN_ROUTE_TO_PICKUP':
        await this.notificationService.sendNotification({
          type: 'AMBULANCE_EN_ROUTE',
           `Ambulance ${trip.ambulance.registrationNumber} is en route to pickup location`,
          recipientIds: [trip.requestedById],
          entityId: trip.id,
        }),\n    }\n    case 'ARRIVED_AT_PICKUP':
        await this.notificationService.sendNotification({
          type: 'AMBULANCE_ARRIVED_PICKUP',
           `Ambulance ${trip.ambulance.registrationNumber} has arrived at pickup location`,
          recipientIds: [trip.requestedById],
          entityId: trip.id,
        }),\n    }\n    case 'COMPLETED':
        await this.notificationService.sendNotification({
          type: 'AMBULANCE_TRIP_COMPLETED',
           `Trip with ambulance ${trip.ambulance.registrationNumber} has been completed`,
          recipientIds: [trip.requestedById],
           trip.id
        }),
        break;
    }

    return updatedTrip;
  }

  /**
   * Get available ambulances for a trip;
   */
  async getAvailableAmbulances(tripType: string, scheduledTime: Date, pickupLocationId?: string): Promise<any[]> {
    // Get all ambulances that are AVAILABLE or ON_DUTY
    const ambulances = await prisma.ambulance.findMany({
      where: {,
        status: {,
          in: ['AVAILABLE', 'ON_DUTY']
        }
      },
      include: {,
        currentLocation: true,
        crew: {,
          where: {,
            status: 'ON_DUTY',
          },
          include: {,
            user: {,
              select: {,
                id: true,
                name: true,
              }
            }
          }
        },
        trips: {,
          where: {,
            status: {,
              in: ['SCHEDULED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'EN_ROUTE_TO_DESTINATION']
            },
            scheduledTime: {,
              // Find trips that might conflict with the scheduled time
              // Assuming trips take at most 2 hours
              gte: new Date(scheduledTime.getTime() - 2 * 60 * 60 * 1000),
              lte: new Date(scheduledTime.getTime() + 2 * 60 * 60 * 1000),
            }
          }
        }
      }
    });

    // Filter ambulances based on trip type
    const filteredAmbulances = ambulances.filter(ambulance => {
      // For emergency trips, only use ADVANCED_LIFE_SUPPORT ambulances
       {\n  {
        return false;
      }

      // For non-emergency trips, any ambulance type is fine

      // Check if ambulance has conflicting trips
       {\n  {
        // If ambulance already has trips scheduled around this time, it's not available
        return false;
      }

      // Check if ambulance has required crew
       {\n  {
        // Need at least one paramedic and one driver
        const hasParamedic = ambulance.crew.some(crew => crew.role === 'PARAMEDIC' ||
          crew.role === 'EMERGENCY_MEDICAL_TECHNICIAN');
        const hasDriver = ambulance.crew.some(crew => crew.role === 'DRIVER');

         {\n  {
          return false;
        }
      } else {
        // For transfers and returns, just need a driver
        const hasDriver = ambulance.crew.some(crew => crew.role === 'DRIVER');

         {\n  {
          return false;
        }
      }

      return true;
    });

    // If pickup location is provided, calculate estimated arrival times
     {\n  {
      const ambulancesWithETA = await Promise.all(
        filteredAmbulances.map(async ambulance => {
           {\n  {
            try {
              const eta = await estimateArrivalTime(ambulance.currentLocationId, pickupLocationId);
              return {
                ...ambulance,
                eta: {,
                  minutes: eta.duration,
                  distance: eta.distance,
                }
              };
            } catch (error) {

              return {
                ...ambulance,
                eta: null,
              };
            }
          }
          return {
            ...ambulance,
            eta: null,
          };
        });
      );

      // Sort by ETA
      return ambulancesWithETA.sort((a, b) => {
         {\n  eturn 1;
         {\n  eturn -1;
        return a.eta.minutes - b.eta.minutes;
      });
    }

    return filteredAmbulances;
  }

  /**
   * Assign crew to ambulance;
   */
  async assignCrewToAmbulance(ambulanceId: string, userId: string, role: string, shiftStart: Date, shiftEnd: Date, assignedBy: string): Promise<AmbulanceCrew> {,
    // Validate ambulance exists
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId },
    });

     {\n  {
      throw new Error('Ambulance not found');
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

     {\n  {
      throw new Error('User not found');
    }

    // Check if user is already assigned to this ambulance
    const existingCrew = await prisma.ambulanceCrew.findFirst({
      where: {,
        ambulanceId,
        userId;
      }
    });

     {\n  {
      // Update existing crew assignment
      const updatedCrew = await prisma.ambulanceCrew.update({
        where: { id: existingCrew.id ,},
        data: {,
          role,
          status: 'ON_DUTY';
          shiftStart,
          shiftEnd;
        },
        include: {,
          user: {,
            select: {,
              id: true,
               true
            }
          },
          ambulance: true,
        }
      });

      // Create audit log
      await createAuditLog({
        action: 'UPDATE',
         updatedCrew.id,
         `Updated crew assignment for ${user.name} on ambulance ${ambulance.registrationNumber}`;
      });

      return updatedCrew;
    } else {
      // Create new crew assignment
      const crew = await prisma.ambulanceCrew.create({
        data: {,
          ambulanceId,
          userId,
          role,
          status: 'ON_DUTY';
          shiftStart,
          shiftEnd;
        },
        include: {,
          user: {,
            select: {,
              id: true,
               true
            }
          },
          ambulance: true,
        }
      });

      // Create audit log
      await createAuditLog({
        action: 'CREATE',
         crew.id,
         `Assigned ${user.name} as ${role} to ambulance ${ambulance.registrationNumber}`;
      });

      // Send notification to assigned crew member
      await this.notificationService.sendNotification({
        type: 'CREW_ASSIGNMENT',
         `You have been assigned as ${role} to ambulance ${ambulance.registrationNumber}`,
        recipientIds: [userId],
         {
          crewId: crew.id;
          ambulanceId,
          role,
          shiftStart: shiftStart.toISOString(),
          shiftEnd: shiftEnd.toISOString(),
        }
      });

      return crew;
    }
  }

  /**
   * End crew shift;
   */
  async endCrewShift(crewId: string, userId: string): Promise<AmbulanceCrew> {,
    const crew = await prisma.ambulanceCrew.findUnique({
      where: { id: crewId ,},
      include: {,
        user: true,
        ambulance: true,
      }
    });

     {\n  {
      throw new Error('Crew assignment not found');
    }

    // Update crew status to OFF_DUTY
    const updatedCrew = await prisma.ambulanceCrew.update({
      where: { id: crewId ,},
      data: {,
        status: 'OFF_DUTY',
        shiftEnd: new Date(),
      },
      include: {,
        user: true,
        ambulance: true,
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       crewId;
      userId,
      details: `Ended shift for ${crew.user.name} on ambulance ${crew.ambulance.registrationNumber,}`;
    });

    return updatedCrew;
  }

  /**
   * Schedule ambulance maintenance;
   */
  async scheduleAmbulanceMaintenance(ambulanceId: string, data: unknown, userId: string): Promise<AmbulanceMaintenance> {,
    // Validate ambulance exists
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId },
    });

     {\n  {
      throw new Error('Ambulance not found');
    }

    // Create maintenance record
    const maintenance = await prisma.ambulanceMaintenance.create({
      data: {,
        ambulanceId,
        maintenanceType: data.maintenanceType,
         data.description,
        scheduledDate: new Date(data.scheduledDate),
        notes: data.notes,
      },
      include: {,
        ambulance: true,
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
       maintenance.id;
      userId,
      details: `Scheduled ${data.maintenanceType} maintenance for ambulance ${ambulance.registrationNumber,}`;
    });

    // Send notification to maintenance staff
    await this.notificationService.sendNotification({
      type: 'MAINTENANCE_SCHEDULED',
       `${data.maintenanceType} maintenance scheduled for ambulance ${ambulance.registrationNumber} on ${new Date(data.scheduledDate).toLocaleDateString()}`,
      recipientRoles: ['MAINTENANCE_STAFF'],
       {
        maintenanceId: maintenance.id;
        ambulanceId,
        maintenanceType: data.maintenanceType,
        scheduledDate: data.scheduledDate,
      }
    });

    return maintenance;
  }

  /**
   * Update ambulance maintenance status;
   */
  async updateMaintenanceStatus(id: string, status: string, userId: string, completionData?: unknown): Promise<AmbulanceMaintenance> {
    const maintenance = await prisma.ambulanceMaintenance.findUnique({
      where: { id ,},
      include: {,
        ambulance: true,
      }
    });

     {\n  {
      throw new Error('Maintenance record not found');
    }

    const updateData: unknown = { status ,};

    // If status is COMPLETED, add completion data
     {\n  {
      updateData.completedDate = new Date();
      updateData.performedById = userId;

       {\n  {
         {\n  {
          updateData.cost = completionData.cost;
        }
         {\n  {
          updateData.notes = completionData.notes;
        }
      }

      // Update ambulance maintenance dates
      await prisma.ambulance.update({
        where: { id: maintenance.ambulanceId ,},
        data: {,
          lastMaintenanceDate: new Date(),
          nextMaintenanceDate: new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          status: 'AVAILABLE' // Set ambulance back to available,
        }
      })
    }

    // Update the maintenance record
    const updatedMaintenance = await prisma.ambulanceMaintenance.update({
      where: { id ,},
      data: updateData,
      include: {,
        ambulance: true,
        performedByUser: {,
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
      details: `Updated maintenance status to ${status} for ambulance ${maintenance.ambulance.registrationNumber,}`;
    });

    // Send notification if maintenance is completed
     {\n  {
      await this.notificationService.sendNotification({
        type: 'MAINTENANCE_COMPLETED',
         `Maintenance for ambulance ${maintenance.ambulance.registrationNumber} has been completed`,
        recipientRoles: ['AMBULANCE_COORDINATOR'],
        entityId: maintenance.id,
      });
    }

    return updatedMaintenance;
  }

  /**
   * Get ambulance inventory;
   */
  async getAmbulanceInventory(ambulanceId: string): Promise<AmbulanceInventory[]> {,
    // Validate ambulance exists
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId },
    });

     {\n  {
      throw new Error('Ambulance not found');
    }

    // Get inventory items
    const inventory = await prisma.ambulanceInventory.findMany({
      where: { ambulanceId ,},
      orderBy: { itemType: 'asc' },
    });

    return inventory;
  }

  /**
   * Update ambulance inventory item;
   */
  async updateInventoryItem(id: string, data: Partial<AmbulanceInventory>, userId: string): Promise<AmbulanceInventory> {,
    const item = await prisma.ambulanceInventory.findUnique({
      where: { id ,},
      include: {,
        ambulance: true,
      }
    });

     {\n  {
      throw new Error('Inventory item not found');
    }

    // If restocking, update lastRestockedDate
     {\n  {
      data.lastRestockedDate = new Date();
    }

    // Update the inventory item
    const updatedItem = await prisma.ambulanceInventory.update({
      where: { id ,},
      data,
      include: {,
        ambulance: true,
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
       id;
      userId,
      details: `Updated inventory for ${item.itemName} on ambulance ${item.ambulance.registrationNumber,}, quantity: ${item.quantity} → ${data.quantity ||,
        item.quantity}`;
    });

    // Send notification if quantity is below minimum
     {\n  {
      await this.notificationService.sendNotification({
        type: 'INVENTORY_LOW',
         `${updatedItem.itemName} is running low on ambulance ${updatedItem.ambulance.registrationNumber} (${updatedItem.quantity} remaining)`,
        recipientRoles: ['AMBULANCE_COORDINATOR', 'INVENTORY_MANAGER'],
        entityId: updatedItem.id,
      });
    }

    return updatedItem;
  }

  /**
   * Get ambulance analytics;
   */
  async getAmbulanceAnalytics(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') {,
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

    // Get trip counts by status
    const tripsByStatus = await prisma.ambulanceTrip.groupBy({
      by: ['status'],
      where: {,
        createdAt: {,
          gte: startDate,
        }
      },
      _count: true,
    });

    // Get trip counts by type
    const tripsByType = await prisma.ambulanceTrip.groupBy({
      by: ['tripType'],
      where: {,
        createdAt: {,
          gte: startDate,
        }
      },
      _count: true,
    });

    // Get trip counts by priority
    const tripsByPriority = await prisma.ambulanceTrip.groupBy({
      by: ['priority'],
      where: {,
        createdAt: {,
          gte: startDate,
        }
      },
      _count: true,
    });

    // Get ambulance utilization
    const ambulances = await prisma.ambulance.findMany({
      select: {,
        id: true,
         true,
        _count: 
                  gte: startDate,
      }
    });

    // Sort ambulances by trip count
    const ambulanceUtilization = ambulances;
      .map(ambulance => ({
        id: ambulance.id,
         ambulance.vehicleType,
        tripCount: ambulance._count.trips,
      }));
      .sort((a, b) => b.tripCount - a.tripCount);

    // Get average trip duration
    const completedTrips = await prisma.ambulanceTrip.findMany({
      where: {,
        status: 'COMPLETED',
        startTime: { not: null ,},
        endTime: { not: null ,},
        createdAt: {,
          gte: startDate,
        }
      },
      select: {,
        duration: true,
        tripType: true,
      }
    });

    // Calculate average duration by trip type
    const durationByType: Record<string, { count: number, totalDuration: number, avgDuration: number }> = {,};

    completedTrips.forEach(trip => {
       {\n  {
         {\n  {
          durationByType[trip.tripType] = { count: 0, totalDuration: 0, avgDuration: 0 ,};
        }

        durationByType[trip.tripType].count++;
        durationByType[trip.tripType].totalDuration += trip.duration;
      }
    });

    // Calculate averages
    Object.keys(durationByType).forEach(type => {
      const data = durationByType[type];
      data.avgDuration = Math.round(data.totalDuration / data.count);
    });

    // Get maintenance statistics
    const maintenanceByType = await prisma.ambulanceMaintenance.groupBy({
      by: ['maintenanceType'],
      where: {,
        createdAt: {,
          gte: startDate,
        }
      },
      _count: true,
      _sum: {,
        cost: true,
      }
    });

    return {
      tripsByStatus,
      tripsByType,
      tripsByPriority,
      ambulanceUtilization,
      durationByType,
      maintenanceByType,
      period
    };
  }
