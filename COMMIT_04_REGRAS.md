# Commit 04 — Regras financeiras e exceções

## Regra adotada pelo projeto (não exigência numérica da professora)
A aprovação exige que a parcela estimada (`valorAprovado / prazoMeses`) não ultrapasse 30% da renda mensal declarada. É uma estimativa **sem juros**, tarifas ou análise de risco real; não deve ser apresentada como proposta bancária.

A reprovação não é bloqueada por essa regra. Um parecer de aprovação/reprovação deve ter pelo menos 3 caracteres não brancos. Validações ocorrem antes da alteração de status; erro de domínio resulta em HTTP 400 pelo filtro já existente.

## Arquivos alterados
- `backend/src/domain/entities/solicitacao-emprestimo.ts`
- `backend/src/domain/entities/solicitacao-emprestimo.spec.ts`

## Verificação
Na pasta `backend`: `npm.cmd test` e `npm.cmd run build`. Não realizar commit se falharem.
