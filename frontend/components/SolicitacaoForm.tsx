"use client";
import { useState } from "react";
import { FINALIDADES, SITUACOES_PROFISSIONAIS } from "@/lib/constants";
import { DadosSolicitacao, SolicitacaoEmprestimo } from "@/lib/types";
import { ApiError } from "@/lib/api";
type Props = { inicial?: SolicitacaoEmprestimo; textoBotao: string; aoSalvar: (dados: DadosSolicitacao) => Promise<void> };
export default function SolicitacaoForm({ inicial, textoBotao, aoSalvar }: Props) {
  const [nomeCompleto,setNomeCompleto]=useState(inicial?.nomeCompleto ?? ""); const [rendaMensal,setRendaMensal]=useState(inicial ? String(inicial.rendaMensal) : "");
  const [valorSolicitado,setValorSolicitado]=useState(inicial ? String(inicial.valorSolicitado) : ""); const [prazoMeses,setPrazoMeses]=useState(String(inicial?.prazoMeses ?? 12));
  const [situacaoProfissional,setSituacaoProfissional]=useState(inicial?.situacaoProfissional ?? "CLT"); const [finalidade,setFinalidade]=useState(inicial?.finalidade ?? "PESSOAL"); const [observacoes,setObservacoes]=useState(inicial?.observacoes ?? "");
  const [enviando,setEnviando]=useState(false); const [erro,setErro]=useState("");
  async function enviar(e: React.FormEvent) { e.preventDefault(); setErro(""); setEnviando(true); try { await aoSalvar({ nomeCompleto, rendaMensal:Number(rendaMensal), valorSolicitado:Number(valorSolicitado), prazoMeses:Number(prazoMeses), situacaoProfissional: situacaoProfissional as DadosSolicitacao["situacaoProfissional"], finalidade: finalidade as DadosSolicitacao["finalidade"], observacoes:observacoes || undefined }); } catch (e) { setErro(e instanceof ApiError ? e.message : "Não foi possível salvar a solicitação."); } finally { setEnviando(false); } }
  const campo="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-blue-600";
  return <form onSubmit={enviar} className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-5">
    <h2 className="font-semibold">Dados do solicitante</h2>
    <label className="flex flex-col gap-1 text-sm">Nome completo<input required minLength={3} className={campo} value={nomeCompleto} onChange={e=>setNomeCompleto(e.target.value)} /></label>
    <label className="flex flex-col gap-1 text-sm">Renda mensal (R$)<input required type="number" min="0.01" step="0.01" className={campo} value={rendaMensal} onChange={e=>setRendaMensal(e.target.value)} /></label>
    <label className="flex flex-col gap-1 text-sm">Situação profissional<select className={campo} value={situacaoProfissional} onChange={e=>setSituacaoProfissional(e.target.value as DadosSolicitacao["situacaoProfissional"])}>{SITUACOES_PROFISSIONAIS.map(s=><option key={s.valor} value={s.valor}>{s.rotulo}</option>)}</select></label>
    <div className="my-1 border-t border-zinc-200"/><h2 className="font-semibold">Dados do empréstimo</h2>
    <label className="flex flex-col gap-1 text-sm">Valor solicitado (R$)<input required type="number" min="100" max="1000000" step="0.01" className={campo} value={valorSolicitado} onChange={e=>setValorSolicitado(e.target.value)} /></label>
    <label className="flex flex-col gap-1 text-sm">Prazo desejado<select className={campo} value={prazoMeses} onChange={e=>setPrazoMeses(e.target.value)}>{[6,12,18,24,36,48,60,72,84,96,120].map(n=><option key={n} value={n}>{n} meses</option>)}</select></label>
    <label className="flex flex-col gap-1 text-sm">Finalidade<select className={campo} value={finalidade} onChange={e=>setFinalidade(e.target.value as DadosSolicitacao["finalidade"])}>{FINALIDADES.map(f=><option key={f.valor} value={f.valor}>{f.rotulo}</option>)}</select></label>
    <label className="flex flex-col gap-1 text-sm">Observações adicionais (opcional)<textarea className={campo} rows={3} value={observacoes} onChange={e=>setObservacoes(e.target.value)} /></label>
    {erro && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
    <button type="submit" disabled={enviando} className="rounded-lg bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800 disabled:opacity-50">{enviando ? "Salvando..." : textoBotao}</button>
  </form>;
}
