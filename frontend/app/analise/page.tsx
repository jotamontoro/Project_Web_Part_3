"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, avaliarSolicitacao, buscarFila } from "@/lib/api";
import { formatarData, formatarMoeda, rotuloFinalidade, rotuloSituacaoProfissional } from "@/lib/constants";
import { SolicitacaoEmprestimo } from "@/lib/types";
import { useIdentidade } from "@/lib/useIdentidade";

export default function AnaliseCreditoPage() {
  const { id: analistaId, atualizar: atualizarAnalistaId } = useIdentidade("meu-analista-id");
  const [fila, setFila] = useState<SolicitacaoEmprestimo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [solicitacaoAberta, setSolicitacaoAberta] = useState<string | null>(null);

  async function buscar() {
    setCarregando(true); setErro("");
    try { setFila(await buscarFila()); }
    catch (e) { setErro(e instanceof ApiError ? e.message : "Não foi possível carregar a fila."); }
    finally { setCarregando(false); }
  }
  useEffect(() => { buscar(); }, []);

  async function enviarAvaliacao(id: string, dados: { aprovada: boolean; valorAprovado?: number; parecer: string }) {
    if (!analistaId.trim()) { setErro("Informe o seu identificador de analista."); return; }
    await avaliarSolicitacao(id, analistaId, dados); setSolicitacaoAberta(null); await buscar();
  }
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <div><Link href="/" className="text-sm text-zinc-500 hover:underline">← voltar</Link><h1 className="mt-3 text-2xl font-semibold">Análise de crédito</h1><p className="mt-1 text-sm text-zinc-500">Fila de solicitações aguardando avaliação.</p></div>
      <label className="flex flex-col gap-1 text-sm">Seu identificador de analista<input className="rounded-lg border border-zinc-300 px-3 py-2" value={analistaId} onChange={(e) => atualizarAnalistaId(e.target.value)} placeholder="Ex.: analista01" /></label>
      <div className="flex items-center justify-between"><h2 className="font-semibold">Solicitações pendentes ({fila.length})</h2><button onClick={buscar} disabled={carregando} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm disabled:opacity-50">Atualizar fila</button></div>
      {carregando && <p className="text-sm text-zinc-500">Carregando...</p>}{erro && <p className="text-sm text-red-600">{erro}</p>}
      {!carregando && fila.length === 0 && !erro && <p className="text-sm text-zinc-500">Nenhuma solicitação pendente.</p>}
      <ul className="flex flex-col gap-4">{fila.map((s) => <li key={s.id} className="rounded-xl border border-zinc-200 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold">{s.nomeCompleto}</h3><p className="text-xs text-zinc-400">Solicitante: {s.solicitanteId} · {formatarData(s.criadaEm)}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">Pendente</span></div>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><p><strong>Renda mensal:</strong> {formatarMoeda(s.rendaMensal)}</p><p><strong>Valor solicitado:</strong> {formatarMoeda(s.valorSolicitado)}</p><p><strong>Prazo:</strong> {s.prazoMeses} meses</p><p><strong>Ocupação:</strong> {rotuloSituacaoProfissional(s.situacaoProfissional)}</p><p><strong>Finalidade:</strong> {rotuloFinalidade(s.finalidade)}</p></div>
        {s.observacoes && <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600"><strong>Observações:</strong> {s.observacoes}</p>}
        {solicitacaoAberta === s.id ? <FormularioAvaliacao valorSolicitado={s.valorSolicitado} onCancelar={() => setSolicitacaoAberta(null)} onEnviar={(dados) => enviarAvaliacao(s.id, dados)} /> : <button onClick={() => setSolicitacaoAberta(s.id)} className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Analisar solicitação</button>}
      </li>)}</ul>
    </main>
  );
}

function FormularioAvaliacao({ valorSolicitado, onEnviar, onCancelar }: { valorSolicitado: number; onEnviar: (dados: { aprovada: boolean; valorAprovado?: number; parecer: string }) => Promise<void>; onCancelar: () => void }) {
  const [aprovada, setAprovada] = useState(true);
  const [valorAprovado, setValorAprovado] = useState(String(valorSolicitado));
  const [parecer, setParecer] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  async function enviar(evento: React.FormEvent) {
    evento.preventDefault(); setEnviando(true); setErro("");
    try { await onEnviar({ aprovada, valorAprovado: aprovada ? Number(valorAprovado) : undefined, parecer }); }
    catch (e) { setErro(e instanceof ApiError ? e.message : "Não foi possível registrar a análise."); }
    finally { setEnviando(false); }
  }
  const campo = "rounded-lg border border-zinc-300 px-3 py-2";
  return <form onSubmit={enviar} className="mt-4 flex flex-col gap-3 border-t border-zinc-200 pt-4 text-sm">
    <label className="flex flex-col gap-1">Decisão<select className={campo} value={aprovada ? "APROVAR" : "REPROVAR"} onChange={(e) => setAprovada(e.target.value === "APROVAR")}><option value="APROVAR">Aprovar crédito</option><option value="REPROVAR">Reprovar crédito</option></select></label>
    {aprovada && <label className="flex flex-col gap-1">Valor aprovado (R$)<input required type="number" min="0.01" max={valorSolicitado} step="0.01" className={campo} value={valorAprovado} onChange={(e) => setValorAprovado(e.target.value)} /><span className="text-xs text-zinc-400">Limite solicitado: {formatarMoeda(valorSolicitado)}</span></label>}
    <label className="flex flex-col gap-1">Parecer da análise<textarea required minLength={3} className={campo} rows={3} value={parecer} onChange={(e) => setParecer(e.target.value)} placeholder="Registre a justificativa da decisão..." /></label>
    {erro && <p className="text-red-600">{erro}</p>}
    <div className="flex gap-2"><button type="submit" disabled={enviando} className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50">{enviando ? "Registrando..." : "Confirmar análise"}</button><button type="button" onClick={onCancelar} className="rounded-lg border border-zinc-300 px-4 py-2">Cancelar</button></div>
  </form>;
}
