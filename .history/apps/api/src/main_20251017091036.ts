import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Life Lessons API')
    .setDescription('API for Life Lessons MVP - Track your 10,000 lessons journey')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('lessons', 'Lesson management')
    .addTag('goals', 'Goals and sprints')
    .addTag('ai', 'AI analysis')
    .addTag('analytics', 'Analytics and insights')
    .addTag('reminders', 'Reminders management')
    .addTag('groups', 'Groups and community')
    .addTag('concepts', 'Concept Knowledge Base')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Life Lessons API running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
}

bootstrap();
