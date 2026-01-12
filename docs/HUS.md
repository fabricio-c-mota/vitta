## Histórias de Usuário - Sistema

---

### Perfil: Sistema

#### Story S01
Como sistema, devo evitar marcar duas consultas no mesmo horário para a nutricionista, para garantir que não haja conflitos de agenda.  
**UC Relacionados:** [UC06](./UC.md#uc06--aceitar-solicitação-de-consulta), [UC13](./UC.md#uc13--reativar-consulta-cancelada-nutricionista)

#### Story S02
Como sistema, devo atualizar o status das consultas em tempo real (via Firebase), para que pacientes e nutricionista vejam sempre informações atualizadas.  
**UC Relacionados:** [UC06](./UC.md#uc06--aceitar-solicitação-de-consulta), [UC07](./UC.md#uc07--recusar-solicitação-de-consulta), [UC12](./UC.md#uc12--cancelar-consulta), [UC13](./UC.md#uc13--reativar-consulta-cancelada-nutricionista)

#### Story S03
Como sistema, devo enviar notificações push sobre mudanças de status (solicitação, aceite, recusa, cancelamento, reativação), para garantir que os envolvidos sejam informados mesmo com o app fechado.  
**UC Relacionado:** [UC11](./UC.md#uc11--enviar-notificações-push-de-atualização)

#### Story S04
Como sistema, devo disponibilizar a tela de resolução de conflitos quando houver colisão de horários, para manter a integridade da agenda.  
**UC Relacionado:** [UC14](./UC.md#uc14--resolver-conflito-de-horário-nutricionista)
