CREATE TABLE "credfacil_solicitacoes" (
  "id" UUID PRIMARY KEY,
  "solicitanteId" TEXT NOT NULL,
  "nomeCompleto" TEXT NOT NULL,
  "rendaMensal" DECIMAL(14,2) NOT NULL CHECK ("rendaMensal" > 0),
  "valorSolicitado" DECIMAL(14,2) NOT NULL CHECK ("valorSolicitado" BETWEEN 100 AND 1000000),
  "prazoMeses" INTEGER NOT NULL CHECK ("prazoMeses" BETWEEN 1 AND 120),
  "situacaoProfissional" TEXT NOT NULL,
  "finalidade" TEXT NOT NULL,
  "observacoes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDENTE' CHECK ("status" IN ('PENDENTE','APROVADA','REPROVADA')),
  "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadaEm" TIMESTAMP(3),
  "analistaId" TEXT,
  "aprovada" BOOLEAN,
  "valorAprovado" DECIMAL(14,2),
  "parecer" TEXT,
  "analisadaEm" TIMESTAMP(3)
);
CREATE TABLE "credfacil_auditorias" (
  "idRegistro" UUID PRIMARY KEY,
  "solicitacaoId" UUID NOT NULL REFERENCES "credfacil_solicitacoes"("id") ON DELETE RESTRICT,
  "estadoAnterior" TEXT NOT NULL,
  "novoEstado" TEXT NOT NULL,
  "autorId" TEXT NOT NULL,
  "justificativa" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "credfacil_auditorias_solicitacaoId_idx" ON "credfacil_auditorias"("solicitacaoId");
