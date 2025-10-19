import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { GoalsModule } from './goals/goals.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { RemindersModule } from './reminders/reminders.module';
import { GroupsModule } from './groups/groups.module';
import { AiModule } from './ai/ai.module';
import { ConceptsModule } from './concepts/concepts.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    LessonsModule,
    GoalsModule,
    AnalyticsModule,
    RemindersModule,
    GroupsModule,
    AiModule,
    ConceptsModule,
  ],
})
export class AppModule {}
