// Mapeamento das questões para códigos
const QUESTION_MAPPING = {
  // Questionário completo (20+ questões)
  'O sistema funciona sem falhas.': 'QS1',
  'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'QS2',
  'O sistema é fácil de usar.': 'QS3',
  'O sistema está disponível para uso em qualquer dia e hora.': 'QS4',
  'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'QS5',
  'O sistema informa sobre as políticas de privacidade e segurança.': 'QS6',
  'Acredito que meus dados estão seguros neste sistema.': 'QS7',
  'É fácil localizar os serviços e as informações no sistema.': 'QS8',
  'A navegação pelo sistema é intuitiva.': 'QS9',
  'O sistema oferece instruções úteis de como utilizar os serviços.': 'QS10',
  'As informações são fáceis de entender.': 'QI1',
  'As informações são precisas.': 'QI2',
  'As informações auxiliam na solicitação dos serviços.': 'QI3',
  'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'QI4',
  'O prazo de entrega dos serviços é informado.': 'QI5',
  'As taxas cobradas pelos serviços são informadas.': 'QI6',
  'As informações disponibilizadas estão atualizadas.': 'QI7',
  'Os serviços oferecem suporte técnico eficiente.': 'QO1',
  'O atendimento resolve meus problemas.': 'QO2',
  'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'QO3',
  'Consigo obter o que preciso no menor tempo possível.': 'QO4',
  'Os serviços atendem às minhas expectativas.': 'QO5',
  'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'QO6',
  'Meus dados são automaticamente identificados na solicitação dos serviços.': 'QO7',
  'Os serviços oferecidos são confiáveis.': 'QO8',
  'Os serviços permitem interações em tempo real (ex. chatbot, IA).': 'QO9',
  
  // Questionário Portal da Transparência (8 questões) - mapeadas para códigos corretos
  'O Portal é fácil de usar.': 'QS3',  // Corresponde a QS3 do questionário completo
  'É fácil localizar os dados e as informações no Portal.': 'QS8',  // Corresponde a QS8
  'A navegação pelo Portal é intuitiva.': 'QS9',  // Corresponde a QS9
  'O Portal funciona sem falhas.': 'QS1',  // Corresponde a QS1
  'As informações são fáceis de entender.': 'QI1',  // Corresponde a QI1
  'As informações são precisas.': 'QI2',  // Corresponde a QI2
  'As informações disponibilizadas estão atualizadas.': 'QI7',  // Corresponde a QI7
  'Consigo obter o que preciso no menor tempo possível.': 'QO4'  // Corresponde a QO4
};

// Mapeamento das dimensões
const DIMENSION_MAPPING = {
  // Qualidade do Sistema (QS)
  'QS1': 'QS', 'QS2': 'QS', 'QS3': 'QS', 'QS4': 'QS', 'QS5': 'QS',
  'QS6': 'QS', 'QS7': 'QS', 'QS8': 'QS', 'QS9': 'QS', 'QS10': 'QS',
  
  // Qualidade da Informação (QI)
  'QI1': 'QI', 'QI2': 'QI', 'QI3': 'QI', 'QI4': 'QI', 'QI5': 'QI',
  'QI6': 'QI', 'QI7': 'QI',
  
  // Qualidade da Operação (QO)
  'QO1': 'QO', 'QO2': 'QO', 'QO3': 'QO', 'QO4': 'QO', 'QO5': 'QO',
  'QO6': 'QO', 'QO7': 'QO', 'QO8': 'QO', 'QO9': 'QO'
};

// Mapeamento de respostas Likert para números
const LIKERT_MAPPING = {
  'Discordo totalmente': 1,
  'Discordo': 2,
  'Não sei': 3,
  'Indiferente': 3,
  'Concordo': 4,
  'Concordo totalmente': 5
};

// Função para detectar encoding e processar CSV
export function processCSVData(csvText, encoding = 'utf-8') {
  try {
    // Se o texto contém caracteres estranhos, pode ser latin-1
    if (csvText.includes('�') || csvText.includes('Ã')) {
      console.log('Detectado possível encoding latin-1, tentando reprocessar...');
      // Em um ambiente real, aqui faria a conversão de encoding
      // Por enquanto, vamos limpar os caracteres problemáticos
      csvText = csvText
        .replace(/Ã¡/g, 'á')
        .replace(/Ã©/g, 'é')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã /g, 'à')
        .replace(/Ã¢/g, 'â')
        .replace(/Ã£/g, 'ã')
        .replace(/Ãª/g, 'ê')
        .replace(/Ã´/g, 'ô')
        .replace(/Ã¨/g, 'è')
        .replace(/�/g, '');
    }

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Arquivo CSV deve ter pelo menos 2 linhas (cabeçalho + dados)');
    }

    const headers = lines[0].split(';').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Pular linhas vazias
      
      const values = line.split(';').map(v => v.trim());
      if (values.length !== headers.length) continue;

      const row = {};
      headers.forEach((header, index) => {
        const value = values[index];
        
        // Verificar se é questão de perfil
        if (header.toLowerCase().includes('sexo') || 
            header.toLowerCase().includes('idade') || 
            header.toLowerCase().includes('escolaridade') || 
            header.toLowerCase().includes('funcionário público') ||
            header.toLowerCase().includes('funcionario publico')) {
          row[header] = value;
        }
        // Verificar se é questão Likert
        else if (QUESTION_MAPPING[header]) {
          const questionCode = QUESTION_MAPPING[header];
          const numericValue = LIKERT_MAPPING[value] || 3;
          row[questionCode] = numericValue;
        }
      });

      // Só adicionar se tiver pelo menos uma questão Likert
      const hasLikertQuestions = Object.keys(row).some(key => 
        key.startsWith('QS') || key.startsWith('QI') || key.startsWith('QO') || key.startsWith('QT')
      );
      
      if (hasLikertQuestions) {
        data.push(row);
      }
    }

    // Determinar tipo baseado nas questões presentes
    const hasTransparencyQuestions = data.some(row => 
      Object.keys(row).some(key => key.startsWith('QT'))
    );
    
    const type = hasTransparencyQuestions ? 'transparency' : 'complete';

    console.log(`Processados ${data.length} registros do tipo ${type}`);
    return { data, type };
  } catch (error) {
    console.error('Erro ao processar CSV:', error);
    throw error;
  }
}

// Alias para compatibilidade com FileUpload
export const parseCSV = processCSVData;

// Função para processar arquivo com diferentes encodings
export async function processFileWithEncoding(file) {
  try {
    // Primeiro tenta UTF-8
    let text = await readFileAsText(file, 'UTF-8');
    let result = processCSVData(text);
    
    if (result.data.length > 0) {
      console.log('Sucesso com encoding UTF-8');
      return result;
    }
    
    // Se falhar, tenta ISO-8859-1 (Latin-1)
    text = await readFileAsText(file, 'ISO-8859-1');
    result = processCSVData(text);
    
    if (result.data.length > 0) {
      console.log('Sucesso com encoding ISO-8859-1');
      return result;
    }
    
    throw new Error('Não foi possível processar o arquivo');
  } catch (error) {
    console.error('Erro no processamento:', error);
    throw new Error(`Erro ao processar arquivo: ${error.message}`);
  }
}

// Função auxiliar para ler arquivo como texto
function readFileAsText(file, encoding = 'UTF-8') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file, encoding);
  });
}

// Função para calcular médias por questão
export function calculateQuestionAverages(dataset) {
  if (!dataset || !dataset.data || dataset.data.length === 0) {
    return {};
  }

  const averages = {};
  const counts = {};

  // Inicializar contadores
  dataset.data.forEach(row => {
    Object.keys(row).forEach(key => {
      if (key.startsWith('QS') || key.startsWith('QI') || key.startsWith('QO')) {
        if (!averages[key]) {
          averages[key] = 0;
          counts[key] = 0;
        }
        if (typeof row[key] === 'number' && !isNaN(row[key])) {
          averages[key] += row[key];
          counts[key]++;
        }
      }
    });
  });

  // Calcular médias
  Object.keys(averages).forEach(key => {
    if (counts[key] > 0) {
      averages[key] = averages[key] / counts[key];
    }
  });

  return averages;
}

// Função para calcular médias por dimensão
export function calculateDimensionAverages(questionAverages) {
  const dimensions = { QS: [], QO: [], QI: [] };

  Object.keys(questionAverages).forEach(questionCode => {
    const dimension = DIMENSION_MAPPING[questionCode];
    if (dimension && dimensions[dimension]) {
      dimensions[dimension].push(questionAverages[questionCode]);
    }
  });

  const dimensionAverages = {};
  Object.keys(dimensions).forEach(dim => {
    if (dimensions[dim].length > 0) {
      dimensionAverages[dim] = dimensions[dim].reduce((sum, val) => sum + val, 0) / dimensions[dim].length;
    } else {
      dimensionAverages[dim] = 0;
    }
  });

  return dimensionAverages;
}

// Função para classificar questões
export function classifyQuestions(questionAverages, goals) {
  const classification = {
    critical: [],
    neutral: [],
    positive: []
  };

  Object.keys(questionAverages).forEach(questionCode => {
    const average = questionAverages[questionCode];
    const dimension = DIMENSION_MAPPING[questionCode];
    const goal = goals[dimension] || 4.0;

    const item = {
      code: questionCode,
      average,
      dimension,
      question: getQuestionText(questionCode)
    };

    if (average < 3.0) {
      classification.critical.push(item);
    } else if (average >= goal) {
      classification.positive.push(item);
    } else {
      classification.neutral.push(item);
    }
  });

  return classification;
}

// Função para obter texto da questão
function getQuestionText(questionCode) {
  const reverseMapping = Object.fromEntries(
    Object.entries(QUESTION_MAPPING).map(([text, code]) => [code, text])
  );
  return reverseMapping[questionCode] || questionCode;
}

// Função para extrair dados de perfil
export function extractProfileData(dataset) {
  if (!dataset || !dataset.data || dataset.data.length === 0) {
    return {};
  }

  const profileData = {
    sexo: {},
    idade: {},
    escolaridade: {},
    funcionarioPublico: {}
  };

  dataset.data.forEach(row => {
    // Processar sexo
    const sexoKey = Object.keys(row).find(key => key.toLowerCase().includes('sexo'));
    const sexo = row[sexoKey];
    if (sexo) {
      profileData.sexo[sexo] = (profileData.sexo[sexo] || 0) + 1;
    }

    // Processar idade com categorização
    const idadeKey = Object.keys(row).find(key => key.toLowerCase().includes('idade'));
    const idade = parseInt(row[idadeKey]);
    if (!isNaN(idade)) {
      let faixaIdade;
      if (idade <= 20) faixaIdade = 'Até 20 anos';
      else if (idade <= 23) faixaIdade = 'De 21 a 23 anos';
      else if (idade <= 32) faixaIdade = 'De 24 a 32 anos';
      else faixaIdade = 'Acima de 33 anos';
      
      profileData.idade[faixaIdade] = (profileData.idade[faixaIdade] || 0) + 1;
    }

    // Processar escolaridade
    const escolaridadeKey = Object.keys(row).find(key => key.toLowerCase().includes('escolaridade'));
    const escolaridade = row[escolaridadeKey];
    if (escolaridade) {
      profileData.escolaridade[escolaridade] = (profileData.escolaridade[escolaridade] || 0) + 1;
    }

    // Processar funcionário público
    const funcionarioKey = Object.keys(row).find(key => 
      key.toLowerCase().includes('funcionário público') || 
      key.toLowerCase().includes('funcionario publico')
    );
    const funcionarioPublico = row[funcionarioKey];
    if (funcionarioPublico) {
      profileData.funcionarioPublico[funcionarioPublico] = (profileData.funcionarioPublico[funcionarioPublico] || 0) + 1;
    }
  });

  return profileData;
}

// Função para obter recomendações para questões críticas
export function getRecommendationsForCriticalQuestions(questionAverages, goals) {
  const recommendations = [];
  
  Object.keys(questionAverages).forEach(questionCode => {
    const average = questionAverages[questionCode];
    const dimension = DIMENSION_MAPPING[questionCode];
    
    if (average < 3.0) {
      const recommendation = {
        questionCode,
        question: getQuestionText(questionCode),
        average,
        dimension: getDimensionName(dimension),
        actions: getActionsForQuestion(questionCode, dimension)
      };
      recommendations.push(recommendation);
    }
  });

  return recommendations;
}

// Função para obter nome da dimensão
function getDimensionName(dimension) {
  const names = {
    'QS': 'Qualidade do Sistema',
    'QO': 'Qualidade da Operação',
    'QI': 'Qualidade da Informação'
  };
  return names[dimension] || dimension;
}

// Função para obter ações específicas por questão
function getActionsForQuestion(questionCode, dimension) {
  const actions = {
    // Ações para Qualidade do Sistema
    'QS1': [
      {
        title: 'Implementar Monitoramento de Sistema',
        description: 'Criar sistema de monitoramento em tempo real para detectar e corrigir falhas automaticamente.',
        priority: 'Alta'
      }
    ],
    'QS2': [
      {
        title: 'Melhorar Acessibilidade',
        description: 'Implementar recursos de acessibilidade mais visíveis e fáceis de encontrar na interface.',
        priority: 'Alta'
      }
    ],
    'QS3': [
      {
        title: 'Simplificar Interface',
        description: 'Redesenhar a interface para torná-la mais intuitiva e fácil de usar.',
        priority: 'Alta'
      }
    ],
    
    // Ações para Qualidade da Informação
    'QI1': [
      {
        title: 'Revisar Linguagem',
        description: 'Simplificar a linguagem utilizada nas informações para torná-las mais claras.',
        priority: 'Média'
      }
    ],
    'QI2': [
      {
        title: 'Validar Informações',
        description: 'Implementar processo de validação contínua das informações disponibilizadas.',
        priority: 'Alta'
      }
    ],
    
    // Ações para Qualidade da Operação
    'QO1': [
      {
        title: 'Melhorar Suporte Técnico',
        description: 'Capacitar equipe de suporte e implementar sistema de tickets mais eficiente.',
        priority: 'Alta'
      }
    ],
    'QO2': [
      {
        title: 'Otimizar Atendimento',
        description: 'Implementar chatbot e melhorar processos de resolução de problemas.',
        priority: 'Média'
      }
    ]
  };

  return actions[questionCode] || [
    {
      title: 'Análise Detalhada',
      description: 'Realizar análise específica para identificar pontos de melhoria nesta questão.',
      priority: 'Média'
    }
  ];
}

