import { describe, expect, it, vi } from 'vitest';
import { BuscarSolicitacaoUseCase } from './buscar-solicitacao.use-case.js';
import { NaoEncontradoError, PermissaoNegadaError } from '../../domain/errors/domain.errors.js';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';

describe('BuscarSolicitacaoUseCase - controle de acesso', () => {
  const criarCaso = (solicitacao: { solicitanteId: string } | null) => {
    const buscarPorId = vi.fn().mockResolvedValue(solicitacao);
    const caso = new BuscarSolicitacaoUseCase({ buscarPorId } as unknown as SolicitacaoRepository);
    return { caso, buscarPorId };
  };
  it('permite consultar a propria solicitacao', async () => {
    const solicitacao = { solicitanteId: 'usuario-1' };
    const { caso } = criarCaso(solicitacao);
    await expect(caso.executar('pedido-1', 'usuario-1')).resolves.toBe(solicitacao);
  });
  it('impede consultar a solicitacao de outra pessoa', async () => {
    const { caso } = criarCaso({ solicitanteId: 'usuario-2' });
    await expect(caso.executar('pedido-1', 'usuario-1')).rejects.toBeInstanceOf(PermissaoNegadaError);
  });
  it('retorna erro quando a solicitacao nao existe', async () => {
    const { caso } = criarCaso(null);
    await expect(caso.executar('inexistente', 'usuario-1')).rejects.toBeInstanceOf(NaoEncontradoError);
  });
});
