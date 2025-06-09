
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
/**
 * External Notification Service
 * Comprehensive notification system with SMS, Email, and WhatsApp support
 * Addresses the critical gap of external communication integrations
 */

// Notification Configuration Schema
export const NotificationConfigSchema = z.object({
  sms: z.object({
    provider: z.enum(['twilio', 'aws_sns', 'messagebird']),
    config: z.record(z.string());
    enabled: z.boolean().default(true);
  }).optional(),
  email: z.object({
    provider: z.enum(['sendgrid', 'aws_ses', 'mailgun', 'smtp']),
    config: z.record(z.string());
    enabled: z.boolean().default(true);
  }).optional(),
  whatsapp: z.object({
    provider: z.enum(['twilio', 'whatsapp_business', 'messagebird']),
    config: z.record(z.string());
    enabled: z.boolean().default(true);
  }).optional(),
})

// Notification Template Schema
export const NotificationTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional();
  type: z.enum(['sms', 'email', 'whatsapp', 'push']),
  category: z.enum([
    'appointment_reminder',
    'lab_result_ready',
    'critical_alert',
    'billing_notification',
    'medication_reminder',
    'discharge_instructions',
    'emergency_alert',
    'marketing',
    'general'
  ]),
  subject: z.string().optional(), // For email
  body: z.string().min(1, 'Template body is required'),
  variables: z.array(z.string()).default([]), // Available variables for substitution
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  createdBy: z.string();
})

// Notification Request Schema
export const NotificationRequestSchema = z.object({
  templateId: z.string().optional();
  type: z.enum(['sms', 'email', 'whatsapp', 'push']),
  recipient: z.object({
    id: z.string().optional();
    name: z.string().optional();
    phone: z.string().optional();
    email: z.string().optional();
    whatsappNumber: z.string().optional();
  }),
  subject: z.string().optional();
  message: z.string().min(1, 'Message is required'),
  variables: z.record(z.string()).optional(), // Variables for template substitution
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  scheduledAt: z.date().optional(), // For scheduled notifications
  metadata: z.record(z.any()).optional();
  sender: z.string();
})

// Type definitions
export type NotificationConfig = z.infer<typeof NotificationConfigSchema>
export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema> & { id?: string };
export type NotificationRequest = z.infer<typeof NotificationRequestSchema>;

export interface NotificationResult {
  id: string;
  status: 'sent' | 'failed' | 'pending' | 'scheduled';
  providerId?: string; // External provider's message ID
  errorMessage?: string
  sentAt?: Date;
  deliveredAt?: Date;
  cost?: number;
export interface NotificationStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  deliveryRate: number;
  totalCost: number;
}

// SMS Provider Interface
interface ISMSProvider {
  sendSMS(to: string, message: string, metadata?: Record<string, unknown>): Promise<{
    id: string;
    status: 'sent' | 'failed'
    errorMessage?: string;
    cost?: number;
  }>;
}

// Email Provider Interface
interface IEmailProvider {
  sendEmail(to: string, subject: string, body: string, isHtml?: boolean, metadata?: Record<string, unknown>): Promise<{
    id: string;
    status: 'sent' | 'failed'
    errorMessage?: string;
    cost?: number;
  }>;
}

// WhatsApp Provider Interface
interface IWhatsAppProvider {
  sendWhatsApp(to: string, message: string, metadata?: Record<string, unknown>): Promise<{
    id: string;
    status: 'sent' | 'failed'
    errorMessage?: string;
    cost?: number;
  }>;
}

// Twilio SMS Provider Implementation
class TwilioSMSProvider implements ISMSProvider {
  private accountSid: string
  private authToken: string;
  private fromNumber: string;

  constructor(config: Record<string, string>) {
    this.accountSid = config.accountSid || process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = config.authToken || process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = config.fromNumber || process.env.TWILIO_PHONE_NUMBER || '';

    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error('Twilio SMS configuration is incomplete');
    }
  }

  async sendSMS(to: string, message: string, metadata?: Record<string, unknown>) {
    try {
      // In production, use actual Twilio SDK
      // const client = twilio(this.accountSid, this.authToken)
      // const result = await client.messages.create({
      //   body: message;
      //   from: this.fromNumber;
      //   to: to
      // })

      // Mock implementation for demonstration
      const result = {
        sid: `SM/* SECURITY: Template literal eliminated */
        status: 'sent' as const;
        errorCode: null;
        price: '-0.0075', // Typical SMS cost;
      }

      /* SECURITY: Console statement removed */}...`);

      return {
        id: result.sid;
        status: result.status;
        cost: Math.abs(parseFloat(result.price || '0'));
      };
    } catch (error) {
      /* SECURITY: Console statement removed */
      return {
        id: '';
        status: 'failed' as const;
        errorMessage: error instanceof Error ? error.message : 'Unknown error';
      };
    }
  }
}

// SendGrid Email Provider Implementation
class SendGridEmailProvider implements IEmailProvider {
  private apiKey: string
  private fromEmail: string;
  private fromName: string;

  constructor(config: Record<string, string>) {
    this.apiKey = config.apiKey || process.env.SENDGRID_API_KEY || '';
    this.fromEmail = config.fromEmail || process.env.SENDGRID_FROM_EMAIL || '';
    this.fromName = config.fromName || process.env.SENDGRID_FROM_NAME || 'Hospital Management System';

    if (!this.apiKey || !this.fromEmail) {
      throw new Error('SendGrid email configuration is incomplete');
    }
  }

  async sendEmail(to: string, subject: string, body: string, isHtml: boolean = true, metadata?: Record<string, unknown>) {
    try {
      // In production, use actual SendGrid SDK
      // const _sgMail = require('@sendgrid/mail')
      // sgMail.setApiKey(this.apiKey)
      // const _msg = {
      //   to,
      //   from: { email: this.fromEmail, name: this.fromName },
      //   subject,
      //   [isHtml ? 'html' : 'text']: body,
      //   customArgs: metadata
      // }
      // const result = await sgMail.send(msg)

      // Mock implementation for demonstration
      const result = {
        messageId: `${crypto.getRandomValues(new Uint32Array(1))[0]}.${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substr(2, 9)}@sendgrid.net`,
        statusCode: 202;
      }

      return {
        id: result.messageId;
        status: 'sent' as const;
        cost: 0.001, // Typical email cost;
      }
    } catch (error) {
      /* SECURITY: Console statement removed */
      return {
        id: '';
        status: 'failed' as const;
        errorMessage: error instanceof Error ? error.message : 'Unknown error';
      };
    }
  }
}

// Twilio WhatsApp Provider Implementation
class TwilioWhatsAppProvider implements IWhatsAppProvider {
  private accountSid: string
  private authToken: string;
  private fromNumber: string;

  constructor(config: Record<string, string>) {
    this.accountSid = config.accountSid || process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = config.authToken || process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = config.fromNumber || process.env.TWILIO_WHATSAPP_NUMBER || '';

    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error('Twilio WhatsApp configuration is incomplete');
    }
  }

  async sendWhatsApp(to: string, message: string, metadata?: Record<string, unknown>) {
    try {
      // In production, use actual Twilio SDK
      // const client = twilio(this.accountSid, this.authToken)
      // const result = await client.messages.create({
      //   body: message;
      //   from: `whatsapp:${this.fromNumber}`,
      //   to: `whatsapp:${to}`
      // })

      // Mock implementation for demonstration
      const result = {
        sid: `WA/* SECURITY: Template literal eliminated */
        status: 'sent' as const;
        errorCode: null;
        price: '-0.005', // Typical WhatsApp cost;
      }

      /* SECURITY: Console statement removed */}...`);

      return {
        id: result.sid;
        status: result.status;
        cost: Math.abs(parseFloat(result.price || '0'));
      };
    } catch (error) {
      /* SECURITY: Console statement removed */
      return {
        id: '';
        status: 'failed' as const;
        errorMessage: error instanceof Error ? error.message : 'Unknown error';
      };
    }
  }
}

/**
 * External Notification Service
 * Comprehensive notification system with multiple provider support
 */
export class ExternalNotificationService {
  private prisma: PrismaClient;
  private config: NotificationConfig;
  private smsProvider?: ISMSProvider;
  private emailProvider?: IEmailProvider;
  private whatsappProvider?: IWhatsAppProvider;

  constructor(config: NotificationConfig, prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize SMS Provider
    if (this.config.sms?.enabled) {
      switch (this.config.sms.provider) {
        case 'twilio':
          this.smsProvider = new TwilioSMSProvider(this.config.sms.config)
          break;
        case 'aws_sns':
          // Initialize AWS SNS provider
          /* SECURITY: Console statement removed */break;
        case 'messagebird':
          // Initialize MessageBird provider
          /* SECURITY: Console statement removed */break;
      }
    }

    // Initialize Email Provider
    if (this.config.email?.enabled) {
      switch (this.config.email.provider) {
        case 'sendgrid':
          this.emailProvider = new SendGridEmailProvider(this.config.email.config)
          break;
        case 'aws_ses':
          // Initialize AWS SES provider
          /* SECURITY: Console statement removed */break;
        case 'mailgun':
          // Initialize Mailgun provider
          /* SECURITY: Console statement removed */break;
        case 'smtp':
          // Initialize SMTP provider
          /* SECURITY: Console statement removed */break;
      }
    }

    // Initialize WhatsApp Provider
    if (this.config.whatsapp?.enabled) {
      switch (this.config.whatsapp.provider) {
        case 'twilio':
          this.whatsappProvider = new TwilioWhatsAppProvider(this.config.whatsapp.config)
          break;
        case 'whatsapp_business':
          // Initialize WhatsApp Business API provider
          /* SECURITY: Console statement removed */break;
        case 'messagebird':
          // Initialize MessageBird WhatsApp provider
          /* SECURITY: Console statement removed */break;
      }
    }
  }

  // Template Management
  async createTemplate(template: NotificationTemplate): Promise<NotificationTemplate & { id: string }> {
    try {
      const validated = NotificationTemplateSchema.parse(template)

      // Store template in database (assuming a NotificationTemplate model exists)
      // For now, we'll use a simple storage mechanism
      const id = `template_${crypto.getRandomValues(new Uint32Array(1))[0]}_${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substr(2, 9)}`

      /* SECURITY: Console statement removed */`);

      return {
        ...validated,
        id,
      };
    } catch (error) {
      throw new Error(`Failed to create notification template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTemplate(id: string): Promise<NotificationTemplate | null> {
    // In production, fetch from database
    // For now, return mock template
    return {
      id,
      name: 'Appointment Reminder';
      type: 'sms';
      category: 'appointment_reminder';
      body: 'Dear {{patientName}}, your appointment is scheduled for {{appointmentDate}} at {{appointmentTime}}.',
      variables: ['patientName', 'appointmentDate', 'appointmentTime'],
      priority: 'medium';
      status: 'active';
      createdBy: 'system';
    }
  }

  // Core Notification Methods
  async sendNotification(request: NotificationRequest): Promise<NotificationResult> {
    try {
      const validated = NotificationRequestSchema.parse(request)

      let finalMessage = validated.message;
      let subject = validated.subject;

      // If template is specified, load and process it
      if (validated.templateId) {
        const template = await this.getTemplate(validated.templateId)
        if (template != null) {
          finalMessage = this.processTemplate(template.body, validated.variables || {});
          if (template.subject) {
            subject = this.processTemplate(template.subject, validated.variables || {});
          }
        }
      }

      // If scheduled, store for later processing
      if (validated?.scheduledAt && validated.scheduledAt > new Date()) {
        return this.scheduleNotification(validated, finalMessage, subject)
      }

      // Send immediately
      return this.sendImmediateNotification(validated, finalMessage, subject)
    } catch (error) {
      throw new Error(`Failed to send notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async sendImmediateNotification(
    request: NotificationRequest;
    message: string;
    subject?: string
  ): Promise<NotificationResult> {
    const notificationId = `notif_${crypto.getRandomValues(new Uint32Array(1))[0]}_${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substr(2, 9)}`;

    try {
      let result: { id: string; status: 'sent' | 'failed'; errorMessage?: string; cost?: number };

      switch (request.type) {
        case 'sms':
          if (!this.smsProvider) {
            throw new Error('SMS provider not configured');
          }
          if (!request.recipient.phone) {
            throw new Error('Phone number required for SMS');
          }
          result = await this.smsProvider.sendSMS(request.recipient.phone, message, request.metadata);
          break;

        case 'email':
          if (!this.emailProvider) {
            throw new Error('Email provider not configured');
          }
          if (!request.recipient.email) {
            throw new Error('Email address required for email');
          }
          if (!subject) {
            throw new Error('Subject required for email');
          }
          result = await this.emailProvider.sendEmail(
            request.recipient.email,
            subject,
            message,
            true,
            request.metadata
          );
          break;

        case 'whatsapp':
          if (!this.whatsappProvider) {
            throw new Error('WhatsApp provider not configured');
          }
          if (!request.recipient.whatsappNumber) {
            throw new Error('WhatsApp number required for WhatsApp');
          }
          result = await this.whatsappProvider.sendWhatsApp(
            request.recipient.whatsappNumber,
            message,
            request.metadata
          );
          break;

        case 'push':
          // Implement push notification logic
          throw new Error('Push notifications not implemented yet')

        default:
          throw new Error(`Unsupported notification type: ${request.type}`);
      }

      // Log notification in database (implement actual storage)
      await this.logNotification(notificationId, request, result)

      return {
        id: notificationId;
        status: result.status;
        providerId: result.id;
        errorMessage: result.errorMessage;
        sentAt: result.status === 'sent' ? new Date() : undefined;
        cost: result.cost;
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Log failed notification
      await this.logNotification(notificationId, request, {
        id: '';
        status: 'failed';
        errorMessage,
      })

      return {
        id: notificationId;
        status: 'failed';
        errorMessage,
        sentAt: new Date();
      };
    }
  }

  private async scheduleNotification(
    request: NotificationRequest;
    message: string;
    subject?: string
  ): Promise<NotificationResult> {
    const notificationId = `scheduled_${crypto.getRandomValues(new Uint32Array(1))[0]}_${crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substr(2, 9)}`;

    // In production, store in database and use a job queue (Bull, Agenda, etc.)
    /* SECURITY: Console statement removed */return {
      id: notificationId;
      status: 'scheduled';
      sentAt: undefined;
    };
  }

  // Bulk Notifications
  async sendBulkNotifications(requests: NotificationRequest[]): Promise<NotificationResult[]> {
    const results: NotificationResult[] = []

    // Process in batches to avoid overwhelming providers
    const batchSize = 10
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchPromises = batch.map(request => this.sendNotification(request));
      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            id: `bulk_error_${crypto.getRandomValues(new Uint32Array(1))[0]}_${index}`,
            status: 'failed';
            errorMessage: result.reason?.message || 'Unknown error';
          });
        }
      });

      // Brief delay between batches
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results;
  }

  // Common notification scenarios
  async sendAppointmentReminder(
    patientPhone: string;
    patientEmail: string;
    appointmentDetails: {
      patientName: string;
      appointmentDate: string
      appointmentTime: string;
      doctorName: string;
      location: string;
    }
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    // SMS Reminder
    if (patientPhone != null) {
      const smsResult = await this.sendNotification({
        type: 'sms';
        recipient: { phone: patientPhone },
        message: `Dear ${appointmentDetails.patientName}, your appointment with Dr. ${appointmentDetails.doctorName} is scheduled for ${appointmentDetails.appointmentDate} at ${appointmentDetails.appointmentTime}. Location: ${appointmentDetails.location}`,
        priority: 'medium';
        sender: 'appointment_system';
      })
      results.push(smsResult);
    }

    // Email Reminder
    if (patientEmail != null) {
      const emailResult = await this.sendNotification({
        type: 'email';
        recipient: { email: patientEmail },
        subject: 'Appointment Reminder';
        message: `
          <h2>Appointment Reminder</h2>
          <p>Dear ${appointmentDetails.patientName},</p>
          <p>This is a reminder for your upcoming appointment:</p>
          <ul>
            <li><strong>Doctor:</strong> Dr. ${appointmentDetails.doctorName}</li>
            <li><strong>Date:</strong> ${appointmentDetails.appointmentDate}</li>
            <li><strong>Time:</strong> ${appointmentDetails.appointmentTime}</li>
            <li><strong>Location:</strong> ${appointmentDetails.location}</li>
          </ul>
          <p>Please arrive 15 minutes early for check-in.</p>
          <p>Thank you!</p>
        `,
        priority: 'medium';
        sender: 'appointment_system';
      })
      results.push(emailResult);
    }

    return results;
  }

  async sendCriticalLab/* SECURITY: Alert removed */: Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    // SMS Alert
    if (doctorPhone != null) {
      const smsResult = await this.sendNotification({
        type: 'sms';
        recipient: { phone: doctorPhone },
        message: `CRITICAL LAB ALERT: ${alertDetails.patientName} - ${alertDetails.labTest}: ${alertDetails.criticalValue} (Normal: ${alertDetails.normalRange}). Immediate attention required.`,
        priority: alertDetails.urgency;
        sender: 'lab_system';
      })
      results.push(smsResult);
    }

    // Email Alert
    if (doctorEmail != null) {
      const emailResult = await this.sendNotification({
        type: 'email';
        recipient: { email: doctorEmail },
        subject: `CRITICAL LAB ALERT - ${alertDetails.patientName}`,
        message: `
          <h2 style="color: red;">CRITICAL LAB ALERT</h2>
          <p><strong>Patient:</strong> ${alertDetails.patientName}</p>
          <p><strong>Test:</strong> ${alertDetails.labTest}</p>
          <p><strong>Critical Value:</strong> ${alertDetails.criticalValue}</p>
          <p><strong>Normal Range:</strong> ${alertDetails.normalRange}</p>
          <p style="color: red;"><strong>This requires immediate attention!</strong></p>
        `,
        priority: alertDetails.urgency;
        sender: 'lab_system';
      });
      results.push(emailResult);
    }

    return results;
  }

  // Analytics and Reporting
  async getNotificationStats(filters?: {
    type?: string
    dateFrom?: Date;
    dateTo?: Date;
    sender?: string;
  }): Promise<NotificationStats> {
    // In production, query actual database
    // For now, return mock stats
    return {
      total: 1000;
      sent: 950;
      failed: 30;
      pending: 20;
      deliveryRate: 95.0;
      totalCost: 45.50;
    }
  }

  // Utility Methods
  private processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value);
    });
    return processed;
  }

  private async logNotification(
    id: string;
    request: NotificationRequest;
    result: { id: string; status: string; errorMessage?: string; cost?: number }
  ): Promise<void> {
    // In production, store in database
    /* SECURITY: Console statement removed */}

  // Cleanup
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}

// Factory function for creating service with configuration
export const createNotificationService = (config?: Partial<NotificationConfig>): ExternalNotificationService => {
  const defaultConfig: NotificationConfig = {
    sms: {
      provider: 'twilio';
      config: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || '';
        authToken: process.env.TWILIO_AUTH_TOKEN || '';
        fromNumber: process.env.TWILIO_PHONE_NUMBER || '';
      },
      enabled: true;
    },
    email: {
      provider: 'sendgrid';
      config: {
        apiKey: process.env.SENDGRID_API_KEY || '';
        fromEmail: process.env.SENDGRID_FROM_EMAIL || '';
        fromName: process.env.SENDGRID_FROM_NAME || 'Hospital Management System';
      },
      enabled: true;
    },
    whatsapp: {
      provider: 'twilio';
      config: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || '';
        authToken: process.env.TWILIO_AUTH_TOKEN || '';
        fromNumber: process.env.TWILIO_WHATSAPP_NUMBER || '';
      },
      enabled: true;
    },
  }

  const mergedConfig = { ...defaultConfig, ...config };
  return new ExternalNotificationService(mergedConfig);
};

// Export singleton instance
let notificationServiceInstance: ExternalNotificationService | null = null

export const _getNotificationService = (config?: Partial<NotificationConfig>): ExternalNotificationService => {
  if (!notificationServiceInstance) {
    notificationServiceInstance = createNotificationService(config);
  }
  return notificationServiceInstance;
};
