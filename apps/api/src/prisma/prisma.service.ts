import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Avoid passing an explicit undefined URL into PrismaClient constructor.
    // If DATABASE_URL is available at construction time, pass it explicitly.
    // Otherwise call super() with no datasources so Prisma will read
    // process.env.DATABASE_URL at runtime (injected by Railway).
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      super({
        datasources: {
          db: { url: dbUrl },
        },
      });
    } else {
      super();
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
