import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module.js';
@Module({ imports: [HttpModule] })
export class AppModule {}
