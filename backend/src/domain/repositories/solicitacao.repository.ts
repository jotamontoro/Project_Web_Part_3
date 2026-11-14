import { RegistroAuditoria } from '../entities/registro-auditoria.js';
import { SolicitacaoEmprestimo } from '../entities/solicitacao-emprestimo.js';
export abstract class SolicitacaoRepository {
  abstract listar(): Promise<SolicitacaoEmprestimo[]>;
  abstract buscarPorId(id: string): Promise<SolicitacaoEmprestimo | null>;
  abstract salvar(solicitacao: SolicitacaoEmprestimo): Promise<void>;
  abstract excluir(id: string): Promise<void>;
  abstract salvarComAuditoria(solicitacao: SolicitacaoEmprestimo, registro: RegistroAuditoria): Promise<void>;
  abstract listarAuditoria(solicitacaoId: string): Promise<RegistroAuditoria[]>;
}
