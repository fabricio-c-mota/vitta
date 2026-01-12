## Casos de Uso

### UC01 – Registrar Paciente
***Ator:*** Paciente (não cadastrado)  
**Objetivo:** Permitir que novos pacientes criem uma conta no sistema.  
**Resumo do fluxo:** Paciente acessa tela de registro → informa nome, e-mail e senha → sistema valida dados → cria conta no Firebase Auth → cria documento do usuário no Firestore com role "patient" → redireciona para área do paciente.  
**Observação:** Apenas pacientes podem se auto-registrar. A nutricionista é pré-cadastrada pelo administrador. A recuperação de senha é feita por e-mail via Firebase Authentication.  

**RF Relacionados:** [RF02](./RF.md#rf02--registro-de-pacientes)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF04](./RNF.md#rnf04--privacidade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF10](./RNF.md#rnf10--mantenabilidade)
**Histórias Relacionadas:** [P01](./HUP.md#story-p01)

### UC02 – Autenticar Usuário
***Ator:*** Nutricionista, Paciente  
**Objetivo:** Permitir acesso ao app de forma segura.  
**Resumo do fluxo:** Usuário informa credenciais → sistema valida no Firebase → se ok, entra na área apropriada (nutri ou paciente).  

**RF Relacionados:** [RF01](./RF.md#rf01--autenticação-de-usuários), [RF03](./RF.md#rf03--diferenciar-perfis-nutricionista--paciente)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF06](./RNF.md#rnf06--usabilidade)

### UC03 – Visualizar Disponibilidade de Consultas (Paciente)
**Ator:** Paciente  
**Objetivo:** Ver dias e horários disponíveis para agendamento.  
**Resumo do fluxo:** Paciente abre tela de agenda → app consulta disponibilidade configurada no sistema (Segunda a Sexta, 9h às 16h, consultas de 2 horas) → filtra horários no passado, horários ocupados por consultas aceitas e horários com solicitação pendente do próprio paciente → exibe calendário/lista com slots livres. Solicitações pendentes de outros pacientes podem aparecer, mas serão bloqueadas no envio.  

**RF Relacionados:** [RF04](./RF.md#rf04--exibir-diashorários-disponíveis-para-consulta-lado-paciente)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [P02](./HUP.md#story-p02)

### UC04 – Solicitar Consulta
**Ator:** Paciente  
**Objetivo:** Enviar uma solicitação de consulta para a nutricionista.  
**Resumo do fluxo:** Paciente escolhe data/horário → confirma → sistema cria registro de consulta com status "pendente" no Firebase, armazenando data, horário e identificação do paciente. Se já houver solicitação pendente ou aceita para o mesmo horário, o sistema bloqueia e informa o conflito (incluindo duplicidade do próprio paciente).  

**RF Relacionados:** [RF05](./RF.md#rf05--solicitar-consulta), [RF06](./RF.md#rf06--registrar-solicitação-de-consulta)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [P03](./HUP.md#story-p03)

### UC05 – Listar Solicitações Pendentes (Nutricionista)
**Ator:** Nutricionista  
**Objetivo:** Visualizar todas as solicitações pendentes.  
**Resumo do fluxo:** Nutri abre tela "Solicitações" → app busca no Firebase todas as consultas da nutri com status "pendente" → exibe lista.  

**RF Relacionados:** [RF07](./RF.md#rf07--listar-solicitações-pendentes-para-a-nutricionista), [RF12](./RF.md#rf12--visualizar-solicitações-pendentes-da-nutricionista-lado-da-nutricionista)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [N01](./HUN.md#story-n01)

### UC06 – Aceitar Solicitação de Consulta
**Ator:** Nutricionista  
**Objetivo:** Confirmar uma consulta.  
**Resumo do fluxo:** Nutri abre detalhes de uma solicitação → clica em "Aceitar" → sistema verifica conflito de horário → se ok, muda status para "aceita", dispara notificações push e cria evento no calendário do dispositivo.  

**RF Relacionados:** [RF08](./RF.md#rf08--aceitar-ou-recusar-solicitação-de-consulta), [RF09](./RF.md#rf09--verificar-as-consultas-aceitas), [RF10](./RF.md#rf10--impedir-conflitos-de-horário), [RF19](./RF.md#rf19--visualizar-detalhes-da-consulta)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF07](./RNF.md#rnf07--confiabilidade-das-notificações), [RNF08](./RNF.md#rnf08--integração-com-calendário-e-notificações), [RNF10](./RNF.md#rnf10--mantenabilidade), [RNF11](./RNF.md#rnf11--disponibilidade)  
**Histórias Relacionadas:** [N02](./HUN.md#story-n02), [S01](./HUS.md#story-s01), [S02](./HUS.md#story-s02)

### UC07 – Recusar Solicitação de Consulta
**Ator:** Nutricionista  
**Objetivo:** Recusar uma consulta.  
**Resumo do fluxo:** Nutri abre detalhes → clica em "Recusar" → sistema atualiza status para "recusada" e avisa o paciente.  

**RF Relacionados:** [RF08](./RF.md#rf08--aceitar-ou-recusar-solicitação-de-consulta), [RF18](./RF.md#rf18--notificação-para-o-paciente-em-caso-de-atualização-de-status), [RF19](./RF.md#rf19--visualizar-detalhes-da-consulta)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF06](./RNF.md#rnf06--usabilidade), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [N03](./HUN.md#story-n03), [S02](./HUS.md#story-s02)

### UC08 – Visualizar Agenda Confirmada da Nutricionista
**Ator:** Nutricionista  
**Objetivo:** Ver todas as consultas aceitas e canceladas.  
**Resumo do fluxo:** Nutri abre tela "Minha agenda" → app lista consultas com status "aceita" e "cancelada", organizadas por data/horário, com indicação visual do status.  

**RF Relacionados:** [RF11](./RF.md#rf11--visualizar-agenda-confirmada-da-nutricionista-lado-da-nutricionista)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [N04](./HUN.md#story-n04)

### UC09 – Visualizar Minhas Consultas (Paciente)
**Ator:** Paciente  
**Objetivo:** Acompanhar suas consultas e seus status.  
**Resumo do fluxo:** Paciente abre tela "Minhas consultas" → app lista todas as consultas do paciente, status e detalhes.  

**RF Relacionados:** [RF14](./RF.md#rf14--visualizar-status-das-solicitações-lado-paciente), [RF19](./RF.md#rf19--visualizar-detalhes-da-consulta)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [P04](./HUP.md#story-p04), [P05](./HUP.md#story-p05)

### UC10 – Sincronizar com Calendário do Dispositivo
**Ator:** Sistema  
**Objetivo:** Manter o calendário do dispositivo sincronizado com as consultas aceitas.  
**Resumo do fluxo:** Quando uma consulta for aceita, o sistema adiciona/atualiza um evento no calendário do dispositivo com lembrete de 24h antes. Quando a consulta for cancelada ou recusada, o evento é removido automaticamente do calendário.  
**Observação:** A sincronização ocorre quando o app está em execução e a permissão foi concedida. Caso a permissão seja negada, o usuário é direcionado para a tela de permissões e o fluxo fica bloqueado até liberar.  

**RF Relacionados:** [RF15](./RF.md#rf15--criar-evento-no-calendário-do-dispositivo-paciente), [RF16](./RF.md#rf16--criar-evento-no-calendário-do-dispositivo-nutricionista)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF08](./RNF.md#rnf08--integração-com-calendário-e-notificações), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [P06](./HUP.md#story-p06), [N05](./HUN.md#story-n05)

### UC11 – Enviar Notificações Push de Atualização
**Ator:** Sistema  
**Objetivo:** Notificar paciente e nutricionista sobre mudanças de estado.  
**Resumo do fluxo:** Ao ocorrer solicitação, aceite, recusa, cancelamento ou reativação, o sistema envia notificações push aos envolvidos (via Supabase Edge Function e Expo Notifications), incluindo quem executou a ação quando aplicável (ex.: “Consulta cancelada pela nutricionista”).  

**RF Relacionados:** [RF17](./RF.md#rf17--notificações-push-de-atualização-de-consulta), [RF18](./RF.md#rf18--notificar-o-paciente-em-caso-de-atualização-de-status)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF07](./RNF.md#rnf07--confiabilidade-das-notificações), [RNF09](./RNF.md#rnf09--build-nativo-obrigatório-para-push), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [P07](./HUP.md#story-p07), [N08](./HUN.md#story-n08), [S03](./HUS.md#story-s03)

### UC12 – Cancelar Consulta
**Ator:** Paciente ou Nutricionista  
**Objetivo:** Cancelar uma consulta previamente aceita (ou pendente, no caso do paciente).  
**Resumo do fluxo:** Paciente pode cancelar consulta pendente ou aceita; nutricionista cancela apenas consultas aceitas (solicitações pendentes devem ser recusadas). Ao cancelar, o sistema atualiza o status para "cancelada", remove evento do calendário (se existir) e notifica a outra parte.  

**RF Relacionados:** [RF20](./RF.md#rf20--cancelar-consulta-paciente-ou-nutricionista)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF08](./RNF.md#rnf08--integração-com-calendário-e-notificações), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [P08](./HUP.md#story-p08), [N06](./HUN.md#story-n06), [S02](./HUS.md#story-s02)

### UC13 – Reativar Consulta Cancelada (Nutricionista)
**Ator:** Nutricionista  
**Objetivo:** Permitir que a nutricionista aceite novamente uma consulta que estava cancelada.  
**Resumo do fluxo:** Nutri abre detalhes de uma consulta cancelada → clica em "Aceitar Novamente" → sistema verifica conflito de horário → se ok, atualiza o status para "aceita", dispara notificações e cria evento no calendário.  

**RF Relacionados:** [RF21](./RF.md#rf21--reativar-consulta-cancelada-nutricionista), [RF09](./RF.md#rf09--verificar-as-consultas-aceitas), [RF10](./RF.md#rf10--impedir-conflitos-de-horário)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF07](./RNF.md#rnf07--confiabilidade-das-notificações), [RNF08](./RNF.md#rnf08--integração-com-calendário-e-notificações), [RNF10](./RNF.md#rnf10--mantenabilidade), [RNF11](./RNF.md#rnf11--disponibilidade)  
**Histórias Relacionadas:** [N07](./HUN.md#story-n07), [S01](./HUS.md#story-s01), [S02](./HUS.md#story-s02)

### UC14 – Resolver Conflito de Horário (Nutricionista)
**Ator:** Nutricionista  
**Objetivo:** Resolver conflitos ao reativar ou aceitar uma consulta que colide com outra aceita.  
**Resumo do fluxo:** Ao detectar conflito, o sistema exibe tela com consultas aceitas/canceladas do mesmo horário → nutricionista escolhe qual permanecerá aceita → sistema marca a escolhida como "aceita" e cancela as demais aceitas no horário → exibe mensagem de sucesso e retorna à agenda ao confirmar. 

**RF Relacionados:** [RF22](./RF.md#rf22--resolver-conflito-de-horário-nutricionista), [RF10](./RF.md#rf10--impedir-conflitos-de-horário)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF10](./RNF.md#rnf10--mantenabilidade)  
**Histórias Relacionadas:** [N09](./HUN.md#story-n09), [S04](./HUS.md#story-s04)

### UC15 – Recuperar Senha
**Ator:** Paciente ou Nutricionista  
**Objetivo:** Permitir redefinição de senha via e-mail.  
**Resumo do fluxo:** Usuário acessa "Esqueceu sua senha?" → informa e-mail → sistema aciona o Firebase para enviar o link de redefinição → usuário finaliza o processo no e-mail.  

**RF Relacionados:** [RF23](./RF.md#rf23--recuperação-de-senha)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF06](./RNF.md#rnf06--usabilidade)  
**Histórias Relacionadas:** [P09](./HUP.md#story-p09), [N10](./HUN.md#story-n10)
