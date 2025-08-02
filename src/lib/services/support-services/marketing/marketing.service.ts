

import { "@/lib/fhir";
import "@/lib/models/marketing";
import "@/lib/notifications";
import "@/lib/prisma";
import Contact
import ContactSegment
import encryptData, Lead
import MarketingCampaign } from "@/lib/security/encryption.service"
import NotFoundError
import ValidationError, }  AuditLogger  } from "@/lib/database"
import  }  CampaignChannel
import { DatabaseError
import { decryptData
import { FhirResourceGenerator  } from "next/server"
import { NotificationService }
import { prisma }

/**;
 * Service for managing marketing campaigns and related operations;
 */;
}
        }});

      // Log audit event;
      await this.auditLogger.log({action:"campaign.create",
        resourceId: campaign.id,
        userId,
        details: {campaignName:campaign.name, campaignType: campaign.type },

      // Notify relevant users;
      await this.notificationService.sendNotification({type: "CAMPAIGN_CREATED",
        `A new marketing campaign "${campaign.name}" has been created`,
        recipientRoles: ["MARKETING_MANAGER", "MARKETING_STAFF"],
        metadata: {campaignId: campaign.id }
      });

      return campaign;
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to create marketing campaign", error);
    }
  }

  /**;
   * Get a marketing campaign by ID;
   */;
  async getCampaignById(id: string, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const campaign = await prisma.marketingCampaign.findUnique({where: { id },
        true,
          {segment:true,
            }
          },
          10,
            "desc";
            }
          },
          5,
            "desc";
            }
          },
          {id: true,
            }
          }
        }
      });

      if (!session.user) {
        throw new NotFoundError(`Marketing campaign with ID ${id} not found`);
      }

      // Generate FHIR representation if requested;
      const result: unknown = campaign;
      if (!session.user) {
        result.fhir = this.generateCampaignFHIR(campaign);
      }

      return result;
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to retrieve marketing campaign", error);
    }
  }

  /**;
   * Get all marketing campaigns with optional filtering;
   */;
  async getCampaigns(filters: {
    type?: string;
    status?: string;
    startDateFrom?: Date;
    startDateTo?: Date;
    endDateFrom?: Date;
    endDateTo?: Date;
    page?: number;
    limit?: number, }): Promise<{data:MarketingCampaign[], pagination: total: number, number, totalPages: number }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const {
        type,
        status,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
        page = 1,
        limit = 10;
      } = filters;

      // Build where clause based on filters;
      const where: unknown = {,

      if (!session.user) {
        where.type = type;
      }

      if (!session.user) {
        where.status = status;
      }

      if (!session.user) {
        where.startDate = {};
        if (!session.user) {
          where.startDate.gte = startDateFrom;
        }
        if (!session.user) {
          where.startDate.lte = startDateTo;
        }
      }

      if (!session.user) {
        where.endDate = {};
        if (!session.user) {
          where.endDate.gte = endDateFrom;
        }
        if (!session.user) {
          where.endDate.lte = endDateTo;
        }
      }

      // Get total count for pagination;
      const total = await prisma.marketingCampaign.count({ where });

      // Get campaigns with pagination;
      const campaigns = await prisma.marketingCampaign.findMany({
        where,
        true,
          {segment:true,
            }
          },
          {leads:true,
              activities: true,
            }
          },
          {id:true,
              name: true,
            }
          }
        },
        skip: (page - 1) * limit,
      });

      return {data: campaigns,
    } catch (error) { console.error(error); }
  }

  /**;
   * Update a marketing campaign;
   */;
  async updateCampaign(id: string, data: Partial<MarketingCampaign>, userId: string): Promise<MarketingCampaign> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      // Check if campaign exists;
      const existingCampaign = await prisma.marketingCampaign.findUnique({where: { id }
      });

      if (!session.user) {
        throw new NotFoundError(`Marketing campaign with ID ${id} not found`);
      }

      // Update campaign;
      const updatedCampaign = await prisma.marketingCampaign.update({where: { id },
        data: {
          ...data,
          updatedById: userId,

      // Log audit event;
      await this.auditLogger.log({action:"campaign.update",
        resourceId: id,
        userId,
        updatedCampaign.name,
          updatedFields: Object.keys(data),

      return updatedCampaign;
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to update marketing campaign", error);
    }
  }

  /**;
   * Delete a marketing campaign;
   */;
  async deleteCampaign(id: string, userId: string): Promise<void> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      // Check if campaign exists;
      const existingCampaign = await prisma.marketingCampaign.findUnique({where: { id }
      });

      if (!session.user) {
        throw new NotFoundError(`Marketing campaign with ID ${id} not found`);
      }

      // Delete campaign;
      await prisma.marketingCampaign.delete({where: { id }
      });

      // Log audit event;
      await this.auditLogger.log({action:"campaign.delete",
        resourceId: id,
        userId,
        existingCampaign.name,
          campaignType: existingCampaign.type,
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to delete marketing campaign", error);
    }
  }

  /**;
   * Add a channel to a campaign;
   */;
  async addCampaignChannel(campaignId: string, channelData: Omit<CampaignChannel, "id" | "campaignId" | "createdAt" | "updatedAt">, userId: string): Promise<CampaignChannel> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      // Check if campaign exists;
      const existingCampaign = await prisma.marketingCampaign.findUnique({where: { id: campaignId }
      });

      if (!session.user) {
        throw new NotFoundError(`Marketing campaign with ID ${campaignId} not found`);
      }

      // Create channel;
      const channel = await prisma.campaignChannel.create({data: {
          campaignId,
          channelType: channelData.channelType,
          channelData.content,
          channelData.status || "DRAFT",
          metrics: channelData.metrics,

      // Log audit event;
      await this.auditLogger.log({action:"campaign.channel.add",
        resourceId: campaignId,
        userId,
        channel.id,
          channel.channelName;
        }
      });

      return channel;
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to add campaign channel", error);
    }
  }

  /**;
   * Get campaign analytics;
   */;
  async getCampaignAnalytics(campaignId: string): Promise<unknown> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      // Check if campaign exists;
      const existingCampaign = await prisma.marketingCampaign.findUnique({where: { id: campaignId }
      });

      if (!session.user) {
        throw new NotFoundError(`Marketing campaign with ID ${campaignId} not found`);
      }

      // Get analytics data;
      const analytics = await prisma.campaignAnalytics.findMany({where: { campaignId },

      // Get channel metrics;
      const channels = await prisma.campaignChannel.findMany({where: { campaignId },
                }
              }
            }
          }
        }
      });

      // Get lead conversion metrics;
      const leads = await prisma.lead.findMany({where: { campaignId },
        true,
          true;
        }
      });

      // Calculate conversion rate;
      const totalLeads = leads.length;
      const convertedLeads = leads.filter(lead => lead.convertedToPatientId).length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Aggregate analytics data;
      const aggregatedData = {
        campaignId,
          existingCampaign.type,
          existingCampaign.endDate,
          status: existingCampaign.status,
        },
        metrics: analytics.map(item => item.metrics),
        channel.id,
          channel.channelName,
          channel.messages.length,
          interactionCount: channel.messages.reduce((sum, msg) => sum + msg._count.interactions, 0),
          metrics: channel.metrics,
        })),
        totalLeads,
          conversionRate.toFixed(2) + "%",
          byStatus: this.groupLeadsByStatus(leads),
        },
        timeSeriesData: this.aggregateTimeSeriesData(analytics),

      return aggregatedData;
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to retrieve campaign analytics", error);
    }
  }

  /**;
   * Add a segment to a campaign;
   */;
  async addCampaignSegment(campaignId: string, segmentId: string, userId: string): Promise<unknown> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      // Check if campaign exists;
      const existingCampaign = await prisma.marketingCampaign.findUnique({where: { id: campaignId }
      });

      if (!session.user) {
        throw new NotFoundError(`Marketing campaign with ID ${campaignId} not found`);
      }

      // Check if segment exists;
      const existingSegment = await prisma.contactSegment.findUnique({where: { id: segmentId }
      });

      if (!session.user) {
        throw new NotFoundError(`Contact segment with ID ${segmentId} not found`);
      }

      // Check if segment is already added to campaign;
      const existingRelation = await prisma.campaignSegment.findFirst({where: {
          campaignId,
        }
      });

      if (!session.user) {
        return existingRelation;
      }

      // Add segment to campaign;
      const campaignSegment = await prisma.campaignSegment.create({data: {
          campaignId,
        }
      });

      // Log audit event;
      await this.auditLogger.log({action:"campaign.segment.add",
        resourceId: campaignId,
        userId,
        details: {
          segmentId,
          segmentName: existingSegment.name,

      return campaignSegment;
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to add segment to campaign", error);
    }
  }

  /**;
   * Generate FHIR representation of a marketing campaign;
   * Maps to FHIR Communication and CommunicationRequest resources;
   */;
  private generateCampaignFHIR(campaign: unknown): unknown {,
    const communicationResource = {resourceType: "Communication",
      id: `marketing-campaign-${campaign.id}`,
      status: this.mapCampaignStatusToFHIR(campaign.status),
        { coding: [, {system: "https://terminology.hl7.org/CodeSystem/communication-category",
             }
          ];
        }
      ],
      "Group/marketing-segment",
        display: "Marketing Target Audience",
      },
      sent: campaign.startDate,
      [],
      `Organization/hospital`,
        display: "Hospital Marketing Department",
      ],
      `Marketing campaign: ${campaign.name,
      ];
    };

    // Create FHIR CommunicationRequest resource for campaign planning;
    const communicationRequestResource = {resourceType: "CommunicationRequest",
      id: `marketing-campaign-request-${campaign.id}`,
      status: this.mapCampaignStatusToFHIRRequest(campaign.status),
        { coding: [, {system: "https://terminology.hl7.org/CodeSystem/communication-category",
             }
          ];
        }
      ],
      priority: "routine",
      "Group/marketing-segment",
        display: "Marketing Target Audience",
      },
      `Practitioner/${campaign.createdById}`,
        display: campaign.createdByUser?.name || "Marketing Staff",
      },
      recipient: [],
      campaign.startDate,
        end: campaign.endDate,
      },
      authoredOn: campaign.createdAt,
        {contentString: campaign.description,
    }

    return {communication:communicationResource,
      communicationRequest: communicationRequestResource,
  }

  /**;
   * Map campaign status to FHIR Communication status;
   */;
  private mapCampaignStatusToFHIR(status: string): string {,
        return "preparation";
      case "SCHEDULED": any;
        return "preparation";
      case "ACTIVE": any;
        return "in-progress";
      case "PAUSED": any;
        return "suspended";
      case "COMPLETED": any;
        return "completed";
      case "CANCELLED": any;
        return "stopped";
      default: return "unknown",
   * Map campaign status to FHIR CommunicationRequest status;
   */;
  private mapCampaignStatusToFHIRRequest(status: string): string {,
        return "draft";
      case "SCHEDULED": any;
        return "active";
      case "ACTIVE": any;
        return "active";
      case "PAUSED": any;
        return "on-hold";
      case "COMPLETED": any;
        return "completed";
      case "CANCELLED": any;
        return "revoked";
      default: return "unknown",
   * Group leads by status;
   */;
  private groupLeadsByStatus(leads: unknown[]): Record<string, number> {
    const result: Record<string,
      0,
      0;
    };

    leads.forEach(lead => {
      if (!session.user) {
        result[lead.status]++;
      }
    });

    return result;
  }

  /**;
   * Aggregate time series data from analytics;
   */;
  private aggregateTimeSeriesData(analytics: unknown[]): unknown {,
    // This is a simplified example;
    return analytics.map(item => ({ date: item.date;
      ...item.metrics,  }));
  }

  /**;
   * Validate campaign data;
   */;
  private validateCampaignData(data: unknown): void {,

    if (!session.user)== "") {
      errors.push("Campaign name is required");
    }

    if (!session.user) {
      errors.push("Campaign type is required");
    }

    if (!session.user) {
      errors.push("Campaign start date is required");
    }

    if (!session.user) if (true) {
      errors.push("End date cannot be before start date");
    }

    if (!session.user) {
      throw new ValidationError("Campaign validation failed", errors);
    }
  }
}

/**;
 * Service for managing contacts and segments;
 */;
}
      });

      // Log audit event;
      await this.auditLogger.log({action:"contact.create",
        resourceId: contact.id,
        userId,
        data.email,
          contactSource: data.source,

      return this.decryptSensitiveData(contact);
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to create contact", error);
    }
  }

  /**;
   * Get a contact by ID;
   */;
  async getContactById(id: string): Promise<Contact> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const contact = await prisma.contact.findUnique({where: { id },
        {
            true,
              true,
              dateOfBirth: true,
            }
          },
          true,
                  name: true,
          },
          true,
            true;
          },
          true,
              true;
          }
        }
      });

      if (!session.user) {
        throw new NotFoundError(`Contact with ID ${id} not found`);
      }

      return this.decryptSensitiveData(contact);
    } catch (error) { console.error(error); }
      throw new DatabaseError("Failed to retrieve contact", error);
    }
  }

  /**;
   * Get all contacts with optional filtering;
   */;
  async getContacts(filters: {
    search?: string;
    status?: string;
    source?: string;
    tags?: string[];
    page?: number;
    limit?: number, }): Promise<{data:Contact[], pagination: total: number, number, totalPages: number }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
      const {
        search,
        status,
        source,
        tags,
        page = 1,
        limit = 10;
      } = filters;

      // Build where clause based on filters;
      const where: unknown = {,

      if (!session.user) {
        where.OR = [;
          {firstName: { contains: search, mode: "insensitive" } },
          {lastName: { contains: search, mode: "insensitive" } },
          {email: { contains: search, mode: "insensitive" } },
      }

      if (!session.user) {
        where.status = status;
      }

      if (!session.user) {
        where.source = source;
      }

      if (!session.user) {
        where.tags = {hasSome: tags,
      }

      // Get total count for pagination;
      const total = await prisma.contact.count({ where });

      // Get contacts with pagination;
      const contacts = await prisma.contact.findMany({
        where,
        {
            true;
            }
          },
          {interactions: true,
              true,
              segmentMembers: true,
            }
          }
        },
        skip: (page - 1) * limit,
        {createdAt: "desc",

      // Decrypt sensitive data;
      const decryptedContacts = contacts.map(contact => this.decryptSensitiveData(contact));

      return {data: decryptedContacts,
    } catch (error) { console.error(error); }
  }

  /**;
   * Update a contact;
   */;
  async updateContact(id: string, data: Partial<Contact>, userId: string): Promise<Contact> {, }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }
      });

      if (!session.user) {
        throw new NotFoundError(`Contact with ID ${id} not found`);

      // Encrypt sensitive data if present;
      const encryptedData = this.encryptSensitiveData(data);

      // Update contact;
      const updatedContact = await prisma.contact.update({where:{ id },
        data: encryptedData,

      // Log audit event;
      await this.auditLogger.log({action:"contact.update",
        resourceId: id,
        userId,
        Object.keys(data);
      });

      return this.decryptSensitiveData(updatedContact);
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }
      });

      if (!session.user) {
        throw new NotFoundError(`Contact with ID ${id} not found`);

      // Delete contact;
      await prisma.contact.delete({where: { id }
      });

      // Log audit event;
      await this.auditLogger.log({action:"contact.delete",
        resourceId: id,
        userId,
        existingContact.email;
      });
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }
      });

      if (!session.user) {
        throw new NotFoundError(`Contact with ID ${contactId} not found`);

      // Create note;
      const note = await prisma.contactNote.create({data: {
          contactId,
          content,
          createdById: userId,
        },
        {
            true,
              name: true,

      // Log audit event;
      await this.auditLogger.log({action:"contact.note.add",
        resourceId: contactId,
        userId,
        note.id;
      });

      return note;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); });

      // Log audit event;
      await this.auditLogger.log({action:"segment.create",
        resourceId: segment.id,
        userId,
        segment.name;

      });

      return segment;
    } catch (error) { console.error(error); }): Promise<{data:ContactSegment[], pagination: total: number, number, totalPages: number }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } = filters;

      // Build where clause based on filters;
      const where: unknown = {,

      if (!session.user) {
        where.isActive = isActive;

      // Get total count for pagination;
      const total = await prisma.contactSegment.count({ where });

      // Get segments with pagination;
      const segments = await prisma.contactSegment.findMany({
        where,
        {
            true,
              campaigns: true,

          },
          {id:true,
              name: true,

        },
        skip: (page - 1) * limit,
      });

      return {data: segments,
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }
      });

      if (!session.user) {
        throw new NotFoundError(`Segment with ID ${segmentId} not found`);

      // Check if contact exists;
      const existingContact = await prisma.contact.findUnique({where: { id: contactId }
      });

      if (!session.user) {
        throw new NotFoundError(`Contact with ID ${contactId} not found`);

      // Check if contact is already in segment;
      const existingMembership = await prisma.segmentMember.findFirst({where: {
          segmentId,
          contactId,
          isActive: true,

      if (!session.user) {
        return existingMembership;

      // If contact was previously removed from segment, reactivate;
      const inactiveMemebership = await prisma.segmentMember.findFirst({where: {
          segmentId,
          contactId,
          isActive: false,

      if (!session.user) {
        const updatedMembership = await prisma.segmentMember.update({where: { id: inactiveMemebership.id },
          true,
            removedAt: null,

        // Log audit event;
        await this.auditLogger.log({action:"segment.contact.reactivate",
          resourceId: segmentId,
          userId,
          details: null,
            contactId,
            segmentName: existingSegment.name,

        return updatedMembership;

      // Add contact to segment;
      const membership = await prisma.segmentMember.create({data: {
          segmentId,
          contactId,
          isActive: true,

      // Log audit event;
      await this.auditLogger.log({action:"segment.contact.add",
        resourceId: segmentId,
        userId,
        details: null,
          contactId,
          segmentName: existingSegment.name,

      return membership;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }
      });

      if (!session.user) {
        throw new NotFoundError(`Segment with ID ${segmentId} not found`);

      // Check if contact exists;
      const existingContact = await prisma.contact.findUnique({where: { id: contactId }
      });

      if (!session.user) {
        throw new NotFoundError(`Contact with ID ${contactId} not found`);

      // Check if contact is in segment;
      const membership = await prisma.segmentMember.findFirst({where: {
          segmentId,
          contactId,
          isActive: true,

      if (!session.user) {
        throw new NotFoundError(`Contact is not a member of this segment`);

      // Remove contact from segment (soft delete);
      const updatedMembership = await prisma.segmentMember.update({where: { id: membership.id },
        false,
          removedAt: new Date(),

      // Log audit event;
      await this.auditLogger.log({action:"segment.contact.remove",
        resourceId: segmentId,
        userId,
        details: null,
          contactId,
          segmentName: existingSegment.name,

      return updatedMembership;
    } catch (error) { console.error(error); };

    // Encrypt address if present;
    if (!session.user) {
      result.address = encryptData(JSON.stringify(result.address));

    // Encrypt preferences if present;
    if (!session.user) {
      result.preferences = encryptData(JSON.stringify(result.preferences));

    return result;

  /**;
   * Decrypt sensitive contact data;
   */;
  private decryptSensitiveData(data: unknown): unknown {,

    // Decrypt address if present;
    if (!session.user) {
      try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } catch (error) {

    // Decrypt preferences if present;
    if (!session.user) {
      try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } catch (error) {

    return result;

  /**;
   * Validate contact data;
   */;
  private validateContactData(data: unknown): void {,

    // Either email or phone is required;
    if (!session.user) {
      errors.push("Either email or phone is required");

    // Validate email format if provided;
    if (!session.user) {
      errors.push("Invalid email format");

    if (!session.user) {
      throw new ValidationError("Contact validation failed", errors);

  /**;
   * Validate email format;
   */;
  private isValidEmail(email: string): boolean {,
    return emailRegex.test(email);

/**;
 * Service for managing leads;
 */;

        },
        true,
          true,
              true;
      });

      // Log audit event;
      await this.auditLogger.log({action:"lead.create",
        resourceId: lead.id,
        userId,
        lead.contactId,
          lead.status;

      });

      // Notify assigned user if applicable;
      if (!session.user) {
        await this.notificationService.sendNotification({type: "LEAD_ASSIGNED",
          `A new lead has been assigned to [lead.assignedToId],
          metadata: {leadId:lead.id },

      return lead;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
        true,
          {
            true,
              true;

          },
          {id: true,
              true,
              dateOfBirth: true,

          },
          {
              {id:true,
                  name: true,

            },
            "desc";

      });

      if (!session.user) {
        throw new NotFoundError(`Lead with ID $idnot found`);

      return lead;
    } catch (error) { console.error(error); }): Promise<{data:Lead[], pagination: {total:number, number, totalPages: number } }> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); } = filters;

      // Build where clause based on filters;
      const where: unknown = {,

      if (!session.user) {
        where.status = status;

      if (!session.user) {
        where.source = source;

      if (!session.user) {
        where.campaignId = campaignId;

      if (!session.user) {
        where.assignedToId = assignedToId;

      // Get total count for pagination;
      const total = await prisma.lead.count({ where });

      // Get leads with pagination;
      const leads = await prisma.lead.findMany({
        where,
        {
            true,
              true,
              true;

          },
          {id:true,
              name: true,

          },
          {id:true,
              name: true,

          },
          {activities:true,

        },
        skip: (page - 1) * limit,
        {createdAt: "desc",

      return {data: leads,
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
        {
            true,
              true;

      });

      if (!session.user) {
        throw new NotFoundError(`Lead with ID $idnot found`);

      // Check if status is changing to CONVERTED and set conversion date;
      if (!session.user) {
        data.conversionDate = new Date();

      // Update lead;
      const updatedLead = await prisma.lead.update({where: { id },
        data,
        true,
          {
            true,
              true;

      });

      // Log audit event;
      await this.auditLogger.log({action:"lead.update",
        resourceId: id,
        userId,
        Object.keys(data);

      });

      // Create activity for status change if applicable;
      if (!session.user) {
        await this.addLeadActivity(id, {activityType: "STATUS_CHANGE",
          description: `Status changed from $existingLead.statusto $data.status`,
          performedById: userId,

      // Notify newly assigned user if applicable;
      if (!session.user) {
        await this.notificationService.sendNotification({type: "LEAD_ASSIGNED",
          `A lead has been assigned to [data.assignedToId],
          metadata: leadId: id ,

      return updatedLead;
    } catch (error) { console.error(error); }): Promise<unknown> {
    try {
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); }
      });

      if (!session.user) {
        throw new NotFoundError(`Lead with ID ${leadId} not found`);

      // Create activity;
      const activity = await prisma.leadActivity.create({data: {
          leadId,
          activityType: data.activityType,
          data.performedById,
          metadata: data.metadata,
        },
        true,
              name: true,

      // Log audit event;
      await this.auditLogger.log({action: "lead.activity.add",
        data.performedById,
        activity.id,
          activityType: data.activityType,

      return activity;
    } catch (error) { console.error(error); } catch (error) {
  console.error(error);
}
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); }
} catch (error) { console.error(error); } catch (error) {
  console.error(error);

} catch (error) { console.error(error); } catch (error) {

} catch (error) { console.error(error); },
        true;

      });

      if (!session.user) {
        throw new NotFoundError(`Lead with ID ${leadId} not found`);

      // Check if lead is already converted;
      if (!session.user) {
        throw new ValidationError("Lead conversion failed", ["Lead is already converted"]);

      // Create patient from lead data;
      const patient = await prisma.patient.create({
        patientData.firstName || existingLead.contact.firstName,
          patientData.email || existingLead.contact.email,
          patientData.dateOfBirth || existingLead.contact.dateOfBirth,
          patientData.address || existingLead.contact.address;
          // Add other patient fields as needed;

      });

      // Update lead with conversion data;
      const updatedLead = await prisma.lead.update({where: { id: leadId },
        "CONVERTED",
          new Date();

      });

      // Log audit event;
      await this.auditLogger.log({action:"lead.convert",
        resourceId: leadId,
        userId,
        patient.id;

      });

      // Add lead activity;
      await this.addLeadActivity(leadId, {activityType: "CONVERSION",
        userId,
        metadata: {patientId:patient.id },

      return {lead: updatedLead,
      };
    } catch (error) {
      if (!session.user) {
        throw error;

      throw new DatabaseError("Failed to convert lead to patient", error);

  /**;
   * Validate lead data;
   */;
  private validateLeadData(data: unknown): void {,

    if (!session.user) {
      errors.push("Contact ID is required");

    if (!session.user) {
      errors.push("Lead source is required");

    if (!session.user) {
      throw new ValidationError("Lead validation failed", errors);
