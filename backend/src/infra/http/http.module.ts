import { Module, Provider } from '@nestjs/common';
import { AtualizarSolicitacaoUseCase } from '../../application/use-cases/atualizar-solicitacao.use-case.js';
import { AvaliarSolicitacaoUseCase } from '../../application/use-cases/avaliar-solicitacao.use-case.js';
import { BuscarSolicitacaoUseCase } from '../../application/use-cases/buscar-solicitacao.use-case.js';
import { CriarSolicitacaoUseCase } from '../../application/use-cases/criar-solicitacao.use-case.js';
import { ExcluirSolicitacaoUseCase } from '../../application/use-cases/excluir-solicitacao.use-case.js';
import { ListarFilaAnaliseUseCase } from '../../application/use-cases/listar-fila-analise.use-case.js';
import { ListarSolicitacoesUseCase } from '../../application/use-cases/listar-solicitacoes.use-case.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
import { DatabaseModule } from '../database/database.module.js';
import { AnaliseCreditoController } from './controllers/analise-credito.controller.js';
import { SolicitacoesController } from './controllers/solicitacoes.controller.js';
function caso<T>(classe: new (repo: SolicitacaoRepository) => T): Provider { return { provide: classe, useFactory: (repo: SolicitacaoRepository) => new classe(repo), inject: [SolicitacaoRepository] }; }
@Module({ imports: [DatabaseModule], controllers: [SolicitacoesController, AnaliseCreditoController], providers: [caso(CriarSolicitacaoUseCase), caso(ListarSolicitacoesUseCase), caso(BuscarSolicitacaoUseCase), caso(AtualizarSolicitacaoUseCase), caso(ExcluirSolicitacaoUseCase), caso(ListarFilaAnaliseUseCase), caso(AvaliarSolicitacaoUseCase)] })
export class HttpModule {}
