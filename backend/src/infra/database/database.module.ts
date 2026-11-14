import { Module } from '@nestjs/common';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
import { JsonDatabaseService } from './json-database.service.js';
import { JsonSolicitacaoRepository } from './json-solicitacao.repository.js';
@Module({ providers: [JsonDatabaseService, { provide: SolicitacaoRepository, useClass: JsonSolicitacaoRepository }], exports: [JsonDatabaseService, SolicitacaoRepository] })
export class DatabaseModule {}
