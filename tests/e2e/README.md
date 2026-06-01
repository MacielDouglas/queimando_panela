Testes E2E — Queimando Panela
Pré-requisitos
Build da aplicação (os testes rodam contra o servidor de produção):

bash
bun run build
Variáveis de ambiente no .env da raiz do projeto:

text
E2E_USER_EMAIL="seu-usuario@email.com"
E2E_USER_PASSWORD="sua-senha"
PLAYWRIGHT_BASE_URL="http://localhost:3000"
Estrutura
text
tests/e2e/
├── auth.setup.ts # Faz login e salva sessão em playwright/.auth/user.json
├── receitas.spec.ts # Fluxo completo: listar, criar, editar, deletar
├── playwright/
│ └── .auth/
│ ├── .gitignore # Garante que user.json NÃO seja commitado
│ └── user.json # Gerado automaticamente — NÃO commitar
└── README.md
Como rodar
bash

# Modo headless (padrão)

bun run test:e2e

# Ver o navegador abrindo (visual)

bun run test:e2e:headed

# Interface gráfica do Playwright

bun run test:e2e:ui

# Debug passo a passo

bun run test:e2e:debug

# Ver relatório HTML após execução

bun run test:e2e:report
Como funciona a autenticação
O Playwright usa o padrão Global Setup + storageState:

O projeto setup roda auth.setup.ts uma única vez

Ele faz login real com as credenciais do .env

Salva cookies/localStorage em playwright/.auth/user.json

Todos os outros testes herdam essa sessão — sem precisar logar novamente

Ajustando seletores ao seu projeto
Os seletores usados são semânticos e flexíveis (regex case-insensitive), mas você pode precisar ajustar caso os labels do seu formulário sejam diferentes. Procure por getByLabel e getByRole nos arquivos .spec.ts e compare com os seus componentes React.
