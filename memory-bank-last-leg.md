# Memory Bank — Produto “Last Leg”

## Definição (o que é)
Serviço productizado para colocar no ar, em **14 dias**, o produto cujo **front já está pronto** (v0, Lovable, no‑code etc.). Entregamos backend, dados, integrações, domínio, deploy e observabilidade — a “última pernada” até produção.

## Para quem (ICP)
- Founders/PMs que criaram o front e travaram no backend/infra
- Negócios que precisam validar rápido (MVP) com domínio e métricas
- Times sem squad de engenharia completa (auth, DB, APIs, deploy)

## Proposta de valor
- **Rapidez**: 14 dias úteis para “site no ar” com o essencial
- **Clareza**: escopo e entregáveis explícitos, preço fechado por tier
- **Base certa**: arquitetura que permite evoluir pós‑lançamento

## Entregáveis (Core)
- Backend em Next.js (rotas de API) + estruturas de domínio
- Banco Postgres + schemas + migrações + seed básico
- Autenticação (Auth.js/Clerk) + controle de sessão
- Emails/notificações (Resend) e templates base
- Integrações essenciais (ex.: Stripe, Webhooks, WhatsApp)
- Configuração de domínio + DNS + SSL (TLD básico incluído; premium como extra)
- Deploy Vercel + observabilidade (Analytics/Logs)
- Documentação: endpoints, entidades e operação
- Handoff + 30 dias de correções

## Limites do Core (exemplos)
- Mobile nativo, RBAC complexo, filas distrib., IA custom/finetune, BI avançado, integrações raras → **extras**

## Tiers (ajustar preços posteriormente)
- **Lite**: até 3 entidades, 1 integração, 10 telas, sem pagamentos
- **Core**: até 6 entidades, 2 integrações, 15 telas, auth + emails
- **Pro**: pagamentos, automações n8n, admin, 20+ telas
- **Extras**: TLD premium (.ai), integrações específicas, RBAC avançado, jobs/queues, dashboards

## Fluxo em 14 dias (macro)
- D0–D1: **RD** (descoberta 1h) + checklist de intake
- D2–D4: modelagem de dados + auth + base do backend
- D5–D8: integrações + emails + automações
- D9–D11: deploy Vercel + domínio + DNS + observabilidade
- D12–D14: QA, ajustes, documentação, handoff

## Checklist de intake (no assistente/ formulário)
- Link do front (repo v0/Lovable/Git)
- Entidades principais (Usuário, Pedido, Projeto…)
- Fluxos críticos (cadastro, compra, envio, notificação)
- Integrações obrigatórias (Stripe/Resend/WhatsApp/Sheets…)
- Regras de acesso/roles (se houver)
- Domínio desejado (comprar/transferir)
- Critérios de sucesso (o que deve estar “no ar” em 14 dias)

## Como vender no site (estrutura da seção)
- **Título**: “Last Leg — do seu front ao ar em 14 dias”
- **Sub**: “Você já tem o front (v0/Lovable). A gente faz o resto: backend, dados, domínio e deploy.”
- **3 passos** (Descoberta • Construção • Publicação) com ícones
- **Checklist de entregáveis** (bullets claros) + nota de limites
- **Prazos e garantia**: 14 dias + 30 dias correções
- **Extras** como badges (Pagamentos, Automação, Admin, TLD .ai)
- **CTAs**: “Fechar Last Leg em 14 dias” e “Falar com a IA”
- **Prova social** (mini‑cases/logos)

## Copy sugerida (curta)
> Você já tem o front. A gente faz o resto. Em 14 dias, seu produto no ar com backend, dados, domínio e deploy.

## Upsell natural pós‑lançamento
- Manutenção/evolução por sprints ou plano mensal
- Novas integrações, automações, relatórios, IA custom

## KPIs
- Tempo até 1º deploy
- Falhas pós‑lançamento (30 dias)
- Lead→Fechamento do Last Leg

## Observações operacionais
- Padrão Next.js + Vercel para velocidade
- Banco gerenciado (Supabase/Neon) com backups
- Segurança mínima: SSL, envs segregados, roles básicas
- Documentar limites explícitos no contrato/proposta
