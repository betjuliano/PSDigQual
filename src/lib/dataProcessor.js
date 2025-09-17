// Utilitário para processar dados dos questionários PSDigQual

// Mapeamento das respostas Likert para valores numéricos
const likertMapping = {
  'Discordo totalmente': 1,
  'Discordo': 2,
  'Não sei': 3,
  'Indiferente': 3,
  'Concordo': 4,
  'Concordo totalmente': 5
};

// Mapeamento das questões para dimensões (questionário completo - 20 questões)
const questionDimensions = {
  'QS1': 'QS', // O sistema funciona sem falhas
  'QS2': 'QS', // Os recursos de acessibilidade do sistema são fáceis de encontrar
  'QS3': 'QS', // O sistema é fácil de usar
  'QS5': 'QS', // O desempenho do sistema é satisfatório
  'QS6': 'QS', // O sistema informa sobre as políticas de privacidade
  'QS7': 'QS', // Acredito que meus dados estão seguros
  'QS8': 'QS', // É fácil localizar os serviços e as informações
  'QS9': 'QS', // A navegação pelo sistema é intuitiva
  'QS10': 'QS', // O sistema oferece instruções úteis
  'QI1': 'QI', // As informações são fáceis de entender
  'QI2': 'QI', // As informações são precisas
  'QI3': 'QI', // As informações auxiliam na solicitação
  'QI4': 'QI', // Todas as informações necessárias são fornecidas
  'QO1': 'QO', // Os serviços oferecem suporte técnico eficiente
  'QO2': 'QO', // O atendimento resolve meus problemas
  'QO3': 'QO', // Os serviços permitem conclusão no menor tempo
  'QO4': 'QO', // Consigo obter o que preciso no menor tempo
  'QO5': 'QO', // Os serviços atendem às minhas expectativas
  'QO6': 'QO', // Quando preciso de ajuda, dificuldades são resolvidas
  'QO7': 'QO'  // Meus dados são automaticamente identificados
};

// Mapeamento para questionário Portal da Transparência (8 questões)
const transparencyQuestionMapping = {
  'O Portal é fácil de usar.': 'QS3',
  'É fácil localizar os dados e as informações no Portal.': 'QS8', 
  'A navegação pelo Portal é intuitiva.': 'QS9',
  'O Portal funciona sem falhas.': 'QS1',
  'As informações são fáceis de entender.': 'QI1',
  'As informações são precisas.': 'QI2',
  'As informações disponibilizadas estão atualizadas.': 'QI7',
  'Consigo obter o que preciso no menor tempo possível.': 'QO4'
};

// Questões completas com seus códigos
const completeQuestions = {
  'QS1': 'O sistema funciona sem falhas.',
  'QS2': 'Os recursos de acessibilidade do sistema são fáceis de encontrar.',
  'QS3': 'O sistema é fácil de usar.',
  'QS5': 'O desempenho do sistema é satisfatório, independentemente da forma de acesso.',
  'QS6': 'O sistema informa sobre as políticas de privacidade e segurança.',
  'QS7': 'Acredito que meus dados estão seguros neste sistema.',
  'QS8': 'É fácil localizar os serviços e as informações no sistema.',
  'QS9': 'A navegação pelo sistema é intuitiva.',
  'QS10': 'O sistema oferece instruções úteis de como utilizar os serviços.',
  'QI1': 'As informações são fáceis de entender.',
  'QI2': 'As informações são precisas.',
  'QI3': 'As informações auxiliam na solicitação dos serviços.',
  'QI4': 'Todas as informações necessárias para a solicitação dos serviços são fornecidas.',
  'QO1': 'Os serviços oferecem suporte técnico eficiente.',
  'QO2': 'O atendimento resolve meus problemas.',
  'QO3': 'Os serviços permitem a conclusão das tarefas no menor tempo possível.',
  'QO4': 'Consigo obter o que preciso no menor tempo possível.',
  'QO5': 'Os serviços atendem às minhas expectativas.',
  'QO6': 'Quando preciso de ajuda, minhas dificuldades são resolvidas.',
  'QO7': 'Meus dados são automaticamente identificados na solicitação dos serviços.'
};

// Função para converter resposta Likert em número
export function convertLikertToNumber(response) {
  if (typeof response === 'number') return response;
  const cleaned = response?.toString().trim();
  return likertMapping[cleaned] || 3; // Default para "Não sei"
}

// Função para processar CSV e identificar tipo de questionário
export function processCSVData(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return null;

  const headers = lines[0].split(';').map(h => h.trim());
  const data = [];

  // Identificar tipo de questionário baseado no número de questões Likert
  const likertQuestions = headers.filter(h => 
    !h.includes('sexo') && 
    !h.includes('idade') && 
    !h.includes('escolaridade') && 
    !h.includes('funcionário') &&
    !h.includes('satisfação') &&
    !h.includes('comentários')
  );

  const questionnaireType = likertQuestions.length <= 8 ? 'transparency' : 'complete';

  // Processar cada linha de dados
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';');
    if (values.length !== headers.length) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim();
    });

    // Filtrar linhas vazias ou incompletas
    const hasValidData = Object.values(row).some(value => value && value !== '');
    if (hasValidData) {
      data.push(row);
    }
  }

  return {
    type: questionnaireType,
    headers,
    data,
    likertQuestions
  };
}

// Função para calcular médias por questão
export function calculateQuestionAverages(processedData) {
  if (!processedData || !processedData.data.length) return {};

  const { data, type } = processedData;
  const averages = {};

  // Determinar questões baseado no tipo
  let questionsToProcess = [];
  
  if (type === 'transparency') {
    questionsToProcess = [
      'O Portal é fácil de usar.',
      'É fácil localizar os dados e as informações no Portal.',
      'A navegação pelo Portal é intuitiva.',
      'O Portal funciona sem falhas.',
      'As informações são fáceis de entender.',
      'As informações são precisas.',
      'As informações disponibilizadas estão atualizadas.',
      'Consigo obter o que preciso no menor tempo possível.'
    ];
  } else {
    questionsToProcess = [
      'O sistema funciona sem falhas.',
      'Os recursos de acessibilidade do sistema são fáceis de encontrar.',
      'O sistema é fácil de usar.',
      'O desempenho do sistema é satisfatório, independentemente da forma de acesso.',
      'O sistema informa sobre as políticas de privacidade e segurança.',
      'Acredito que meus dados estão seguros neste sistema.',
      'É fácil localizar os serviços e as informações no sistema.',
      'A navegação pelo sistema é intuitiva.',
      'O sistema oferece instruções úteis de como utilizar os serviços.',
      'As informações são fáceis de entender.',
      'As informações são precisas.',
      'As informações auxiliam na solicitação dos serviços.',
      'Todas as informações necessárias para a solicitação dos serviços são fornecidas.',
      'Os serviços oferecem suporte técnico eficiente.',
      'O atendimento resolve meus problemas.',
      'Os serviços permitem a conclusão das tarefas no menor tempo possível.',
      'Consigo obter o que preciso no menor tempo possível.',
      'Os serviços atendem às minhas expectativas.',
      'Quando preciso de ajuda, minhas dificuldades são resolvidas.',
      'Meus dados são automaticamente identificados na solicitação dos serviços.'
    ];
  }

  questionsToProcess.forEach((question, index) => {
    const values = data
      .map(row => convertLikertToNumber(row[question]))
      .filter(val => val >= 1 && val <= 5);

    if (values.length > 0) {
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      // Mapear questão para código padrão
      let questionCode;
      let dimension;
      
      if (type === 'transparency') {
        const mapping = {
          'O Portal é fácil de usar.': { code: 'QS3', dimension: 'QS' },
          'É fácil localizar os dados e as informações no Portal.': { code: 'QS8', dimension: 'QS' },
          'A navegação pelo Portal é intuitiva.': { code: 'QS9', dimension: 'QS' },
          'O Portal funciona sem falhas.': { code: 'QS1', dimension: 'QS' },
          'As informações são fáceis de entender.': { code: 'QI1', dimension: 'QI' },
          'As informações são precisas.': { code: 'QI2', dimension: 'QI' },
          'As informações disponibilizadas estão atualizadas.': { code: 'QI7', dimension: 'QI' },
          'Consigo obter o que preciso no menor tempo possível.': { code: 'QO4', dimension: 'QO' }
        };
        questionCode = mapping[question]?.code || `T${index + 1}`;
        dimension = mapping[question]?.dimension || 'QS';
      } else {
        const codes = ['QS1', 'QS2', 'QS3', 'QS5', 'QS6', 'QS7', 'QS8', 'QS9', 'QS10', 
                      'QI1', 'QI2', 'QI3', 'QI4', 'QO1', 'QO2', 'QO3', 'QO4', 'QO5', 'QO6', 'QO7'];
        questionCode = codes[index] || `Q${index + 1}`;
        dimension = questionCode.substring(0, 2);
      }
      
      averages[questionCode] = {
        average: Number(avg.toFixed(2)),
        question: completeQuestions[questionCode] || question,
        dimension: dimension,
        responseCount: values.length
      };
    }
  });

  return averages;
}

// Função para calcular médias por dimensão
export function calculateDimensionAverages(questionAverages) {
  const dimensions = { QS: [], QO: [], QI: [] };

  Object.entries(questionAverages).forEach(([code, data]) => {
    if (dimensions[data.dimension]) {
      dimensions[data.dimension].push(data.average);
    }
  });

  const dimensionAverages = {};
  Object.entries(dimensions).forEach(([dim, values]) => {
    if (values.length > 0) {
      dimensionAverages[dim] = Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2));
    }
  });

  return dimensionAverages;
}

// Função para classificar questões por status (crítico, neutro, positivo)
export function classifyQuestions(questionAverages, goals = { QS: 4, QO: 4, QI: 4 }) {
  const classification = {
    critical: [], // < 3
    neutral: [],  // >= 3 e < meta
    positive: []  // >= meta
  };

  Object.entries(questionAverages).forEach(([code, data]) => {
    const goal = goals[data.dimension] || 4;
    
    if (data.average < 3) {
      classification.critical.push({ code, ...data });
    } else if (data.average >= goal) {
      classification.positive.push({ code, ...data });
    } else {
      classification.neutral.push({ code, ...data });
    }
  });

  return classification;
}

// Função para extrair dados de perfil
export function extractProfileData(processedData) {
  if (!processedData || !processedData.data.length) return {};

  const { data } = processedData;
  const profileData = {
    sexo: {},
    idade: {},
    escolaridade: {},
    funcionarioPublico: {}
  };

  // Função para categorizar idade
  const categorizeAge = (age) => {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return 'Não informado';
    
    if (ageNum <= 20) return 'Até 20 anos';
    if (ageNum >= 21 && ageNum <= 23) return 'De 21 a 23 anos';
    if (ageNum >= 24 && ageNum <= 32) return 'De 24 a 32 anos';
    if (ageNum >= 33) return 'Acima de 33 anos';
    
    return 'Não informado';
  };

  data.forEach(row => {
    // Sexo
    const sexo = row['Qual o seu sexo?'] || row['sexo'];
    if (sexo) {
      profileData.sexo[sexo] = (profileData.sexo[sexo] || 0) + 1;
    }

    // Idade (com categorização)
    const idade = row['Qual a sua idade?'] || row['idade'];
    if (idade) {
      const ageCategory = categorizeAge(idade);
      profileData.idade[ageCategory] = (profileData.idade[ageCategory] || 0) + 1;
    }

    // Escolaridade
    const escolaridade = row['Qual seu nível de escolaridade completo?'] || row['escolaridade'];
    if (escolaridade) {
      profileData.escolaridade[escolaridade] = (profileData.escolaridade[escolaridade] || 0) + 1;
    }

    // Funcionário Público
    const funcionario = row['Você é funcionário público?'] || row['funcionario'];
    if (funcionario) {
      profileData.funcionarioPublico[funcionario] = (profileData.funcionarioPublico[funcionario] || 0) + 1;
    }
  });

  return profileData;
}


// Sistema de recomendações para questões críticas
export const questionRecommendations = {
  // Questionário Portal da Transparência (8 questões)
  'QS3': { // O Portal é fácil de usar
    actions: [
      {
        title: 'Pesquisa orientada e inteligente',
        description: 'Implemente uma barra de busca que utilize inteligência artificial para entender a intenção do usuário. Por exemplo, se a pessoa digita "salário do governador", a busca deve direcioná-la diretamente para a página de remuneração de servidores, sem a necessidade de clicar em múltiplos links.',
        priority: 'Alta'
      },
      {
        title: 'Testes de usabilidade com o público',
        description: 'Realize sessões periódicas de testes (experimentos) com cidadãos de diferentes perfis (idade, familiaridade com tecnologia, etc.). Observe como eles interagem com o portal, onde encontram dificuldades e quais termos de busca utilizam.',
        priority: 'Média'
      }
    ]
  },
  'QS8': { // É fácil localizar os dados e as informações no Portal
    actions: [
      {
        title: 'Categorização clara e padronizada',
        description: 'Crie um menu principal com categorias lógicas e nomes simples, como "Receitas", "Despesas", "Servidores", "Licitações e Contratos". Dentro de cada categoria, use subcategorias intuitivas para evitar que o usuário se perca.',
        priority: 'Alta'
      },
      {
        title: 'Mapas de calor e análise de cliques',
        description: 'Utilize ferramentas de análise de dados para entender quais páginas são mais acessadas e quais links recebem mais cliques. Identifique "pontos de atrito" onde os usuários desistem da navegação.',
        priority: 'Média'
      }
    ]
  },
  'QS1': { // O Portal funciona sem falhas
    actions: [
      {
        title: 'Dashboard de monitoramento em tempo real',
        description: 'Crie um painel visível para todos os envolvidos mostrando métricas como tempo de carregamento, disponibilidade do servidor, taxa de erro e número de usuários ativos.',
        priority: 'Alta'
      },
      {
        title: 'Testes de regressão automatizados',
        description: 'Crie scripts automatizados para simular o comportamento de usuários reais, verificando funcionalidade dos links, compatibilidade em múltiplos dispositivos e integridade dos dados.',
        priority: 'Alta'
      }
    ]
  },
  'QI1': { // As informações são fáceis de entender
    actions: [
      {
        title: 'Glossário interativo e linguagem simples',
        description: 'Evite jargões técnicos e termos burocráticos. Crie um glossário interativo onde o usuário pode passar o mouse sobre termos como "Empenho", "Liquidação" ou "Orçamento" e visualizar explicações claras.',
        priority: 'Média'
      },
      {
        title: 'Visualização de dados e infográficos',
        description: 'Apresente dados complexos em formatos visuais, como gráficos de barras, gráficos de pizza e infográficos. Isso torna a informação mais digerível e permite entendimento rápido dos principais pontos.',
        priority: 'Alta'
      }
    ]
  },
  'QI2': { // As informações são precisas
    actions: [
      {
        title: 'Processo de conciliação de dados automatizado',
        description: 'Configure rotinas automatizadas para comparar dados do portal com os sistemas originais. Scripts diários podem verificar se totais publicados correspondem aos registros nos sistemas financeiros.',
        priority: 'Alta'
      },
      {
        title: 'Formulário de correção com rastreamento',
        description: 'Crie um formulário simples para reportar erros com campos objetivos e sistema de rastreamento. O cidadão recebe um protocolo para acompanhar o status da correção.',
        priority: 'Média'
      }
    ]
  },
  'QI7': { // As informações disponibilizadas estão atualizadas
    actions: [
      {
        title: 'Automação da publicação de dados',
        description: 'Integre o portal de transparência diretamente aos sistemas de gestão do governo para publicação automática de dados assim que são gerados, eliminando atualizações manuais.',
        priority: 'Alta'
      },
      {
        title: 'Exibição da data de atualização',
        description: 'Em cada relatório, tabela ou conjunto de dados, inclua uma etiqueta clara mostrando a data e hora da última atualização para gerar confiança no usuário.',
        priority: 'Baixa'
      }
    ]
  },
  'QO4': { // Consigo obter o que preciso no menor tempo possível
    actions: [
      {
        title: 'Dashboard de acesso rápido',
        description: 'Crie uma página inicial com os dados mais acessados (gastos com saúde, salário de servidores, despesas do mês). Torne-o dinâmico baseado no controle de acessos dos usuários.',
        priority: 'Alta'
      },
      {
        title: 'Caminhos de navegação guiados',
        description: 'Para informações complexas, crie um passo a passo visual. Exemplo: "Como encontrar gasto de uma secretaria: Passo 1: Clique em \'Despesas\' > Passo 2: Selecione \'Órgãos\' > Passo 3: Escolha a secretaria".',
        priority: 'Média'
      }
    ]
  }
};

// Função para obter recomendações para questões críticas
export function getRecommendationsForCriticalQuestions(questionAverages, goals) {
  const recommendations = [];
  
  Object.entries(questionAverages).forEach(([code, data]) => {
    if (data.average < 3.0 && questionRecommendations[code]) {
      recommendations.push({
        questionCode: code,
        question: data.question,
        average: data.average,
        dimension: data.dimension,
        actions: questionRecommendations[code].actions
      });
    }
  });

  return recommendations;
}

// Mapeamento de questões similares entre questionários de 8 e 20 questões
export const questionMapping = {
  // Portal Transparência -> Questionário Completo
  'QS3_transparency': 'QS3', // Portal é fácil de usar -> Sistema é fácil de usar
  'QS8_transparency': 'QS8', // Fácil localizar dados -> Fácil localizar serviços
  'QS9_transparency': 'QS9', // Navegação intuitiva -> Navegação intuitiva
  'QS1_transparency': 'QS1', // Portal funciona sem falhas -> Sistema funciona sem falhas
  'QI1_transparency': 'QI1', // Informações fáceis de entender -> Informações fáceis de entender
  'QI2_transparency': 'QI2', // Informações precisas -> Informações precisas
  'QO4_transparency': 'QO4', // Obter o que precisa rapidamente -> Obter o que precisa rapidamente
};

