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

---

# 📍 Rotas de Endereço do Cliente (`/client/:id/address`)

## ✅ POST `/client/:id/address`

Cria um novo endereço para o cliente.

🔒 **Acesso:** Cliente dono ou administrador

## 🔐 GET `/client/:id/address`

Busca os endereços do cliente.

🔒 **Acesso:** Cliente dono ou administrador

## 🔐 PATCH `/client/:id/address/:addressid`

Atualiza um endereço do cliente.

🔒 **Acesso:** Cliente dono ou administrador

## 🗑 DELETE `/client/:id/address/:addressid`

Remove um endereço do cliente.

🔒 **Acesso:** Cliente dono ou administrador

---

# 🧾 Esquema de Retorno do Cliente

### `clientReturnSchema`

```json
{
  "publicId": "uuid-cliente",
  "name": "Maria Souza",
  "email": "maria@email.com",
  "birthDate": "1990-05-20T00:00:00.000Z",
  "CPF": "12345678900",
  "phone": "11999999999",
  "storeId": 1,
  "address": [
    {
      "street": "Rua das Flores",
      "number": "456",
      "complement": "Casa 2",
      "zipCode": "12345678",
      "city": "Campinas",
      "state": "SP"
    }
  ]
}
```

### `completeReturnSchema` adiciona o `id`

```json
{
  "id": 5,
  "publicId": "uuid-cliente",
  "name": "Maria Souza",
  "email": "maria@email.com",
  "birthDate": "1990-05-20T00:00:00.000Z",
  "CPF": "12345678900",
  "phone": "11999999999",
  "storeId": 1,
  "address": [ ... ]
}
```

---

✔️ As senhas seguem o padrão:

- Mínimo de 8 caracteres
- Máximo de 50 caracteres
- Pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial
