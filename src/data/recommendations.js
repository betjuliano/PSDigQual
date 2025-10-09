// Recomendações específicas para cada questão do PSDigQual

export const DETAILED_RECOMMENDATIONS = {
  // QI - Qualidade da Informação
  QI1: {
    code: "QI1",
    dimension: "Qualidade da Informação",
    title: "As informações são fáceis de entender",
    strategicRecommendation: "Criar glossário interativo e melhorar linguagem, desenvolvendo glossário de termos técnicos, simplificando textos e adicionando explicações contextuais.",
    detailedDescription: "Desenvolver glossário de termos técnicos com explicações contextuais (tooltips), revisar textos existentes e publicar um Guia de Linguagem Simples. Implementar verificação de legibilidade contínua para garantir consistência da comunicação.",
    strategicActions: [
      "Usar linguagem simples e clara",
      "Evitar jargões técnicos",
      "Implementar glossário de termos",
      "Adicionar exemplos práticos"
    ],
    immediateActions: [
      "Revisar todos os textos do sistema",
      "Implementar teste de legibilidade",
      "Criar guia de linguagem simples"
    ],
    impact: "Alto",
    impactDescription: "Clareza da informação é essencial para compreensão",
    responsible: "Conteúdo / UX",
    kpi: "Índice de legibilidade ≥ meta; satisfação \"clareza\" ≥ 80%"
  },

  QI2: {
    code: "QI2",
    dimension: "Qualidade da Informação",
    title: "As informações são precisas",
    strategicRecommendation: "Implementar conciliação automatizada de dados, com processos de validação e auditoria contínuos para garantir uma única fonte confiável de verdade (SSoT).",
    detailedDescription: "Estabelecer regras automáticas de validação e reconciliação; implantar painéis de qualidade e alertas de inconsistência; definir processos formais de correção e auditoria contínua.",
    strategicActions: [
      "Implementar processo de validação de dados",
      "Criar sistema de atualização automática",
      "Estabelecer fonte única da verdade",
      "Implementar controle de qualidade"
    ],
    immediateActions: [
      "Auditar precisão dos dados atuais",
      "Criar processo de verificação",
      "Implementar alertas de inconsistência"
    ],
    impact: "Crítico",
    impactDescription: "Dados imprecisos comprometem a confiança no sistema",
    responsible: "Engenharia de Dados / DevOps",
    kpi: "Acurácia ≥ 99%; inconsistências < 1/1.000 registros"
  },

  QI7: {
    code: "QI7",
    dimension: "Qualidade da Informação",
    title: "As informações disponibilizadas estão atualizadas",
    strategicRecommendation: "Automatizar publicação e atualização de dados, implementando rotinas agendadas e alertas para garantir a atualização constante das informações.",
    detailedDescription: "Implementar pipelines de atualização (ETL/ELT), definir SLAs de atualização e criar alertas quando o prazo de publicação for violado.",
    strategicActions: [
      "Implementar pipelines de atualização",
      "Definir SLAs de atualização",
      "Criar alertas de desatualização",
      "Automatizar processo de publicação"
    ],
    immediateActions: [
      "Mapear datasets críticos e definir SLAs",
      "Configurar alertas de frescor",
      "Adicionar indicadores de atualização"
    ],
    impact: "Alto",
    impactDescription: "Garantir atualidade evita decisões baseadas em dados obsoletos",
    responsible: "Dados / DevOps",
    kpi: "% datasets dentro do SLA ≥ 95%"
  },

  // QO - Qualidade da Operação
  QO4: {
    code: "QO4",
    dimension: "Qualidade da Operação",
    title: "Consigo obter o que preciso no menor tempo possível",
    strategicRecommendation: "Criar dashboard de acesso rápido e otimizar performance, com personalização de acesso, busca inteligente e atalhos para as informações mais usadas.",
    detailedDescription: "Desenvolver dashboards personalizados por perfil, reduzir latência (P95), e implementar cache e atalhos para tarefas mais frequentes.",
    strategicActions: [
      "Implementar busca inteligente",
      "Criar atalhos personalizados",
      "Otimizar tempo de resposta",
      "Implementar cache de resultados"
    ],
    immediateActions: [
      "Mapear as 10 jornadas mais frequentes",
      "Prototipar dashboard de acesso rápido",
      "Ativar cache básico e medir tempo até resultado"
    ],
    impact: "Alto",
    impactDescription: "Rapidez na obtenção de resultados aumenta produtividade e satisfação",
    responsible: "Produto / Engenharia / UX",
    kpi: "Tempo até resultado (P95) < meta; taxa de sucesso sem ajuda > 90%"
  },

  // QS - Qualidade do Sistema
  QS1: {
    code: "QS1",
    dimension: "Qualidade do Sistema",
    title: "O sistema funciona sem falhas",
    strategicRecommendation: "Implementar monitoramento contínuo e testes automatizados, estabelecendo alertas, planos de contingência e processos de correção rápida de falhas.",
    detailedDescription: "Implantar monitoramento em tempo real (APM), definir SLO/SLA e error budget; criar runbooks de incidentes e ampliar cobertura de testes (unitários e E2E).",
    strategicActions: [
      "Implementar monitoramento contínuo de performance",
      "Realizar testes de carga regulares",
      "Estabelecer planos de contingência para falhas",
      "Criar sistema de alertas automáticos"
    ],
    immediateActions: [
      "Habilitar APM e alertas automáticos",
      "Cobrir fluxos críticos com testes automatizados",
      "Criar runbooks mínimos e revisar logs de erro"
    ],
    impact: "Alto",
    impactDescription: "Falhas impactam diretamente a confiança e o serviço",
    responsible: "Engenharia / DevOps",
    kpi: "Disponibilidade ≥ 99,9%; MTTR ↘ contínua"
  },

  QS3: {
    code: "QS3",
    dimension: "Qualidade do Sistema",
    title: "O sistema é fácil de usar",
    strategicRecommendation: "Realizar testes de usabilidade e melhorar interface, simplificando fluxos, reduzindo cliques e aplicando design centrado no usuário.",
    detailedDescription: "Aplicar testes com usuários reais, reduzir número de cliques e complexidade visual; introduzir tutoriais interativos e padronizar elementos via Design System.",
    strategicActions: [
      "Simplificar interface do usuário",
      "Implementar design intuitivo",
      "Reduzir número de cliques necessários",
      "Adicionar tutoriais interativos"
    ],
    immediateActions: [
      "Conduzir 3–5 testes rápidos de usabilidade",
      "Corrigir barreiras evidentes e reduzir etapas",
      "Inserir feedbacks visuais e micro-interações"
    ],
    impact: "Muito Alto",
    impactDescription: "Usabilidade afeta adoção e percepção geral de valor",
    responsible: "UX / Produto / Engenharia",
    kpi: "SUS ≥ 80; taxa de conclusão ↗ contínua"
  },

  QS8: {
    code: "QS8",
    dimension: "Qualidade do Sistema",
    title: "É fácil localizar serviços e informações",
    strategicRecommendation: "Implementar busca inteligente e reorganizar menu, aprimorando categorização, aplicando filtros e melhorando a arquitetura da informação.",
    detailedDescription: "Reestruturar taxonomia e categorização; melhorar ranking de resultados; adicionar autocomplete e filtros inteligentes; atualizar mapa do site.",
    strategicActions: [
      "Melhorar sistema de busca",
      "Reorganizar menu de navegação",
      "Implementar filtros inteligentes",
      "Adicionar mapa do site"
    ],
    immediateActions: [
      "Definir taxonomia e reorganizar menu",
      "Ativar autocomplete e reduzir \"zero results\"",
      "Realizar card sorting com usuários"
    ],
    impact: "Alto",
    impactDescription: "Facilita acesso a serviços e reduz tempo de busca",
    responsible: "Produto / UX / Engenharia",
    kpi: "Sucesso na 1ª busca ≥ 85%; \"zero results\" ↘ contínua"
  },

  QS9: {
    code: "QS9",
    dimension: "Qualidade do Sistema",
    title: "A navegação pelo sistema é intuitiva",
    strategicRecommendation: "Melhorar arquitetura da informação e fluxos de navegação, com redesenho dos caminhos principais, breadcrumbs e mapa do site claro.",
    detailedDescription: "Simplificar fluxos prioritários; implementar breadcrumbs; padronizar elementos de interface e criar guia de navegação.",
    strategicActions: [
      "Simplificar estrutura de navegação",
      "Implementar breadcrumbs",
      "Padronizar elementos de interface",
      "Adicionar indicadores de progresso"
    ],
    immediateActions: [
      "Realizar card sorting e tree testing",
      "Criar sitemap inicial e padrões de navegação",
      "Implementar breadcrumbs nas jornadas principais"
    ],
    impact: "Alto",
    impactDescription: "Navegação intuitiva reduz tempo de aprendizado",
    responsible: "UX / Produto",
    kpi: "Tempo de navegação ↘ contínua; satisfação \"navegação\" ↗ contínua"
  },

  // Questões sem recomendações personalizadas usarão fallback genérico
  QI3: {
    code: "QI3",
    dimension: "Qualidade da Informação",
    title: "As informações auxiliam na solicitação dos serviços",
    strategicRecommendation: "Contextualizar informações por serviço e implementar ajuda contextual.",
    strategicActions: [
      "Contextualizar informações por serviço",
      "Adicionar exemplos de preenchimento",
      "Implementar ajuda contextual",
      "Criar pré-visualização de resultados"
    ],
    immediateActions: [
      "Mapear jornada do usuário por serviço",
      "Implementar ajuda inline",
      "Criar simuladores de serviços"
    ],
    impact: "Alto",
    impactDescription: "Informações contextuais reduzem erros"
  },

  QI4: {
    code: "QI4",
    dimension: "Qualidade da Informação",
    title: "Todas as informações necessárias são fornecidas",
    strategicRecommendation: "Mapear e fornecer todas as informações necessárias com validação em tempo real.",
    strategicActions: [
      "Mapear todas as informações necessárias",
      "Implementar checklist de requisitos",
      "Adicionar validação em tempo real",
      "Criar resumo de informações necessárias"
    ],
    immediateActions: [
      "Auditar completude das informações",
      "Implementar validação progressiva",
      "Criar guias de requisitos"
    ],
    impact: "Alto",
    impactDescription: "Informações incompletas geram retrabalho"
  },

  QO1: {
    code: "QO1",
    dimension: "Qualidade da Operação",
    title: "Os serviços oferecem suporte técnico eficiente",
    strategicRecommendation: "Implementar chat de suporte em tempo real e treinar equipe.",
    strategicActions: [
      "Implementar chat de suporte em tempo real",
      "Criar base de conhecimento abrangente",
      "Estabelecer SLA de atendimento",
      "Treinar equipe de suporte"
    ],
    immediateActions: [
      "Mapear principais dúvidas dos usuários",
      "Implementar sistema de tickets",
      "Criar métricas de satisfação do suporte"
    ],
    impact: "Alto",
    impactDescription: "Suporte eficiente reduz frustração do usuário"
  },

  QO2: {
    code: "QO2",
    dimension: "Qualidade da Operação",
    title: "O atendimento resolve meus problemas",
    strategicRecommendation: "Estabelecer processo de resolução efetiva com escalação automática.",
    strategicActions: [
      "Implementar escalação automática",
      "Criar processo de follow-up",
      "Estabelecer métricas de resolução",
      "Treinar equipe em resolução de problemas"
    ],
    immediateActions: [
      "Analisar taxa de resolução atual",
      "Implementar feedback pós-atendimento",
      "Criar processo de melhoria contínua"
    ],
    impact: "Crítico",
    impactDescription: "Resolução efetiva é essencial para confiança"
  },

  QO3: {
    code: "QO3",
    dimension: "Qualidade da Operação",
    title: "Os serviços permitem conclusão no menor tempo possível",
    strategicRecommendation: "Otimizar fluxos de trabalho e implementar automação de processos.",
    strategicActions: [
      "Otimizar fluxos de trabalho",
      "Implementar automação de processos",
      "Reduzir etapas desnecessárias",
      "Criar atalhos para usuários experientes"
    ],
    immediateActions: [
      "Mapear tempo atual de cada processo",
      "Identificar gargalos operacionais",
      "Implementar métricas de tempo"
    ],
    impact: "Alto",
    impactDescription: "Eficiência operacional impacta satisfação"
  },

  QO5: {
    code: "QO5",
    dimension: "Qualidade da Operação",
    title: "Os serviços atendem às minhas expectativas",
    strategicRecommendation: "Realizar pesquisas de expectativa e implementar ciclo de melhoria contínua.",
    strategicActions: [
      "Realizar pesquisas de expectativa",
      "Implementar feedback contínuo",
      "Criar processo de melhoria baseado em feedback",
      "Estabelecer métricas de satisfação"
    ],
    immediateActions: [
      "Mapear expectativas dos usuários",
      "Implementar NPS (Net Promoter Score)",
      "Criar ciclo de melhoria contínua"
    ],
    impact: "Alto",
    impactDescription: "Atender expectativas gera fidelização"
  },

  QO6: {
    code: "QO6",
    dimension: "Qualidade da Operação",
    title: "Minhas dificuldades são resolvidas quando preciso de ajuda",
    strategicRecommendation: "Implementar sistema de suporte multicamadas e criar documentação abrangente.",
    strategicActions: [
      "Implementar sistema de suporte multicamadas",
      "Criar documentação abrangente",
      "Estabelecer processo de escalação",
      "Treinar equipe em empatia"
    ],
    immediateActions: [
      "Mapear principais dificuldades",
      "Implementar sistema de conhecimento",
      "Criar métricas de resolução"
    ],
    impact: "Alto",
    impactDescription: "Resolução de dificuldades impacta retenção"
  },

  QO7: {
    code: "QO7",
    dimension: "Qualidade da Operação",
    title: "Meus dados são automaticamente identificados",
    strategicRecommendation: "Implementar integração com sistemas governamentais e SSO.",
    strategicActions: [
      "Implementar integração com sistemas governamentais",
      "Criar perfil único do cidadão",
      "Implementar SSO (Single Sign-On)",
      "Otimizar preenchimento automático"
    ],
    immediateActions: [
      "Integrar com bases de dados governamentais",
      "Implementar autenticação única",
      "Criar cache de dados do usuário"
    ],
    impact: "Médio",
    impactDescription: "Automação reduz fricção no processo"
  },

  QS2: {
    code: "QS2",
    dimension: "Qualidade do Sistema",
    title: "Os recursos de acessibilidade são fáceis de encontrar",
    strategicRecommendation: "Adicionar menu de acessibilidade visível e implementar recursos WCAG.",
    strategicActions: [
      "Adicionar menu de acessibilidade visível",
      "Implementar atalhos de teclado",
      "Melhorar contraste e tamanho de fontes",
      "Adicionar descrições alt em imagens"
    ],
    immediateActions: [
      "Realizar auditoria de acessibilidade",
      "Treinar equipe em WCAG 2.1",
      "Implementar leitor de tela"
    ],
    impact: "Alto",
    impactDescription: "Inclusão digital é fundamental para o serviço público"
  },

  QS5: {
    code: "QS5",
    dimension: "Qualidade do Sistema",
    title: "O desempenho do sistema é satisfatório",
    strategicRecommendation: "Otimizar tempo de carregamento e implementar cache inteligente.",
    strategicActions: [
      "Otimizar tempo de carregamento",
      "Implementar cache inteligente",
      "Melhorar responsividade mobile",
      "Reduzir tamanho de arquivos"
    ],
    immediateActions: [
      "Analisar métricas de performance",
      "Otimizar banco de dados",
      "Implementar CDN"
    ],
    impact: "Alto",
    impactDescription: "Performance afeta satisfação e produtividade"
  },

  QS6: {
    code: "QS6",
    dimension: "Qualidade do Sistema",
    title: "O sistema informa sobre políticas de privacidade",
    strategicRecommendation: "Criar política de privacidade clara e implementar avisos de cookies.",
    strategicActions: [
      "Criar política de privacidade clara",
      "Implementar avisos de cookies",
      "Adicionar termos de uso visíveis",
      "Explicar uso de dados pessoais"
    ],
    immediateActions: [
      "Revisar conformidade com LGPD",
      "Criar avisos transparentes",
      "Implementar controles de privacidade"
    ],
    impact: "Alto",
    impactDescription: "Transparência é obrigatória por lei"
  },

  QS7: {
    code: "QS7",
    dimension: "Qualidade do Sistema",
    title: "Meus dados estão seguros neste sistema",
    strategicRecommendation: "Implementar criptografia end-to-end e autenticação de dois fatores.",
    strategicActions: [
      "Implementar criptografia end-to-end",
      "Adicionar autenticação de dois fatores",
      "Realizar auditorias de segurança",
      "Criar certificados de segurança visíveis"
    ],
    immediateActions: [
      "Implementar HTTPS em todas as páginas",
      "Revisar políticas de senha",
      "Criar backup seguro de dados"
    ],
    impact: "Crítico",
    impactDescription: "Segurança é fundamental para confiança"
  },

  QS10: {
    code: "QS10",
    dimension: "Qualidade do Sistema",
    title: "O sistema oferece instruções úteis",
    strategicRecommendation: "Criar tutoriais passo-a-passo e implementar tooltips contextuais.",
    strategicActions: [
      "Criar tutoriais passo-a-passo",
      "Implementar tooltips contextuais",
      "Adicionar FAQ dinâmico",
      "Desenvolver sistema de ajuda integrado"
    ],
    immediateActions: [
      "Mapear pontos de dúvida dos usuários",
      "Criar vídeos explicativos",
      "Implementar chat de suporte"
    ],
    impact: "Médio",
    impactDescription: "Instruções claras reduzem suporte técnico"
  }
};

// Função auxiliar para obter recomendação por código
export function getRecommendation(questionCode) {
  return DETAILED_RECOMMENDATIONS[questionCode] || null;
}

// Função auxiliar para obter todas as recomendações de uma dimensão
export function getRecommendationsByDimension(dimension) {
  return Object.values(DETAILED_RECOMMENDATIONS).filter(
    rec => rec.dimension.includes(dimension)
  );
}

