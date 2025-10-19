import { Injectable, Logger } from '@nestjs/common';

/**
 * Mock Notification Service
 * V1: Logs to console (mock email/push)
 * V2: Integrate real providers (SendGrid, OneSignal, etc.)
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  /**
   * Send email notification (MOCK)
   * @param to - Recipient email
   * @param subject - Email subject
   * @param body - Email body content
   */
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    this.logger.log(`📧 [MOCK EMAIL] To: ${to}`);
    this.logger.log(`   Subject: ${subject}`);
    this.logger.log(`   Body: ${body.substring(0, 100)}...`);
    
    // TODO V2: Implement real email provider
    // Example: await this.sendgridClient.send({ to, subject, html: body });
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Send push notification (MOCK)
   * @param userId - User identifier
   * @param title - Notification title
   * @param message - Notification message
   */
  async sendPush(userId: string, title: string, message: string): Promise<void> {
    this.logger.log(`📱 [MOCK PUSH] UserId: ${userId}`);
    this.logger.log(`   Title: ${title}`);
    this.logger.log(`   Message: ${message}`);
    
    // TODO V2: Implement real push provider (OneSignal, FCM, etc.)
    // Example: await this.oneSignal.createNotification({ user_ids: [userId], contents: { en: message } });
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Send reminder notification via configured channel
   * @param user - User object with email and id
   * @param reminderType - Type of reminder (DAILY_EVENING, WEEKLY_REVIEW, etc.)
   * @param channel - Notification channel (email, push)
   */
  async sendReminder(
    user: { id: string; email: string; name?: string },
    reminderType: string,
    channel: 'email' | 'push',
  ): Promise<void> {
    const templates = {
      DAILY_EVENING: {
        subject: '🌙 Reflection Time - Life Lessons',
        title: 'Evening Reflection',
        message: 'Take a moment to capture today\'s lessons and insights.',
      },
      WEEKLY_REVIEW: {
        subject: '📊 Weekly Review - Life Lessons',
        title: 'Weekly Review',
        message: 'Review your week\'s lessons and plan your next sprint.',
      },
      MONTHLY_RETRO: {
        subject: '🎯 Monthly Retrospective - Life Lessons',
        title: 'Monthly Retrospective',
        message: 'Reflect on your monthly progress and set new goals.',
      },
    };

    const template = templates[reminderType] || templates.DAILY_EVENING;
    const userName = user.name || 'there';

    if (channel === 'email') {
      const body = `
        <h2>Hi ${userName},</h2>
        <p>${template.message}</p>
        <p><a href="http://localhost:3000/journal/new">Capture your lesson now →</a></p>
        <p><small>Life Lessons App</small></p>
      `;
      await this.sendEmail(user.email, template.subject, body);
    } else if (channel === 'push') {
      await this.sendPush(user.id, template.title, template.message);
    }
  }
}
