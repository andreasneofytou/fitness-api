import { AppModule } from '@app/app.module';
import { logger } from '@app/logger';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
    rawBody: true,
    cors: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Fitness API')
    .setDescription('Fitness API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  if (process.env.NODE_ENV?.toLowerCase() !== 'production') {
    SwaggerModule.setup('/', app, document);
  }

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
