import { NaoEncontradoError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
export class ExcluirSolicitacaoUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(id: string, solicitanteId: string): Promise<void> { const s = await this.repository.buscarPorId(id); if (!s) throw new NaoEncontradoError('Solicitação não encontrada.'); s.verificarPermissao(solicitanteId); await this.repository.excluir(id); }
}
