import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { getTimezoneOffset, utcToZonedTime, format } from 'date-fns-tz';

/**
 * Reminder Job Producer
 * Runs cron job every 5 minutes to check and enqueue reminder notifications
 */
@Injectable()
export class ReminderProducerService {
  private readonly logger = new Logger(ReminderProducerService.name);

  constructor(
    @InjectQueue('reminders') private reminderQueue: Queue,
    private prisma: PrismaService,
  ) {}

  /**
   * Cron job: Check reminders every 5 minutes
   * Matches users whose local time matches the reminder hour
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkAndEnqueueReminders() {
    this.logger.log('🕐 Checking reminders...');

    try {
      // Get all active reminders with user info
      const reminders = await this.prisma['reminder'].findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              tz: true,
            },
          },
        },
      });

      this.logger.log(`Found ${reminders.length} total reminders`);

      let enqueuedCount = 0;

      for (const reminder of reminders) {
        const userTz = reminder.user.tz || 'Asia/Bangkok';
        const now = new Date();
        
        // Convert UTC to user's timezone
        const zonedTime = utcToZonedTime(now, userTz);
        const currentHour = zonedTime.getHours();
        const currentMinute = zonedTime.getMinutes();

        // Check if current hour matches reminder hour (allow 5-minute window)
        if (currentHour === reminder.hour && currentMinute < 5) {
          this.logger.log(
            `✓ Enqueueing reminder for ${reminder.user.email} (${reminder.type} at ${reminder.hour}:00 ${userTz})`,
          );

          // Enqueue job
          await this.reminderQueue.add(
            'send-reminder',
            {
              userId: reminder.user.id,
              userEmail: reminder.user.email,
              userName: reminder.user.name,
              reminderType: reminder.type,
              channel: reminder.channel,
              timezone: userTz,
            },
            {
              jobId: `${reminder.id}-${format(zonedTime, 'yyyy-MM-dd-HH', { timeZone: userTz })}`,
              removeOnComplete: 100, // Keep last 100 completed jobs
              removeOnFail: 500, // Keep last 500 failed jobs
            },
          );

          enqueuedCount++;
        }
      }

      if (enqueuedCount > 0) {
        this.logger.log(`✅ Enqueued ${enqueuedCount} reminder(s)`);
      } else {
        this.logger.debug('No reminders to send at this time');
      }
    } catch (error) {
      this.logger.error('Failed to check reminders', error);
    }
  }

  /**
   * Manual trigger for testing
   * @param userId - User ID to send test reminder
   */
  async sendTestReminder(userId: string) {
    const user = await this.prisma['user'].findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        tz: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    this.logger.log(`📨 Sending test reminder to ${user.email}`);

    await this.reminderQueue.add('send-reminder', {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      reminderType: 'DAILY_EVENING',
      channel: 'email',
      timezone: user.tz || 'Asia/Bangkok',
    });

    return { message: 'Test reminder enqueued' };
  }
}
