import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { API_BEARER_AUTH } from 'src/common/constants/bearer-auth.constant';

export const SWAGGER_ROUTE = 'api-docs';

export const initializeSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Food Management App')
    .setDescription('Food management App')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        bearerFormat: 'JWT',
        in: 'header',
        scheme: 'bearer',
      },
      API_BEARER_AUTH,
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_ROUTE, app, documentFactory);
};
