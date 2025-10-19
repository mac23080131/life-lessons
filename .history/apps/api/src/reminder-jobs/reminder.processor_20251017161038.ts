import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationService } from './notification.service';

interface ReminderJobData {
  userId: string;
  userEmail: string;
  userName?: string;
  reminderType: string;
  channel: 'email' | 'push';
  timezone: string;
}

/**
 * Reminder Job Processor
 * Handles reminder jobs from the queue
 */
@Processor('reminders')
export class ReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(ReminderProcessor.name);

  constructor(private notificationService: NotificationService) {
    super();
  }

  async process(job: Job<ReminderJobData>): Promise<void> {
    this.logger.log(`Processing job ${job.id}...`);
    
    const { userId, userEmail, userName, reminderType, channel, timezone } = job.data;

    try {
      // Send notification via configured channel
      await this.notificationService.sendReminder(
        { id: userId, email: userEmail, name: userName },
        reminderType,
        channel,
      );

      this.logger.log(`✅ Sent ${reminderType} reminder to ${userEmail} via ${channel}`);
      
      // Update job progress
      await job.updateProgress(100);
      
    } catch (error) {
      this.logger.error(`Failed to send reminder to ${userEmail}`, error);
      throw error; // Will be retried by BullMQ
    }
  }
}
