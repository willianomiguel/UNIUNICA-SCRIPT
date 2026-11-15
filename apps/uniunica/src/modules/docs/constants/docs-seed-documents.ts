import { type DocumentoSeed } from 'src/modules/docs/types/documento-seed';

const BEM_VINDO = `Este é o ponto de partida da gestão da UniÚnica dentro do Twenty. Cada item do menu lateral é um módulo; abaixo está o que cada um faz e quando usar.

## Projetos
Roadmap da empresa. Cada **projeto** tem status, responsável, prazos, ideias, tarefas, sprints e documentos ligados. Use para planejar o que vamos construir e acompanhar o andamento.

## Ideias
Caixa de entrada de ideias (produto, marketing, processos). Vote, priorize e, quando fizer sentido, ligue a ideia a um projeto.

## Sprints
Ciclos curtos de trabalho (1–2 semanas). Cada sprint agrupa **tarefas** com data de início e fim. Use o quadro para ver o que está a fazer, em andamento e concluído.

## Vendas
Todas as vendas e eventos de pagamento recebidos dos checkouts/gateways (aprovadas, pendentes, recusadas, reembolsos e chargebacks). É a base dos números de faturamento.

## Financeiro
Lançamentos de contas a pagar e a receber, com categorias financeiras, vencimentos e status (pago, pendente, atrasado). Mostra o fluxo de caixa.

## Metas
Metas e submetas (OKRs) com valor alvo, valor atual e status (no prazo, em risco, atrasada, concluída).

## Tráfego
Campanhas de mídia paga e métricas diárias (gasto, cliques, conversões). Cruza com as vendas para calcular CAC e ROAS.

## Wiki (Docs)
Esta wiki. Documentos em árvore (um documento pode ter subdocumentos), com categorias, status e fixados no topo. Use o botão **Editar** para abrir o registro e escrever no editor. Comece pelos modelos: planejamento trimestral, ata de reunião, processo de deploy e guia de marca.

## Avisos (Alertas)
Regras que vigiam os números e mandam mensagem no **Slack, Discord, WhatsApp ou webhook** quando algo sai do normal — por exemplo, taxa de chargeback acima de 1% ou faturamento do dia abaixo da meta. Cadastre o destino, ative a regra e use **Testar alerta** para conferir.

---

> Dúvidas ou sugestões? Crie um documento na categoria **Processo** ou registre uma ideia.`;

const PLANEJAMENTO = `> Modelo — duplique este documento para cada trimestre (ex.: "Planejamento 2027-T1").

## 1. Contexto
- Onde estamos: faturamento do trimestre anterior, base de clientes, principais aprendizados.
- O que mudou no mercado / na concorrência.

## 2. Retrospectiva do trimestre anterior
- Funcionou:
- Não funcionou:
- Vamos mudar:

## 3. Objetivos do trimestre (no máximo 3)
1. Objetivo:
2. Objetivo:
3. Objetivo:

## 4. Metas e indicadores
Para cada objetivo, cadastre as metas no módulo **Metas** e cole os links aqui.
- [ ] Meta de faturamento:
- [ ] Meta de margem / CAC:
- [ ] Meta de produto / entrega:

## 5. Iniciativas e projetos
- Projeto: — responsável: — prazo:
- Projeto: — responsável: — prazo:

## 6. Orçamento
- Mídia paga:
- Ferramentas:
- Pessoas / freelas:

## 7. Riscos e dependências
- Risco: — plano de mitigação:

## 8. Rituais de acompanhamento
- Revisão semanal das metas (segunda-feira).
- Revisão mensal do planejamento.
- Retrospectiva no fim do trimestre.`;

const ATA = `> Modelo — duplique para cada reunião e renomeie como "Ata AAAA-MM-DD — Assunto".

**Data:** DD/MM/AAAA
**Horário:** HH:MM – HH:MM
**Participantes:**
**Facilitador(a):**

## Pauta
1. Item da pauta
2. Item da pauta

## Discussão
- Ponto discutido e contexto.

## Decisões
- Decisão tomada e motivo.

## Próximos passos
- [ ] Ação — responsável — prazo
- [ ] Ação — responsável — prazo

## Pendências para a próxima reunião
- `;

const DEPLOY = `Processo padrão para colocar uma nova versão em produção com segurança.

## Antes do deploy
- [ ] PR revisado e aprovado por pelo menos 1 pessoa
- [ ] Testes automatizados passando no CI
- [ ] Variáveis de ambiente novas cadastradas em produção
- [ ] Migrações de banco revisadas (e reversíveis quando possível)
- [ ] Deploy comunicado no canal do time (horário e escopo)

## Deploy
1. Faça merge na branch principal.
2. Acompanhe o pipeline até o fim.
3. Rode as migrações, se houver.
4. Confira os logs nos primeiros 10 minutos.

\`\`\`
git checkout main
git pull
yarn build && yarn test
\`\`\`

## Verificação pós-deploy
- [ ] Fluxo de checkout funcionando (compra de teste)
- [ ] Páginas principais carregando
- [ ] Sem aumento de erros no monitoramento
- [ ] Alertas do módulo Avisos sem disparos anormais

## Rollback
Se algo crítico quebrar: reverta o merge, faça novo deploy da versão anterior e avise o time. Registre o incidente em um documento da categoria **Técnico**.`;

const GUIA_MARCA = `Referência rápida de como a UniÚnica fala e aparece.

## Essência
- **Missão:**
- **Promessa:**
- **Público:**

## Tom de voz
- Próximo e direto, sem jargão.
- Confiante, sem exagero: prometa só o que entregamos.
- Use "você"; evite gírias que envelhecem rápido.

## Logo
- Use sempre o arquivo oficial (não distorça, não mude as cores).
- Respeite a área de respiro mínima ao redor do logo.

## Cores
- Primária: #______
- Secundária: #______
- Apoio / fundo: #______

## Tipografia
- Títulos:
- Textos:

## Do e Don't
- Faça: fotos reais, frases curtas, chamada para ação clara.
- Não faça: textos em caixa alta inteira, promessas de resultado garantido.

## Arquivos
Cole aqui os links da pasta com logos, templates e fotos.`;

// Documentos iniciais da wiki; o seed procura pelo título antes de criar.
export const DOCS_SEED_DOCUMENTS: DocumentoSeed[] = [
  { titulo: 'Bem-vindo à UniÚnica', categoria: 'OUTRO', status: 'PUBLICADO', fixado: true, ordem: 0, markdown: BEM_VINDO },
  { titulo: 'Planejamento estratégico trimestral', categoria: 'ESTRATEGIA', status: 'PUBLICADO', fixado: false, ordem: 10, markdown: PLANEJAMENTO },
  { titulo: 'Ata de reunião (modelo)', categoria: 'ATA_REUNIAO', status: 'PUBLICADO', fixado: false, ordem: 10, markdown: ATA },
  { titulo: 'Processo de deploy', categoria: 'TECNICO', status: 'PUBLICADO', fixado: false, ordem: 10, markdown: DEPLOY },
  { titulo: 'Guia de marca', categoria: 'MARKETING', status: 'PUBLICADO', fixado: false, ordem: 10, markdown: GUIA_MARCA },
];
