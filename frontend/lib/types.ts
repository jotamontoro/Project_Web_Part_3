export type FinalidadeEmprestimo = "PESSOAL" | "REFORMA" | "EDUCACAO" | "SAUDE" | "VEICULO" | "OUTRA";
export type SituacaoProfissional = "CLT" | "AUTONOMO" | "SERVIDOR_PUBLICO" | "EMPREENDEDOR" | "DESEMPREGADO" | "OUTRA";
export type StatusSolicitacao = "PENDENTE" | "APROVADA" | "REPROVADA";
export interface AnaliseCredito { analistaId: string; aprovada: boolean; valorAprovado?: number; parecer: string; analisadaEm: string; }
export interface DadosSolicitacao { nomeCompleto: string; rendaMensal: number; valorSolicitado: number; prazoMeses: number; situacaoProfissional: SituacaoProfissional; finalidade: FinalidadeEmprestimo; observacoes?: string; }
export interface SolicitacaoEmprestimo extends DadosSolicitacao { id: string; solicitanteId: string; status: StatusSolicitacao; criadaEm: string; atualizadaEm?: string; analise?: AnaliseCredito; }
