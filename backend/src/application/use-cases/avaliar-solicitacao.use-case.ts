import { randomUUID } from 'node:crypto';
import { DadosAnalise, SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { NaoEncontradoError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
export class AvaliarSolicitacaoUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(id: string, analistaId: string, dados: DadosAnalise): Promise<SolicitacaoEmprestimo> {
    const solicitacao = await this.repository.buscarPorId(id);
    if (!solicitacao) throw new NaoEncontradoError('Solicitação não encontrada.');
    const estadoAnterior = solicitacao.status;
    solicitacao.avaliar(analistaId, dados);
    await this.repository.salvarComAuditoria(solicitacao, {
      idRegistro: randomUUID(), solicitacaoId: id, estadoAnterior,
      novoEstado: solicitacao.status, autorId: analistaId,
      justificativa: dados.parecer.trim(), timestamp: solicitacao.analise!.analisadaEm,
    });
    return solicitacao;
  }
}
