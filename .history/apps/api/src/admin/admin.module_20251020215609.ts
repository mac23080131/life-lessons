import { Module } from '@nestjs/common';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminConceptsController } from './controllers/admin-concepts.controller';
import { AdminLessonsController } from './controllers/admin-lessons.controller';
import { AdminCategoriesController } from './controllers/admin-categories.controller';
import { AdminStatsController } from './controllers/admin-stats.controller';
import { AuditLogController } from './controllers/audit-log.controller';
import { ReportsController, AdminReportsController } from './controllers/reports.controller';
import { AdminUsersService } from './services/admin-users.service';
import { AdminConceptsService } from './services/admin-concepts.service';
import { AdminLessonsService } from './services/admin-lessons.service';
import { AdminStatsService } from './services/admin-stats.service';
import { ReportsService } from './services/reports.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminUsersController,
    AdminConceptsController,
    AdminLessonsController,
    AdminCategoriesController,
    AdminStatsController,
    AuditLogController,
    ReportsController,
    AdminReportsController,
  ],
  providers: [
    AdminUsersService,
    AdminConceptsService,
    AdminLessonsService,
    AdminStatsService,
    ReportsService,
  ],
  exports: [
    AdminUsersService,
    AdminConceptsService,
    AdminLessonsService,
    AdminStatsService,
    ReportsService,
  ],
})
export class AdminModule {}
