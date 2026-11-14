import { SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
export class ListarSolicitacoesUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(solicitanteId: string): Promise<SolicitacaoEmprestimo[]> { return (await this.repository.listar()).filter(s => s.solicitanteId === solicitanteId).sort((a,b) => b.criadaEm.localeCompare(a.criadaEm)); }
}
