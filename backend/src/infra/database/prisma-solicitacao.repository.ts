import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { SolicitacaoRepository } from '../../domain/repositories/solicitacao.repository.js';
import { SolicitacaoEmprestimo, SolicitacaoProps } from '../../domain/entities/solicitacao-emprestimo.js';
import { RegistroAuditoria } from '../../domain/entities/registro-auditoria.js';
import { RegraDeNegocioError } from '../../domain/errors/domain.errors.js';
import { FinalidadeEmprestimo, SituacaoProfissional, StatusSolicitacao } from '../../domain/entities/enums.js';

@Injectable()
export class PrismaSolicitacaoRepository extends SolicitacaoRepository implements OnModuleDestroy {
  private readonly prisma = new PrismaClient();
  async onModuleDestroy() { await this.prisma.$disconnect(); }

  private toDomain(row: any): SolicitacaoEmprestimo {
    const props: SolicitacaoProps = {
      id: row.id, solicitanteId: row.solicitanteId, nomeCompleto: row.nomeCompleto,
      rendaMensal: Number(row.rendaMensal), valorSolicitado: Number(row.valorSolicitado),
      prazoMeses: row.prazoMeses, situacaoProfissional: row.situacaoProfissional as SituacaoProfissional,
      finalidade: row.finalidade as FinalidadeEmprestimo, observacoes: row.observacoes ?? undefined,
      status: row.status as StatusSolicitacao, criadaEm: row.criadaEm.toISOString(),
      atualizadaEm: row.atualizadaEm?.toISOString(),
      analise: row.analistaId && row.analisadaEm ? {
        analistaId: row.analistaId, aprovada: Boolean(row.aprovada),
        valorAprovado: row.valorAprovado == null ? undefined : Number(row.valorAprovado),
        parecer: row.parecer ?? '', analisadaEm: row.analisadaEm.toISOString(),
      } : undefined,
    };
    return new SolicitacaoEmprestimo(props);
  }
  private toData(s: SolicitacaoEmprestimo) {
    return {
      solicitanteId: s.solicitanteId, nomeCompleto: s.nomeCompleto,
      rendaMensal: new Prisma.Decimal(s.rendaMensal), valorSolicitado: new Prisma.Decimal(s.valorSolicitado),
      prazoMeses: s.prazoMeses, situacaoProfissional: s.situacaoProfissional,
      finalidade: s.finalidade, observacoes: s.observacoes ?? null, status: s.status,
      criadaEm: new Date(s.criadaEm), atualizadaEm: s.atualizadaEm ? new Date(s.atualizadaEm) : null,
      analistaId: s.analise?.analistaId ?? null, aprovada: s.analise?.aprovada ?? null,
      valorAprovado: s.analise?.valorAprovado == null ? null : new Prisma.Decimal(s.analise.valorAprovado),
      parecer: s.analise?.parecer ?? null,
      analisadaEm: s.analise?.analisadaEm ? new Date(s.analise.analisadaEm) : null,
    };
  }
  async listar() { return (await this.prisma.solicitacao.findMany({ orderBy: { criadaEm: 'desc' } })).map(r => this.toDomain(r)); }
  async buscarPorId(id: string) { const r = await this.prisma.solicitacao.findUnique({ where: { id } }); return r ? this.toDomain(r) : null; }
  async salvar(s: SolicitacaoEmprestimo) {
    const data = this.toData(s);
    await this.prisma.solicitacao.upsert({ where: { id: s.id }, create: { id: s.id, ...data }, update: data });
  }
  async excluir(id: string) { await this.prisma.solicitacao.deleteMany({ where: { id, status: 'PENDENTE' } }); }
  async salvarComAuditoria(s: SolicitacaoEmprestimo, registro: RegistroAuditoria) {
    await this.prisma.$transaction(async tx => {
      const changed = await tx.solicitacao.updateMany({
        where: { id: s.id, status: registro.estadoAnterior },
        data: this.toData(s),
      });
      if (changed.count !== 1) throw new RegraDeNegocioError('Solicitação não encontrada ou já analisada. Atualize a página.');
      await tx.auditoria.create({ data: {
        idRegistro: registro.idRegistro, solicitacaoId: registro.solicitacaoId,
        estadoAnterior: registro.estadoAnterior, novoEstado: registro.novoEstado,
        autorId: registro.autorId, justificativa: registro.justificativa,
        timestamp: new Date(registro.timestamp),
      } });
    });
  }
  async listarAuditoria(solicitacaoId: string): Promise<RegistroAuditoria[]> {
    return (await this.prisma.auditoria.findMany({ where: { solicitacaoId }, orderBy: { timestamp: 'asc' } }))
      .map(r => ({ idRegistro: r.idRegistro, solicitacaoId: r.solicitacaoId,
        estadoAnterior: r.estadoAnterior as StatusSolicitacao, novoEstado: r.novoEstado as StatusSolicitacao,
        autorId: r.autorId, justificativa: r.justificativa, timestamp: r.timestamp.toISOString() }));
  }
}
