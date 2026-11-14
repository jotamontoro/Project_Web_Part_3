import { randomUUID } from 'node:crypto';
import { DadosSolicitacao, SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { ConflitoError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
export class CriarSolicitacaoUseCase {
  constructor(private readonly repository: SolicitacaoRepository) {}
  async executar(solicitanteId: string, dados: DadosSolicitacao): Promise<SolicitacaoEmprestimo> {
    const existentes = await this.repository.listar();
    if (existentes.some(s => s.solicitanteId === solicitanteId && s.estaPendente())) throw new ConflitoError('Você já possui uma solicitação em análise. Aguarde a conclusão antes de enviar outra.');
    const solicitacao = SolicitacaoEmprestimo.criar(randomUUID(), solicitanteId, dados);
    await this.repository.salvar(solicitacao); return solicitacao;
  }
}
