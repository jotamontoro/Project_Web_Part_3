import { DadosSolicitacao, SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { NaoEncontradoError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
export class AtualizarSolicitacaoUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(id: string, solicitanteId: string, dados: DadosSolicitacao): Promise<SolicitacaoEmprestimo> { const s = await this.repository.buscarPorId(id); if (!s) throw new NaoEncontradoError('Solicitação não encontrada.'); s.editar(solicitanteId, dados); await this.repository.salvar(s); return s; }
}
