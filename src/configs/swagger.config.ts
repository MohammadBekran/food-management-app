import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const SwaggerConfiguration = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Food Management App')
    .setDescription('Backend application for a food management application')
    .setVersion('0.0.1')
    .addBearerAuth(SwaggerAuthConfiguration(), 'authorization')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, documentFactory);
};

const SwaggerAuthConfiguration = (): SecuritySchemeObject => {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  };
};
