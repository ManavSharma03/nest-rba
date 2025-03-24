import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Global Validation Pipes
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('User & Document Management API')
    .setDescription(
      'APIs for managing users, authentication, documents, and ingestion',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // 🔥 Important for Swagger UI
        in: 'header',
      },
      'access-token', // 🔥 This must match the name in `@ApiBearerAuth('access-token')`
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps authorization active across requests
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
