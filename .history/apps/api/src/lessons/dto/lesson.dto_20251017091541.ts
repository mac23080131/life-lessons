import { IsString, IsEnum, IsArray, IsInt, Min, Max, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Domain, Privacy } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @ApiProperty({ description: 'Lesson content' })
  @IsString()
  contentRaw: string;

  @ApiProperty({ enum: Domain })
  @IsEnum(Domain)
  domain: Domain;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Mood scale -2 to +2', minimum: -2, maximum: 2 })
  @IsInt()
  @Min(-2)
  @Max(2)
  mood: number;

  @ApiProperty({ description: 'Resonance scale 0 to 3', minimum: 0, maximum: 3 })
  @IsInt()
  @Min(0)
  @Max(3)
  resonance: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gratitude?: string;

  @ApiProperty({ enum: Privacy, required: false })
  @IsOptional()
  @IsEnum(Privacy)
  visibility?: Privacy;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;
}

export class UpdateLessonDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contentRaw?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contentSummary?: string;

  @ApiProperty({ enum: Domain, required: false })
  @IsOptional()
  @IsEnum(Domain)
  domain?: Domain;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(-2)
  @Max(2)
  mood?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3)
  resonance?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gratitude?: string;

  @ApiProperty({ enum: Privacy, required: false })
  @IsOptional()
  @IsEnum(Privacy)
  visibility?: Privacy;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  aiConcepts?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aiNextQuestion?: string;
}

export class LessonQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ enum: Domain, required: false })
  @IsOptional()
  @IsEnum(Domain)
  domain?: Domain;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}
