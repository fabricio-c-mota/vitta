<!--
Objetivo: Documentar os casos de uso do sistema de agendamento.
Escopo: Fluxos principais de interação entre usuários e sistema.
-->

## Casos de Uso

**UC01 – Registrar Paciente**  
*Ator principal:* Paciente (não cadastrado)  
*Objetivo:* Permitir que novos pacientes criem uma conta no sistema.  
*Resumo do fluxo:* Paciente acessa tela de registro → informa nome, e-mail e senha → sistema valida dados → cria conta no Firebase Auth → cria documento do usuário no Firestore com role "patient" → redireciona para área do paciente.  
*Observação:* Apenas pacientes podem se auto-registrar. A nutricionista é pré-cadastrada pelo administrador. Não há funcionalidade de edição de perfil ou recuperação de senha no app (gerenciadas manualmente no Firebase).  
**RF Relacionados:** [RF02](./RF.md#rf02--registro-de-pacientes)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF04](./RNF.md#rnf04--privacidade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF09](./RNF.md#rnf09--mantenabilidade) <br>
**Histórias Relacionadas:** [P01](./HUP.md#story-p01)

**UC02 – Autenticar Usuário**  
*Ator principal:* Nutricionista, Paciente  
*Objetivo:* Permitir acesso ao app de forma segura.  
*Resumo do fluxo:* Usuário informa credenciais → sistema valida no Firebase → se ok, entra na área apropriada (nutri ou paciente).  
**RF Relacionados:** [RF01](./RF.md#rf01--autenticação-de-usuários), [RF03](./RF.md#rf03--diferenciar-perfis-nutricionista--paciente)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF06](./RNF.md#rnf06--usabilidade)

**UC03 – Visualizar Disponibilidade de Consultas (Paciente)**  
*Ator:* Paciente  
*Objetivo:* Ver dias e horários disponíveis para agendamento.  
*Resumo:* Paciente abre tela de agenda → app consulta disponibilidade configurada no sistema (Segunda a Sexta, 9h às 16h, consultas de 2 horas) → filtra horários já ocupados por consultas aceitas → exibe calendário/lista com slots livres.  
**RF Relacionados:** [RF04](./RF.md#rf04--exibir-diashorários-disponíveis-para-consulta-lado-paciente)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [P02](./HUP.md#story-p02)

**UC04 – Solicitar Consulta**  
*Ator:* Paciente  
*Objetivo:* Enviar uma solicitação de consulta para a nutricionista.  
*Resumo:* Paciente escolhe data/horário → opcionalmente adiciona observações → confirma → sistema cria registro de consulta com status "pendente" no Firebase, armazenando data, horário, observações e identificação do paciente.  
**RF Relacionados:** [RF05](./RF.md#rf05--solicitar-consulta), [RF06](./RF.md#rf06--registrar-solicitação-de-consulta)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [P03](./HUP.md#story-p03)

**UC05 – Listar Solicitações Pendentes (Nutricionista)**  
*Ator:* Nutricionista  
*Objetivo:* Visualizar todas as solicitações pendentes.  
*Resumo:* Nutri abre tela "Solicitações" → app busca no Firebase todas as consultas da nutri com status "pendente" → exibe lista.  
**RF Relacionados:** [RF07](./RF.md#rf07--listar-solicitações-pendentes-para-a-nutricionista), [RF12](./RF.md#rf12--visualizar-solicitações-pendentes-da-nutricionista-lado-da-nutricionista)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [N01](./HUN.md#story-n01)

**UC06 – Aceitar Solicitação de Consulta**  
*Ator:* Nutricionista  
*Objetivo:* Confirmar uma consulta.  
*Resumo:* Nutri abre detalhes de uma solicitação → clica em "Aceitar" → sistema verifica conflito de horário → se ok, muda status para "aceita", dispara notificações necessárias e permite criação de evento no calendário.  
**RF Relacionados:** [RF08](./RF.md#rf08--aceitar-ou-recusar-solicitação-de-consulta), [RF09](./RF.md#rf09--verificar-as-consultas-aceitas), [RF10](./RF.md#rf10--impedir-conflitos-de-horário), [RF19](./RF.md#rf19--visualizar-detalhes-da-consulta)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF08](./RNF.md#rnf08--integração-com-calendário), [RNF09](./RNF.md#rnf09--mantenabilidade), [RNF10](./RNF.md#rnf10--disponibilidade)  
**Histórias Relacionadas:** [N02](./HUN.md#story-n02), [S01](./HUS.md#story-s01), [S02](./HUS.md#story-s02)

**UC07 – Recusar Solicitação de Consulta**  
*Ator:* Nutricionista  
*Objetivo:* Recusar uma consulta.  
*Resumo:* Nutri abre detalhes → clica em "Recusar" → sistema atualiza status para "recusada" e avisa o paciente.  
**RF Relacionados:** [RF08](./RF.md#rf08--aceitar-ou-recusar-solicitação-de-consulta), [RF18](./RF.md#rf18--notificação-para-o-paciente-em-caso-de-atualização-de-status), [RF19](./RF.md#rf19--visualizar-detalhes-da-consulta)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF06](./RNF.md#rnf06--usabilidade), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [N03](./HUN.md#story-n03), [S02](./HUS.md#story-s02)

**UC08 – Visualizar Agenda Confirmada da Nutricionista**  
*Ator:* Nutricionista  
*Objetivo:* Ver todas as consultas aceitas.  
*Resumo:* Nutri abre tela "Minha agenda" → app lista consultas com status "aceita", organizadas por data/horário.  
**RF Relacionados:** [RF11](./RF.md#rf11--visualizar-agenda-confirmada-da-nutricionista-lado-da-nutricionista)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [N04](./HUN.md#story-n04)

**UC09 – Visualizar Minhas Consultas (Paciente)**  
*Ator:* Paciente  
*Objetivo:* Acompanhar suas consultas e seus status.  
*Resumo:* Paciente abre tela "Minhas consultas" → app lista todas as consultas do paciente, status e detalhes.  
**RF Relacionados:** [RF14](./RF.md#rf14--visualizar-status-das-solicitações-lado-paciente), [RF19](./RF.md#rf19--visualizar-detalhes-da-consulta)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF06](./RNF.md#rnf06--usabilidade), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [P04](./HUP.md#story-p04), [P05](./HUP.md#story-p05)

**UC10 – Sincronizar com Calendário do Dispositivo**  
*Ator:* Sistema  
*Objetivo:* Manter o calendário do dispositivo sincronizado com as consultas aceitas.  
*Resumo:* Quando uma consulta for aceita, o sistema adiciona automaticamente um evento ao calendário do dispositivo com lembretes de 1h e 24h antes. Quando a consulta for cancelada ou recusada, o evento é removido automaticamente do calendário.  
*Observação:* A sincronização é automática e não requer ação do usuário. Caso a permissão de calendário seja negada, o app continua funcionando normalmente.  
**RF Relacionados:** [RF15](./RF.md#rf15--criar-evento-no-calendário-do-dispositivo-paciente), [RF16](./RF.md#rf16--criar-evento-no-calendário-do-dispositivo-nutricionista)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF08](./RNF.md#rnf08--integração-com-calendário), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [P06](./HUP.md#story-p06), [N05](./HUN.md#story-n05)

**UC11 – Agendar Notificações de Lembrete**  
*Ator:* Sistema  
*Objetivo:* Notificar o paciente próximo à data da consulta.  
*Resumo:* Ao ter uma consulta "aceita", app agenda notificações locais para horários pré-definidos (24h e 1h antes).  
**RF Relacionados:** [RF17](./RF.md#rf17--agendar-notificações-de-lembrete-lado-paciente), [S03](./HUS.md#story-s03)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF07](./RNF.md#rnf07--confiabilidade-das-notificações), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [P07](./HUP.md#story-p07)

**UC12 – Cancelar Consulta**  
*Ator:* Paciente ou Nutricionista  
*Objetivo:* Cancelar uma consulta previamente aceita.  
*Resumo:* Usuário abre detalhes da consulta aceita → clica em "Cancelar" → sistema atualiza status para "cancelled", remove evento do calendário, cancela notificações agendadas e notifica a outra parte.  
**RF Relacionados:** [RF20](./RF.md#rf20--cancelar-consulta-paciente-ou-nutricionista)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF08](./RNF.md#rnf08--integração-com-calendário), [RNF09](./RNF.md#rnf09--mantenabilidade)  
**Histórias Relacionadas:** [P08](./HUP.md#story-p08), [N06](./HUN.md#story-n06), [S02](./HUS.md#story-s02)

**UC13 – Reativar Consulta Cancelada (Nutricionista)**  
*Ator:* Nutricionista  
*Objetivo:* Permitir que a nutricionista aceite novamente uma consulta que estava cancelada.  
*Resumo:* Nutri abre detalhes de uma consulta cancelada → clica em "Aceitar Novamente" → sistema verifica conflito de horário → se ok, atualiza o status para "accepted", dispara notificações, agenda lembretes e permite criação do evento no calendário.  
**RF Relacionados:** [RF21](./RF.md#rf21--reativar-consulta-cancelada-nutricionista), [RF09](./RF.md#rf09--verificar-as-consultas-aceitas), [RF10](./RF.md#rf10--impedir-conflitos-de-horário)  
**RNF Relacionados:** [RNF01](./RNF.md#rnf01--plataforma), [RNF02](./RNF.md#rnf02--backend), [RNF03](./RNF.md#rnf03--segurança-de-dados), [RNF05](./RNF.md#rnf05--desempenho--responsividade), [RNF08](./RNF.md#rnf08--integração-com-calendário), [RNF09](./RNF.md#rnf09--mantenabilidade), [RNF10](./RNF.md#rnf10--disponibilidade)  
**Histórias Relacionadas:** [N07](./HUN.md#story-n07), [S01](./HUS.md#story-s01), [S02](./HUS.md#story-s02)
