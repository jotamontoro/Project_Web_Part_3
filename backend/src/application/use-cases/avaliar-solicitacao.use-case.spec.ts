import { describe, expect, it, vi } from 'vitest';
import { AvaliarSolicitacaoUseCase } from './avaliar-solicitacao.use-case.js';
import { SolicitacaoEmprestimo } from '../../domain/entities/solicitacao-emprestimo.js';
import { FinalidadeEmprestimo, SituacaoProfissional, StatusSolicitacao } from '../../domain/entities/enums.js';
import { NaoEncontradoError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';

const criar = () => SolicitacaoEmprestimo.criar('pedido-1', 'cliente-1', {
  nomeCompleto: 'Maria da Silva', rendaMensal: 4000, valorSolicitado: 5000,
  prazoMeses: 12, situacaoProfissional: SituacaoProfissional.CLT,
  finalidade: FinalidadeEmprestimo.PESSOAL,
});

describe('AvaliarSolicitacaoUseCase - auditoria', () => {
  it('registra transicao e justificativa junto da avaliacao', async () => {
    const solicitacao = criar();
    const salvarComAuditoria = vi.fn().mockResolvedValue(undefined);
    const repo = { buscarPorId: vi.fn().mockResolvedValue(solicitacao), salvarComAuditoria } as unknown as SolicitacaoRepository;
    const resultado = await new AvaliarSolicitacaoUseCase(repo).executar('pedido-1', 'analista-1', {
      aprovada: true, valorAprovado: 4500, parecer: '  Perfil aprovado  ',
    });
    expect(resultado.status).toBe(StatusSolicitacao.APROVADA);
    expect(salvarComAuditoria).toHaveBeenCalledOnce();
    expect(salvarComAuditoria).toHaveBeenCalledWith(resultado, expect.objectContaining({
      solicitacaoId: 'pedido-1', estadoAnterior: StatusSolicitacao.PENDENTE,
      novoEstado: StatusSolicitacao.APROVADA, autorId: 'analista-1', justificativa: 'Perfil aprovado',
      idRegistro: expect.any(String), timestamp: expect.any(String),
    }));
  });

  it('nao gera auditoria quando a avaliacao e invalida', async () => {
    const salvarComAuditoria = vi.fn();
    const repo = { buscarPorId: vi.fn().mockResolvedValue(criar()), salvarComAuditoria } as unknown as SolicitacaoRepository;
    await expect(new AvaliarSolicitacaoUseCase(repo).executar('pedido-1', 'cliente-1', {
      aprovada: false, parecer: 'Negado',
    })).rejects.toThrow();
    expect(salvarComAuditoria).not.toHaveBeenCalled();
  });

  it('retorna erro quando a solicitacao nao existe', async () => {
    const repo = { buscarPorId: vi.fn().mockResolvedValue(null) } as unknown as SolicitacaoRepository;
    await expect(new AvaliarSolicitacaoUseCase(repo).executar('inexistente', 'analista-1', {
      aprovada: false, parecer: 'Negado',
    })).rejects.toThrow(NaoEncontradoError);
  });
});
