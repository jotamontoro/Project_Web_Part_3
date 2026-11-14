# Commit 07 — PostgreSQL + Prisma

## Preparação
1. Conecte a VPN Forcepoint do IFSP.
2. No DBeaver, confirme seu schema individual e permissões. **Não use `public` nem o schema de outro aluno.**
3. Copie `backend/.env.example` para `backend/.env` e configure usuário, senha e schema. Nunca faça commit de `.env`. Codifique caracteres especiais da senha na URL.
4. Dentro de `backend`, execute:
   ```powershell
   npm.cmd install
   npm.cmd run prisma:generate
   npm.cmd run prisma:migrate:deploy
   npm.cmd test
   npm.cmd run build
   npm.cmd run start:dev
   ```
5. No frontend, execute `npm.cmd run dev` e crie/avalie uma solicitação. Verifique as duas tabelas `credfacil_solicitacoes` e `credfacil_auditorias` no DBeaver.

## Observações
- Este commit substitui o repositório JSON por Prisma no módulo NestJS.
- A transação de avaliação usa atualização condicional de estado e inserção de auditoria na mesma transação.
- **A conexão real ao banco e os testes/build ainda precisam ser executados na sua máquina.**
- Não execute `prisma db push` no banco institucional.
- Este pacote não contém `node_modules`; instale as dependências com `npm.cmd install` (não `npm.cmd ci` antes de atualizar o lock).
- Se a migração retornar erro de permissão, pare e peça autorização ao administrador; não tente outro schema.
- Se `npm install` atualizar `backend/package-lock.json`, inclua esse arquivo no commit.
