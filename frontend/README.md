# Front-end — CredFácil

Interface desenvolvida com Next.js, React e Tailwind CSS.

## Executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. A API NestJS deve estar rodando em `http://localhost:8000`.

## Telas

- `/`: página inicial e seleção de perfil.
- `/solicitar`: formulário para incluir pedido de empréstimo.
- `/minhas-solicitacoes`: consulta dos pedidos do solicitante, com ações de alteração e exclusão enquanto estiverem pendentes.
- `/solicitacoes/[id]/editar`: formulário para alterar um pedido pendente.
- `/analise`: fila de análise para o perfil de analista de crédito.

O identificador é armazenado no `localStorage` apenas para facilitar a demonstração acadêmica; isso não equivale a autenticação real.
