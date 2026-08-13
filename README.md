# FleetOps — Sumário Executivo e Documentação Detalhada

## Visão Geral do Projeto
O **FleetOps** é um projeto de portfólio estruturado como uma aplicação corporativa robusta de logística e transporte. Diferente de uma abordagem tradicional baseada em CRUDs anêmicos, o projeto prioriza de forma intransigente a proteção de invariantes de negócio, o isolamento completo do domínio em relação a regras de infraestrutura e a aplicação rigorosa de padrões avançados de engenharia de software, tais como **Domain-Driven Design (DDD)**, **Clean Architecture**, **Padrões de Projeto (Ports & Adapters)** e **Máquinas de Estado**.

---

## Stack Tecnológica
O ecossistema técnico do projeto é composto por tecnologias modernas e consolidadas no desenvolvimento backend corporativo:
* **Linguagem:** TypeScript
* **Runtime:** Node.js
* **Framework:** NestJS
* **Banco de Dados Relacional:** PostgreSQL
* **ORM:** TypeORM
* **Testes:** Jest

---

## Arquitetura e Clean Architecture
A arquitetura do FleetOps combina os princípios da Clean Architecture com o Domain-Driven Design (DDD), dividindo a responsabilidade do sistema em três camadas concêntricas fundamentais, onde o fluxo de dependências aponta estritamente de fora para dentro:

1. **Domain (Domínio - Camada Mais Interna)**
   * **Responsabilidade:** Contém o núcleo do negócio, entidades, Value Objects, agregados, regras invariantes e as interfaces de repositórios (*Ports*).
   * **Isolamento:** É puramente orientado a objetos e totalmente desacoplado de frameworks (como NestJS), bibliotecas ORM (como TypeORM), protocolos de transporte (HTTP) ou bancos de dados específicos.

2. **Application (Aplicação - Camada Intermediária)**
   * **Responsabilidade:** Orquestra os fluxos operacionais da aplicação através de Casos de Uso (*Use Cases*). Gerencia transações de aplicação e interage com as portas de repositório e serviços de domínio.
   * **Restrição:** Os Casos de Uso não concentram regras de negócio complexas; eles apenas delegam essa responsabilidade para as entidades e objetos do domínio.

3. **Infrastructure (Infraestrutura - Camada Mais Externa)**
   * **Responsabilidade:** Abriga os detalhes técnicos da aplicação, tais como controladores NestJS, DTOs de transporte, entidades e configurações do TypeORM, persistência em PostgreSQL, implementações concretas de repositórios e adaptadores para serviços externos.

---

## Estrutura do Projeto
A organização dos diretórios reflete a divisão modular orientada a **Bounded Contexts**, preservando o desacoplamento estrito entre domínio, aplicação e infraestrutura:

```text
src/
├── driver/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── fleet/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── logistics/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
└── shared/