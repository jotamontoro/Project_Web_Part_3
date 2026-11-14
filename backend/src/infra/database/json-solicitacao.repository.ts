import { RegistroAuditoria } from '../../domain/entities/registro-auditoria.js';
import { RegraDeNegocioError } from '../../domain/errors/domain.errors.js';
import { Injectable } from '@nestjs/common';
import { SolicitacaoEmprestimo, SolicitacaoProps } from '../../domain/entities/solicitacao-emprestimo.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
import { JsonDatabaseService } from './json-database.service.js';
const COLECAO = 'solicitacoes';
@Injectable()
export class JsonSolicitacaoRepository extends SolicitacaoRepository {
  constructor(private readonly banco: JsonDatabaseService) { super(); }
  async listar(): Promise<SolicitacaoEmprestimo[]> { return (await this.banco.ler<SolicitacaoProps>(COLECAO)).map(r => new SolicitacaoEmprestimo(r)); }
  async buscarPorId(id: string): Promise<SolicitacaoEmprestimo | null> { const r = (await this.banco.ler<SolicitacaoProps>(COLECAO)).find(x => x.id === id); return r ? new SolicitacaoEmprestimo(r) : null; }
  salvar(s: SolicitacaoEmprestimo): Promise<void> { const registro: SolicitacaoProps = { ...s }; return this.banco.alterar<SolicitacaoProps>(COLECAO, itens => { const i = itens.findIndex(x => x.id === s.id); return i < 0 ? [...itens, registro] : itens.map((x,n) => n === i ? registro : x); }); }
  salvarComAuditoria(s: SolicitacaoEmprestimo, registro: RegistroAuditoria): Promise<void> {
    return this.banco.alterarBanco(banco => {
      const solicitacoes = (banco[COLECAO] ?? []) as SolicitacaoProps[];
      const indice = solicitacoes.findIndex(item => item.id === s.id);
      if (indice < 0) throw new RegraDeNegocioError('Solicitação não encontrada para auditoria.');
      if (solicitacoes[indice].status !== registro.estadoAnterior)
        throw new RegraDeNegocioError('A solicitação foi modificada por outro usuário. Atualize a página.');
      solicitacoes[indice] = { ...s };
      banco[COLECAO] = solicitacoes;
      const auditoria = (banco['auditoria'] ?? []) as RegistroAuditoria[];
      banco['auditoria'] = [...auditoria, registro];
    });
  }
  async listarAuditoria(solicitacaoId: string): Promise<RegistroAuditoria[]> {
    return (await this.banco.ler<RegistroAuditoria>('auditoria')).filter(r => r.solicitacaoId === solicitacaoId);
  }
  excluir(id: string): Promise<void> { return this.banco.alterar<SolicitacaoProps>(COLECAO, itens => itens.filter(x => x.id !== id)); }
}
