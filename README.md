# FleetOps

Sistema de gestão de frotas e logística terrestre desenvolvido como projeto de portfólio, com foco em **Domain-Driven Design (DDD)**, **Clean Architecture**, **SOLID** e modelagem de regras de negócio complexas.

O FleetOps foi projetado inicialmente como um **monólito modular**, mantendo fronteiras claras entre os contextos de domínio para permitir evolução futura sem introduzir complexidade arquitetural prematuramente.

---

## 🎯 Objetivo

O objetivo do FleetOps é simular um sistema real de gestão de operações logísticas terrestres, indo além de operações CRUD.

O projeto concentra-se principalmente em:

* Modelagem rica de domínio;
* Value Objects;
* Entities e Aggregates;
* Invariantes de negócio;
* Máquinas de estado;
* Matchmaking entre motoristas, veículos e viagens;
* Repository Pattern;
* Use Cases;
* Ports & Adapters;
* Anti-Corruption Layer;
* Testes unitários e de integração;
* Separação entre domínio e infraestrutura.

---

## 🏗️ Arquitetura

O FleetOps utiliza:

**DDD + Clean Architecture + Monólito Modular**

A organização segue o princípio de que as dependências devem apontar para dentro:

```text
┌───────────────────────────────┐
│            HTTP               │
│        Controllers            │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│         Application           │
│           Use Cases            │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│            Domain             │
│ Entities / VOs / Rules / Ports│
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│        Infrastructure         │
│ TypeORM / PostgreSQL / APIs   │
└───────────────────────────────┘
```

O domínio não possui dependência de:

* NestJS;
* TypeORM;
* PostgreSQL;
* HTTP;
* Controllers;
* DTOs de infraestrutura;
* APIs externas.

---

## 🧩 Módulos

A versão atual possui três módulos principais:

### Driver

Responsável pelo domínio de motoristas.

Principais conceitos:

* Cadastro de motoristas;
* CNH como Value Object;
* Validação da CNH;
* Categorias de habilitação;
* Validade da CNH;
* Verificação de CNH vencida;
* Regras relacionadas à aptidão para operação.

### Fleet

Responsável pelo domínio da frota terrestre.

Principais conceitos:

* Veículos;
* Placa como Value Object;
* Categorias de veículos;
* Capacidade de carga;
* Quilometragem;
* Status operacional;
* Manutenção preventiva.

### Logistics

Responsável pelas operações logísticas.

Principais conceitos:

* Viagens;
* Rotas;
* Alocações;
* Matchmaking;
* Máquina de estados;
* Cálculo de custos;
* Integração com preços de combustível.

---

## 🚚 Matchmaking

Uma viagem somente pode ser alocada quando todas as condições de domínio forem satisfeitas:

```text
Veículo disponível?
       ↓
Capacidade suficiente?
       ↓
CNH compatível?
       ↓
CNH válida?
       ↓
Motorista disponível?
       ↓
Motorista sem viagem ativa?
       ↓
     ALOCAR
```

Qualquer falha interrompe a operação e rejeita a alocação.

Entre as principais invariantes estão:

```text
peso da carga <= capacidade do veículo
```

e:

```text
motorista sem viagem ativa
```

Além disso, a categoria da CNH deve ser compatível com a categoria do veículo.

---

## 🔄 Máquina de Estados

As viagens possuem os seguintes estados:

```text
PLANEJADA
    │
    ▼
EM ANDAMENTO
    │
    ▼
CONCLUÍDA
```

Cancelamento:

```text
PLANEJADA ──────► CANCELADA

EM ANDAMENTO ────► CANCELADA
```

As transições são protegidas pelo domínio.

A aplicação não deve alterar diretamente o estado de uma viagem:

```typescript
trip.status = TripStatus.COMPLETED;
```

Em vez disso, as operações de domínio devem controlar as transições:

```typescript
trip.start();
trip.complete();
trip.cancel();
```

---

## ⛽ Cálculo de Custos

O cálculo de custo utiliza uma abstração para obtenção do preço de combustível.

O domínio conhece somente o contrato necessário:

```text
FleetOps
   │
   ▼
FuelPriceProvider
   │
   ▼
Adapter / ACL
   │
   ▼
Serviço externo
```

O domínio não conhece:

* URLs;
* HTTP;
* DTOs externos;
* autenticação;
* NestJS;
* detalhes da API utilizada.

O Adapter funciona como uma **Anti-Corruption Layer**, traduzindo o modelo externo para o modelo utilizado pelo FleetOps.

---

## 🛠️ Stack

### Backend

* Node.js 22 LTS
* TypeScript
* NestJS
* TypeORM
* PostgreSQL 17
* Jest

### Infraestrutura

* Docker
* Docker Compose

Tecnologias adicionais poderão ser introduzidas somente quando houver uma necessidade técnica real.

---

## 🗂️ Estrutura

```text
FleetOps/
│
├── backend/
│   ├── src/
│   │   ├── driver/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   └── infrastructure/
│   │   │
│   │   ├── fleet/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   └── infrastructure/
│   │   │
│   │   ├── logistics/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   └── infrastructure/
│   │   │
│   │   └── shared/
│   │
│   ├── test/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

A estrutura física pode evoluir conforme o projeto cresce, mas as fronteiras entre **Domain**, **Application** e **Infrastructure** devem ser preservadas.

---

## 🧪 Estratégia de Testes

Os testes são organizados de acordo com a responsabilidade de cada camada.

### Domain

Prioridade para testes de regras de negócio:

* CNH;
* Placa;
* Validade;
* Compatibilidade;
* Capacidade;
* Manutenção preventiva;
* Matchmaking;
* Disponibilidade;
* Máquina de estados.

### Application

Use Cases são testados isoladamente utilizando:

* Mocks;
* Fakes;
* Repository Ports;
* External Service Ports.

Exemplos:

* `CreateDriverUseCase`;
* `CreateVehicleUseCase`;
* `AllocateTripUseCase`;
* `StartTripUseCase`;
* `CompleteTripUseCase`;
* `CancelTripUseCase`;
* `CalculateTripCostUseCase`.

### Infrastructure

Testes relacionados a:

* Repositories;
* Persistência;
* Mapeamentos;
* Adapters;
* Integrações externas.

---

## 🐳 Ambiente

Docker é utilizado para padronizar o ambiente de desenvolvimento.

Inicialmente, o principal serviço de infraestrutura é:

```text
Docker
└── PostgreSQL 17
```

Serviços adicionais poderão ser introduzidos conforme necessidades reais do sistema.

---

## 🚀 Roadmap

### v1 — MVP

* [x] Estrutura modular;
* [ ] Driver Module;
* [ ] CNH como Value Object;
* [ ] Fleet Module;
* [ ] Placa como Value Object;
* [ ] Manutenção preventiva;
* [ ] Logistics Module;
* [ ] Matchmaking;
* [ ] Máquina de estados de viagens;
* [ ] Cálculo de custos;
* [ ] Adapter/ACL para preço de combustível;
* [ ] Testes de domínio;
* [ ] Testes de Application;
* [ ] Testes de Infrastructure.

### v2

#### Maintenance Module

* Histórico de oficinas;
* Peças;
* Serviços;
* Custos reais;
* Ciclo de vida dos veículos.

#### Notification Module

Eventos relacionados a:

* CNH próxima do vencimento;
* Veículo entrando em manutenção.

#### Billing Module

* Custos operacionais;
* Margem de lucro;
* Rentabilidade por rota.

### v3

Expansão para o modal aquaviário:

* Navios;
* Embarcações;
* Tripulação;
* Habilitações marítimas;
* Rotas por milhas náuticas.

O domínio aquaviário será modelado de forma independente, evitando forçar conceitos do domínio terrestre sobre ele.

---

## 🧭 Evolução Arquitetural

O FleetOps começa como um **monólito modular**.

A extração para microsserviços não é um objetivo da v1.

Uma futura separação poderia resultar em:

```text
Driver Service
Fleet Service
Logistics Service
```

porém somente caso existam necessidades como:

* Escalabilidade independente;
* Autonomia de deploy;
* Isolamento de falhas;
* Ownership independente;
* Diferentes padrões de carga;
* Processamento assíncrono;
* Integrações externas específicas.

A arquitetura não adota microsserviços apenas por preferência tecnológica.

---

## 📌 Princípios

O desenvolvimento do FleetOps segue alguns princípios fundamentais:

1. O domínio é o centro do sistema.
2. Regras de negócio pertencem ao domínio.
3. Controllers não possuem regras de negócio.
4. DTOs não definem invariantes de domínio.
5. Repositories não implementam regras de negócio.
6. Infraestrutura é um detalhe.
7. Use Cases orquestram operações.
8. Ports representam contratos.
9. Adapters implementam detalhes externos.
10. Value Objects protegem conceitos com regras próprias.
11. Domain Services são utilizados somente quando necessários.
12. Não são criadas abstrações sem necessidade.
13. Não são introduzidas tecnologias sem justificativa técnica.

---

## 📄 Licença

Projeto desenvolvido para fins de estudo, aprendizado e portfólio.
