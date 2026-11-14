import { StatusSolicitacao } from '../../domain/entities/enums.js';
import { SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
export class ListarFilaAnaliseUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(): Promise<SolicitacaoEmprestimo[]> { return (await this.repository.listar()).filter(s => s.status === StatusSolicitacao.PENDENTE).sort((a,b) => a.criadaEm.localeCompare(b.criadaEm)); }
}
