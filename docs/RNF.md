## Requisitos Não Funcionais (RNF)

### RNF01 – Plataforma
O aplicativo deve ser desenvolvido em React Native com Expo, suportando Android e iOS.

### RNF02 – Backend
O backend deve ser implementado utilizando Firebase (Auth e Firestore). As notificações push são disparadas via Supabase Edge Functions utilizando Expo Push Tokens.

### RNF03 – Segurança de dados
Os acessos ao backend devem ser protegidos por regras de segurança do Firebase (segurança em nível de coleção e por usuário), garantindo que:  
- Um paciente só veja/edite suas próprias solicitações.  
- A nutricionista veja apenas suas consultas aceitas, pendentes e canceladas.

### RNF04 – Privacidade
Dados pessoais dos pacientes e da nutricionista devem ser armazenados minimamente e usados apenas para o funcionamento da agenda, em conformidade com boas práticas de privacidade.

### RNF05 – Desempenho / Responsividade
O app deve carregar listas de consultas e agenda em no máximo 3 segundos, sem travamentos perceptíveis para o usuário em cenários de uso normal (poucas dezenas/centenas de consultas).

### RNF06 – Usabilidade
As telas devem ser simples, com navegação clara e textos em linguagem acessível, considerando o uso diário por profissionais de saúde e pacientes em geral.

### RNF07 – Confiabilidade das notificações
As notificações push devem ser enviadas por um serviço remoto (Supabase Edge Functions) e recebidas no dispositivo mesmo com o app fechado. Lembretes de consulta são responsabilidade do calendário nativo (lembrete 24h antes).

### RNF08 – Integração com calendário e notificações
O aplicativo deve solicitar permissões de calendário e notificações de forma clara após o login e bloquear o uso do app enquanto as permissões não forem concedidas, orientando o usuário a abrir os ajustes do sistema.

### RNF09 – Build nativo obrigatório para push
O envio/recebimento de notificações push exige build nativo (development/release). Expo Go não é suficiente para push.

### RNF10 – Mantenabilidade
O código deve ser organizado em MVVM, facilitando manutenção e evolução futura.

### RNF11 – Disponibilidade
Como o app é de agenda, espera-se que o sistema backend (Firebase) esteja disponível 99,9% do tempo; em caso de falta de conexão, o app deve informar o usuário e oferecer tentativa de recarregar.

### RNF12 – Idioma e região
O app deve apresentar textos e datas em português (Brasil), adotando formatação local (pt-BR) e uso voltado ao público brasileiro.
