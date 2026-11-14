# Back-end — CredFácil

API desenvolvida com NestJS e TypeScript seguindo arquitetura limpa.

## Camadas

- `src/domain`: entidade `SolicitacaoEmprestimo`, enums, regras de negócio, erros e contrato `SolicitacaoRepository`.
- `src/application/use-cases`: casos de uso independentes do framework (criar, listar, buscar, atualizar, excluir, listar fila e avaliar).
- `src/infra/database`: repositório JSON que implementa o contrato do domínio.
- `src/infra/http`: controllers NestJS, DTOs, decorator de identificação, guard de papel, filtro de erros e configuração HTTP.

## Executar

```bash
npm install
npm run start:dev
```

A API inicia em `http://localhost:8000`. Os registros são gravados em `data/db.json`.

## Regras

O solicitante usa o header `x-user-id`. Só pode alterar ou excluir a própria solicitação enquanto estiver pendente. Um solicitante não pode ter mais de uma solicitação pendente. A análise exige `x-role: ANALISTA`; a decisão também recebe `x-user-id` para identificar o analista.
