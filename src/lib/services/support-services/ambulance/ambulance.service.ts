import { Ambulance, AmbulanceCrew, AmbulanceInventory, AmbulanceMaintenance, AmbulanceTrip } from '@prisma/client';


import { createAuditLog } from '@/lib/audit-logging';
import { toFHIRAmbulance, toFHIRAmbulanceTrip } from '@/lib/models/ambulance';
import { prisma } from '@/lib/prisma';
import type { NotificationService } from '@/lib/services/notification.service';
import { calculateRoute, estimateArrivalTime } from '@/lib/services/support-services/ambulance/routing.service';
\1
}
  }

  /**
   * Get ambulances based on filters;
   */
  async getAmbulances(filter: AmbulanceFilter) {
    const { status, vehicleType, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.status = status;
    \1 {\n  \2here.vehicleType = vehicleType;

    const [ambulances, total] = await Promise.all([
      prisma.ambulance.findMany({
        where,
        \1,\2 true,
          \1,\2 {
              \1,\2 {
                  id: true,
                  \1,\2 true
                }
              }
            },
            \1,\2 'ON_DUTY'
            }
          },
          \1,\2 {
              \1,\2 {
                  \1,\2 ['SCHEDULED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'EN_ROUTE_TO_DESTINATION']
                  }
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { registrationNumber: 'asc' }
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
        totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get ambulance by ID;
   */
  async getAmbulanceById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id },
      \1,\2 true,
        \1,\2 {
            \1,\2 {
                id: true,
                \1,\2 true
              }
            }
          }
        },
        \1,\2 ['SCHEDULED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'EN_ROUTE_TO_DESTINATION', 'ARRIVED_AT_DESTINATION'],
          \1,\2 true,
            \1,\2 true,
          orderBy: scheduledTime: 'asc' 
        },
        \1,\2 ['SCHEDULED', 'IN_PROGRESS'],
          orderBy: scheduledDate: 'asc' 
        }
      }
    });

    \1 {\n  \2{
      return null;
    }

    \1 {\n  \2{
      return {
        data: ambulance,
        fhir: toFHIRAmbulance(ambulance)
      };
    }

    return ambulance;
  }

  /**
   * Create a new ambulance;
   */
  async createAmbulance(data: CreateAmbulanceData, userId: string): Promise<Ambulance> {
    // Check if registration number is already in use
    const existingAmbulance = await prisma.ambulance.findUnique({
      where: { registrationNumber: data.registrationNumber }
    });

    \1 {\n  \2{
      throw new Error(`An ambulance with registration number ${data.registrationNumber} already exists`);
    }

    // Create the ambulance
    const ambulance = await prisma.ambulance.create({
      \1,\2 data.registrationNumber,
        \1,\2 'AVAILABLE',
        \1,\2 data.features,
        \1,\2 data.lastMaintenanceDate,
        nextMaintenanceDate: data.nextMaintenanceDate
      },
      \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 ambulance.id;
      userId,
      details: `Created ambulance with registration number ${ambulance.registrationNumber}`;
    });

    return ambulance;
  }

  /**
   * Update an ambulance;
   */
  async updateAmbulance(id: string, data: Partial<Ambulance>, userId: string): Promise<Ambulance> {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Ambulance not found');
    }

    // If registration number is being updated, check if it's already in use
    \1 {\n  \2{
      const existingAmbulance = await prisma.ambulance.findUnique({
        where: { registrationNumber: data.registrationNumber }
      });

      \1 {\n  \2{
        throw new Error(`An ambulance with registration number ${data.registrationNumber} already exists`);
      }
    }

    // Update the ambulance
    const updatedAmbulance = await prisma.ambulance.update({
      where: { id },
      data,
      \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated ambulance /* SECURITY: Template literal eliminated */

    // Send notification if status changed to UNDER_MAINTENANCE
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'AMBULANCE_MAINTENANCE',
        \1,\2 `Ambulance ${ambulance.registrationNumber} is now under maintenance`,
        recipientRoles: ['MAINTENANCE_MANAGER', 'AMBULANCE_COORDINATOR'],
        entityId: ambulance.id,
        \1,\2 ambulance.id,
          registrationNumber: ambulance.registrationNumber
      });
    }

    return updatedAmbulance;
  }

  /**
   * Get ambulance trips based on filters;
   */
  async getAmbulanceTrips(filter: AmbulanceTripFilter) {
    const { status, tripType, priority, ambulanceId, patientId, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.status = status;
    \1 {\n  \2here.tripType = tripType;
    \1 {\n  \2here.priority = priority;
    \1 {\n  \2here.ambulanceId = ambulanceId;
    \1 {\n  \2here.patientId = patientId;

    // Date range filter for scheduledTime
    \1 {\n  \2{
      where.scheduledTime = {};
      \1 {\n  \2here.scheduledTime.gte = startDate;
      \1 {\n  \2here.scheduledTime.lte = endDate;
    }

    const [trips, total] = await Promise.all([
      prisma.ambulanceTrip.findMany({
        where,
        \1,\2 true,
          \1,\2 {
              id: true,
              \1,\2 true,
              gender: true
            }
          },
          \1,\2 {
              id: true,
              \1,\2 true
            }
          },
          pickupLocation: true,
          \1,\2 {
            \1,\2 {
                \1,\2 true,
                  \1,\2 true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { scheduledTime: 'desc' }
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
        totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get ambulance trip by ID;
   */
  async getAmbulanceTripById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const trip = await prisma.ambulanceTrip.findUnique({
      where: { id },
      \1,\2 true,
        \1,\2 {
            id: true,
            \1,\2 true,
            gender: true
          }
        },
        \1,\2 true,
            \1,\2 true
        },
        pickupLocation: true,
        dropLocation: true;
        {
                id: true,
                \1,\2 true
        },
        route: true
      }
    });

    \1 {\n  \2{
      return null;
    }

    \1 {\n  \2{
      return {
        data: trip,
        fhir: toFHIRAmbulanceTrip(trip)
      };
    }

    return trip;
  }

  /**
   * Create a new ambulance trip;
   */
  async createAmbulanceTrip(data: CreateAmbulanceTripData, userId: string): Promise<AmbulanceTrip> {
    // Validate ambulance exists and is available
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: data.ambulanceId }
    });

    \1 {\n  \2{
      throw new Error('Ambulance not found');
    }

    \1 {\n  \2{
      throw new Error(`Ambulance ${ambulance.registrationNumber} is not available (current status: ${ambulance.status})`);
    }

    // Validate locations if provided
    \1 {\n  \2{
      const pickupLocation = await prisma.location.findUnique({
        where: { id: data.pickupLocationId }
      });

      \1 {\n  \2{
        throw new Error('Pickup location not found');
      }
    }

    \1 {\n  \2{
      const dropLocation = await prisma.location.findUnique({
        where: { id: data.dropLocationId }
      });

      \1 {\n  \2{
        throw new Error('Drop location not found');
      }
    }

    // Validate patient if provided
    \1 {\n  \2{
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId }
      });

      \1 {\n  \2{
        throw new Error('Patient not found');
      }
    }

    // Create the trip
    const trip = await prisma.ambulanceTrip.create({
      \1,\2 data.ambulanceId,
        \1,\2 'SCHEDULED',
        \1,\2 data.patientId,
        \1,\2 data.pickupLocationId,
        \1,\2 data.scheduledTime,
        \1,\2 data.medicalDetails || {}
      },
      \1,\2 true,
        \1,\2 true,
        dropLocation: true
      }
    });

    // If both pickup and drop locations are provided, calculate route
    \1 {\n  \2{
      try {
        const routeData = await calculateRoute(data.pickupLocationId, data.dropLocationId);

        await prisma.ambulanceRoute.create({
          \1,\2 trip.id,
            \1,\2 routeData.distance,
            estimatedDuration: routeData.duration
          }
        });
      } catch (error) {

        // Continue without route data
      }
    }

    // Assign crew if provided
    \1 {\n  \2{
      for (const crewId of data.crewIds) {
        try {
          await prisma.ambulanceCrew.update({
            \1,\2 crewId
            },
            \1,\2 {
                connect: { id: trip.id }
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
      where: { id: data.ambulanceId },
      data: { status: 'ON_DUTY' }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 trip.id;
      userId,
      details: `Created ${data.tripType} ambulance trip with ${ambulance.registrationNumber}`;
    });

    // Send notification to ambulance crew
    await this.notificationService.sendNotification({
      type: 'AMBULANCE_TRIP_ASSIGNED',
      \1,\2 `A new ${data.tripType} trip has been assigned to ambulance ${ambulance.registrationNumber}`,
      recipientRoles: ['AMBULANCE_DRIVER', 'PARAMEDIC'],
      entityId: trip.id,
      \1,\2 trip.id,
        \1,\2 data.priority
      }
    });

    return trip;
  }

  /**
   * Update ambulance trip status;
   */
  async updateAmbulanceTripStatus(id: string, status: string, userId: string, locationData?: unknown): Promise<AmbulanceTrip> {
    const trip = await prisma.ambulanceTrip.findUnique({
      where: { id },
      \1,\2 true,
        patient: true
      }
    });

    \1 {\n  \2{
      throw new Error('Ambulance trip not found');
    }

    const updateData: unknown = { status };

    // Handle status-specific updates
    switch (status) {
      case 'EN_ROUTE_TO_PICKUP':
        updateData.startTime = new Date(),\1\n    }\n    case 'ARRIVED_AT_DESTINATION':
        // No specific updates needed\1\n    }\n    case 'COMPLETED':
        updateData.endTime = new Date(),
        \1 {\n  \2{
          const duration = Math.round((crypto.getRandomValues(\1[0] - trip.startTime.getTime()) / (60 * 1000)); // in minutes
          updateData.duration = duration;
        }
        break;
    }

    // Update the trip
    const updatedTrip = await prisma.ambulanceTrip.update({
      where: { id },
      data: updateData,
      \1,\2 true,
        \1,\2 true,
        \1,\2 {
          \1,\2 true,
            \1,\2 true
          }
        }
      }
    });

    // If trip is completed or cancelled, update ambulance status to AVAILABLE
    \1 {\n  \2{
      // Check if ambulance has other active trips
      const _activeTrips = await prisma.ambulanceTrip.count({
        \1,\2 trip.ambulanceId,
          id: { not: id },
          \1,\2 ['SCHEDULED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'EN_ROUTE_TO_DESTINATION', 'ARRIVED_AT_DESTINATION']
          }
        }
      });

      \1 {\n  \2{
        await prisma.ambulance.update({
          where: { id: trip.ambulanceId },
          data: { status: 'AVAILABLE' }
        });
      }
    }

    // If location data is provided, update the route
    \1 {\n  \2 {
      try {
        // Update route with actual data
        await prisma.ambulanceRoute.upsert({
          where: { tripId: id },
          \1,\2 {
              ...locationData,
              lastUpdated: new Date().toISOString()
            }
          },
          \1,\2 id,
            routeData: {
              ...locationData,
              lastUpdated: new Date().toISOString()
            },
            estimatedDistance: locationData.distance || 0,
            estimatedDuration: locationData.duration || 0
          }
        });
      } catch (error) {

        // Continue without route update
      }
    }

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated ambulance trip status to ${status}`;
    });

    // Send notifications based on status
    switch (status) {
      case 'EN_ROUTE_TO_PICKUP':
        await this.notificationService.sendNotification({
          type: 'AMBULANCE_EN_ROUTE',
          \1,\2 `Ambulance ${trip.ambulance.registrationNumber} is en route to pickup location`,
          recipientIds: [trip.requestedById],
          entityId: trip.id
        }),\1\n    }\n    case 'ARRIVED_AT_PICKUP':
        await this.notificationService.sendNotification({
          type: 'AMBULANCE_ARRIVED_PICKUP',
          \1,\2 `Ambulance ${trip.ambulance.registrationNumber} has arrived at pickup location`,
          recipientIds: [trip.requestedById],
          entityId: trip.id
        }),\1\n    }\n    case 'COMPLETED':
        await this.notificationService.sendNotification({
          type: 'AMBULANCE_TRIP_COMPLETED',
          \1,\2 `Trip with ambulance ${trip.ambulance.registrationNumber} has been completed`,
          recipientIds: [trip.requestedById],
          \1,\2 trip.id
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
      \1,\2 {
          in: ['AVAILABLE', 'ON_DUTY']
        }
      },
      \1,\2 true,
        \1,\2 {
            status: 'ON_DUTY'
          },
          \1,\2 {
              \1,\2 true,
                name: true
              }
            }
          }
        },
        \1,\2 {
            \1,\2 ['SCHEDULED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'EN_ROUTE_TO_DESTINATION']
            },
            scheduledTime: {
              // Find trips that might conflict with the scheduled time
              // Assuming trips take at most 2 hours
              gte: new Date(scheduledTime.getTime() - 2 * 60 * 60 * 1000),
              lte: new Date(scheduledTime.getTime() + 2 * 60 * 60 * 1000)
            }
          }
        }
      }
    });

    // Filter ambulances based on trip type
    const filteredAmbulances = ambulances.filter(ambulance => {
      // For emergency trips, only use ADVANCED_LIFE_SUPPORT ambulances
      \1 {\n  \2{
        return false;
      }

      // For non-emergency trips, any ambulance type is fine

      // Check if ambulance has conflicting trips
      \1 {\n  \2{
        // If ambulance already has trips scheduled around this time, it's not available
        return false;
      }

      // Check if ambulance has required crew
      \1 {\n  \2{
        // Need at least one paramedic and one driver
        const hasParamedic = ambulance.crew.some(crew => crew.role === 'PARAMEDIC' ||
          crew.role === 'EMERGENCY_MEDICAL_TECHNICIAN');
        const hasDriver = ambulance.crew.some(crew => crew.role === 'DRIVER');

        \1 {\n  \2{
          return false;
        }
      } else {
        // For transfers and returns, just need a driver
        const hasDriver = ambulance.crew.some(crew => crew.role === 'DRIVER');

        \1 {\n  \2{
          return false;
        }
      }

      return true;
    });

    // If pickup location is provided, calculate estimated arrival times
    \1 {\n  \2{
      const ambulancesWithETA = await Promise.all(
        filteredAmbulances.map(async ambulance => {
          \1 {\n  \2{
            try {
              const eta = await estimateArrivalTime(ambulance.currentLocationId, pickupLocationId);
              return {
                ...ambulance,
                \1,\2 eta.duration,
                  distance: eta.distance
                }
              };
            } catch (error) {

              return {
                ...ambulance,
                eta: null
              };
            }
          }
          return {
            ...ambulance,
            eta: null
          };
        });
      );

      // Sort by ETA
      return ambulancesWithETA.sort((a, b) => {
        \1 {\n  \2eturn 1;
        \1 {\n  \2eturn -1;
        return a.eta.minutes - b.eta.minutes;
      });
    }

    return filteredAmbulances;
  }

  /**
   * Assign crew to ambulance;
   */
  async assignCrewToAmbulance(ambulanceId: string, userId: string, role: string, shiftStart: Date, shiftEnd: Date, assignedBy: string): Promise<AmbulanceCrew> {
    // Validate ambulance exists
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId }
    });

    \1 {\n  \2{
      throw new Error('Ambulance not found');
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    \1 {\n  \2{
      throw new Error('User not found');
    }

    // Check if user is already assigned to this ambulance
    const existingCrew = await prisma.ambulanceCrew.findFirst({
      where: {
        ambulanceId,
        userId;
      }
    });

    \1 {\n  \2{
      // Update existing crew assignment
      const updatedCrew = await prisma.ambulanceCrew.update({
        where: { id: existingCrew.id },
        data: {
          role,
          status: 'ON_DUTY';
          shiftStart,
          shiftEnd;
        },
        \1,\2 {
            \1,\2 true,
              \1,\2 true
            }
          },
          ambulance: true
        }
      });

      // Create audit log
      await createAuditLog({
        action: 'UPDATE',
        \1,\2 updatedCrew.id,
        \1,\2 `Updated crew assignment for ${user.name} on ambulance ${ambulance.registrationNumber}`;
      });

      return updatedCrew;
    } else {
      // Create new crew assignment
      const crew = await prisma.ambulanceCrew.create({
        data: {
          ambulanceId,
          userId,
          role,
          status: 'ON_DUTY';
          shiftStart,
          shiftEnd;
        },
        \1,\2 {
            \1,\2 true,
              \1,\2 true
            }
          },
          ambulance: true
        }
      });

      // Create audit log
      await createAuditLog({
        action: 'CREATE',
        \1,\2 crew.id,
        \1,\2 `Assigned ${user.name} as ${role} to ambulance ${ambulance.registrationNumber}`;
      });

      // Send notification to assigned crew member
      await this.notificationService.sendNotification({
        type: 'CREW_ASSIGNMENT',
        \1,\2 `You have been assigned as ${role} to ambulance ${ambulance.registrationNumber}`,
        recipientIds: [userId],
        \1,\2 {
          crewId: crew.id;
          ambulanceId,
          role,
          shiftStart: shiftStart.toISOString(),
          shiftEnd: shiftEnd.toISOString()
        }
      });

      return crew;
    }
  }

  /**
   * End crew shift;
   */
  async endCrewShift(crewId: string, userId: string): Promise<AmbulanceCrew> {
    const crew = await prisma.ambulanceCrew.findUnique({
      where: { id: crewId },
      \1,\2 true,
        ambulance: true
      }
    });

    \1 {\n  \2{
      throw new Error('Crew assignment not found');
    }

    // Update crew status to OFF_DUTY
    const updatedCrew = await prisma.ambulanceCrew.update({
      where: { id: crewId },
      \1,\2 'OFF_DUTY',
        shiftEnd: new Date()
      },
      \1,\2 true,
        ambulance: true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 crewId;
      userId,
      details: `Ended shift for ${crew.user.name} on ambulance ${crew.ambulance.registrationNumber}`;
    });

    return updatedCrew;
  }

  /**
   * Schedule ambulance maintenance;
   */
  async scheduleAmbulanceMaintenance(ambulanceId: string, data: unknown, userId: string): Promise<AmbulanceMaintenance> {
    // Validate ambulance exists
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId }
    });

    \1 {\n  \2{
      throw new Error('Ambulance not found');
    }

    // Create maintenance record
    const maintenance = await prisma.ambulanceMaintenance.create({
      data: {
        ambulanceId,
        maintenanceType: data.maintenanceType,
        \1,\2 data.description,
        scheduledDate: new Date(data.scheduledDate),
        notes: data.notes
      },
      \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 maintenance.id;
      userId,
      details: `Scheduled ${data.maintenanceType} maintenance for ambulance ${ambulance.registrationNumber}`;
    });

    // Send notification to maintenance staff
    await this.notificationService.sendNotification({
      type: 'MAINTENANCE_SCHEDULED',
      \1,\2 `${data.maintenanceType} maintenance scheduled for ambulance ${ambulance.registrationNumber} on ${new Date(data.scheduledDate).toLocaleDateString()}`,
      recipientRoles: ['MAINTENANCE_STAFF'],
      \1,\2 {
        maintenanceId: maintenance.id;
        ambulanceId,
        maintenanceType: data.maintenanceType,
        scheduledDate: data.scheduledDate
      }
    });

    return maintenance;
  }

  /**
   * Update ambulance maintenance status;
   */
  async updateMaintenanceStatus(id: string, status: string, userId: string, completionData?: unknown): Promise<AmbulanceMaintenance> {
    const maintenance = await prisma.ambulanceMaintenance.findUnique({
      where: { id },
      \1,\2 true
      }
    });

    \1 {\n  \2{
      throw new Error('Maintenance record not found');
    }

    const updateData: unknown = { status };

    // If status is COMPLETED, add completion data
    \1 {\n  \2{
      updateData.completedDate = new Date();
      updateData.performedById = userId;

      \1 {\n  \2{
        \1 {\n  \2{
          updateData.cost = completionData.cost;
        }
        \1 {\n  \2{
          updateData.notes = completionData.notes;
        }
      }

      // Update ambulance maintenance dates
      await prisma.ambulance.update({
        where: { id: maintenance.ambulanceId },
        \1,\2 new Date(),
          nextMaintenanceDate: \1[0] + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          status: 'AVAILABLE' // Set ambulance back to available
        }
      })
    }

    // Update the maintenance record
    const updatedMaintenance = await prisma.ambulanceMaintenance.update({
      where: { id },
      data: updateData,
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
      details: `Updated maintenance status to ${status} for ambulance ${maintenance.ambulance.registrationNumber}`;
    });

    // Send notification if maintenance is completed
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'MAINTENANCE_COMPLETED',
        \1,\2 `Maintenance for ambulance ${maintenance.ambulance.registrationNumber} has been completed`,
        recipientRoles: ['AMBULANCE_COORDINATOR'],
        entityId: maintenance.id
      });
    }

    return updatedMaintenance;
  }

  /**
   * Get ambulance inventory;
   */
  async getAmbulanceInventory(ambulanceId: string): Promise<AmbulanceInventory[]> {
    // Validate ambulance exists
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId }
    });

    \1 {\n  \2{
      throw new Error('Ambulance not found');
    }

    // Get inventory items
    const inventory = await prisma.ambulanceInventory.findMany({
      where: { ambulanceId },
      orderBy: { itemType: 'asc' }
    });

    return inventory;
  }

  /**
   * Update ambulance inventory item;
   */
  async updateInventoryItem(id: string, data: Partial<AmbulanceInventory>, userId: string): Promise<AmbulanceInventory> {
    const item = await prisma.ambulanceInventory.findUnique({
      where: { id },
      \1,\2 true
      }
    });

    \1 {\n  \2{
      throw new Error('Inventory item not found');
    }

    // If restocking, update lastRestockedDate
    \1 {\n  \2{
      data.lastRestockedDate = new Date();
    }

    // Update the inventory item
    const updatedItem = await prisma.ambulanceInventory.update({
      where: { id },
      data,
      \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated inventory for ${item.itemName} on ambulance ${item.ambulance.registrationNumber}, quantity: ${item.quantity} → ${data.quantity ||
        item.quantity}`;
    });

    // Send notification if quantity is below minimum
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'INVENTORY_LOW',
        \1,\2 `${updatedItem.itemName} is running low on ambulance ${updatedItem.ambulance.registrationNumber} (${updatedItem.quantity} remaining)`,
        recipientRoles: ['AMBULANCE_COORDINATOR', 'INVENTORY_MANAGER'],
        entityId: updatedItem.id
      });
    }

    return updatedItem;
  }

  /**
   * Get ambulance analytics;
   */
  async getAmbulanceAnalytics(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') {
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

    // Get trip counts by status
    const tripsByStatus = await prisma.ambulanceTrip.groupBy({
      by: ['status'],
      \1,\2 {
          gte: startDate
        }
      },
      _count: true
    });

    // Get trip counts by type
    const tripsByType = await prisma.ambulanceTrip.groupBy({
      by: ['tripType'],
      \1,\2 {
          gte: startDate
        }
      },
      _count: true
    });

    // Get trip counts by priority
    const tripsByPriority = await prisma.ambulanceTrip.groupBy({
      by: ['priority'],
      \1,\2 {
          gte: startDate
        }
      },
      _count: true
    });

    // Get ambulance utilization
    const ambulances = await prisma.ambulance.findMany({
      \1,\2 true,
        \1,\2 true,
        \1,\2 startDate
      }
    });

    // Sort ambulances by trip count
    const ambulanceUtilization = ambulances;
      .map(ambulance => ({
        id: ambulance.id,
        \1,\2 ambulance.vehicleType,
        tripCount: ambulance._count.trips
      }));
      .sort((a, b) => b.tripCount - a.tripCount);

    // Get average trip duration
    const completedTrips = await prisma.ambulanceTrip.findMany({
      \1,\2 'COMPLETED',
        startTime: { not: null },
        endTime: { not: null },
        \1,\2 startDate
        }
      },
      \1,\2 true,
        tripType: true
      }
    });

    // Calculate average duration by trip type
    const durationByType: Record<string, { count: number, totalDuration: number, avgDuration: number }> = {};

    completedTrips.forEach(trip => {
      \1 {\n  \2{
        \1 {\n  \2{
          durationByType[trip.tripType] = { count: 0, totalDuration: 0, avgDuration: 0 };
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
      \1,\2 {
          gte: startDate
        }
      },
      _count: true,
      \1,\2 true
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
