import { DadosAnalise, SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { NaoEncontradoError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
export class AvaliarSolicitacaoUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(id: string, analistaId: string, dados: DadosAnalise): Promise<SolicitacaoEmprestimo> { const s = await this.repository.buscarPorId(id); if (!s) throw new NaoEncontradoError('Solicitação não encontrada.'); s.avaliar(analistaId, dados); await this.repository.salvar(s); return s; }
}
