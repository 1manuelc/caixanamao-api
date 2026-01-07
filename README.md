# API CaixanaMão

<div>
  <img src='https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white' alt='NestJS'>
  <img src='https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white' alt='TypeScript\'>
  <img src='https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white' alt='PostgreSQL'>
  <img src='https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white' alt='Prisma'>
  <img src='https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens' alt='JWT'>
</div>

Este projeto contém uma API robusta desenvolvida com NestJS para gerenciar operações financeiras e administrativas de empresas e usuários, incluindo autenticação, gestão de usuários, empresas, registros de valores e relatórios. A API oferece rotas bem definidas e seguras para diversas funcionalidades.

## 📋 Funcionalidades

-   **Autenticação e Autorização**: Registro de novos usuários, login/logout e autenticação baseada em JWT com cookies seguros.
-   **Gestão de Usuários**: Criação, leitura, atualização e exclusão de usuários com diferentes níveis de acesso (Operador, Admin).
-   **Gestão de Empresas**: Criação, leitura, atualização e exclusão de informações de empresas.
-   **Registros de Valores**: Gerenciamento de entradas de valores (espécie, cartão, pix, despesas) por usuário e data.
-   **Relatórios**: Geração e gestão de relatórios financeiros baseados em dados de entrada de valores.
-   **Validação de Dados**: Validação robusta de requisições e esquemas de resposta usando `class-validator` e `class-transformer`.
-   **Controle de Acesso**: Implementação de guardas de rota baseados em papéis (`RolesEnum.OPERADOR`, `RolesEnum.ADMIN`).

## 🛠️ Implementação

A API foi desenvolvida com `NestJS` e `TypeScript`, utilizando as seguintes dependências principais:

-   **`@nestjs/core`**: Framework principal para construção da API.
-   **`@nestjs/config`**: Módulo para gerenciamento de variáveis de ambiente.
-   **`@prisma/client`**: Cliente Prisma para interagir com o banco de dados PostgreSQL.
-   **`argon2`**: Biblioteca para hash seguro de senhas.
-   **`class-validator` e `class-transformer`**: Para validação e transformação de objetos de dados (DTOs).
-   **`jsonwebtoken`**: Para geração e verificação de JSON Web Tokens (JWT).
-   **`rxjs`**: Biblioteca para programação reativa.
-   **`uuid`**: Para geração de IDs únicos.

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza PostgreSQL com Prisma como ORM. As principais entidades são:

-   **`tbcargo`**: Define os cargos dos usuários e seus níveis de acesso.
-   **`tbempresa`**: Armazena informações das empresas (nome, CNPJ, endereço, etc.).
-   **`tbentradadevalores`**: Registra as entradas de valores diárias por usuário (espécie, cartão, pix, despesas).
-   **`tbrelatorio`**: Gerencia os relatórios gerados, com referência ao usuário e caminho do arquivo.
-   **`tbusuario`**: Contém os dados dos usuários (nome, CPF, email, senha, cargo, empresa).

## 📡 Rotas e Módulos

### Teste

- `GET /` - Retorna `Hello CaixaNaMão!`.

### Autenticação (`/auth`)

-   `POST /auth/login` - Autenticação de usuário e obtenção de token JWT.
-   `POST /auth/register` - Registro de um novo usuário.

### Usuários (`/users`)

-   `GET /users` - Lista todos os usuários (requer autenticação e papéis específicos).
-   `GET /users/:id` - Obtém um usuário específico por ID (requer autenticação e papéis específicos).
-   `PATCH /users/:id` - Atualiza um usuário específico por ID (requer autenticação e papéis específicos).
-   `DELETE /users/:id` - Remove um usuário específico por ID (requer autenticação e papéis específicos).

### Empresas (`/companies`)

-   `POST /companies` - Cria uma nova empresa (requer autenticação e papéis específicos).
-   `GET /companies` - Lista todas as empresas (requer autenticação e papéis específicos).
-   `GET /companies/:id` - Obtém uma empresa específica por ID (requer autenticação e papéis específicos).
-   `PATCH /companies/:id` - Atualiza uma empresa específica por ID (requer autenticação e papéis específicos).
-   `DELETE /companies/:id` - Remove uma empresa específica por ID (requer autenticação e papéis específicos).

### Registros de Valores (`/registers`)

-   `POST /registers` - Cria um novo registro de entrada de valores (requer autenticação e papéis específicos).
-   `GET /registers` - Lista todos os registros de entrada de valores (requer autenticação e papéis específicos).
-   `GET /registers/:id` - Obtém um registro específico por ID (requer autenticação e papéis específicos).
-   `PATCH /registers/:id` - Atualiza um registro específico por ID (requer autenticação e papéis específicos).
-   `DELETE /registers/:id` - Remove um registro específico por ID (requer autenticação e papéis específicos).

### Relatórios (`/reports`)

-   `POST /reports` - Cria um novo relatório (requer autenticação e papéis específicos).
-   `GET /reports` - Lista todos os relatórios (requer autenticação e papéis específicos).
-   `GET /reports/:id` - Obtém um relatório específico por ID (requer autenticação e papéis específicos).
-   `PATCH /reports/:id` - Atualiza um relatório específico por ID (requer autenticação e papéis específicos).
-   `DELETE /reports/:id` - Remove um relatório específico por ID (requer autenticação e papéis específicos).

## 🚀 Executando Localmente

Para executar a API localmente, siga os passos abaixo:

### 1. Clonar o repositório

```bash
git clone https://github.com/1manuelc/caixanamao-api.git
cd caixanamao-api
```

### 2. Instalar as dependências

```bash
npm install
# ou
pnpm install
# ou
yarn install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database_name>"
SECRET_KEY="<jwt-secret>"
MASTER_ACCESS_TOKEN = "<your-master-access-token>"
NODE_ENV=<development | production | test>
PORT=3000
```

### 4. Configurar o banco de dados

Execute as migrações do Prisma para criar as tabelas:

```bash
npx prisma migrate dev --name init
```

### 5. Executar em modo desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000` (ou na porta configurada em `PORT`).


## 📦 Scripts Disponíveis

-   `npm run build` - Compila o projeto TypeScript para JavaScript.
-   `npm run format` - Formata o código com Prettier.
-   `npm run start` - Inicia a API em modo de produção (requer compilação prévia).
-   `npm run start:dev` - Inicia a API em modo de desenvolvimento com hot-reload.
-   `npm run start:debug` - Inicia a API em modo debug com hot-reload.
-   `npm run start:prod` - Inicia a API em modo de produção (usando o build).
-   `npm run lint` - Executa o linter e corrige problemas.

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação em cabeçalhos de autorização. O fluxo de autenticação envolve o registro e login para obtenção de um token que deve ser enviado em requisições subsequentes para rotas protegidas.

## 📝 Validação de Dados

Todas as requisições são validadas usando `class-validator` e `class-transformer` do NestJS, garantindo a integridade dos dados. Erros de validação retornam mensagens claras e estruturadas.

## 🌐 CORS

O NestJS oferece suporte a CORS por padrão ou através de módulos específicos, permitindo requisições de diferentes origens. A configuração exata pode ser encontrada no `main.ts` ou em um módulo de configuração.

## 👤 Autor

[@1manuelc](https://github.com/1manuelc)
