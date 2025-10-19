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
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 16379),
        },
      }),
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
