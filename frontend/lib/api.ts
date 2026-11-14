import { API_URL } from "./constants";
import { DadosSolicitacao, SolicitacaoEmprestimo } from "./types";
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  if (!resposta.ok) { const corpo = await resposta.json().catch(() => null); const mensagem = (Array.isArray(corpo?.message) ? corpo.message.join(", ") : corpo?.message) ?? "Ocorreu um erro ao falar com o servidor."; throw new ApiError(mensagem, resposta.status); }
  if (resposta.status === 204) return undefined as T;
  return resposta.json() as Promise<T>;
}
function headersUsuario(id: string) { return { "Content-Type": "application/json", "x-user-id": id }; }
export function criarSolicitacao(id: string, dados: DadosSolicitacao) { return requisicao<SolicitacaoEmprestimo>("/solicitacoes", { method: "POST", headers: headersUsuario(id), body: JSON.stringify(dados) }); }
export function listarMinhasSolicitacoes(id: string) { return requisicao<SolicitacaoEmprestimo[]>("/solicitacoes", { headers: headersUsuario(id) }); }
export function buscarSolicitacao(id: string, usuarioId: string) { return requisicao<SolicitacaoEmprestimo>(`/solicitacoes/${id}`, { headers: headersUsuario(usuarioId) }); }
export function atualizarSolicitacao(id: string, usuarioId: string, dados: DadosSolicitacao) { return requisicao<SolicitacaoEmprestimo>(`/solicitacoes/${id}`, { method: "PUT", headers: headersUsuario(usuarioId), body: JSON.stringify(dados) }); }
export function excluirSolicitacao(id: string, usuarioId: string) { return requisicao<void>(`/solicitacoes/${id}`, { method: "DELETE", headers: headersUsuario(usuarioId) }); }
export function buscarFila() { return requisicao<SolicitacaoEmprestimo[]>("/analise-credito/fila", { headers: { "x-role": "ANALISTA" } }); }
export function avaliarSolicitacao(id: string, analistaId: string, dados: { aprovada: boolean; valorAprovado?: number; parecer: string }) { return requisicao<SolicitacaoEmprestimo>(`/analise-credito/${id}/avaliar`, { method: "PATCH", headers: { ...headersUsuario(analistaId), "x-role": "ANALISTA" }, body: JSON.stringify(dados) }); }
