import { type NextRequest, NextResponse } from 'next/server';


import { authService } from '@/lib/auth/auth-service';
import { prisma } from '@/lib/prisma';

// Push Notification Service
class PushNotificationService {
  private static fcmServerKey = process.env.FCM_SERVER_KEY;
  private static twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  private static twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  private static whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

  static async sendNotification(notification: {
    userId: string,
    message: string,
    channels: ('PUSH' | 'SMS' | 'EMAIL' | 'WHATSAPP')[];
    data?: any;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  }) {
    const results = {
      push: null,
      email: null,
      whatsapp: null,

    // Get user notification preferences
    const user = await prisma.user.findUnique({
      where: { id: notification.userId ,},
      include: { notificationPreferences: true },

    if (!user) {
      throw new Error('User not found');
    }

    // Store notification in database
    const storedNotification = await prisma.notification.create({
      data: {
        userId: notification.userId,
        message: notification.message,
        urgency: notification.urgency,
        data: notification.data || {,},
        status: 'PENDING',

    // Send through requested channels
    for (const channel of notification.channels) {
      try {
        switch (channel) {
          case 'PUSH':
            if (user.fcmToken) {
              results.push = await this.sendPushNotification(user.fcmToken, notification);
            }
            break;
          case 'SMS':
            if (user.phone_number) {
              results.sms = await this.sendSMS(user.phone_number, notification);
            }
            break;
          case 'EMAIL':
            if (user.email) {
              results.email = await this.sendEmail(user.email, notification);
            }
            break;
          case 'WHATSAPP':
            if (user.phone_number) {
              results.whatsapp = await this.sendWhatsApp(user.phone_number, notification);
            }
            break;
        }
      } catch (error) { console.error(error); }
    }

    // Update notification status
    await prisma.notification.update({
      where: { id: storedNotification.id ,},
      data: {
        status: 'SENT',
        sentAt: new Date(),

    return { notificationId: storedNotification.id,
  }

  static async sendPushNotification(fcmToken: string, notification: unknown) {,
    }

    const payload = {
      to: fcmToken,
      notification: {
        title: notification.title,
        icon: '/icons/hospital-icon.png',
        badge: '/icons/badge.png',
      },
      data: {
        type: notification.type,
        ...notification.data
      }
    };

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${this.fcmServerKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),

    return await response.json();
  }

  static async sendSMS(phoneNumber: string, notification: unknown) {,
    }

    const accountSid = this.twilioAccountSid;
    const authToken = this.twilioAuthToken;
    const client = require('twilio')(accountSid, authToken);

    const message = await client.messages.create({
      body: `${notification.title}: ${notification.message,}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,

    return { messageId: message.sid, status: message.status ,
  }

  static async sendEmail(email: string, notification: unknown) {,
    // Email service implementation (using SendGrid, AWS SES, etc.)
    const _emailPayload = {
      to: email,
      html: this.generateEmailTemplate(notification),
      urgency: notification.urgency,

    // Mock email sending - replace with actual service
    return { emailId: 'mock-email-id', status: 'sent' ,
  }

  static async sendWhatsApp(phoneNumber: string, notification: unknown) {,
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber.replace('+', ''),
      type: 'template',
      template: {
        name: 'hospital_notification',
        language: { code: 'en' ,},
        components: [,
          {
            type: 'body',
            parameters: [,
              { type: 'text', text: notification.title ,},
              { type: 'text', text: notification.message },

    const response = await fetch(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID,}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.whatsappApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),

    return await response.json();
  }

  static generateEmailTemplate(notification: unknown): string {,
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px, font-family: Arial, sans-serif }
          .header { background-color: #007AFF, padding: 20px; text-align: center },
          .content { padding: 20px },
          .urgency-critical { border-left: 4px solid #dc3545 },
          .urgency-high { border-left: 4px solid #fd7e14 },
          .urgency-medium { border-left: 4px solid #ffc107 },
          .urgency-low { border-left: 4px solid #28a745 },
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 Hospital Management System</h1>
          </div>
          <div class="content urgency-${notification.urgency.toLowerCase()}">
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            <hr>
            <p><small>Type: ${notification.type} | Urgency: ${notification.urgency}</small></p>,
  }

  // Bulk notification methods
  static async sendBulkNotifications(notifications: unknown[]) {,

    for (const notification of notifications) {
      try {
        const result = await this.sendNotification(notification);
        results.push({ success: true, notificationId: result.notificationId ,
      } catch (error) { console.error(error); });
      }
    }

    return results;
  }

  // Scheduled notifications
  static async scheduleNotification(notification: unknown, scheduledTime: Date) {,
    const scheduledNotification = await prisma.scheduledNotification.create({
      data: {
        ...notification,
        scheduledTime,
        status: 'SCHEDULED',

    return scheduledNotification;
  }
}

// POST /api/notifications/send
export const POST = async (request: NextRequest) => {try {
    const notification = await request.json();

  return NextResponse.json({ message: "Not implemented" });
};
    const { user } = await authService.verifyToken(request);
    if (!user || !['Admin', 'Doctor', 'Nurse'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' ,}, { status: 403 ,
    }

    const result = await PushNotificationService.sendNotification(notification);

    return NextResponse.json({ success: true,
  } catch (error) { console.error(error); }, { status: 500 ,}),
  }
};

// POST /api/notifications/bulk
export const POST = async (request: NextRequest) => {try {
  return NextResponse.json({ message: "Not implemented" });
};
    const { notifications } = await request.json();

    const { user } = await authService.verifyToken(request);
    if (!user || !['Admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' ,}, { status: 403 ,
    }

    const results = await PushNotificationService.sendBulkNotifications(notifications);

    return NextResponse.json({ success: true,
  } catch (error) { console.error(error); }, { status: 500 ,}),
  }
};

export { PushNotificationService };
