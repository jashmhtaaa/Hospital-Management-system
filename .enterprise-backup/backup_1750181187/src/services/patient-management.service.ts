import { EmergencyContact, type Patient, PatientAddress, PatientIdentification, PatientInsurance, PrismaClient } from '@prisma/client';
import * as z from 'zod';


import { FhirService } from '../lib/fhir/fhir-r4-base';
import { NotificationService } from '../lib/notifications';
import { AuditService } from './audit_log_service.ts';
import { AuthService } from './auth_service.ts';
import { EncryptionService } from './encryption_service.ts';
const prisma = new PrismaClient();

// Define schema for patient creation/update
const PatientSchema = z.object({
  // Required fields
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date(),
  gender: z.string().min(1, "Gender is required"),

  // Optional fields
  mrn: z.string().optional(),
  title: z.string().optional(),
  middleName: z.string().optional(),
  preferredName: z.string().optional(),
  biologicalSex: z.string().optional(),
  genderIdentity: z.string().optional(),
  pronouns: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  language: z.string().default("English"),
  interpreter: z.boolean().default(false),
  ethnicity: z.string().optional(),
  race: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  educationLevel: z.string().optional(),
  bloodType: z.string().optional(),
  rh: z.string().optional(),
  organDonor: z.boolean().default(false),
  deceasedDate: z.date().optional(),
  deceasedReason: z.string().optional(),
  vip: z.boolean().default(false),
  confidential: z.boolean().default(false),
  notes: z.string().optional(),
});

// Define schema for contact information
const ContactSchema = z.object({
  phoneHome: z.string().optional(),
  phoneMobile: z.string().optional(),
  phoneWork: z.string().optional(),
  phonePreferred: z.string().min(1, "Preferred phone type is required"),
  email: z.string().email().optional(),
  emailOptIn: z.boolean().default(false),
  smsOptIn: z.boolean().default(false),
  mailOptIn: z.boolean().default(true),
  doNotContact: z.boolean().default(false),
  doNotContactReason: z.string().optional(),
});

// Define schema for address
const AddressSchema = z.object({
  addressType: z.string().min(1, "Address type is required"),
  isPrimary: z.boolean().default(false),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().default("USA"),
  county: z.string().optional(),
  validFrom: z.date().default(new Date()),
  validTo: z.date().optional(),
  isBilling: z.boolean().default(false),
  isShipping: z.boolean().default(false),
  notes: z.string().optional(),
});

// Define schema for identification
const IdentificationSchema = z.object({
  idType: z.string().min(1, "ID type is required"),
  idNumber: z.string().min(1, "ID number is required"),
  issuingCountry: z.string().optional(),
  issuingState: z.string().optional(),
  issueDate: z.date().optional(),
  expirationDate: z.date().optional(),
  isPrimary: z.boolean().default(false),
  documentImageUrl: z.string().optional(),
  notes: z.string().optional(),
});

// Define schema for emergency contact
const EmergencyContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  isPrimary: z.boolean().default(false),
  phoneHome: z.string().optional(),
  phoneMobile: z.string().optional(),
  phoneWork: z.string().optional(),
  phonePreferred: z.string().min(1, "Preferred phone type is required"),
  email: z.string().email().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  isLegalGuardian: z.boolean().default(false),
  hasDecisionMaking: z.boolean().default(false),
  notes: z.string().optional(),
});

// Define schema for insurance
const InsuranceSchema = z.object({
  insuranceType: z.string().min(1, "Insurance type is required"),
  payerName: z.string().min(1, "Payer name is required"),
  planName: z.string().optional(),
  policyNumber: z.string().min(1, "Policy number is required"),
  groupNumber: z.string().optional(),
  subscriberId: z.string().optional(),
  subscriberName: z.string().optional(),
  subscriberRelation: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  copayAmount: z.number().optional(),
  coinsuranceRate: z.number().optional(),
  deductibleAmount: z.number().optional(),
  deductibleMet: z.number().optional(),
  outOfPocketMax: z.number().optional(),
  outOfPocketMet: z.number().optional(),
  cardFrontImageUrl: z.string().optional(),
  cardBackImageUrl: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Service class for patient management;
 */

}
  }

  /**
   * Generate a unique MRN for a new patient;
   */
  private async generateMRN(): Promise<string> {
    // Get current date for prefix
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    // Get count of patients for the day to generate a sequential number
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const patientCount = await prisma.patient.count({
      where: {,
        createdAt: {,
          gte: today,
        }
      }
    });

    // Generate sequential number with padding
    const sequentialNumber = (patientCount + 1).toString().padStart(4, '0');

    // Combine to create MRN: YY-MM-XXXX,
    const mrn = `${year}-${month}-${sequentialNumber}`;

    return mrn;
  }

  /**
   * Create a new patient;
   */
  async createPatient(patientData: unknown, userId: string): Promise<Patient> {,
    try {
      // Validate patient data
      const validatedPatient = PatientSchema.parse(patientData);

      // Generate MRN if not provided
      const mrn = validatedPatient.mrn || await this.generateMRN();

      // Create patient record
      const patient = await prisma.patient.create({
        data: {,
          ...validatedPatient,
          mrn,
        }
      });

      // Create contact information if provided
       {\n  {
        const validatedContact = ContactSchema.parse(patientData.contact);
        await prisma.patientContact.create({
          data: {,
            ...validatedContact,
            patientId: patient.id,
          }
        });
      }

      // Create address if provided
       {\n  {
        const validatedAddress = AddressSchema.parse(patientData.address);
        await prisma.patientAddress.create({
          data: {,
            ...validatedAddress,
            patientId: patient.id,
          }
        });
      }

      // Create identification if provided
       {\n  {
        const validatedIdentification = IdentificationSchema.parse(patientData.identification);
        await prisma.patientIdentification.create({
          data: {,
            ...validatedIdentification,
            patientId: patient.id,
          }
        });
      }

      // Create emergency contact if provided
       {\n  {
        const validatedEmergencyContact = EmergencyContactSchema.parse(patientData.emergencyContact);
        await prisma.emergencyContact.create({
          data: {,
            ...validatedEmergencyContact,
            patientId: patient.id,
          }
        });
      }

      // Create insurance if provided
       {\n  {
        const validatedInsurance = InsuranceSchema.parse(patientData.insurance);
        await prisma.patientInsurance.create({
          data: {,
            ...validatedInsurance,
            patientId: patient.id,
          }
        });
      }

      // Create FHIR resource for interoperability
      await this.fhirService.createPatientResource(patient);

      // Log audit
      await this.auditService.logAction({
        action: 'Create',
        resourceType: 'Patient',        resourceId: patient.id,
        description: `Created patient record for /* SECURITY: Template literal eliminated */,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return patient;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get patient by ID;
   */
  async getPatientById(patientId: string, userId: string): Promise<unknown> {,
    try {
      // Check if user has permission to view this patient
      const hasPermission = await this.authService.hasPermission(userId, 'view', 'patient', patientId);
       {\n  {
        throw new Error('Unauthorized to view this patient');
      }

      // Get patient with related data
      const patient = await prisma.patient.findUnique({
        where: { id: patientId ,},
        include: {,
          contact: true,
          addresses: true,          identifications: true,
          contacts: true,          insurances: true,
          allergies: true,          conditions: true,
          documents: true,          appointments: {,
            take: 5,
            orderBy: { startDateTime: 'desc' },
          },
          visits: {,
            take: 5,
            orderBy: { startDate: 'desc' },
          },
          vitalSigns: {,
            take: 10,
            orderBy: { recordedAt: 'desc' },
          },
          immunizations: {,
            take: 10,
            orderBy: { administeredDate: 'desc' },
          }
        }
      });

       {\n  {
        throw new Error('Patient not found');
      }

      // Log audit
      await this.auditService.logAction({
        action: 'View',
        resourceType: 'Patient',        resourceId: patientId,
        description: `Viewed patient record for /* SECURITY: Template literal eliminated */,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return patient;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Update patient information;
   */
  async updatePatient(patientId: string, patientData: unknown, userId: string): Promise<Patient> {,
    try {
      // Check if user has permission to update this patient
      const hasPermission = await this.authService.hasPermission(userId, 'update', 'patient', patientId);
       {\n  {
        throw new Error('Unauthorized to update this patient');
      }

      // Get current patient data
      const existingPatient = await prisma.patient.findUnique({
        where: { id: patientId },
      });

       {\n  {
        throw new Error('Patient not found');
      }

      // Validate patient data
      const validatedPatient = PatientSchema.parse({
        ...existingPatient,
        ...patientData;
      });

      // Update patient record
      const patient = await prisma.patient.update({
        where: { id: patientId ,},
        data: validatedPatient,
      });

      // Update contact information if provided
       {\n  {
        const validatedContact = ContactSchema.parse(patientData.contact);
        await prisma.patientContact.upsert({
          where: { patientId ,},
          update: validatedContact,
          create: {,
            ...validatedContact,
            patientId;
          }
        });
      }

      // Update FHIR resource for interoperability
      await this.fhirService.updatePatientResource(patient);

      // Log audit
      await this.auditService.logAction({
        action: 'Update',
        resourceType: 'Patient',        resourceId: patientId,
        description: `Updated patient record for /* SECURITY: Template literal eliminated */,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return patient;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Add patient address;
   */
  async addPatientAddress(patientId: string, addressData: unknown, userId: string): Promise<PatientAddress> {,
    try {
      // Check if user has permission
      const hasPermission = await this.authService.hasPermission(userId, 'update', 'patient', patientId);
       {\n  {
        throw new Error('Unauthorized to update this patient');
      }

      // Validate address data
      const validatedAddress = AddressSchema.parse(addressData);

      // If this is a primary address, unset primary flag on other addresses of same type
       {\n  {
        await prisma.patientAddress.updateMany({
          where: {,
            patientId,
            addressType: validatedAddress.addressType,
            isPrimary: true,
          },
          data: {,
            isPrimary: false,
          }
        });
      }

      // Create address
      const address = await prisma.patientAddress.create({
        data: {,
          ...validatedAddress,
          patientId;
        }
      });

      // Log audit
      await this.auditService.logAction({
        action: 'Create',
        resourceType: 'PatientAddress',        resourceId: address.id,
        description: `Added address for patient ${patientId,}`,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return address;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Add patient identification;
   */
  async addPatientIdentification(patientId: string, identificationData: unknown, userId: string): Promise<PatientIdentification> {,
    try {
      // Check if user has permission
      const hasPermission = await this.authService.hasPermission(userId, 'update', 'patient', patientId);
       {\n  {
        throw new Error('Unauthorized to update this patient');
      }

      // Validate identification data
      const validatedIdentification = IdentificationSchema.parse(identificationData);

      // If this is a primary ID, unset primary flag on other IDs of same type
       {\n  {
        await prisma.patientIdentification.updateMany({
          where: {,
            patientId,
            idType: validatedIdentification.idType,
            isPrimary: true,
          },
          data: {,
            isPrimary: false,
          }
        });
      }

      // Check for existing ID with same number
      const existingId = await prisma.patientIdentification.findFirst({
        where: {,
          idType: validatedIdentification.idType,
          idNumber: validatedIdentification.idNumber,
        }
      });

       {\n  {
        throw new Error(`This ${validatedIdentification.idType} is already associated with another patient`);
      }

      // Create identification
      const identification = await prisma.patientIdentification.create({
        data: {,
          ...validatedIdentification,
          patientId;
        }
      });

      // Log audit
      await this.auditService.logAction({
        action: 'Create',
        resourceType: 'PatientIdentification',        resourceId: identification.id,
        description: `Added identification for patient ${patientId,}`,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return identification;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Add emergency contact;
   */
  async addEmergencyContact(patientId: string, contactData: unknown, userId: string): Promise<EmergencyContact> {,
    try {
      // Check if user has permission
      const hasPermission = await this.authService.hasPermission(userId, 'update', 'patient', patientId);
       {\n  {
        throw new Error('Unauthorized to update this patient');
      }

      // Validate contact data
      const validatedContact = EmergencyContactSchema.parse(contactData);

      // If this is a primary contact, unset primary flag on other contacts
       {\n  {
        await prisma.emergencyContact.updateMany({
          where: {,
            patientId,
            isPrimary: true,
          },
          data: {,
            isPrimary: false,
          }
        });
      }

      // Create contact
      const contact = await prisma.emergencyContact.create({
        data: {,
          ...validatedContact,
          patientId;
        }
      });

      // Log audit
      await this.auditService.logAction({
        action: 'Create',
        resourceType: 'EmergencyContact',        resourceId: contact.id,
        description: `Added emergency contact for patient ${patientId,}`,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return contact;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Add insurance;
   */
  async addInsurance(patientId: string, insuranceData: unknown, userId: string): Promise<PatientInsurance> {,
    try {
      // Check if user has permission
      const hasPermission = await this.authService.hasPermission(userId, 'update', 'patient', patientId);
       {\n  {
        throw new Error('Unauthorized to update this patient');
      }

      // Validate insurance data
      const validatedInsurance = InsuranceSchema.parse(insuranceData);

      // If there's an existing insurance of the same type, update its status based on priority
       {\n  {
        // Find existing primary insurance
        const existingPrimary = await prisma.patientInsurance.findFirst({
          where: {,
            patientId,
            insuranceType: 'Primary',
          }
        });

        // If found, change it to secondary
         {\n  {
          await prisma.patientInsurance.update({
            where: { id: existingPrimary.id ,},
            data: { insuranceType: 'Secondary' },
          });

          // Find existing secondary and change to tertiary if needed
          const existingSecondary = await prisma.patientInsurance.findFirst({
            where: {,
              patientId,
              insuranceType: 'Secondary',
            }
          });

           {\n  {
            await prisma.patientInsurance.update({
              where: { id: existingSecondary.id ,},
              data: { insuranceType: 'Tertiary' },
            });
          }
        }
      }

      // Create insurance
      const insurance = await prisma.patientInsurance.create({
        data: {,
          ...validatedInsurance,
          patientId;
        }
      });

      // Log audit
      await this.auditService.logAction({
        action: 'Create',
        resourceType: 'PatientInsurance',        resourceId: insurance.id,
        description: `Added insurance for patient ${patientId,}`,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return insurance;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Search patients;
   */
  async searchPatients(searchParams: unknown, userId: string): Promise<unknown> {,
    try {
      // Check if user has permission to search patients
      const hasPermission = await this.authService.hasPermission(userId, 'search', 'patient');
       {\n  {
        throw new Error('Unauthorized to search patients');
      }

      // Build where clause based on search parameters
      const where: unknown = {,};

       {\n  {
        where.mrn = {
          contains: searchParams.mrn,
          mode: 'insensitive',
        };
      }

       {\n  {
        where.firstName = {
          contains: searchParams.firstName,
          mode: 'insensitive',
        };
      }

       {\n  {
        where.lastName = {
          contains: searchParams.lastName,
          mode: 'insensitive',
        };
      }

       {\n  {
        where.dateOfBirth = new Date(searchParams.dateOfBirth);
      }

       {\n  {
        where.contact = {
          OR: [,
            { phoneHome: { contains: searchParams.phone } ,},
            { phoneMobile: { contains: searchParams.phone } ,},
            { phoneWork: { contains: searchParams.phone } },
          ]
        };
      }

       {\n  {
        where.contact = {
          ...where.contact,
          email: {,
            contains: searchParams.email,
            mode: 'insensitive',
          }
        };
      }

       {\n  {
        where.status = searchParams.status;
      }

      // Add pagination parameters
      const skip = searchParams.page ? (searchParams.page - 1) * (searchParams.limit || 10) : 0;
      const take = searchParams.limit || 10;

      // Perform search
      const [patients, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          include: {,
            contact: true,
            addresses: {,
              where: { isPrimary: true },
            }
          },
          skip,
          take,
          orderBy: { lastName: 'asc' },
        }),
        prisma.patient.count({ where })
      ]);

      // Log audit
      await this.auditService.logAction({
        action: 'Search',
        resourceType: 'Patient',        description: 'Performed patient search',
        performedBy: userId,        performerRole: await this.authService.getUserRole(userId),
      });

      return {
        patients,
        total,
        page: searchParams.page || 1,
        limit: take,        totalPages: Math.ceil(total / take),
      };
    } catch (error) {

      throw error;
    }
  }

  /**
   * Mark patient as deceased;
   */
  async markPatientDeceased(patientId: string, data: { deceasedDate: Date, deceasedReason?: string }, userId: string): Promise<Patient> {,
    try {
      // Check if user has permission
      const hasPermission = await this.authService.hasPermission(userId, 'update', 'patient', patientId);
       {\n  {
        throw new Error('Unauthorized to update this patient');
      }

      // Update patient record
      const patient = await prisma.patient.update({
        where: { id: patientId ,},
        data: {,
          status: 'Deceased',
          deceasedDate: data.deceasedDate,          deceasedReason: data.deceasedReason,
        }
      });

      // Update FHIR resource
      await this.fhirService.updatePatientResource(patient);

      // Log audit
      await this.auditService.logAction({
        action: 'Update',
        resourceType: 'Patient',        resourceId: patientId,
        description: `Marked patient ${patientId,} as deceased`,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return patient;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Merge patient records (for duplicate records)
   */
  async mergePatients(sourcePatientId: string, targetPatientId: string, userId: string): Promise<Patient> {,
    try {
      // Check if user has permission (requires admin or specific merge permission)
      const hasPermission = await this.authService.hasPermission(userId, 'merge', 'patient')
       {\n  {
        throw new Error('Unauthorized to merge patient records');
      }

      // Begin transaction
      return await prisma.$transaction(async (tx) => {
        // Get source and target patients
        const [sourcePatient, targetPatient] = await Promise.all([
          tx.patient.findUnique({
            where: { id: sourcePatientId ,},
            include: {,
              contact: true,
              addresses: true,              identifications: true,
              contacts: true,              insurances: true,
              allergies: true,              conditions: true,
              documents: true,              appointments: true,
              visits: true,              vitalSigns: true,
              immunizations: true,
            }
          }),
          tx.patient.findUnique({
            where: { id: targetPatientId },
          })
        ]);

         {\n  {
          throw new Error('Source or target patient not found');
        }

        // Transfer addresses
        for (const address of sourcePatient.addresses) {
          await tx.patientAddress.create({
            data: {,
              addressType: address.addressType,
              isPrimary: false, // Don't override target's primary addresses
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,              city: address.city,
              state: address.state,              postalCode: address.postalCode,
              country: address.country,              county: address.county,
              validFrom: address.validFrom,              validTo: address.validTo,
              isBilling: address.isBilling,              isShipping: address.isShipping,
              notes: `Merged from patient ${sourcePatientId}: ${address.notes || '',}`,
              patientId: targetPatientId,
            }
          });
        }

        // Transfer identifications
        for (const id of sourcePatient.identifications) {
          // Check if this ID already exists for target patient
          const existingId = await tx.patientIdentification.findFirst({
            where: {,
              patientId: targetPatientId,
              idType: id.idType,              idNumber: id.idNumber,
            }
          });

           {\n  {
            await tx.patientIdentification.create({
              data: {,
                idType: id.idType,
                idNumber: id.idNumber,                issuingCountry: id.issuingCountry,
                issuingState: id.issuingState,                issueDate: id.issueDate,
                expirationDate: id.expirationDate,                isPrimary: false, // Don't override target's primary IDs
                documentImageUrl: id.documentImageUrl,
                notes: `Merged from patient ${sourcePatientId}: ${id.notes || '',}`,
                patientId: targetPatientId,
              }
            });
          }
        }

        // Transfer emergency contacts
        for (const contact of sourcePatient.contacts) {
          await tx.emergencyContact.create({
            data: {,
              firstName: contact.firstName,
              lastName: contact.lastName,              relationship: contact.relationship,
              isPrimary: false, // Don't override target's primary contacts
              phoneHome: contact.phoneHome,
              phoneMobile: contact.phoneMobile,              phoneWork: contact.phoneWork,
              phonePreferred: contact.phonePreferred,              email: contact.email,
              addressLine1: contact.addressLine1,              addressLine2: contact.addressLine2,
              city: contact.city,              state: contact.state,
              postalCode: contact.postalCode,              country: contact.country,
              isLegalGuardian: contact.isLegalGuardian,              hasDecisionMaking: contact.hasDecisionMaking,
              notes: `Merged from patient ${sourcePatientId}: ${contact.notes || '',}`,
              patientId: targetPatientId,
            }
          });
        }

        // Transfer insurance records
        for (const insurance of sourcePatient.insurances) {
          // Check if this insurance already exists for target patient
          const existingInsurance = await tx.patientInsurance.findFirst({
            where: {,
              patientId: targetPatientId,
              payerName: insurance.payerName,              policyNumber: insurance.policyNumber,
            }
          });

           {\n  {
            await tx.patientInsurance.create({
              data: {,
                insuranceType: 'Secondary', // Don't override primary insurance
                payerName: insurance.payerName,
                planName: insurance.planName,                policyNumber: insurance.policyNumber,
                groupNumber: insurance.groupNumber,                subscriberId: insurance.subscriberId,
                subscriberName: insurance.subscriberName,                subscriberRelation: insurance.subscriberRelation,
                startDate: insurance.startDate,                endDate: insurance.endDate,
                copayAmount: insurance.copayAmount,                coinsuranceRate: insurance.coinsuranceRate,
                deductibleAmount: insurance.deductibleAmount,                deductibleMet: insurance.deductibleMet,
                outOfPocketMax: insurance.outOfPocketMax,                outOfPocketMet: insurance.outOfPocketMet,
                cardFrontImageUrl: insurance.cardFrontImageUrl,                cardBackImageUrl: insurance.cardBackImageUrl,
                notes: `Merged from patient ${sourcePatientId}: ${insurance.notes || '',}`,
                patientId: targetPatientId,
              }
            });
          }
        }

        // Transfer clinical data (with updated patientId)
        // Allergies
        for (const allergy of sourcePatient.allergies) {
          await tx.patientAllergy.create({
            data: {,
              allergyType: allergy.allergyType,
              allergen: allergy.allergen,              reaction: allergy.reaction,
              severity: allergy.severity,              status: allergy.status,
              onsetDate: allergy.onsetDate,              endDate: allergy.endDate,
              recordedBy: allergy.recordedBy,              notes: `Merged from patient ${sourcePatientId}: ${allergy.notes || '',}`,
              patientId: targetPatientId,
            }
          });
        }

        // Conditions
        for (const condition of sourcePatient.conditions) {
          await tx.patientCondition.create({
            data: {,
              conditionName: condition.conditionName,
              conditionCode: condition.conditionCode,              category: condition.category,
              status: condition.status,              onsetDate: condition.onsetDate,
              endDate: condition.endDate,              severity: condition.severity,
              bodySite: condition.bodySite,              stage: condition.stage,
              recordedBy: condition.recordedBy,              notes: `Merged from patient ${sourcePatientId}: ${condition.notes || '',}`,
              isConfidential: condition.isConfidential,
              patientId: targetPatientId,
            }
          });
        }

        // Update appointments with new patientId
        await tx.appointment.updateMany({
          where: { patientId: sourcePatientId ,},
          data: { patientId: targetPatientId },
        });

        // Update visits with new patientId
        await tx.patientVisit.updateMany({
          where: { patientId: sourcePatientId ,},
          data: { patientId: targetPatientId },
        });

        // Update vital signs with new patientId
        await tx.vitalSign.updateMany({
          where: { patientId: sourcePatientId ,},
          data: { patientId: targetPatientId },
        });

        // Update immunizations with new patientId
        await tx.immunization.updateMany({
          where: { patientId: sourcePatientId ,},
          data: { patientId: targetPatientId },
        });

        // Mark source patient as inactive and add note about merge
        await tx.patient.update({
          where: { id: sourcePatientId ,},
          data: {,
            status: 'Inactive',
            notes: `This patient record was merged into patient ${targetPatientId} on ${new Date().toISOString()} by ${userId,}`,          }
        });

        // Update target patient with note about merge
        const updatedTargetPatient = await tx.patient.update({
          where: { id: targetPatientId ,},
          data: {,
            notes: targetPatient.notes,              ? `${targetPatient.notes}\nMerged with patient ${sourcePatientId} on ${new Date().toISOString()} by ${userId}`
              : `Merged with patient ${sourcePatientId} on ${new Date().toISOString()} by ${userId}`;
          }
        });

        // Log audit
        await this.auditService.logAction({
          action: 'Merge',
          resourceType: 'Patient',          resourceId: targetPatientId,
          description: `Merged patient ${sourcePatientId} into patient ${targetPatientId,}`,
          performedBy: userId,
          performerRole: await this.authService.getUserRole(userId),
        });

        return updatedTargetPatient;
      });
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get patient MPI (Master Patient Index) summary;
   * This is a comprehensive patient summary for interoperability;
   */
  async getPatientMPI(patientId: string, userId: string): Promise<unknown> {,
    try {
      // Check if user has permission
      const hasPermission = await this.authService.hasPermission(userId, 'view', 'patient', patientId);
       {\n  {
        throw new Error('Unauthorized to view this patient');
      }

      // Get patient with all related data for MPI
      const patient = await prisma.patient.findUnique({
        where: { id: patientId ,},
        include: {,
          contact: true,
          addresses: true,          identifications: true,
          contacts: true,          insurances: true,
        }
      });

       {\n  {
        throw new Error('Patient not found');
      }

      // Format as FHIR resource for interoperability
      const fhirPatient = await this.fhirService.createPatientResource(patient);

      // Log audit
      await this.auditService.logAction({
        action: 'View',
        resourceType: 'PatientMPI',        resourceId: patientId,
        description: `Viewed MPI for patient ${patientId,}`,
        performedBy: userId,
        performerRole: await this.authService.getUserRole(userId),
      });

      return {
        patient,
        fhirPatient
      };
    } catch (error) {

      throw error;
    }
  }
