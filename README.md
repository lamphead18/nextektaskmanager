# 📝 Nextek Manager - Gestão de Tarefas

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green)

Um sistema de **gestão de tarefas** desenvolvido com **NestJS** no backend e **React** no frontend. O projeto implementa **autenticação JWT**, **cache com Redis**, **paginação**, **filtros**, e segue uma **arquitetura modular**.

---

## 🚀 Tecnologias Utilizadas

### 🔹 Backend

- **NestJS** (Framework Node.js)
- **Prisma ORM** (Banco de dados PostgreSQL)
- **Redis** (Gerenciamento de cache)
- **Passport.js** (Autenticação JWT)
- **Docker** (Ambiente de desenvolvimento)
- **pgAdmin4** (Gerenciamento do PostgreSQL)

### 🔹 Frontend

- **React.js** (Criado com Vite)
- **TypeScript**
- **TailwindCSS** + **DaisyUI** (Estilização)
- **React Router** (Navegação entre páginas)

---

## ✅ Requisitos do Projeto

### 📌 Requisitos Funcionais

✔️ O usuário pode **cadastrar**, **editar**, **visualizar** e **excluir** tarefas.  
✔️ O sistema permite **filtrar tarefas por status** e **buscar por título**.  
✔️ Implementação de **autenticação JWT** para proteger rotas.  
✔️ O backend usa **cache com Redis** para melhorar a performance das requisições.  
✔️ **Paginação** de tarefas para evitar sobrecarga.  
✔️ Logs detalhados de **acessos** e **ações no sistema**.

### 📌 Requisitos Não Funcionais

✔️ O sistema utiliza **Redis** como cache de dados.  
✔️ O backend está estruturado seguindo **arquitetura modular**.  
✔️ O banco de dados PostgreSQL é gerenciado via **Prisma ORM**.  
✔️ Utilização de **middlewares** para logging e autenticação.  
✔️ Interface responsiva e otimizada.

---

## 🏗️ Arquitetura e Configuração

### 🔹 Arquitetura do Redis

Utilizamos **Redis como um cache store** para armazenar tarefas e reduzir a carga no banco de dados.

- As tarefas são armazenadas com **chaves únicas por usuário e parâmetros da requisição**.
- O cache é **invalidado sempre que ocorre uma alteração** (criação, edição, exclusão).

Exemplo de chave no Redis:

tasks:{userId}:status:{status}:search:{query}:page

---

## 🔧 Configuração e Execução

### 📌 1. Clonar o repositório

```sh
git clone https://github.com/seu-usuario/nextek-manager.git
cd nextek-manager
```

### 📌 2. Configurar o Backend
```sh
Copiar
Editar
cd backend-manager
cp .env.example .env  # Configure suas variáveis de ambiente
npm install
npm run start:dev
```

### 📌 3. Configurar o Frontend
```sh
Copiar
Editar
cd ../frontend-manager
npm install
npm run dev
```

### 📌 4. Subindo o Redis com Docker (Opcional)
```sh
Copiar
Editar
docker run --name redis -p 6379:6379 -d redis
```

🛠️ Endpoints da API

🔹 Autenticação
Método	Rota	Descrição
POST	/auth/login	Autenticação de usuário

🔹 Tarefas
Método	Rota	Descrição
POST	/tasks	Criar uma nova tarefa
GET	/tasks	Listar todas as tarefas
GET	/tasks/:id	Buscar uma tarefa por ID
PUT	/tasks/:id	Atualizar uma tarefa existente
DELETE	/tasks/:id	Excluir uma tarefa

📌 Fluxo de Uso
1️⃣ Usuário se autentica via /auth/login e recebe um token JWT.
2️⃣ Faz requisições autenticadas para /tasks para criar, editar e excluir tarefas.
3️⃣ As tarefas são armazenadas em cache no Redis para otimizar a busca.
4️⃣ Quando uma tarefa é alterada, o cache correspondente é invalidado automaticamente.
5️⃣ O frontend consome a API para exibir e manipular as tarefas.

📜 Licença
Este projeto é licenciado sob a MIT License.
```
