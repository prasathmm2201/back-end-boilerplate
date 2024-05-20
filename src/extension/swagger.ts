import { config } from '../configs';
import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerOption: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'My REST API',
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
  },
  apis: ['**/*.ts'],
};