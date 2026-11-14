# Commit 05 — Controle de acesso à consulta

## Alteração
O endpoint `GET /solicitacoes/:id` passa a exigir `x-user-id` e a validar que a solicitação pertence ao usuário informado. Em caso de tentativa de consultar dados de outro solicitante, o backend retorna 403. O frontend envia o identificador no carregamento da página de edição. Foram adicionados três testes unitários.

## Limitação importante
**Os cabeçalhos `x-user-id` e `x-role` são informados pelo próprio cliente e podem ser falsificados.** Portanto, isto é apenas autorização demonstrativa, **não autenticação real nem segurança adequada para produção**. Um sistema real exigiria login, sessão/token verificado no servidor e papéis atribuídos pelo backend.

## Testar
No diretório `backend`: `npm.cmd test` e `npm.cmd run build`.
No diretório `frontend`: `npm.cmd ci` (se necessário) e `npm.cmd run build`.
