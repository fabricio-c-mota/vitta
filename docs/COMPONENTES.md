<!--
Objetivo: Documentar a arquitetura de componentes, deployment e dependências do sistema.
Escopo: Visão abstrata de onde o app executa e de onde consome serviços.
-->

# Documentação de Componentes

---

## 1. Visão Geral do Sistema

O sistema é composto por um **aplicativo móvel** que se comunica com **serviços externos** para persistência, autenticação e funcionalidades do dispositivo.

```
┌─────────────────────────────────────────────────────────────────┐
│                      DISPOSITIVO MÓVEL                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    APLICAÇÃO VITTA                        │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │  │
│  │  │  View   │→ │ViewModel│→ │ UseCase │→ │  Model  │      │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └────┬────┘      │  │
│  │                                              │            │  │
│  │                                    ┌─────────▼─────────┐  │  │
│  │                                    │   Infraestrutura  │  │  │
│  │                                    │    (Adaptadores)  │  │  │
│  │                                    └─────────┬─────────┘  │  │
│  └──────────────────────────────────────────────┼────────────┘  │
│                                                 │                │
│  ┌──────────────────────────────────────────────┼────────────┐  │
│  │              SERVIÇOS DO DISPOSITIVO         │            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────▼─────────┐  │  │
│  │  │ Calendário │  │Notificações│  │   Armazenamento    │  │  │
│  │  │   Nativo   │  │   Locais   │  │      Local         │  │  │
│  │  └────────────┘  └────────────┘  └────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REDE (HTTPS)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVIÇOS REMOTOS                            │
│  ┌───────────────────┐  ┌───────────────────────────────────┐  │
│  │ Provedor de       │  │ Provedor de Persistência          │  │
│  │ Autenticação      │  │ (Banco de Dados em Nuvem)         │  │
│  │                   │  │                                   │  │
│  │ • Login/Logout    │  │ • Coleção: Usuários               │  │
│  │ • Registro        │  │ • Coleção: Consultas              │  │
│  │ • Sessão          │  │ • Listeners em tempo real         │  │
│  └───────────────────┘  └───────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes do Sistema

### 2.1 Aplicação Móvel (Cliente)

| Componente | Responsabilidade | Tecnologia Base |
|------------|------------------|-----------------|
| **View** | Renderizar interface, capturar interações | React Native |
| **ViewModel** | Gerenciar estado da UI, expor ações | TypeScript Classes |
| **UseCase** | Implementar regras de negócio | TypeScript Classes |
| **Model** | Definir entidades e contratos | TypeScript Interfaces |
| **Infra** | Adaptar serviços externos às interfaces do domínio | Implementações concretas |
| **DI Container** | Montar e injetar dependências | Fábricas TypeScript |

### 2.2 Serviços do Dispositivo

| Serviço | Propósito | Interface de Domínio |
|---------|-----------|---------------------|
| **Calendário Nativo** | Sincronizar eventos com agenda do usuário | `ICalendarProvider` |
| **Notificações Locais** | Agendar lembretes no dispositivo | `INotificationProvider` |
| **Armazenamento Local** | Cache e persistência offline (futuro) | `ILocalStorage` |

### 2.3 Serviços Remotos

| Serviço | Propósito | Interface de Domínio |
|---------|-----------|---------------------|
| **Provedor de Autenticação** | Gerenciar identidade e sessão | `IAuthService` |
| **Provedor de Persistência** | Armazenar e consultar dados | `IUserRepository`, `IAppointmentRepository` |

---

## 3. Fluxo de Dependências

### 3.1 Princípio de Inversão

O domínio **não conhece** implementações concretas. A comunicação é feita através de **interfaces** (contratos):

```
┌─────────────────────────────────────────────────────────────┐
│                         DOMÍNIO                             │
│                    (Model + UseCase)                        │
│                                                             │
│   Define interfaces:                                        │
│   • IAuthService                                            │
│   • IUserRepository                                         │
│   • IAppointmentRepository                                  │
│   • ICalendarProvider                                       │
│   • INotificationProvider                                   │
│                                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ depende de (interfaces)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     INFRAESTRUTURA                          │
│                                                             │
│   Implementa interfaces:                                    │
│   • ConcreteAuthService implements IAuthService             │
│   • ConcreteUserRepository implements IUserRepository       │
│   • ConcreteAppointmentRepo implements IAppointmentRepo     │
│   • ConcreteCalendarProvider implements ICalendarProvider   │
│   • ConcreteNotificationProvider implements INotification   │
│                                                             │
│   Conecta com serviços externos reais                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Matriz de Dependências

| Camada | Depende de | Não depende de |
|--------|-----------|----------------|
| **View** | ViewModel | UseCase, Model, Infra |
| **ViewModel** | UseCase (via interface) | Infra, Serviços externos |
| **UseCase** | Model (interfaces) | Infra, Serviços externos |
| **Model** | Nada | Tudo externo |
| **Infra** | Model (interfaces), Serviços externos | View, ViewModel |

---

## 4. Ambiente de Execução

### 4.1 Plataformas Suportadas

| Plataforma | Sistema Operacional | Versão Mínima |
|------------|---------------------|---------------|
| **iOS** | iOS | 13.0+ |
| **Android** | Android | API 21+ (5.0 Lollipop) |

### 4.2 Runtime

| Componente | Ambiente |
|------------|----------|
| **Código JavaScript** | Hermes Engine (React Native) |
| **Código Nativo** | iOS: Swift/Objective-C, Android: Kotlin/Java |
| **Bridge** | React Native New Architecture (Fabric) |

### 4.3 Ciclo de Vida

```
┌────────────────────────────────────────────────────────────┐
│                    INICIALIZAÇÃO                           │
│                                                            │
│  1. App inicia                                             │
│  2. DI Container monta dependências                        │
│  3. Verifica sessão ativa com Provedor de Autenticação     │
│  4. Redireciona para tela apropriada                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│                    EXECUÇÃO ATIVA                          │
│                                                            │
│  • Views renderizam estado do ViewModel                    │
│  • ViewModel executa UseCases                              │
│  • UseCases chamam Repositórios (via interface)            │
│  • Infraestrutura comunica com serviços externos           │
│  • Listeners recebem atualizações em tempo real            │
│                                                            │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│                    BACKGROUND                              │
│                                                            │
│  • Notificações locais continuam agendadas                 │
│  • Listeners pausados (reconectam ao voltar)               │
│  • Sessão mantida (token armazenado)                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Comunicação com Serviços Externos

### 5.1 Padrão de Comunicação

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   UseCase   │────────▶│ Repository  │────────▶│  Serviço    │
│             │ chamada │  (Infra)    │  HTTPS  │  Remoto     │
│             │◀────────│             │◀────────│             │
│             │ resposta│             │  JSON   │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

### 5.2 Tipos de Comunicação

| Tipo | Direção | Uso |
|------|---------|-----|
| **Request/Response** | Cliente → Servidor → Cliente | CRUD de dados |
| **Real-time Listeners** | Servidor → Cliente (push) | Atualizações de status |
| **Local** | App ↔ Dispositivo | Calendário, Notificações |

### 5.3 Contratos de Serviço

#### Provedor de Autenticação

```typescript
interface IAuthService {
  login(email: string, password: string): Promise<AuthResult>;
  register(email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe;
}
```

#### Provedor de Persistência - Usuários

```typescript
interface IUserRepository {
  getById(id: string): Promise<User | null>;
  create(user: User): Promise<void>;
  getByEmail(email: string): Promise<User | null>;
}
```

#### Provedor de Persistência - Consultas

```typescript
interface IAppointmentRepository {
  create(appointment: Appointment): Promise<void>;
  getById(id: string): Promise<Appointment | null>;
  listByPatient(patientId: string): Promise<Appointment[]>;
  listByNutritionist(nutritionistId: string): Promise<Appointment[]>;
  listByDateAndStatus(date: string, status: AppointmentStatus): Promise<Appointment[]>;
  updateStatus(id: string, status: AppointmentStatus): Promise<void>;
  onPatientAppointmentsChanged(patientId: string, callback: (appointments: Appointment[]) => void): Unsubscribe;
  onNutritionistAppointmentsChanged(nutritionistId: string, callback: (appointments: Appointment[]) => void): Unsubscribe;
}
```

#### Provedor de Calendário

```typescript
interface ICalendarProvider {
  requestPermission(): Promise<boolean>;
  addEvent(event: CalendarEvent): Promise<string>; // retorna eventId
  removeEvent(eventId: string): Promise<void>;
  hasPermission(): Promise<boolean>;
}
```

#### Provedor de Notificações

```typescript
interface INotificationProvider {
  requestPermission(): Promise<boolean>;
  scheduleReminder(reminder: ReminderInput): Promise<string>; // retorna notificationId
  cancelReminder(notificationId: string): Promise<void>;
  hasPermission(): Promise<boolean>;
}
```

---

## 6. Diagrama de Deployment

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         AMBIENTE DE PRODUÇÃO                        │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    DISPOSITIVOS MÓVEIS                        │  │
│  │                                                               │  │
│  │   ┌─────────────┐                      ┌─────────────┐       │  │
│  │   │   iPhone    │                      │   Android   │       │  │
│  │   │             │                      │             │       │  │
│  │   │ ┌─────────┐ │                      │ ┌─────────┐ │       │  │
│  │   │ │  Vitta  │ │                      │ │  Vitta  │ │       │  │
│  │   │ │   App   │ │                      │ │   App   │ │       │  │
│  │   │ └─────────┘ │                      │ └─────────┘ │       │  │
│  │   └──────┬──────┘                      └──────┬──────┘       │  │
│  │          │                                    │               │  │
│  └──────────┼────────────────────────────────────┼───────────────┘  │
│             │              INTERNET              │                   │
│             └────────────────┬───────────────────┘                   │
│                              │                                       │
│  ┌───────────────────────────┼───────────────────────────────────┐  │
│  │                    NUVEM (BaaS)                               │  │
│  │                           │                                   │  │
│  │   ┌───────────────────────┴───────────────────────────┐      │  │
│  │   │              PROVEDOR DE BACKEND                  │      │  │
│  │   │                                                   │      │  │
│  │   │  ┌─────────────────┐  ┌─────────────────┐        │      │  │
│  │   │  │  Autenticação   │  │   Banco NoSQL   │        │      │  │
│  │   │  │                 │  │                 │        │      │  │
│  │   │  │ • Identidade    │  │ • users/        │        │      │  │
│  │   │  │ • Tokens JWT    │  │ • appointments/ │        │      │  │
│  │   │  │ • Sessões       │  │ • Índices       │        │      │  │
│  │   │  └─────────────────┘  └─────────────────┘        │      │  │
│  │   │                                                   │      │  │
│  │   └───────────────────────────────────────────────────┘      │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Segurança

### 7.1 Camadas de Segurança

| Camada | Mecanismo |
|--------|-----------|
| **Transporte** | HTTPS/TLS para todas as comunicações |
| **Autenticação** | Tokens JWT com expiração |
| **Autorização** | Regras no provedor de persistência |
| **Dados** | Isolamento por usuário |

### 7.2 Regras de Acesso

```
┌─────────────────────────────────────────────────────────────┐
│                   REGRAS DE AUTORIZAÇÃO                     │
│                                                             │
│  Paciente:                                                  │
│  ├─ Lê: apenas suas próprias consultas                     │
│  ├─ Cria: consultas onde é o patientId                     │
│  ├─ Atualiza: cancelar suas consultas (pending/accepted)   │
│  └─ Deleta: nunca                                          │
│                                                             │
│  Nutricionista:                                             │
│  ├─ Lê: todas as consultas                                 │
│  ├─ Cria: nunca (apenas paciente solicita)                 │
│  ├─ Atualiza: status de qualquer consulta                  │
│  └─ Deleta: nunca                                          │
│                                                             │
│  Sistema:                                                   │
│  ├─ Valida conflitos de horário                            │
│  ├─ Mantém integridade referencial                         │
│  └─ Registra timestamps automáticos                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Escalabilidade e Resiliência

### 8.1 Características

| Aspecto | Abordagem |
|---------|-----------|
| **Escalabilidade** | Serverless (provedor gerencia) |
| **Disponibilidade** | SLA do provedor de backend |
| **Latência** | Listeners em tempo real |
| **Offline** | Não suportado no MVP (futuro) |

### 8.2 Pontos de Falha

| Componente | Impacto se falhar | Mitigação |
|------------|-------------------|-----------|
| **Rede** | App não funciona | Mensagem de erro + retry |
| **Provedor Auth** | Não faz login | Sessão em cache |
| **Provedor DB** | Não carrega dados | Loading + retry |
| **Calendário** | Não sincroniza | Funcionalidade degradada |
| **Notificações** | Não lembra | Funcionalidade degradada |

---

## 9. Documentação Relacionada

- [Arquitetura (ARQUITETURA.md)](./ARQUITETURA.md) - Padrões de código e camadas
- [ERD (ERD.md)](./ERD.md) - Modelo de dados
- [Sprints (SPRINTS.md)](./SPRINTS.md) - Planejamento de desenvolvimento
- [Requisitos Funcionais (RF.md)](./RF.md) - O que o sistema faz
- [Requisitos Não Funcionais (RNF.md)](./RNF.md) - Como o sistema se comporta
