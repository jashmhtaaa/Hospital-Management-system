
import { AuditLogger } from '@/lib/audit';
import { decryptData, encryptData } from '@/lib/encryption';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';
import { FhirResourceGenerator } from '@/lib/fhir';
import { Contact, ContactNote, ContactStatus } from '@/lib/models/marketing';
import { NotificationService } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';
/**
 * Service for managing marketing contacts and related operations;
 */

}
      };

      // Create contact in database
      const contact = await prisma.contact.create({
        data: {,
          firstName: encryptedData.firstName,
           encryptedData.email,
           encryptedData.address,
           encryptedData.gender,
           encryptedData.organization,
           encryptedData.status || ContactStatus.ACTIVE,
           encryptedData.preferences,
          patientId: encryptedData.patientId,
        },
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'contact.create',
        resourceId: contact.id;
        userId,
        details: {,
          contactSource: contact.source,
          hasPatientRecord: !!contact.patientId,
        }
      });

      // Decrypt sensitive data before returning
      return this.decryptContactData(contact);
    } catch (error) {
       {\n  {
        throw error;
      }
      throw new DatabaseError('Failed to create contact', error);
    }
  }

  /**
   * Get a contact by ID;
   */
  async getContactById(id: string, includeFHIR = false): Promise<Contact & { fhir?: unknown }> {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id ,},
        include: {,
          notes: {,
            orderBy: {,
              createdAt: 'desc',
            },
            take: 10,
            include: {,
              createdByUser: {,
                select: {,
                  id: true,
                  name: true,
                }
              }
            }
          },
          patient: includeFHIR ? true : false,
          segmentMembers: {,
            where: {,
              isActive: true,
            },
            include: {,
              segment: true,
            }
          },
          leads: {,
            take: 5,
            orderBy: {,
              createdAt: 'desc',
            }
          }
        }
      });

       {\n  {
        throw new NotFoundError(`Contact with ID ${id} not found`);
      }

      // Decrypt sensitive data
      const decryptedContact = this.decryptContactData(contact);

      // Generate FHIR representation if requested
      const result: unknown = decryptedContact;
       {\n  {
        result.fhir = this.generateContactFHIR(decryptedContact);
      }

      return result;
    } catch (error) {
       {\n  {
        throw error;
      }
      throw new DatabaseError('Failed to retrieve contact', error);
    }
  }

  /**
   * Get all contacts with optional filtering;
   */
  async getContacts(filters: {,
    status?: string;
    source?: string;
    search?: string;
    segmentId?: string;
    hasPatient?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Contact[], pagination: total: number,  number, totalPages: number }> {,
    try {
      const {
        status,
        source,
        search,
        segmentId,
        hasPatient,
        page = 1,
        limit = 10;
      } = filters;

      // Build where clause based on filters
      const where: unknown = {,};

       {\n  {
        where.status = status;
      }

       {\n  {
        where.source = source;
      }

       {\n  {
        where.patientId = hasPatient ? { not: null ,} : null;
      }

       {\n  {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } ,},
          { lastName: { contains: search, mode: 'insensitive' } ,},
          { email: { contains: search, mode: 'insensitive' } ,},
          { phone: { contains: search, mode: 'insensitive' } ,},
          { organization: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Handle segment filter
      let segmentFilter = {};
       {\n  {
        segmentFilter = {
          segmentMembers: {,
            some: {,
              segmentId,
              isActive: true,
            }
          }
        };
        Object.assign(where, segmentFilter);
      }

      // Get total count for pagination
      const total = await prisma.contact.count({ where });

      // Get contacts with pagination
      const contacts = await prisma.contact.findMany({
        where,
        include: {,
          patient: {,
            select: {,
              id: true,
               true
            }
          },
          _count: {,
              notes: true,
               true
          }
        },
        skip: (page - 1) * limit,
        take: limit;
        {
          createdAt: 'desc',
        }
      });

      // Decrypt sensitive data
      const decryptedContacts = contacts.map(contact => this.decryptContactData(contact));

      return {
        data: decryptedContacts,
        pagination: {,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      throw new DatabaseError('Failed to retrieve contacts', error);
    }
  }

  /**
   * Update a contact;
   */
  async updateContact(id: string, data: Partial<Contact>, userId: string): Promise<Contact> {,
    try {
      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id },
      });

       {\n  {
        throw new NotFoundError(`Contact with ID ${id} not found`);
      }

      // Encrypt sensitive data if provided
      const updateData: unknown = { ...data ,};

       {\n  {
        updateData.email = encryptData(data.email);
      }

       {\n  {
        updateData.phone = encryptData(data.phone);
      }

       {\n  {
        updateData.address = encryptData(JSON.stringify(data.address));
      }

      // Update contact
      const updatedContact = await prisma.contact.update({
        where: { id ,},
        data: updateData,
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'contact.update',
        resourceId: id;
        userId,
        details: 
          updatedFields: Object.keys(data),
      });

      // Decrypt sensitive data before returning
      return this.decryptContactData(updatedContact);
    } catch (error) {
       {\n  {
        throw error;
      }
      throw new DatabaseError('Failed to update contact', error);
    }
  }

  /**
   * Add a note to a contact;
   */
  async addContactNote(contactId: string, content: string, userId: string): Promise<ContactNote> {,
    try {
      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id: contactId },
      });

       {\n  {
        throw new NotFoundError(`Contact with ID ${contactId} not found`);
      }

      // Create note
      const note = await prisma.contactNote.create({
        data: {,
          contactId,
          content,
          createdById: userId,
        },
        include: {,
          createdByUser: {,
            select: {,
              id: true,
              name: true,
            }
          }
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'contact.note.add',
        resourceId: contactId;
        userId,
        details: 
          noteId: note.id,
      });

      return note;
    } catch (error) {
       {\n  {
        throw error;
      }
      throw new DatabaseError('Failed to add contact note', error);
    }
  }

  /**
   * Link a contact to a patient;
   */
  async linkContactToPatient(contactId: string, patientId: string, userId: string): Promise<Contact> {,
    try {
      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id: contactId },
      });

       {\n  {
        throw new NotFoundError(`Contact with ID ${contactId} not found`);
      }

      // Check if patient exists
      const existingPatient = await prisma.patient.findUnique({
        where: { id: patientId },
      });

       {\n  {
        throw new NotFoundError(`Patient with ID ${patientId} not found`);
      }

      // Update contact with patient link
      const updatedContact = await prisma.contact.update({
        where: { id: contactId ,},
        data: {,
          patientId
        },
        include: {,
          patient: {,
            select: {,
              id: true,
               true
            }
          }
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'contact.link.patient',
        resourceId: contactId;
        userId,
        details: {,
          patientId
        }
      });

      // Decrypt sensitive data before returning
      return this.decryptContactData(updatedContact);
    } catch (error) {
       {\n  {
        throw error;
      }
      throw new DatabaseError('Failed to link contact to patient', error);
    }
  }

  /**
   * Generate FHIR representation of a contact;
   * Maps to FHIR Patient and RelatedPerson resources;
   */
  private generateContactFHIR(contact: Contact): unknown {,
    // If contact is linked to a patient, use Patient resource
     {\n  {
      return {
        resourceType: 'Patient',
        id: `patient-${contact.patientId,}`,
        identifier: [,
          {
            system: 'urn:oid:2.16.840.1.113883.2.4.6.3',
            value: contact.patientId,
          }
        ],
        name: [,
          {
            use: 'official',
             [contact.firstName || '']
          }
        ],
        telecom: [,
          {
            system: 'email',
             'home'
          },
          {
            system: 'phone',
             'mobile'
          }
        ],
        gender: contact.gender?.toLowerCase() || 'unknown',
        birthDate: contact.dateOfBirth ? contact.dateOfBirth.toISOString().split('T')[0] : undefined,
      };
    }

    // Otherwise use RelatedPerson resource
    return {
      resourceType: 'RelatedPerson',
      id: `contact-${contact.id,}`,
      identifier: [,
        {
          system: 'urn:oid:2.16.840.1.113883.2.4.6.3',
          value: contact.id,
        }
      ],
      name: [,
        {
          use: 'official',
           [contact.firstName || '']
        }
      ],
      telecom: [,
        {
          system: 'email',
           'home'
        },
        {
          system: 'phone',
           'mobile'
        }
      ],
      gender: contact.gender?.toLowerCase() || 'unknown',
      birthDate: contact.dateOfBirth ? contact.dateOfBirth.toISOString().split('T')[0] : undefined,
    };
  }

  /**
   * Validate contact data;
   */
  private validateContactData(data: Partial<Contact>): void {,
    const errors: string[] = [];

    // Email or phone is required
     {\n  {
      errors.push('Either email or phone is required');
    }

    // Validate email format if provided
     {\n   {
      errors.push('Invalid email format');
    }

    // Validate phone format if provided
     {\n   {
      errors.push('Invalid phone format');
    }

    // Check for valid status
     {\n  includes(data.status as ContactStatus)) {
      errors.push(`Invalid status: ${}`;
    }

     {\n  {
      throw new ValidationError('Contact validation failed', errors);
    }
  }

  /**
   * Validate email format;
   */
  private isValidEmail(email: string): boolean {,
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format;
   */
  private isValidPhone(phone: string): boolean {,
    // Allow various phone formats
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Decrypt sensitive contact data;
   */
  private decryptContactData(contact: unknown): Contact {,
    try {
      const decryptedContact = { ...contact };

       {\n  {
        decryptedContact.email = decryptData(contact.email);
      }

       {\n  {
        decryptedContact.phone = decryptData(contact.phone);
      }

       {\n  {
        decryptedContact.address = JSON.parse(decryptData(contact.address));
      }

      return decryptedContact;
    } catch (error) {

      return contact;
    }
  }
