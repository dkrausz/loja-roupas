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
  "paymentType": "PIX",
  "status": "IN_PROGRESS",
  "discount": false,
  "total": 5832794,
  "orderItems": [
    { "productPublicId": "8be95f27-ccb0-4e94-8745-36f3fd792d96", "quantity": 2 },
    { "productPublicId": "80b49a62-25f7-4d43-903b-93d9c8498932", "quantity": 9 },
    { "productPublicId": "762e53bd-d3bd-43d5-af3c-07d9546d4bb9", "quantity": 1 }
  ]
}
```

#### Resposta (201)

```json
{
  "publicId": "3887d2f1-61de-4747-b888-23463b1c3416",
  "date": "2025-06-13T08:50:12.599Z",
  "paymentType": "PIX",
  "status": "IN_PROGRESS",
  "discount": false,
  "total": 54200,
  "client": {
    "publicId": "c16fdbf4-a1d9-4310-9ccb-19d349ecd5f6",
    "name": "laura",
    "email": "laura@email.com"
  },
  "orderItems": [
    {
      "orderId": 4,
      "quantity": 1,
      "priceUnit": 2600,
      "subTotal": 2600,
      "product": {
        "publicId": "762e53bd-d3bd-43d5-af3c-07d9546d4bb9",
        "name": "Tomara-que-caia",
        "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
        "price": 2600
      }
    },
    {
      "orderId": 4,
      "quantity": 9,
      "priceUnit": 4200,
      "subTotal": 37800,
      "product": {
        "publicId": "80b49a62-25f7-4d43-903b-93d9c8498932",
        "name": "Cueca box",
        "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
        "price": 4200
      }
    },
    {
      "orderId": 4,
      "quantity": 2,
      "priceUnit": 6900,
      "subTotal": 13800,
      "product": {
        "publicId": "8be95f27-ccb0-4e94-8745-36f3fd792d96",
        "name": "Cueca box",
        "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
        "price": 6900
      }
    }
  ]
}
```

---

### GET `/orders`

#### Resposta (200)

```json
[
  {
    "publicId": "e5748fd0-7d90-4a6a-8b6f-c0672e028ab4",
    "date": "2025-06-12T13:17:08.115Z",
    "paymentType": "CARTAO_CREDITO",
    "status": "IN_PROGRESS",
    "discount": false,
    "total": 14700,
    "client": {
      "publicId": "a2b490fa-43d6-440f-811a-0d84b58a0ade",
      "name": "danilo",
      "email": "sanilo@email.com"
    },
    "orderItems": [
      {
        "orderId": 1,
        "quantity": 3,
        "priceUnit": 1900,
        "subTotal": 5700,
        "product": {
          "publicId": "1858c06f-6e29-4463-98b3-446ac0269f3f",
          "name": "Meia",
          "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
          "price": 1900
        }
      },
      {
        "orderId": 1,
        "quantity": 1,
        "priceUnit": 8400,
        "subTotal": 8400,
        "product": {
          "publicId": "9951fccc-a7b0-4064-931e-e75ed71035a8",
          "name": "Gorro",
          "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
          "price": 8400
        }
      },
      {
        "orderId": 1,
        "quantity": 2,
        "priceUnit": 300,
        "subTotal": 600,
        "product": {
          "publicId": "0f007cd1-cc97-4196-b705-248d1c5b7de2",
          "name": "Camisa de manga curta",
          "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
          "price": 300
        }
      }
    ]
  },
  {
    "publicId": "05b3b28b-9ee8-4568-a9ec-eb02981267ee",
    "date": "2025-06-12T13:17:08.116Z",
    "paymentType": "PIX",
    "status": "IN_PROGRESS",
    "discount": false,
    "total": 185300,
    "client": {
      "publicId": "c16fdbf4-a1d9-4310-9ccb-19d349ecd5f6",
      "name": "laura",
      "email": "laura@email.com"
    },
    "orderItems": [
      {
        "orderId": 2,
        "quantity": 1,
        "priceUnit": 2600,
        "subTotal": 2600,
        "product": {
          "publicId": "762e53bd-d3bd-43d5-af3c-07d9546d4bb9",
          "name": "Tomara-que-caia",
          "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
          "price": 2600
        }
      },
      {
        "orderId": 2,
        "quantity": 9,
        "priceUnit": 4200,
        "subTotal": 37800,
        "product": {
          "publicId": "80b49a62-25f7-4d43-903b-93d9c8498932",
          "name": "Cueca box",
          "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
          "price": 4200
        }
      },
      {
        "orderId": 2,
        "quantity": 21,
        "priceUnit": 6900,
        "subTotal": 144900,
        "product": {
          "publicId": "8be95f27-ccb0-4e94-8745-36f3fd792d96",
          "name": "Cueca box",
          "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
          "price": 6900
        }
      }
    ]
  }
]
```

---

### GET `/orders/:orderId`

**Busca um pedido pelo ID**

Exemplo: `/orders/e5748fd0-7d90-4a6a-8b6f-c0672e028ab4`

#### Resposta (200)

```json
{
  "publicId": "e5748fd0-7d90-4a6a-8b6f-c0672e028ab4",
  "date": "2025-06-13T08:15:15.625Z",
  "paymentType": "CARTAO_CREDITO",
  "status": "IN_PROGRESS",
  "discount": false,
  "total": 14700,
  "client": {
    "publicId": "a2b490fa-43d6-440f-811a-0d84b58a0ade",
    "name": "danilo",
    "email": "sanilo@email.com"
  },
  "orderItems": [
    {
      "orderId": 1,
      "quantity": 3,
      "priceUnit": 1900,
      "subTotal": 5700,
      "product": {
        "publicId": "1858c06f-6e29-4463-98b3-446ac0269f3f",
        "name": "Meia",
        "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
        "price": 1900
      }
    },
    {
      "orderId": 1,
      "quantity": 1,
      "priceUnit": 8400,
      "subTotal": 8400,
      "product": {
        "publicId": "9951fccc-a7b0-4064-931e-e75ed71035a8",
        "name": "Gorro",
        "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
        "price": 8400
      }
    },
    {
      "orderId": 1,
      "quantity": 2,
      "priceUnit": 300,
      "subTotal": 600,
      "product": {
        "publicId": "0f007cd1-cc97-4196-b705-248d1c5b7de2",
        "name": "Camisa de manga curta",
        "description": "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
        "price": 300
      }
    }
  ]
}
```

---

### DELETE `/orders/:orderId`

**Remove um pedido**

#### Resposta (204)

---

## 👤 Rotas de Funcionários (`/employee`)

### POST `/employee`

**Cria um novo funcionário**

> 🔐 Requer token JWT no header `Authorization`  
> Acesso permitido apenas para usuários com papel `ADM`.

#### Corpo da requisição

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "SenhaForte123!",
  "birthDate": "1990-04-05",
  "CPF": "84988147070",
  "phone": "11999999999",
  "accessLevel": "FUNCIONARIO",
  "address": {
    "street": "Rua do tamoios",
    "number": 598,
    "complement": "2 andar",
    "zipCode": "80045-000",
    "neighborhood": "Centro",
    "city": "Sao Paulo",
    "state": "SP",
    "country": "Brasil"
  }
}
```

#### Resposta (201)

```json
{
  "publicId": "0e4979d5-b98d-44f6-b9fa-2026cd92bada",
  "name": "João Silva",
  "email": "joao@email.com",
  "birthDate": "1990-04-05T00:00:00.000Z",
  "CPF": "84988147070",
  "phone": "11999999999",
  "accessLevel": "FUNCIONARIO",
  "address": {
    "street": "Rua do tamoios",
    "number": 598,
    "complement": "2 andar",
    "zipCode": "80045-000",
    "neighborhood": "Centro",
    "state": "SP",
    "city": "Sao Paulo",
    "country": "Brasil"
  },
  "store": {
    "publicId": "3294cf96-db26-4dda-ab38-7a54853fc057",
    "name": "Mega Store",
    "CNPJ": "41984004000139"
  }
}
```

---

### GET `/employee`

**Lista todos os funcionários**

#### Resposta (200)

```json
[
  {
    "publicId": "7dd3c4b9-9da5-4c25-856d-2dce9d04ca89",
    "name": "Zé da loja",
    "email": "zedaloja@email.com",
    "birthDate": "1985-02-13T23:00:00.000Z",
    "CPF": "62759608093",
    "phone": "41987654321",
    "accessLevel": "ADM"
  },
  {
    "publicId": "0e4979d5-b98d-44f6-b9fa-2026cd92bada",
    "name": "João Silva",
    "email": "joao@email.com",
    "birthDate": "1990-04-05T00:00:00.000Z",
    "CPF": "84988147070",
    "phone": "11999999999",
    "accessLevel": "FUNCIONARIO"
  }
]
```

---

### GET `/employee/:employeeId`

**Busca um funcionário pelo ID**

Exemplo: `/employee/0e4979d5-b98d-44f6-b9fa-2026cd92bada`

#### Resposta (200)

```json
{
  "publicId": "0e4979d5-b98d-44f6-b9fa-2026cd92bada",
  "name": "João Silva",
  "email": "joao@email.com",
  "birthDate": "1990-04-05T00:00:00.000Z",
  "CPF": "84988147070",
  "phone": "11999999999",
  "accessLevel": "FUNCIONARIO",
  "address": {
    "street": "Rua do tamoios",
    "number": 598,
    "complement": "2 andar",
    "zipCode": "80045-000",
    "neighborhood": "Centro",
    "state": "SP",
    "city": "Sao Paulo",
    "country": "Brasil"
  }
}
```

#### Erro: Funcionário não encontrado (404)

```json
{
  "message": "User not found!"
}
```

---

### PATCH `/employee/:employeeId`

**Atualiza um funcionário existente**

> 🔐 Requer token JWT no header `Authorization`

#### Corpo da requisição (exemplo)

```json
{
  "phone": "11888888888"
}
```

#### Resposta (200)

```json
{
  "publicId": "0e4979d5-b98d-44f6-b9fa-2026cd92bada",
  "name": "João Silva",
  "email": "joao@email.com",
  "birthDate": "1990-04-05T00:00:00.000Z",
  "CPF": "84988147070",
  "phone": "11888888888",
  "accessLevel": "FUNCIONARIO",
  "address": {
    "street": "Rua do tamoios",
    "number": 598,
    "complement": "2 andar",
    "zipCode": "80045-000",
    "neighborhood": "Centro",
    "state": "SP",
    "city": "Sao Paulo",
    "country": "Brasil"
  }
}
```

---

### DELETE `/employee/:employeeId`

**Remove um funcionário pelo ID**

> 🔐 Requer token JWT no header `Authorization`  
> Acesso permitido apenas para usuários com papel `ADM`.

#### Resposta de Sucesso (204)

Sem conteúdo.

#### Erros Possíveis

- **401** Token inválido ou ausente

**Código:** 403

**Descrição:**  
Este erro ocorre quando o token JWT é válido, mas o usuário autenticado não possui o papel necessário (`ADM` ou `employee`) para executar a ação.

**Resposta:**

```json
{
  "message": "You don't have permission to perform this action"
}
```

- **404** Funcionário não encontrado

```json
{
  "message": "User not found!"
}
```

# 📘 API - Rotas de Clientes (`/client`)

## ✅ POST `/client`

Registra um novo cliente.

🔓 **Acesso:** Público

### Body

```json
{
  "name": "danilo",
  "email": "sanilo@email.com",
  "password": "Teste123*",
  "birthDate": "1985/02/14",
  "CPF": "62759608093",
  "phone": "41996991234"
}
```

#### Resposta (201)

```json
{
  "publicId": "a2b490fa-43d6-440f-811a-0d84b58a0ade",
  "name": "danilo",
  "email": "sanilo@email.com",
  "birthDate": "1985-02-13T23:00:00.000Z",
  "CPF": "62759608093",
  "phone": "41996991234",
  "storeId": 1,
  "address": []
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

### Regras de Validação para criação de cliente (`POST /client`)

| Campo       | Tipo   | Regras                                                                                                           | Obrigatório? |
| ----------- | ------ | ---------------------------------------------------------------------------------------------------------------- | ------------ |
| `name`      | string | Máximo de 255 caracteres                                                                                         | Sim          |
| `email`     | string | Formato de e-mail válido                                                                                         | Sim          |
| `password`  | string | Entre 8 e 50 caracteres, deve conter pelo menos: 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial | Sim          |
| `birthDate` | date   | Deve ser uma data válida e o usuário precisa ter no mínimo 18 anos                                               | Sim          |
| `CPF`       | string | Até 11 caracteres (formato validado externamente)                                                                | Sim          |
| `phone`     | string | Até 11 caracteres                                                                                                | Sim          |

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

## 🔐 GET `/client`

Lista todos os clientes.

🔒 **Acesso:** Somente administradores

#### Resposta (200)

```json
[
  {
    "publicId": "a2b490fa-43d6-440f-811a-0d84b58a0ade",
    "name": "danilo",
    "email": "sanilo@email.com",
    "birthDate": "1985-02-13T23:00:00.000Z",
    "CPF": "62759608093",
    "phone": "41996991234",
    "storeId": 1,
    "address": [
      {
        "id": 4,
        "street": "Rua do tamoios",
        "number": 598,
        "complement": "2 andar",
        "zipCode": "80045-000",
        "neighborhood": "Centro",
        "state": "SP",
        "city": "Sao Paulo",
        "country": "Brasil",
        "clientId": 1
      }
    ]
  },
  {
    "publicId": "c16fdbf4-a1d9-4310-9ccb-19d349ecd5f6",
    "name": "laura",
    "email": "laura@email.com",
    "birthDate": "1985-02-13T23:00:00.000Z",
    "CPF": "72981378082",
    "phone": "41996991234",
    "storeId": 1,
    "address": []
  },
  {
    "publicId": "de72156a-da4b-412d-b9fa-b82224cab74a",
    "name": "Elise",
    "email": "elise@email.com",
    "birthDate": "1985-02-13T23:00:00.000Z",
    "CPF": "10951008072",
    "phone": "41996991234",
    "storeId": 1,
    "address": []
  }
]
```

## 🔐 GET `/client/:id`

Busca um cliente pelo ID.

🔒 **Acesso:** Cliente dono ou administrador

```json
{
  "publicId": "a2b490fa-43d6-440f-811a-0d84b58a0ade",
  "name": "danilo",
  "email": "sanilo@email.com",
  "birthDate": "1985-02-13T23:00:00.000Z",
  "CPF": "62759608093",
  "phone": "41996991234",
  "storeId": 1,
  "address": [
    {
      "id": 4,
      "street": "Rua do tamoios",
      "number": 598,
      "complement": "2 andar",
      "zipCode": "80045-000",
      "neighborhood": "Centro",
      "state": "SP",
      "city": "Sao Paulo",
      "country": "Brasil",
      "clientId": 1
    }
  ]
}
```

## Erros Possíveis

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
Este erro ocorre quando o token JWT é válido, mas o usuário autenticado não possui o papel necessário (`ADM` ou `owner`) para executar a ação.

**Resposta:**

```json
{
  "message": "You don't have permission to perform this action"
}
```

#### Erro: Produto não encontrado

**Código:** 404

**Descrição:**  
Este erro ocorre quando o `id` fornecido não corresponde a nenhum client existente no banco de dados.

**Resposta:**

```json
{
  "message": "Client not found"
}
```

## 🔐 PATCH `/client/:id`

Atualiza informações do cliente.

🔒 **Acesso:** Cliente dono ou administrador

### Body (exemplo)

```json
{
  "phone": "41996991234"
}
```

#### Resposta (200)

```json
{
  "publicId": "c16fdbf4-a1d9-4310-9ccb-19d349ecd5f6",
  "name": "laura",
  "email": "laura@email.com",
  "birthDate": "1985-02-13T23:00:00.000Z",
  "CPF": "72981378082",
  "phone": "41996991234",
  "address": []
}
```

## Erros Possíveis

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
Este erro ocorre quando o token JWT é válido, mas o usuário autenticado não possui o papel necessário (`ADM` ou `owner`) para executar a ação.

**Resposta:**

```json
{
  "message": "You don't have permission to perform this action"
}
```

#### Erro: Cliente não encontrado

**Código:** 404

**Descrição:**  
Este erro ocorre quando o `id` fornecido não corresponde a nenhum client existente no banco de dados.

**Resposta:**

```json
{
  "message": "Client not found"
}
```

## 🗑 DELETE `/client/:id`

Remove um cliente.

🔒 **Acesso:** Cliente dono ou administrador

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

**Código:** 404

**Descrição:**  
Este erro ocorre quando o `id` fornecido não corresponde a nenhum client existente no banco de dados.

**Resposta:**

````json
{
  "message": "Client not found"
}



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
````
