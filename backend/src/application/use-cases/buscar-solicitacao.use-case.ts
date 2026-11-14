import { SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { NaoEncontradoError, PermissaoNegadaError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';

export class BuscarSolicitacaoUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(id: string, usuarioId: string): Promise<SolicitacaoEmprestimo> {
    const solicitacao = await this.repository.buscarPorId(id);
    if (!solicitacao) throw new NaoEncontradoError('Solicitação não encontrada.');
    if (solicitacao.solicitanteId !== usuarioId) {
      throw new PermissaoNegadaError('Você não pode consultar a solicitação de outro usuário.');
    }
    return solicitacao;
  }
}
