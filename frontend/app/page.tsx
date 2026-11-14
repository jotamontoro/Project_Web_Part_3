import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20 text-center">
      <div className="max-w-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">CredFácil</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Solicitação de empréstimo e análise de crédito</h1>
        <p className="mt-3 text-zinc-500">Uma maneira simples de registrar pedidos de empréstimo e acompanhar a análise.</p>
      </div>
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <Link href="/solicitar" className="rounded-xl border border-zinc-300 bg-white p-6 text-left transition hover:border-blue-500 hover:shadow-sm">
          <span className="mb-3 block text-2xl">💳</span><span className="block font-semibold">Sou solicitante</span>
          <span className="mt-1 block text-sm text-zinc-500">Preencher uma solicitação de empréstimo e acompanhar seu andamento.</span>
        </Link>
        <Link href="/analise" className="rounded-xl border border-zinc-300 bg-white p-6 text-left transition hover:border-blue-500 hover:shadow-sm">
          <span className="mb-3 block text-2xl">📋</span><span className="block font-semibold">Sou analista de crédito</span>
          <span className="mt-1 block text-sm text-zinc-500">Consultar solicitações pendentes e registrar uma decisão.</span>
        </Link>
      </div>
      <p className="max-w-lg text-xs text-zinc-400">Projeto acadêmico demonstrativo. As análises são registradas por um analista e não representam uma oferta real de crédito.</p>
    </main>
  );
}
