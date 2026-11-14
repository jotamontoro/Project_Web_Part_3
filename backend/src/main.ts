import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configurarApp } from './infra/http/configurar-app.js';
async function bootstrap() { const app = await NestFactory.create(AppModule); configurarApp(app); await app.listen(process.env.PORT ?? 8000); console.log('CredFácil API rodando em http://localhost:8000'); }
await bootstrap();
