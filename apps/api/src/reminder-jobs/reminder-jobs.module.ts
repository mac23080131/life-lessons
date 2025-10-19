import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReminderProducerService } from './reminder-producer.service';
import { ReminderProcessor } from './reminder.processor';
import { NotificationService } from './notification.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get('REDIS_URL');
        
        // If REDIS_URL exists (Railway/production), use connection string
        if (redisUrl) {
          console.log('[BullMQ] Using REDIS_URL from environment');
          return {
            connection: {
              url: redisUrl, // Explicit url property for BullMQ
            },
          };
        }
        
        // Fallback to separate host/port for local development
        console.log('[BullMQ] Using REDIS_HOST/PORT (fallback to localhost)');
        return {
          connection: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: parseInt(configService.get('REDIS_PORT', '6379'), 10),
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'reminders',
    }),
  ],
  providers: [ReminderProducerService, ReminderProcessor, NotificationService],
  exports: [ReminderProducerService],
})
export class ReminderJobsModule {}
