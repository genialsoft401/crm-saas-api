# 🚀 CRM SaaS API - Enterprise Edition

API profissional de CRM SaaS premium para gestão empresarial completa: clientes, empresas, usuários, faturação, pagamentos e dashboards analíticos.

## ✅ Características

- ✅ **Arquitetura Enterprise Escalável** - Camadas bem definidas (Controllers, Services, Repositories)
- ✅ **MySQL Puro** - Sem ORM, SQL direto com Prepared Statements
- ✅ **Autenticação JWT** - Segurança profissional com refresh tokens
- ✅ **Rate Limiting** - Proteção contra abuso
- ✅ **Logging Profissional** - Winston com rotação de logs
- ✅ **Cache Redis** - Suporte a cache distribuído (opcional)
- ✅ **Validação Robusta** - Joi validation completo
- ✅ **CORS & Helmet** - Segurança HTTP
- ✅ **Transações ACID** - Integridade de dados
- ✅ **RBAC** - Role-based access control (Owner, Admin, Employee, Viewer)
- ✅ **Email** - Nodemailer com templates
- ✅ **Upload** - Multer com limite de tamanho
- ✅ **Swagger** - Documentação automática
- ✅ **Cron Jobs** - Tarefas agendadas

## 🛠️ Stack Técnico

```
Node.js 18+
Express.js 4.x
MySQL (conexão pura)
JWT Authentication
Bcryptjs
Winston Logger
Redis (opcional)
Nodemailer
Joi Validation
Multer
Helmet
CORS
Morgan
Node-Cron
Swagger
```

## 📁 Estrutura de Pastas

```
src/
├── config/              # Configurações
│   ├── database.js     # Pool MySQL
│   ├── logger.js       # Winston Logger
│   ├── redis.js        # Redis Cache
│   └── mail.js         # Nodemailer
├── controllers/         # HTTP Request Handlers
├── services/           # Business Logic
├── repositories/       # Database Access (SQL puro)
├── routes/            # Express Routes
├── middlewares/       # Express Middlewares
├── validators/        # Joi Schemas
├── jobs/             # Cron Jobs
├── utils/            # Utilities & Helpers
│   ├── response.js   # Response Helpers
│   ├── helpers.js    # 20+ Helper Functions
│   └── constants.js  # Constants & Enums
├── app.js            # Express App
└── server.js         # Server Entry Point
```

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- Redis (opcional)

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/crm-saas-api.git
   cd crm-saas-api
   ```

2. **Instale dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas configurações
   ```

4. **Crie o banco de dados**
   ```bash
   mysql -u root -p -e "CREATE DATABASE crm_saas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

5. **Execute as migrations**
   ```bash
   npm run migrate
   ```

6. **Popule dados de teste (opcional)**
   ```bash
   npm run seed
   ```

7. **Inicie o servidor**
   ```bash
   npm run dev
   ```

O servidor estará disponível em `http://localhost:3000`

## 📖 Documentação API

A documentação Swagger está disponível em:
```
http://localhost:3000/api-docs
```

## 🔐 Autenticação

Todos os endpoints protegidos requerem um token JWT no header:

```
Authorization: Bearer <seu_token_jwt>
```

### Fluxo de Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha_segura"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## 🔄 Refresh Token

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "seu_refresh_token"
}
```

## 📊 Endpoints Principais

### Autenticação
- `POST /api/v1/auth/register` - Criar nova conta
- `POST /api/v1/auth/login` - Fazer login
- `POST /api/v1/auth/logout` - Fazer logout
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/forgot-password` - Solicitar reset de senha
- `POST /api/v1/auth/reset-password` - Resetar senha
- `POST /api/v1/auth/change-password` - Alterar senha

### Usuários
- `GET /api/v1/users` - Listar usuários
- `GET /api/v1/users/:id` - Buscar usuário por ID
- `POST /api/v1/users` - Criar usuário
- `PUT /api/v1/users/:id` - Editar usuário
- `DELETE /api/v1/users/:id` - Deletar usuário
- `PATCH /api/v1/users/:id/activate` - Ativar usuário
- `PATCH /api/v1/users/:id/deactivate` - Desativar usuário

### Empresas
- `GET /api/v1/companies` - Listar empresas
- `GET /api/v1/companies/:id` - Buscar empresa
- `POST /api/v1/companies` - Criar empresa
- `PUT /api/v1/companies/:id` - Editar empresa
- `DELETE /api/v1/companies/:id` - Deletar empresa

### Clientes
- `GET /api/v1/clients` - Listar clientes
- `GET /api/v1/clients/:id` - Buscar cliente
- `POST /api/v1/clients` - Criar cliente
- `PUT /api/v1/clients/:id` - Editar cliente
- `DELETE /api/v1/clients/:id` - Deletar cliente

### Faturação
- `GET /api/v1/invoices` - Listar faturas
- `GET /api/v1/invoices/:id` - Buscar fatura
- `POST /api/v1/invoices` - Criar fatura
- `PUT /api/v1/invoices/:id` - Editar fatura
- `DELETE /api/v1/invoices/:id` - Deletar fatura
- `PATCH /api/v1/invoices/:id/send` - Enviar fatura

### Pagamentos
- `GET /api/v1/payments` - Listar pagamentos
- `GET /api/v1/payments/:id` - Buscar pagamento
- `POST /api/v1/payments` - Registrar pagamento
- `PATCH /api/v1/payments/:id/confirm` - Confirmar pagamento

### Dashboard
- `GET /api/v1/dashboard/summary` - Resumo executivo
- `GET /api/v1/dashboard/revenue` - Análise de receita
- `GET /api/v1/dashboard/clients` - Análise de clientes
- `GET /api/v1/dashboard/invoices` - Análise de faturas

### Estoque
- `GET /api/v1/stocks` - Listar itens de estoque
- `GET /api/v1/stocks/:id` - Buscar item
- `POST /api/v1/stocks` - Criar item
- `PUT /api/v1/stocks/:id` - Editar item
- `PATCH /api/v1/stocks/:id/movement` - Registrar movimento

## 🔒 Segurança

### Boas Práticas Implementadas

1. **Senhas Hasheadas** - Bcryptjs com 10 rounds
2. **JWT Tokens** - Expiração automática (24h access, 7d refresh)
3. **Rate Limiting** - Limite de requisições por IP
4. **CORS Configurável** - Apenas domínios permitidos
5. **Helmet** - Headers HTTP de segurança
6. **SQL Injection Prevention** - Prepared Statements obrigatórios
7. **RBAC** - Controle de acesso por role
8. **Validation** - Validação de todos os inputs
9. **HTTPS Recomendado** - Em produção
10. **HTTPS Only Cookies** - Em produção

## 📝 Variáveis de Ambiente

Ver `.env.example` para lista completa de variáveis configuráveis:

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=crm_saas_db
JWT_SECRET=sua_secret_key
REDIS_ENABLED=false
MAIL_ENABLED=true
LOG_LEVEL=debug
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Com coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## 📦 Deploy

### Produção

1. **Variáveis de Ambiente**
   - Configure todas as variáveis `.env` para produção
   - Use secrets manager (AWS Secrets, HashiCorp Vault, etc)
   - NUNCA commite `.env` com dados sensíveis

2. **Database**
   - Use backup automático
   - Implemente replicação master-slave
   - Configure connection pooling adequado

3. **Redis**
   - Configure persistência RDB ou AOF
   - Implemente replicação
   - Configure monitores e alertas

4. **Logs**
   - Configure agregação de logs (ELK, DataDog, etc)
   - Implemente alertas para erros críticos

5. **Monitoramento**
   - Configure APM (New Relic, DataDog, Elastic)
   - Implemente health checks
   - Configure alertas de performance

6. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY src ./src
   EXPOSE 3000
   CMD ["node", "src/server.js"]
   ```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Proprietary - Genialsoft

## 📞 Suporte

- Email: support@genialsoft.com
- Documentation: https://docs.crm-saas.com
- Issues: GitHub Issues

---

**Desenvolvido com ❤️ por Genialsoft**

*API CRM SaaS Enterprise - Padrão production-ready com arquitetura escalável*