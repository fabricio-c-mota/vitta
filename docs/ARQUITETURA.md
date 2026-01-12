# Guia de Arquitetura do Projeto

**App de Agendamento de Consultas Nutricionais**  
*React Native + Expo + Firebase (dados/autenticação) + Supabase (push) + Expo Calendar e Notifications*

---

## 1. Objetivo da Arquitetura

Este documento estabelece a organização do código e as boas práticas a serem seguidas no desenvolvimento do aplicativo de agendamento de consultas nutricionais.

### Principais objetivos:
- Aplicar o padrão **MVVM sofisticado** em React Native
- Garantir **separação de responsabilidades** (View, ViewModel, Model, Use Case, Infra, DI)
- Facilitar **testes automatizados** (unitários e de integração)
- Implementar **Inversão de Dependência** (DIP) e **Injeção de Dependência** (via construtor/fábricas)
- Evitar código monolítico ("Big Tripe" - tudo junto na tela)

Este guia deve ser seguido por todos os desenvolvedores e agentes que contribuírem com este projeto.

---

## 2. Padrão MVVM no Projeto (Sofisticado)

Adotamos o **MVVM Sofisticado** com camadas claras e independentes:

### **View (React Native)**
- `src/app` usa Expo Router para roteamento.
- `src/view` contém páginas e componentes de UI.
- A View recebe apenas **state** e **actions** da ViewModel.
- Não acessa Use Cases, serviços ou repositórios diretamente.

### **ViewModel**
- Intermediária entre View e Use Cases.
- Implementada como **hooks** em `src/viewmodel`.
- Gerencia estado da UI (loading, erros, dados) e expõe comandos.
- Depende apenas de **interfaces de Use Cases** (injeção via DI).
- Não contém regras de negócio.

### **Use Case**
- Vive em `src/usecase`.
- Contém interfaces e implementações.
- Implementa regras de negócio e orquestra o fluxo entre entidades e interfaces de serviços.
- Independente de UI e de implementações concretas (infra).

### **Model (Domínio)**
- Entidades (`User`, `Appointment`, etc.).
- Contratos/Interfaces para serviços externos e repositórios (ex.: `IAuthService`, `IAppointmentRepository`).
- Definições de erros de domínio.

### **Infra**
- Implementações concretas das interfaces de domínio (Firebase, calendário, notificações, Supabase push).
- Não vaza detalhes de tecnologia para o domínio.
- Converte erros de infraestrutura em erros de domínio.

### **Dependency Injection (DI)**
- `src/di` monta dependências.
- View consome **hooks de ViewModel já injetados** (ex.: factories/containers) sem acessar Use Cases.
- `app.config.ts` tipado injeta chaves `EXPO_PUBLIC_*` (Firebase, Supabase) no `extra`.

### Princípio Central:
> A **ViewModel** depende apenas de **interfaces de Use Cases**, e a View só conhece **state/actions**. As dependências são injetadas via DI.

---

## 3. Estrutura de Pastas

O código do projeto está organizado no diretório `/src`. O **Expo Router** fica em `src/app`
para rotas, e as páginas/componentes ficam em `src/view`.

```
src/
├─ app/                      # Expo Router - rotas (sem regra de negócio)
│  ├─ _layout.tsx
│  └─ (arquivos de rota)     # mapeiam para páginas em src/view/pages
├─ view/                     # UI (páginas e componentes)
│  ├─ pages/
│  │   ├─ patient/
│  │   └─ nutritionist/
│  ├─ components/
│  └─ themes/
├─ viewmodel/                # ViewModels (hooks)
├─ usecase/                  # Use Cases (interfaces + implementações)
├─ model/                    # Domínio (puro)
│  ├─ entities/
│  ├─ factories/
│  ├─ services/
│  ├─ repositories/
│  └─ errors/
├─ infra/                    # Implementações concretas
│  ├─ firebase/
│  ├─ notifications/
│  └─ calendar/
├─ di/                       # Injeção de dependências
│  ├─ container.ts
│  └─ viewmodelContainer.ts  # Fábricas de ViewModels
└─ tests/
  ├─ unit/
  │   ├─ model/
  │   ├─ usecase/
  │   └─ viewmodel/
  └─ integration/
```

### 3.1 Factories vs DI Container

O projeto usa dois tipos de "fábricas" com propósitos distintos:

| Local | Propósito | Exemplo |
|-------|-----------|---------|
| `model/factories/` | Criar **entidades de domínio** com validações | `makeUser()`, `makeAppointment()`, `makeTimeSlot()` |
| `di/container.ts` | Montar **dependências** (Use Cases, ViewModels, Repositórios) | `makeRequestAppointmentUseCase()` |

**Factories de Entidade (`model/factories/`):**
- Encapsulam lógica de criação de objetos de domínio
- Aplicam validações e valores default
- Retornam entidades prontas para uso

```typescript
// model/factories/makeUser.ts
export function makeUser(input: CreateUserInput): User {
  return {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    role: input.role,
    createdAt: new Date(),
  };
}

// model/factories/makeAppointment.ts
export function makeAppointment(input: CreateAppointmentInput): Appointment {
  return {
    id: crypto.randomUUID(),
    patientId: input.patientId,
    nutritionistId: input.nutritionistId,
    date: input.date,
    timeStart: input.timeStart,
    timeEnd: input.timeEnd,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// model/factories/makeTimeSlot.ts
export function makeTimeSlot(input: CreateTimeSlotInput): TimeSlot {
  return {
    date: input.date,
    timeStart: input.timeStart,
    timeEnd: input.timeEnd,
    available: input.available ?? true,
  };
}
```

**DI Container (`di/container.ts`):**
- Monta árvore de dependências
- Injeta repositórios e providers nos Use Cases
- Injeta Use Cases nas ViewModels

```typescript
// di/container.ts
export function makeRequestAppointmentUseCase(): RequestAppointmentUseCase {
  const appointmentRepository = new FirebaseAppointmentRepository();
  return new RequestAppointmentUseCase(appointmentRepository);
}
```

---

## 4. Inversão de Dependência e Injeção por Construtor

### 4.1 Princípio

- **Interfaces** vivem no domínio (`model/services` ou equivalente)
- **Implementações concretas** vivem em `infra/`
- **ViewModel** depende da interface, recebida via parâmetros do hook

### 4.2 Exemplo Conceitual

#### Interface de domínio:
```typescript
// model/services/IAppointmentRepository.ts
export interface IAppointmentRepository {
  requestAppointment(data: RequestAppointmentDTO): Promise<void>;
  listPatientAppointments(patientId: string): Promise<Appointment[]>;
  listNutritionistPending(nutritionistId: string): Promise<Appointment[]>;
  acceptAppointment(id: string): Promise<void>;
}
```

#### Implementação na infraestrutura:
```typescript
// infra/firebase/FirebaseAppointmentRepository.ts
export class FirebaseAppointmentRepository implements IAppointmentRepository {
  /* Implementa os métodos usando Firebase */
}
```

#### Caso de uso (regra de negócio):
```typescript
// usecase/RequestAppointmentUseCase.ts
export class RequestAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(input: RequestAppointmentDTO): Promise<void> {
    // Regras de negócio (validações, conflitos, etc.)
    await this.appointmentRepository.requestAppointment(input);
  }
}
```

#### ViewModel como Hook (injeção direta):
```typescript
// viewmodel/usePatientScheduleViewModel.ts
export function usePatientScheduleViewModel(
  requestAppointment: RequestAppointmentUseCase
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestAppointment(/* dados da tela */) {
    setLoading(true);
    setError(null);
    try {
      await requestAppointment.execute(/* dados */);
    } catch (err: any) {
      setError(err.message ?? "Falha inesperada.");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, handleRequestAppointment };
}
```

### 4.3 Observações sobre ViewModel

O ViewModel como hook:
- Recebe dependências por parâmetro (injeção via DI)
- Gerencia estado de React (`useState`/`useEffect`)
- Expõe ações consumidas diretamente pela View

**Benefícios:**
- Testar a ViewModel com `renderHook` e mocks das interfaces
- Injetar mocks das interfaces nos testes
- Manter a integração fácil com React Native

---

## 5. Ferramentas e Boas Práticas de Teste

### 5.1 Stack de Testes

- **Jest**: testes unitários e de integração
- **@testing-library/react-native**: testes de componentes / Views
- **Mocks**: `jest.fn()` ou mocks manuais para repositórios e providers

### 5.2 O que Testar

#### **Model / Use Cases (Domínio)**
- Regras de negócio (ex.: impedir duas consultas no mesmo horário)
- Casos de uso: Login, Solicitar Consulta, Aceitar Consulta
- Independentes de Firebase, notificações, calendário

#### **ViewModels**
- Mudanças de estado (loading, erro, sucesso)
- Comportamento frente a respostas dos serviços
- Usando repositórios / serviços mockados

#### **Views (telas)**
- Renderizam o estado corretamente
- Chamam ações certas quando o usuário interage
- Não precisam saber nada de Firebase

### 5.3 Organização dos Testes

```
tests/
  unit/
    usecase/
    viewmodel/
  integration/
    views/
```

### 5.4 Boas Práticas de Teste

- Cada teste deve focar em **um comportamento específico**
- Não testar detalhes de implementação desnecessários
- Evitar acessar Firebase real em testes unitários (usar mocks)
- Nomear testes de forma descritiva:
  - Exemplo: `should_not_accept_two_appointments_at_same_time_for_same_nutritionist`

---

## 6. Boas Práticas Gerais do Projeto

### Views "burras"
- Apenas exibem dados e disparam ações da ViewModel
- Sem lógica de negócio, sem `if` aninhado pesado

### Tipos e Entidades Bem Definidas
- Usar TypeScript em todas as camadas
- Entidades como `Appointment`, `User` devem estar em `model/entities`

### Naming Consistente
- **ViewModel**: `useSomethingViewModel.ts`
- **Repositórios/Serviços (contratos)**: `IAppointmentRepository`, `IAuthService`
- **Use Cases**: `ActionNameUseCase` (ex.: `RequestAppointmentUseCase`)

### Tratamento de Erros
- Serviços de domínio podem lançar erros específicos (`DomainError`, `ValidationError`)
- ViewModel traduz erros em mensagens amigáveis para a View

### Sem "Big Tripe"
- **Proibido** criar tela com: UI + regra de negócio + chamada Firebase tudo junto
- Se surgir, refatorar para MVVM + domínio + infra

### Configuração Centralizada
`di/container.ts` deve expor funções/fábricas para instanciar:
- Repositórios concretos
- Use Cases
- ViewModels (quando necessário)

---

## 7. Fluxo de Desenvolvimento de Funcionalidades

Sempre que for adicionar uma nova funcionalidade:

### 1. Comece pelo Domínio
- Precisa de nova entidade ou campo?
- Precisa de um novo caso de uso (Service)?

### 2. Crie/Atualize Interfaces de Repositório
- Métodos necessários para a funcionalidade

### 3. Implemente na Infraestrutura
- Firebase, expo-calendar, expo-notifications, etc.

### 4. Crie/Ajuste a ViewModel
- Injetando os casos de uso via construtor
- Preparando estados e actions para a View

### 5. Implemente a View
- Consumindo a ViewModel via Hook

### 6. Escreva Testes
- Unitário para o serviço
- Unitário para a ViewModel (com mocks)
- Opcionalmente de integração para a View

---

## 8. Firebase, Notificações e Calendário

### Firebase Auth / Firestore
- Somente acessado em `infra/firebase/`
- Regras de segurança configuradas para isolar dados por usuário

### Notificações (expo-notifications)
- Encapsuladas em `IPushNotificationService` (permissões/token) e `IPushNotificationSender` (envio via Supabase Edge Functions)
- Tokens são persistidos em `users.pushTokens` no Firestore
- O envio é feito pela Edge Function `supabase/functions/push-notify` via Expo Push API

### Calendário (expo-calendar)
- Encapsulado em `ICalendarService`
- Eventos são criados/atualizados quando a consulta é aceita e removidos quando é cancelada/recusada
- Lembrete padrão: 24h antes (via calendário nativo)
- Permissão é obrigatória: se negada, o app redireciona para a tela de permissão

---

## 9. Resumo

- O projeto segue **MVVM sofisticado** com camadas claras
- **Domínio não conhece Firebase nem Expo**: apenas interfaces e regras de negócio
- **Inversão de dependência**: interfaces no domínio, implementações na infra
- **Injeção por construtor** permite:
  - Testes fáceis (mocks)
  - Substituição de implementações (ex.: trocar Firebase por outra solução)
- **Qualquer nova funcionalidade deve respeitar esta arquitetura** antes de ser implementada

---

## Referências

- [Padrão MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)
- [Princípios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Testing Library React Native](https://callstack.github.io/react-native-testing-library/)
