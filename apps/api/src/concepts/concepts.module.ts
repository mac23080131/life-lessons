import { Module } from '@nestjs/common';
import { ConceptsController } from './concepts.controller';
import { ConceptsService } from './concepts.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConceptsController],
  providers: [ConceptsService],
  exports: [ConceptsService],
})
export class ConceptsModule {}
