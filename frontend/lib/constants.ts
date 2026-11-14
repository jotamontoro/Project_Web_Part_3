export const API_URL = "http://localhost:8000";
export const FINALIDADES = [
  { valor: "PESSOAL", rotulo: "Uso pessoal" },
  { valor: "REFORMA", rotulo: "Reforma ou construção" },
  { valor: "EDUCACAO", rotulo: "Educação" },
  { valor: "SAUDE", rotulo: "Saúde" },
  { valor: "VEICULO", rotulo: "Compra de veículo" },
  { valor: "OUTRA", rotulo: "Outra finalidade" },
] as const;
export const SITUACOES_PROFISSIONAIS = [
  { valor: "CLT", rotulo: "Empregado (CLT)" },
  { valor: "AUTONOMO", rotulo: "Autônomo / Freelancer" },
  { valor: "SERVIDOR_PUBLICO", rotulo: "Servidor público" },
  { valor: "EMPREENDEDOR", rotulo: "Empreendedor" },
  { valor: "DESEMPREGADO", rotulo: "Desempregado" },
  { valor: "OUTRA", rotulo: "Outra situação" },
] as const;
export function rotuloFinalidade(valor: string): string { return FINALIDADES.find((i) => i.valor === valor)?.rotulo ?? valor; }
export function rotuloSituacaoProfissional(valor: string): string { return SITUACOES_PROFISSIONAIS.find((i) => i.valor === valor)?.rotulo ?? valor; }
export function formatarMoeda(valor: number): string { return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
export function formatarData(valor: string): string { return new Date(valor).toLocaleDateString("pt-BR"); }
