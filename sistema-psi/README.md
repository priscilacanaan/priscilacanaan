# Consultório — central de pessoas e agenda (protótipo)

Abra `index.html` no navegador. Os dados ficam salvos só neste navegador (localStorage).

- **Agenda:** visão do dia com horários de 30 em 30 min (08:00–20:00), faixa da semana e contagem de sessões. Clique em "+ sessão neste horário" ou em uma sessão para editar.
- **Pessoas:** central com busca, ficha de cada pessoa e histórico de sessões com status (Agendada, Realizada, Faltou, Cancelada).
- Não permite duas sessões no mesmo horário.
- "Carregar exemplos" cria pessoas e sessões fictícias para testar.

## Antes de usar com pacientes de verdade
- Hoje os dados ficam no navegador: não há backup, login nem criptografia. Para dados de saúde, é preciso um sistema com login, banco de dados protegido e registros de acesso.
- Dados de saúde são sensíveis pela LGPD: o sistema precisa de termo de consentimento, política de privacidade e controle de quem acessa.
- Prontuário e laudos têm regras do Conselho Federal de Psicologia (sigilo, guarda e prazos). Confirmar antes de usar.
