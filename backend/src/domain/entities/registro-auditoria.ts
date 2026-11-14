import { StatusSolicitacao } from './enums.js';

/** Registro append-only de uma transição de estado. */
export interface RegistroAuditoria {
  idRegistro: string;
  solicitacaoId: string;
  estadoAnterior: StatusSolicitacao;
  novoEstado: StatusSolicitacao;
  autorId: string;
  justificativa: string;
  timestamp: string;
}
