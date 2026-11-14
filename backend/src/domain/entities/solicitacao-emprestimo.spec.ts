import { describe, expect, it } from 'vitest';
import { SolicitacaoEmprestimo } from './solicitacao-emprestimo.js';
import { FinalidadeEmprestimo, SituacaoProfissional, StatusSolicitacao } from './enums.js';
import { PermissaoNegadaError, RegraDeNegocioError } from '../errors/domain.errors.js';

const dados = {
  nomeCompleto: 'Maria da Silva', rendaMensal: 4500, valorSolicitado: 12000,
  prazoMeses: 24, situacaoProfissional: SituacaoProfissional.CLT,
  finalidade: FinalidadeEmprestimo.PESSOAL,
};
const nova = () => SolicitacaoEmprestimo.criar('sol-1', 'cliente-1', dados);

describe('SolicitacaoEmprestimo - regras de dominio', () => {
  it('cria uma solicitacao pendente', () => {
    const solicitacao = nova();
    expect(solicitacao.status).toBe(StatusSolicitacao.PENDENTE);
    expect(solicitacao.criadaEm).toBeTruthy();
  });

  it('aprova com valor valido e registra analista e parecer', () => {
    const solicitacao = nova();
    solicitacao.aprovar('analista-1', 9000, 'Documentacao aprovada');
    expect(solicitacao.status).toBe(StatusSolicitacao.APROVADA);
    expect(solicitacao.analise).toMatchObject({ analistaId: 'analista-1', aprovada: true, valorAprovado: 9000 });
    expect(solicitacao.atualizadaEm).toBeTruthy();
  });

  it('reprova e impede uma segunda decisao', () => {
    const solicitacao = nova();
    solicitacao.reprovar('analista-1', 'Renda insuficiente');
    expect(solicitacao.status).toBe(StatusSolicitacao.REPROVADA);
    expect(() => solicitacao.aprovar('analista-2', 1000, 'Outra decisao')).toThrow(RegraDeNegocioError);
  });

  it('impede que o solicitante analise o proprio pedido', () => {
    expect(() => nova().aprovar('cliente-1', 1000, 'Aprovado')).toThrow(PermissaoNegadaError);
  });

  it('impede aprovacao acima do valor solicitado ou com valor nao positivo', () => {
    expect(() => nova().aprovar('analista-1', 12001, 'Aprovado')).toThrow(RegraDeNegocioError);
    expect(() => nova().aprovar('analista-1', 0, 'Aprovado')).toThrow(RegraDeNegocioError);
  });

  it('exige parecer na analise', () => {
    expect(() => nova().reprovar('analista-1', '   ')).toThrow(RegraDeNegocioError);
  });

  it('permite edicao pelo dono apenas enquanto pendente', () => {
    const solicitacao = nova();
    expect(() => solicitacao.editar('outra-pessoa', dados)).toThrow(PermissaoNegadaError);
    solicitacao.editar('cliente-1', { ...dados, rendaMensal: 5000 });
    expect(solicitacao.rendaMensal).toBe(5000);
    solicitacao.aprovar('analista-1', 10000, 'Aprovado');
    expect(() => solicitacao.editar('cliente-1', dados)).toThrow(RegraDeNegocioError);
  });

  it('rejeita dados invalidos na criacao', () => {
    expect(() => SolicitacaoEmprestimo.criar('id', 'cliente', { ...dados, rendaMensal: -1 })).toThrow(RegraDeNegocioError);
    expect(() => SolicitacaoEmprestimo.criar('id', 'cliente', { ...dados, prazoMeses: 0 })).toThrow(RegraDeNegocioError);
  });
});
