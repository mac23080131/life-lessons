import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  
  // CORS configuration for production
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Temporarily disabled for debugging
      transformOptions: {
        enableImplicitConversion: true, // Auto convert types
      },
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

    const port = Number(process.env.API_PORT || 3001);
    const host = process.env.HOST || '0.0.0.0';
    await app.listen(port, host as any);
  
    console.log(`🚀 Life Lessons API running on: http://${host}:${port}`);
    console.log(`📚 Swagger docs available at: http://${host}:${port}/docs`);
}

bootstrap();
