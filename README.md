# 👗 API Back-end para Site de Roupas

## 📄 Descrição

API back-end para gerenciamento de um site de roupas, incluindo funcionalidades para cadastro e gerenciamento de produtos, lojas, funcionários, clientes, pedidos e endereços. Desenvolvido com **TypeScript**, **Express**, **Prisma**, e diversas outras ferramentas para validação, autenticação e testes.

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Prisma (PostgreSQL)
- Zod
- Tsyringe
- Jest
- Supertest
- bcrypt / bcryptjs
- jsonwebtoken
- cors
- dotenv
- helmet
- faker (para dados falsos)
- ejs

---

## 🔁 Rotas da Aplicação

### 🛣️ Endpoints Principais

- `/address`
- `/products`
- `/store`
- `/employee`
- `/login`
- `/clients`
- `/orders`

---

## 🛍️ Rotas de Produtos (`/products`)

### POST `/products`

**Cria um novo produto**

> 🔐 Requer token JWT no header `Authorization`  
> Acesso permitido apenas para usuários com papel `ADM` ou `employee`.

#### Corpo da requisição

```json
{
  "name": "Calça jeans",
  "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. Seu design combina elementos modernos e clássicos, oferecendo um caimento que valoriza a silhueta e permite liberdade de movimento.",
  "price": 7500
}
```

#### Resposta (201)

```json
{
  "publicId": "ebeef689-a4e1-40f9-8bc5-1c6e496439bd",
  "name": "Calça jeans",
  "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. Seu design combina elementos modernos e clássicos, oferecendo um caimento que valoriza a silhueta e permite liberdade de movimento.",
  "price": 7500,
  "storeId": 1
}
```

## Erros Possíveis

#### Erro: JSON inválido

**Código:** 400

**Resposta:**

```json
{
  "message": "JSON inválido no corpo da requisição."
}
```

### Regras de Validação para criação de produto (`POST /products`)

| Campo         | Tipo   | Regras                                      | Obrigatório? |
| ------------- | ------ | ------------------------------------------- | ------------ |
| `name`        | string | Deve conter ao menos 1 caractere            | Sim          |
| `description` | string | Deve conter entre 1 e 255 caracteres        | Sim          |
| `price`       | number | Deve ser número positivo maior ou igual a 1 | Sim          |

---

#### Erro: Validação do Zod

**Código:** 400

**Descrição:**  
Este erro ocorre quando os dados enviados na requisição não atendem às regras definidas pelo esquema de validação. Por exemplo, campos obrigatórios ausentes ou com formato incorreto.

**Resposta:**

```json
{
  "errors": {
    "name": ["String must contain at least 1 character(s)"]
  }
}
```

#### Erro: Problema com Token

**Código:** 401

**Descrição:**  
Este erro ocorre quando há qualquer problema relacionado ao token JWT no cabeçalho `Authorization`, como token ausente, mal formado ou expirado.

**Respostas possíveis:**

```json
{
  "message": "Token is required."
}
```

```json
{
  "message": "Token mal formado."
}
```

```json
{
  "message": "Token expirado."
}
```

#### Erro: Permissão negada

**Código:** 403

**Descrição:**  
Este erro ocorre quando o token JWT é válido, mas o usuário autenticado não possui o papel necessário (`ADM` ou `employee`) para executar a ação.

**Resposta:**

```json
{
  "message": "You don't have permission to perform this action"
}
```

---

### 📚 GET `/products`

Lista todos os produtos cadastrados com paginação.

#### 📥 Query Parameters (opcionais)

- `page` (number): Página atual (default: 1)
- `perPage` (number): Quantidade de itens por página (default: 10)

Exemplo: `/products?page=1&perPage=5`

#### 📤 Resposta (200)

```json
{
  "count": 502,
  "previousPage": "http://localhost:3000/products/?page=1&perPage=5",
  "nextPage": "http://localhost:3000/products/?page=2&perPage=5",
  "data": [
    {
      "publicId": "3c8a6f25-9090-497e-922a-ef0b4e6ace47",
      "name": "Camisola",
      "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões.",
      "price": 7000,
      "storeId": 1
    },
    {
      "publicId": "1b6e3492-a638-4cb6-ad30-36a303ea6bf4",
      "name": "Camisa gola polo",
      "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões.",
      "price": 5800,
      "storeId": 1
    },
    {
      "publicId": "d62e2369-1c38-4fbf-958f-75563dbfdffe",
      "name": "Cueca box",
      "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões.",
      "price": 5000,
      "storeId": 1
    },
    {
      "publicId": "93c4c292-f7ff-4ac7-9541-41fcbe53ea18",
      "name": "Croped",
      "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões.",
      "price": 7500,
      "storeId": 1
    },
    {
      "publicId": "0596dd2e-3593-41a5-b6e4-6126dac01180",
      "name": "Camisola",
      "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões.",
      "price": 4800,
      "storeId": 1
    }
  ]
}
```

---

### 📚 GET `/products/:productId`

**Busca um produto pelo ID**

#### 📤 Resposta (200)

```json
{
  "publicId": "8cdf030f-ef0d-47d3-86d9-653cd0dd7391",
  "name": "Camiseta",
  "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
  "price": 6700,
  "storeId": 1
}
```

## Erros Possíveis

#### Erro: Produto não encontrado

**Código:** 404

**Descrição:**  
Este erro ocorre quando o `productId` fornecido não corresponde a nenhum produto existente no banco de dados.

**Resposta:**

```json
{
  "message": "Product not found"
}
```

---

### ✏️ Atualizar Produto

```
PATCH /products/:id
```

**Descrição:**  
Atualiza um ou mais campos de um produto existente. Os campos `name`, `description` e `price` são opcionais, mas ao menos um deve estar presente.

> 🔐 Requer token JWT no header `Authorization`  
> Acesso permitido apenas para usuários com papel `ADM` ou `employee`.

#### Corpo da requisição (exemplo)

```
PATCH /products/0e4fbb80-db12-4937-84f6-9cde634f1d16
```

```json
{
  "price": 7900
}
```

#### Resposta de Sucesso (200)

```json
{
  "publicId": "0e4fbb80-db12-4937-84f6-9cde634f1d16",
  "name": "Jaqueta jeans",
  "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
  "price": 7900,
  "storeId": 1
}
```

---

## Erros Possíveis

#### Erro: Produto não encontrado

**Código:** 404

**Descrição:**  
Este erro ocorre quando o `productId` fornecido não corresponde a nenhum produto existente no banco de dados.

**Resposta:**

```json
{
  "message": "Product not found"
}
```

### Regras de Validação para atualização de produto (`PATCH /products/:id`)

| Campo         | Tipo   | Regras                                      | Obrigatório? |
| ------------- | ------ | ------------------------------------------- | ------------ |
| `name`        | string | Deve conter ao menos 1 caractere            | Não          |
| `description` | string | Deve conter entre 1 e 255 caracteres        | Não          |
| `price`       | number | Deve ser número positivo maior ou igual a 1 | Não          |

---

#### Erro: JSON inválido

**Código:** 400

**Descrição:**  
O JSON enviado está malformado ou incompleto, impedindo o processamento da requisição.

**Resposta:**

```json
{
  "message": "JSON inválido no corpo da requisição."
}
```

#### Erro: Validação do Zod

**Código:** 400

**Descrição:**  
Este erro ocorre quando os dados não atendem às regras definidas no esquema (ex: campo muito curto ou tipo incorreto).

**Resposta:**

```json
{
  "errors": {
    "price": ["Number must be greater than 0"]
  }
}
```

#### Erro: Problema com Token

**Código:** 401

**Descrição:**  
Este erro ocorre quando há qualquer problema com o token JWT.

**Respostas possíveis:**

```json
{
  "message": "Token is required."
}
```

```json
{
  "message": "Token mal formado."
}
```

```json
{
  "message": "Token expirado."
}
```

#### Erro: Permissão negada

**Código:** 403

**Descrição:**  
O token é válido, mas o usuário não tem o papel necessário (`ADM` ou `employee`).

**Resposta:**

```json
{
  "message": "You don't have permission to perform this action"
}
```

---

### 🗑️ DELETE `/products/:productId`

**Descrição:**  
Remove um produto com base em seu ID público.

> 🔐 Requer token JWT no header `Authorization`  
> Acesso permitido apenas para usuários com papel `ADM` ou `employee`.

---

#### Resposta de Sucesso (204)

Sem conteúdo.

---

#### Erro: Problema com Token

**Código:** 401

**Descrição:**  
Este erro ocorre quando há qualquer problema com o token JWT.

**Respostas possíveis:**

```json
{
  "message": "Token is required."
}
```

```json
{
  "message": "Token mal formado."
}
```

```json
{
  "message": "Token expirado."
}
```

---

#### Erro: Permissão negada

**Código:** 403

**Descrição:**  
Este erro ocorre quando o token JWT é válido, mas o usuário autenticado não possui o papel necessário (`ADM` ou `employee`) para executar a ação.

**Resposta:**

```json
{
  "message": "You don't have permission to perform this action"
}
```

---

#### Erro: Produto não encontrado

**Código:** 404

**Descrição:**  
Este erro ocorre quando o `productId` fornecido não corresponde a nenhum produto existente no banco de dados.

**Resposta:**

```json
{
  "message": "Product not found"
}
```

---

## 🛒 Rotas de Pedidos (`/orders`)

### POST `/orders`

**Cria um novo pedido**

> 🔐 Requer token JWT no header `Authorization`

#### Corpo da requisição (exemplo)

```json
{
  "clientId": 1,
  "products": [{ "productId": "ebeef689-a4e1-40f9-8bc5-1c6e496439bd", "quantity": 2 }],
  "paymentMethod": "credit_card",
  "addressId": 5
}
```

#### Resposta (201)

```json
{
  "orderId": 15,
  "clientId": 1,
  "totalAmount": 15000,
  "status": "pending",
  "createdAt": "2025-06-09T12:00:00Z"
}
```

---

### GET `/orders`

**Lista todos os pedidos**

---

### GET `/orders/:orderId`

**Busca um pedido pelo ID**

---

### PATCH `/orders/:orderId`

**Atualiza um pedido**

---

### DELETE `/orders/:orderId`

**Remove um pedido**

---

## 📦 Como rodar localmente

```bash
git clone <seu-repo-url>
cd seu-projeto
npm install
```

Configure um arquivo `.env` com:

```
DATABASE_URL=<sua-url-do-banco>
JWT_SECRET=<seu-segredo-jwt>
```

Para aplicar as migrações:

```bash
npx prisma migrate dev
```

Para rodar o servidor em modo desenvolvimento:

```bash
npm run dev
```

Para rodar os testes:

```bash
npm run test
```

---

## 📝 Licença

Este projeto é de uso educacional e não possui uma licença específica.
