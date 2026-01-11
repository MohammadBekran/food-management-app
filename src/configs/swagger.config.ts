import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { API_BEARER_AUTH } from 'src/common/constants/bearer-auth.constant';

export const SwaggerConfiguration = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Food Management App')
    .setDescription('Backend for a food management application')
    .setVersion('0.0.1')
    .addBearerAuth(SwaggerAuthConfiguration(), API_BEARER_AUTH)
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
