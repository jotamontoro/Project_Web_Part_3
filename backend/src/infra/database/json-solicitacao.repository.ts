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
  excluir(id: string): Promise<void> { return this.banco.alterar<SolicitacaoProps>(COLECAO, itens => itens.filter(x => x.id !== id)); }
}
