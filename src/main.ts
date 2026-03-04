import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerConfiguration } from './configs/swagger.config';
import { AppModule } from './modules/app/app.module';

const GLOBAL_API_PERFIX = 'api' as const;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfiguration(app);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(GLOBAL_API_PERFIX);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
