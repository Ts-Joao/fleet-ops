# FleetOps Backend

Backend do **FleetOps**, sistema de gestão de frotas e logística terrestre desenvolvido utilizando **NestJS, TypeScript, DDD e Clean Architecture**.

O backend é estruturado como um **monólito modular**, com separação clara entre domínio, aplicação e infraestrutura.

---

## 🏗️ Arquitetura

Cada módulo segue a mesma divisão conceitual:

```text
module/
├── domain/
├── application/
└── infrastructure/
```

### Domain

Contém o coração do sistema:

* Entities;
* Value Objects;
* Aggregates;
* Domain Services, quando necessários;
* Regras de negócio;
* Invariantes;
* Repository Ports;
* External Service Ports.

Essa camada não depende de NestJS ou TypeORM.

### Application

Responsável pela orquestração dos casos de uso.

Contém:

* Use Cases;
* DTOs de entrada/saída da aplicação, quando necessários;
* Coordenação entre Aggregates;
* Utilização dos Ports;
* Tratamento do fluxo de aplicação.

A Application Layer não implementa detalhes de persistência.

### Infrastructure

Contém os detalhes tecnológicos:

* Controllers;
* TypeORM;
* PostgreSQL;
* Repository Adapters;
* External Service Adapters;
* ACLs;
* Configurações;
* Integrações externas.

---

## 📂 Estrutura

```text
src/
│
├── driver/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── ports/
│   │   └── ...
│   │
│   ├── application/
│   │   └── use-cases/
│   │
│   └── infrastructure/
│       ├── controllers/
│       ├── persistence/
│       └── ...
│
├── fleet/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│
├── logistics/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│
└── shared/
```

A estrutura exata pode evoluir durante o desenvolvimento.

A separação arquitetural entre as camadas, porém, deve ser preservada.

---

## 👨‍✈️ Driver Module

O módulo Driver é responsável pelo domínio dos motoristas.

### CNH

A CNH é representada como um **Value Object**.

Ela é responsável por encapsular:

* Valor da CNH;
* Validação de formato;
* Categoria;
* Validade;
* Verificação de vencimento.

Exemplo conceitual:

```text
CNH
├── number
├── category
├── expirationDate
│
├── isExpired()
└── isCompatibleWith(...)
```

A CNH inválida não deve conseguir existir dentro do domínio.

Motoristas com CNH vencida não podem ser considerados aptos para operação nem alocados em viagens.

---

## 🚛 Fleet Module

Responsável pelos veículos terrestres.

Categorias atuais:

```text
UTILITARIO
CAMINHAO_MEDIO
CAMINHAO_PESADO
```

### Placa

A placa é representada como Value Object.

Responsabilidades:

* Validação;
* Normalização;
* Proteção contra valores inválidos.

### Manutenção

O veículo mantém informações relacionadas à manutenção preventiva:

```text
quilometragem atual
        -
quilometragem da última revisão
        =
quilometragem desde a revisão
```

Quando o limite de manutenção é atingido, o domínio deve determinar a mudança do status operacional para manutenção.

A infraestrutura pode disparar a verificação, mas não decide a regra.

---

## 🚚 Logistics Module

Responsável pelas operações logísticas.

Principais conceitos:

* Trip;
* Route;
* Allocation;
* Matchmaking;
* Trip State Machine;
* Cost Calculation.

---

## 🔗 Matchmaking

A alocação de uma viagem exige a validação de múltiplas regras.

```text
                 ┌─────────────────────┐
                 │ Veículo disponível? │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ Capacidade suficiente?│
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ CNH compatível?     │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ CNH válida?         │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ Motorista disponível│
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ Sem viagem ativa?   │
                 └──────────┬──────────┘
                            ↓
                         ALOCAR
```

As regras individuais devem permanecer no domínio.

Quando uma informação estiver fora do Aggregate responsável, o Use Case pode utilizar os Ports apropriados para obter os dados necessários.

---

## 🔄 Trip State Machine

A entidade `Trip` protege suas próprias transições.

Estados:

```text
PLANNED
   │
   ▼
IN_PROGRESS
   │
   ▼
COMPLETED
```

Cancelamento:

```text
PLANNED ───────► CANCELLED

IN_PROGRESS ───► CANCELLED
```

A mudança de estado deve acontecer por comportamento de domínio:

```typescript
trip.start();
trip.complete();
trip.cancel();
```

e não através de atribuição direta:

```typescript
trip.status = TripStatus.COMPLETED;
```

---

## ⛽ Fuel Price Provider

O cálculo de custos utiliza uma porta para obtenção de preços de combustível.

Conceitualmente:

```text
Application
     │
     ▼
FuelPriceProvider
     │
     ▼
External Adapter
     │
     ▼
External API
```

O domínio e a Application Layer não conhecem detalhes da API externa.

O Adapter é responsável por:

1. Consumir o serviço externo;
2. Receber o modelo externo;
3. Traduzir os dados;
4. Retornar o modelo esperado pelo FleetOps.

Essa tradução funciona como uma **Anti-Corruption Layer**.

---

## 🗄️ Persistência

O banco utilizado pelo backend é:

**PostgreSQL 17**

O acesso é realizado através do **TypeORM**.

A infraestrutura implementa os Ports definidos pelas camadas internas.

Conceitualmente:

```text
Domain/Application
       │
       ▼
Repository Port
       │
       ▼
TypeORM Repository Adapter
       │
       ▼
PostgreSQL
```

O domínio não deve importar:

```typescript
import { Entity } from 'typeorm';
```

nem possuir conhecimento sobre:

* SQL;
* TypeORM;
* tabelas;
* migrations;
* conexões;
* PostgreSQL.

---

## 🧪 Testes

O backend utiliza **Jest**.

A prioridade é testar as regras de negócio independentemente do framework.

### Domain

Exemplos:

```text
CNH
├── formato válido
├── categoria válida
├── validade
└── vencimento

Placa
├── formato válido
└── normalização

Vehicle
├── capacidade
└── manutenção

Trip
├── transições válidas
└── transições inválidas
```

### Application

Use Cases devem ser testados utilizando Ports falsos ou mocks.

Exemplos:

```text
CreateDriverUseCase
CreateVehicleUseCase
AllocateTripUseCase
StartTripUseCase
CompleteTripUseCase
CancelTripUseCase
CalculateTripCostUseCase
```

### Infrastructure

Testes de:

* Repositories;
* Mapeamentos;
* Persistência;
* Adapters;
* Integrações externas.

---

## 🐳 Desenvolvimento

O projeto utiliza Docker para infraestrutura.

O PostgreSQL pode ser executado através do Docker Compose.

Exemplo conceitual:

```text
FleetOps Backend
       │
       ▼
PostgreSQL 17
       │
       ▼
Docker
```

---

## ⚙️ Variáveis de Ambiente

As configurações sensíveis devem ser fornecidas através de variáveis de ambiente.

Exemplo:

```env
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=fleetops
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
```

Os nomes finais das variáveis devem acompanhar a implementação efetiva do projeto.

---

## 🚀 Execução

Instalar dependências:

```bash
npm install
```

Iniciar a infraestrutura:

```bash
docker compose up -d
```

Executar o backend em desenvolvimento:

```bash
npm run start:dev
```

Executar testes:

```bash
npm test
```

Executar testes em modo watch:

```bash
npm run test:watch
```

Executar cobertura:

```bash
npm run test:cov
```

Os comandos exatos devem acompanhar os scripts definidos no `package.json`.

---

## 🧭 Princípios de Desenvolvimento

Ao implementar novas funcionalidades:

### 1. Comece pela regra

Antes de criar Controller, DTO ou Entity de TypeORM, identifique:

```text
Qual é a regra de negócio?
Qual objeto é responsável por ela?
Qual invariante precisa ser protegida?
```

### 2. Modele o domínio

Utilize:

* Entity;
* Value Object;
* Aggregate;
* Domain Service;

somente quando fizer sentido.

### 3. Crie o Use Case

O Use Case deve coordenar a operação sem assumir responsabilidades que pertencem ao domínio.

### 4. Defina Ports

Quando uma operação depender de algo externo:

```text
Repository
External Service
Provider
```

a dependência deve ser representada através de um contrato.

### 5. Implemente Adapters

A infraestrutura implementa esses contratos utilizando:

* TypeORM;
* PostgreSQL;
* HTTP;
* serviços externos;
* outras tecnologias necessárias.

---

## 🚫 O que evitar

Não colocar regras de negócio em:

* Controllers;
* DTOs;
* Pipes;
* Guards;
* Repositories;
* Entities de TypeORM;
* Services genéricos de infraestrutura.

Também evitar:

* Abstrações sem necessidade;
* Generic Repositories excessivamente genéricos;
* Services que apenas delegam chamadas;
* Microsserviços prematuros;
* Tecnologias adicionadas sem necessidade real;
* Acoplamento do domínio ao framework.

---

## 📌 Regra de ouro

O backend deve seguir:

```text
REGRA DE NEGÓCIO
        ↓
DOMAIN
        ↓
APPLICATION
        ↓
PORT
        ↓
ADAPTER
        ↓
INFRASTRUCTURE
```

O NestJS, TypeORM e PostgreSQL existem para suportar o domínio — não para defini-lo.
