"use client";

import { useEffect, useState } from "react";

// Guarda o id digitado no localStorage deste navegador, só para não
// precisar redigitar a cada visita. Não é autenticação de verdade,
// é só uma conveniência para o trabalho.
export function useIdentidade(chave: string) {
  const [id, setId] = useState("");

  useEffect(() => {
    const salvo = window.localStorage.getItem(chave);
    if (salvo) setId(salvo);
  }, [chave]);

  function atualizar(novoId: string) {
    setId(novoId);
    window.localStorage.setItem(chave, novoId);
  }

  return { id, atualizar };
}
