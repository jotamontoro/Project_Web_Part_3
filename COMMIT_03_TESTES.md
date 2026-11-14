# Commit 03 — Testes das regras de negócio

Este estágio adiciona testes automatizados para a entidade `SolicitacaoEmprestimo` e para o caso de uso `AvaliarSolicitacaoUseCase`, sem alterar a API ou a persistência.

## Como executar

No terminal, dentro da pasta `backend`:

```powershell
npm ci
npm test
npm run build
```

Os testes verificam criação, aprovação, reprovação, proibição de autoavaliação, bloqueio de decisões repetidas, valores inválidos, permissões de edição e geração de dados de auditoria.

**Limitação:** os testes do caso de uso utilizam um repositório simulado. Eles não comprovam a atomicidade da escrita JSON, transações ACID ou integração com PostgreSQL; isso exige testes de integração posteriores.
