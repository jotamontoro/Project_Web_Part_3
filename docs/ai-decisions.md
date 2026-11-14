# Relatório de utilização de Inteligência Artificial — CredFácil

## 1. Introdução

O desenvolvimento do CredFácil, sistema web destinado ao gerenciamento de solicitações de empréstimo e análise de crédito, contou com o apoio de Inteligência Artificial generativa na implementação, validação e documentação. As intervenções foram organizadas em etapas específicas: máquina de estados, auditoria, testes automatizados, regras financeiras, controle de acesso e documentação.

O código proposto pela IA foi incorporado progressivamente, com commits no Git. A avaliação técnica considerou compatibilidade com a arquitetura existente, testes automatizados, compilação e limitações identificadas. Os prompts abaixo foram registrados durante a interação. As soluções são descritas em síntese técnica, sem apresentá-las como transcrição literal da resposta original.

## 2. Intervenções e análise crítica

### 2.1. Máquina de estados — Commit 01

**Desafio:** controlar transições de solicitações, impedir uma segunda decisão e bloquear autoaprovação.

**Prompt registrado:**

> Analise a entidade `SolicitacaoEmprestimo` do backend do projeto CredFácil, desenvolvido em NestJS e TypeScript. Refatore a lógica de avaliação de crédito para implementar uma máquina de estados finitos, com métodos específicos para aprovar e reprovar solicitações. Preserve os estados existentes (`PENDENTE`, `APROVADA` e `REPROVADA`), impeça transições a partir de estados finais e bloqueie a análise de uma solicitação pelo próprio solicitante. Mantenha a compatibilidade com o caso de uso e a API existentes. Não altere o frontend nem a persistência JSON nesta etapa.

**Solução gerada:** introdução de métodos `aprovar()` e `reprovar()` na entidade, com validações de transição e do analista, preservando compatibilidade com `avaliar()`.

**Análise crítica:** concentrar a transição no domínio reduz mudanças arbitrárias de estado. O fluxo permanece simplificado: não contempla solicitação de ajustes nem conclusão. A identificação por cabeçalhos HTTP não representa autenticação confiável.

### 2.2. Auditoria — Commit 02

**Desafio:** registrar decisões sem apagar o histórico.

**Prompt registrado:**

> Implemente um mecanismo de auditoria no backend do projeto CredFácil, utilizando NestJS e TypeScript. Cada aprovação ou reprovação de uma solicitação de empréstimo deve gerar um registro contendo identificador, solicitação, estado anterior, novo estado, autor da decisão, justificativa e data/hora.
>
> Preserve a arquitetura existente e a persistência JSON nesta etapa. Garanta que a atualização da solicitação e a inclusão do registro de auditoria ocorram na mesma operação de persistência, sem sobrescrever o histórico anterior. Impeça também que uma avaliação substitua outra decisão já registrada.
>
> Disponibilize um endpoint para consultar o histórico de auditoria, restrito aos analistas. Não modifique o frontend nem implemente PostgreSQL ainda.

**Solução gerada:** estrutura `RegistroAuditoria`, persistência da avaliação com seu registro histórico, verificação de estado anterior e consulta do histórico por analistas.

**Análise crítica:** a rastreabilidade foi ampliada. Contudo, persistência conjunta em JSON não equivale às garantias ACID de um banco relacional. A migração deverá assegurar atualização e inserção de auditoria na mesma transação.

### 2.3. Testes automatizados — Commit 03

**Desafio:** validar regras de domínio, operações inválidas e auditoria.

**Prompt registrado:**

> Analise as regras de negócio implementadas no backend do CredFácil e desenvolva testes automatizados utilizando Vitest. Verifique a criação de solicitações, aprovação e reprovação de crédito, restrições de acesso, impossibilidade de analisar a própria solicitação, bloqueio de transições inválidas e validação dos valores financeiros.
>
> Crie também testes para o caso de uso de avaliação de crédito, verificando a geração dos dados de auditoria e o tratamento de solicitações inexistentes ou avaliações inválidas. Preserve a arquitetura atual, sem modificar o frontend nem integrar PostgreSQL nesta etapa.

**Solução gerada:** testes de domínio e caso de uso em Vitest.

**Resultado observado:** 11 testes aprovados e build do backend concluído na execução registrada após instalação das dependências.

**Análise crítica:** testes unitários ajudaram a verificar regras, mas não comprovam integração frontend/backend, autenticação nem atomicidade do banco. O bloqueio inicial do `npm.ps1` e a ausência de dependências foram problemas do ambiente de execução, não falhas da regra de negócio.

### 2.4. Regras financeiras — Commit 04

**Desafio:** impedir aprovação com parcela estimada incompatível com a renda declarada.

**Prompt registrado:**

> Analise a entidade SolicitacaoEmprestimo do projeto CredFácil e implemente uma regra financeira para aprovação de empréstimos. Considere que a parcela estimada, calculada pela divisão do valor aprovado pelo prazo em meses, não poderá ultrapassar 30% da renda mensal declarada pelo solicitante.
>
> Garanta que solicitações incompatíveis com essa regra não sejam aprovadas e que o estado permaneça inalterado em caso de erro. Reforce também a validação do parecer do analista, exigindo pelo menos três caracteres válidos.
>
> Mantenha a arquitetura existente, preserve o frontend e a persistência JSON e desenvolva testes automatizados para as novas regras. Não implemente PostgreSQL nesta etapa.

**Solução gerada:** validação do comprometimento máximo de 30% da renda, com parcela estimada pela divisão do valor aprovado pelo prazo, além de validação do parecer.

**Análise crítica e refatoração:** o teste inicial de aprovação no limite utilizava R$ 32.400, superior ao valor solicitado no cenário. Assim, a execução falhou por uma regra distinta daquela que pretendia testar. Os dados foram corrigidos para solicitação de R$ 32.400, renda de R$ 3.000 e prazo de 36 meses, resultando em parcela estimada de R$ 900 (30% da renda). Um teste duplicado também foi removido. Após a revisão, 13 testes passaram e o build do backend foi concluído.

O limite de 30% é uma premissa adotada neste projeto, não uma regra bancária universal nem uma exigência específica do enunciado. A estimativa não considera juros, tarifas ou análise real de risco.

### 2.5. Controle de acesso — Commit 05

**Desafio:** impedir consulta individual a solicitações de terceiros.

**Prompt registrado:**

> Analise o controle de acesso às solicitações de empréstimo no projeto CredFácil. Identifique possíveis falhas de autorização e implemente uma validação no caso de uso de consulta individual para impedir que um solicitante visualize dados pertencentes a outro usuário.
>
> Atualize o controller NestJS e a chamada correspondente no frontend Next.js, preservando as funcionalidades existentes. Utilize as exceções de domínio já implementadas e crie testes automatizados para consulta autorizada, acesso negado e solicitação inexistente.
>
> Mantenha a persistência JSON nesta etapa e documente as limitações do mecanismo atual de identificação por cabeçalhos HTTP.

**Solução gerada:** verificação de propriedade no caso de uso, adaptação do controller e da chamada do frontend, com três novos testes.

**Resultado observado:** 16 testes aprovados; builds do backend e frontend concluídos. A instalação do frontend também apresentou alertas de vulnerabilidades em dependências, que exigem avaliação antes de produção.

**Análise crítica:** a autorização no backend é superior à restrição exclusiva na interface. Entretanto, a identidade ainda é recebida de cabeçalhos controláveis pelo cliente; portanto, não há autenticação segura para uso em produção.

### 2.6. Documentação — Commit 06

**Desafio:** reunir instruções, arquitetura, diagramas e histórico de IA.

**Prompt registrado:**

> Analise a estrutura atual do projeto CredFácil e elabore sua documentação técnica para entrega acadêmica. Atualize o README com instruções de execução, arquitetura, diagrama de estados em Mermaid e proposta de diagrama entidade-relacionamento para PostgreSQL.
>
> Crie também os arquivos docs/arquitetura.md, docs/ai-decisions.md e AI-LOG.md, organizando os prompts utilizados nas etapas anteriores, as soluções propostas, os problemas identificados e as refatorações realizadas.
>
> Diferencie claramente funcionalidades já implementadas das pendentes. Não afirme que o PostgreSQL ou transações ACID estão funcionando enquanto a persistência permanecer em JSON. Preserve todo o código existente.

**Solução gerada:** README com instruções e diagramas, documentação arquitetural e relatório de uso de IA.

**Análise crítica:** a documentação organiza as decisões e facilita a manutenção. O DER foi inicialmente apresentado como proposta e precisa ser revisado após a implementação do banco relacional. A descrição técnica não substitui os artefatos de teste e os registros originais da interação.

## 3. Considerações finais

A IA auxiliou a produção incremental do CredFácil, mas as implementações precisaram ser verificadas. A falha no teste da regra financeira exemplifica a necessidade de avaliar criticamente inclusive os testes gerados: um cenário inconsistente pode produzir uma falha que não decorre da regra sob avaliação.

Os resultados registrados incluem testes automatizados e builds bem-sucedidos, mas não comprovam, por si só, o funcionamento completo em produção. Permanecem como limitações a identificação de usuários por cabeçalhos HTTP e, até a migração, a persistência JSON sem transações relacionais. A etapa de PostgreSQL deverá ser documentada após sua execução e validação.

## 4. Registro das respostas originais

Os textos das seções anteriores são **sínteses técnicas**, não transcrições literais da IA. Para atendimento integral ao requisito de resposta bruta, as mensagens originais de cada intervenção devem ser anexadas ou transcritas diretamente do histórico da conversa, preservando seu conteúdo. Não foram reconstruídas respostas fictícias nem declaradas como originais.
