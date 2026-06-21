import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { appendFileSync } from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
   origin: ['http://localhost:3000', 'http://localhost:3001', 'https://client-notes-one.vercel.app/'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
       forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        console.log(
          'Validation failed errors:',
          JSON.stringify(errors, null, 2),
        );
        return new BadRequestException(errors);
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('User Auth API')
    .setDescription('NestJS Auth Example with MongoDB')
    .setVersion('1.0')
    .addTag('Auth')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3007);
}
bootstrap();
