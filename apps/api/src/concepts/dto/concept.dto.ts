import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConceptDifficulty, ConceptRelType } from '@prisma/client';

export class ConceptDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  summaryEn: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  descriptionEn: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty({ enum: ConceptDifficulty })
  difficulty: ConceptDifficulty;

  @ApiPropertyOptional()
  source?: string;

  @ApiPropertyOptional()
  sourceUrl?: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiProperty()
  views: number;

  @ApiProperty()
  aiContext: string;

  @ApiProperty({ type: [String] })
  keywords: string[];

  @ApiProperty()
  version: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateConceptDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  summaryEn: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  descriptionEn: string;

  @ApiProperty()
  categoryId: string;

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ enum: ConceptDifficulty })
  difficulty?: ConceptDifficulty;

  @ApiPropertyOptional()
  source?: string;

  @ApiPropertyOptional()
  sourceUrl?: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiProperty()
  aiContext: string;

  @ApiPropertyOptional({ type: [String] })
  keywords?: string[];
}

export class UpdateConceptDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  titleEn?: string;

  @ApiPropertyOptional()
  summary?: string;

  @ApiPropertyOptional()
  summaryEn?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  descriptionEn?: string;

  @ApiPropertyOptional()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ enum: ConceptDifficulty })
  difficulty?: ConceptDifficulty;

  @ApiPropertyOptional()
  source?: string;

  @ApiPropertyOptional()
  sourceUrl?: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  aiContext?: string;

  @ApiPropertyOptional({ type: [String] })
  keywords?: string[];
}

export class ConceptPracticeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  conceptId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  descriptionEn: string;

  @ApiProperty({ type: [String] })
  steps: string[];

  @ApiProperty({ type: [String] })
  stepsEn: string[];

  @ApiPropertyOptional()
  duration?: number;

  @ApiProperty({ enum: ConceptDifficulty })
  difficulty: ConceptDifficulty;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: Date;
}

export class CreatePracticeDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  descriptionEn: string;

  @ApiProperty({ type: [String] })
  steps: string[];

  @ApiProperty({ type: [String] })
  stepsEn: string[];

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional({ enum: ConceptDifficulty })
  difficulty?: ConceptDifficulty;

  @ApiPropertyOptional()
  order?: number;
}

export class ConceptExampleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  conceptId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  textEn: string;

  @ApiPropertyOptional()
  source?: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: Date;
}

export class CreateExampleDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  textEn: string;

  @ApiPropertyOptional()
  source?: string;

  @ApiPropertyOptional()
  order?: number;
}

export class ConceptQuestionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  conceptId: string;

  @ApiProperty()
  question: string;

  @ApiProperty()
  questionEn: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  context?: string;

  @ApiPropertyOptional()
  contextEn?: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: Date;
}

export class CreateQuestionDto {
  @ApiProperty()
  question: string;

  @ApiProperty()
  questionEn: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  context?: string;

  @ApiPropertyOptional()
  contextEn?: string;

  @ApiPropertyOptional()
  order?: number;
}

export class ConceptRelationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  aId: string;

  @ApiProperty()
  bId: string;

  @ApiProperty({ enum: ConceptRelType })
  type: ConceptRelType;
}

export class CreateRelationDto {
  @ApiProperty()
  bId: string;

  @ApiProperty({ enum: ConceptRelType })
  type: ConceptRelType;
}

export class SearchConceptsDto {
  @ApiPropertyOptional()
  q?: string;

  @ApiPropertyOptional()
  slug?: string;

  @ApiPropertyOptional()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ enum: ConceptDifficulty })
  difficulty?: ConceptDifficulty;

  @ApiPropertyOptional()
  language?: string;

  @ApiPropertyOptional({ default: 10 })
  limit?: number;

  @ApiPropertyOptional({ default: 0 })
  offset?: number;
}

export class ConceptCategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nameEn: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateCategoryDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nameEn: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional()
  order?: number;
}
