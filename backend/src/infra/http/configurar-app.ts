import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DomainErrorFilter } from './filters/domain-error.filter.js';
export function configurarApp(app: INestApplication) { app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); app.useGlobalFilters(new DomainErrorFilter()); app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', methods: 'GET,POST,PATCH,PUT,DELETE', allowedHeaders: 'Content-Type, Accept, x-user-id, x-role' }); }
