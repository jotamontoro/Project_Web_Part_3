import { SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { NaoEncontradoError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
export class BuscarSolicitacaoUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(id: string): Promise<SolicitacaoEmprestimo> { const s = await this.repository.buscarPorId(id); if (!s) throw new NaoEncontradoError('Solicitação não encontrada.'); return s; }
}
