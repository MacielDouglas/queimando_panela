# 🔥 Queimando Panela - Blog gastronômico de cozinheiro amadores.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Status: Em Desenvolvimento](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)

Plataforma completa para delivery de marmitas com acompanhamento em tempo real.

## 🌐 Demonstração

Acesse a versão online do projeto: [queimandopanela.vercel.app](https://queimandopanela.vercel.app)

## 🚀 Tecnologias Utilizadas

### Frontend

- **React** com Vite.js
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **React Icons** para ícones

### Backend

- **Node.js** com Express
- **MongoDB** (Atlas) para banco de dados
- **Firebase** para autenticação e storage

## 📌 Funcionalidades Principais

✔️ Cadastro de usuários  
✔️ Receitas com categorias  
✔️ Sistema de avaliações em tempo real  
✔️ Painel administrativo

## 🛠️ Como Executar

### Pré-requisitos

- Node.js (v18+)
- MongoDB Atlas
- Conta Firebase

### Passo a Passo

1. Clone o repositório:

```bash
git clone https://github.com/MacielDouglas/queimando_panela.git
cd queimando_panela
```

2. Instale as dependências:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Inicie os servidores:

```bash
# Em um terminal:
npm run server

# Em outro terminal:
npm run client
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/queimando_panela

# Firebase
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com

# Servidor
PORT=5000
JWT_SECRET=your_jwt_secret
```

## 📂 Estrutura do Projeto

```
queimando_panela/
├── client/          # Aplicação React
│   ├── public/
│   └── src/
│       ├── apollo/
│       ├── assets/
│       ├── components/
│       ├── constants/
│       ├── features/
│       ├── graphql/
│       ├── helper/
│       ├── hooks/
│       └── pages/
└── api/          # Backend Node.js
    ├── graphql/
    ├── models/
    └── socket/
```

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature:

```bash
git checkout -b feature/nova-feature
```

3. Commit suas mudanças:

```bash
git commit -m 'Adiciona nova feature'
```

4. Envie para o repositório:

```bash
git push origin feature/nova-feature
```

5. Abra um Pull Request

## 📞 Suporte

Para reportar problemas ou solicitar features, abra uma [issue](https://github.com/MacielDouglas/queimando_panela/issues).

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE.md) para detalhes.

---

Desenvolvido com ❤️ por [Maciel Douglas](https://github.com/MacielDouglas)
