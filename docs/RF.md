## Requisitos Funcionais (RF)

**Convenção de status (exibição vs. interno)**  
O app exibe os status em português, mas persiste os valores internos em inglês:  
`pendente` → `pending`, `aceita` → `accepted`, `recusada` → `rejected`, `cancelada` → `cancelled`.

### RF01 – Autenticação de usuários
O sistema deve permitir que nutricionista e pacientes façam login com e-mail/senha para acessar o aplicativo.

### RF02 – Registro de pacientes
O sistema deve permitir que novos pacientes se registrem no aplicativo informando nome, e-mail e senha. O paciente é o único perfil que realiza auto-cadastro. A nutricionista (Jesseane) será cadastrada diretamente no Firebase pelo administrador do sistema. Não há funcionalidade de edição de perfil no aplicativo.

### RF03 – Diferenciar perfis (nutricionista / paciente)
O sistema deve identificar o tipo de usuário (nutricionista ou paciente) a partir do login e mostrar telas/funcionalidades adequadas para cada perfil. O sistema possui apenas uma nutricionista.

### RF04 – Exibir dias/horários disponíveis para consulta (lado paciente)
O sistema deve exibir para o paciente um calendário interativo onde:
- O paciente visualiza um calendário mensal com os dias disponíveis destacados
- Ao clicar em um dia, são exibidos os horários vagos daquele dia
- Dias sem horários disponíveis ficam desabilitados/esmaecidos
- A disponibilidade é configurada no sistema: **Segunda a Sexta-feira, das 9h às 16h, consultas de 2 horas cada** (9h-11h, 11h-13h, 13h-15h, 14h-16h)
- Horários já ocupados por consultas **aceitas** não são exibidos
- Horários com solicitações **pendentes do próprio paciente** não são exibidos
- Horários com solicitações **pendentes de outros pacientes** podem aparecer, mas serão bloqueados no envio
- Se o paciente cancelar uma solicitação **pendente**, o horário volta a aparecer
- Horários no passado (inclusive no dia atual) não são exibidos
- Fins de semana não são disponíveis

### RF05 – Solicitar consulta
O sistema deve permitir que o paciente selecione um dia e horário disponível e envie a solicitação de consulta.

### RF06 – Registrar solicitação de consulta
Ao solicitar uma consulta, o sistema deve registrar a solicitação com status inicial "pendente" (`pending`).
O sistema não deve permitir solicitação para um horário já pendente ou aceito, nem duplicar uma solicitação pendente do mesmo paciente no mesmo horário.

### RF07 – Listar solicitações pendentes para a nutricionista
O sistema deve permitir que a nutricionista visualize uma lista de todas as solicitações com status pendente, incluindo data, horário e identificação do paciente.

### RF08 – Aceitar ou recusar solicitação de consulta
A nutricionista deve poder aceitar ou recusar uma solicitação de consulta.  
Aceitar → muda status para "aceita" (`accepted`).  
Recusar → muda status para "recusada" (`rejected`).

### RF09 – Verificar as consultas aceitas
O sistema deve verificar se já existe outra consulta aceita no mesmo dia/horário para aquela nutricionista.

### RF10 – Impedir conflitos de horário
Ao aceitar uma consulta em uma data e horário, o sistema deve impedir novos registros na mesma data e horário, bloqueando conflitos.

### RF11 – Visualizar agenda da nutricionista (lado da nutricionista)
O sistema deve permitir que a nutricionista veja as consultas **aceitas** e **canceladas** em visão de lista ou calendário (por dia/semana), com indicação visual de status.

### RF12 – Visualizar solicitações pendentes da nutricionista (lado da nutricionista)
O sistema deve permitir que a nutricionista veja todas as consultas com status "pendente", em visão de lista (por dia/semana).

### RF13 – Visualizar solicitações canceladas da nutricionista (lado da nutricionista)
O sistema deve permitir que a nutricionista veja todas as consultas com status "cancelada" (`cancelled`), em visão de lista (por dia/semana).

### RF14 – Visualizar status das solicitações (lado paciente)
O paciente deve poder consultar as suas solicitações e ver o status de cada uma: pendente, aceita, recusada ou cancelada.

### RF15 – Criar evento no calendário do dispositivo (paciente)
Quando uma consulta for aceita, o app do paciente deve criar ou atualizar automaticamente um evento no calendário do dispositivo e armazenar o `calendarEventIdPatient`, desde que o app esteja em execução e a permissão de calendário tenha sido concedida.

### RF16 – Criar evento no calendário do dispositivo (nutricionista)
Quando a nutricionista aceitar uma consulta, o app dela também deve criar ou atualizar automaticamente um evento no calendário do dispositivo e armazenar o `calendarEventIdNutritionist`, desde que o app esteja em execução e a permissão de calendário tenha sido concedida.

### RF17 – Notificações push de atualização de consulta
O sistema deve enviar notificações push sempre que houver mudanças relevantes na consulta (solicitação, aceite, recusa, cancelamento, reativação), identificando o evento e o responsável quando aplicável (ex.: quem cancelou).

### RF18 – Notificar o paciente em caso de atualização de status
Quando a nutricionista aceitar, recusar, cancelar ou reativar uma consulta, o sistema deve avisar o paciente com notificação push.

### RF19 – Visualizar detalhes da consulta
O sistema deve permitir que a nutricionista e o paciente visualizem detalhes de uma consulta específica: data, horário e status.

### RF20 – Cancelar consulta (paciente ou nutricionista)
O sistema deve permitir que o paciente cancele uma consulta pendente ou aceita. A nutricionista pode cancelar apenas consultas já aceitas (solicitações pendentes devem ser recusadas).  
O cancelamento atualiza o status para "cancelada", remove o evento do calendário (quando existir) e notifica a outra parte.  
Se a consulta estava pendente e foi cancelada pelo paciente, o horário volta a ficar disponível para novas solicitações.

### RF21 – Reativar consulta cancelada (nutricionista)
O sistema deve permitir que a nutricionista aceite novamente uma consulta que foi cancelada (por ela ou pelo paciente), verificando conflitos de horário, atualizando o status para "aceita" (`accepted`) e notificando o paciente.

### RF22 – Resolver conflito de horário (nutricionista)
Quando houver conflito ao reativar/aceitar uma consulta, o sistema deve apresentar uma tela de resolução com as consultas aceitas/canceladas do mesmo horário para a nutricionista escolher qual permanecerá aceita. Ao confirmar, as demais consultas aceitas no horário passam a "cancelada" e o sistema retorna à agenda após o aviso de sucesso.

### RF23 – Recuperação de senha
O sistema deve permitir que o usuário solicite recuperação de senha por e-mail, enviando um link de redefinição via Firebase Authentication.
