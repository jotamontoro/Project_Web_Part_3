import { Module } from '@nestjs/common';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
import { PrismaSolicitacaoRepository } from './prisma-solicitacao.repository.js';
@Module({ providers: [{ provide: SolicitacaoRepository, useClass: PrismaSolicitacaoRepository }], exports: [SolicitacaoRepository] })
export class DatabaseModule {}
