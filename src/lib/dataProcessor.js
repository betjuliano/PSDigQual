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
    console.log('🔍 Iniciando processamento do CSV...');
    
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

    console.log(`📄 Total de linhas encontradas: ${lines.length}`);

    const headers = lines[0].split(';').map(h => h.trim());
    console.log(`📋 Cabeçalhos detectados: ${headers.length}`);
    
    // VALIDAÇÃO RIGOROSA DOS CABEÇALHOS
    const validHeaders = headers.filter(header => header && header.length > 0);
    if (validHeaders.length === 0) {
      throw new Error('Nenhum cabeçalho válido encontrado');
    }
    
    console.log(`✅ Cabeçalhos válidos: ${validHeaders.length}/${headers.length}`);
    
    // Detectar questões válidas
    const questionHeaders = headers.filter(header => {
      const questionCode = QUESTION_MAPPING[header];
      return questionCode || (header && header.includes('?'));
    });
    
    console.log(`❓ Questões detectadas: ${questionHeaders.length}`);
    
    const data = [];
    const invalidRows = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Pular linhas vazias
      
      const values = line.split(';').map(v => v.trim());
      if (values.length !== headers.length) continue;

      const row = {};
      let validResponses = 0;
      let totalQuestions = 0;
      
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
          totalQuestions++;
          
          if (LIKERT_MAPPING[value]) {
            row[questionCode] = LIKERT_MAPPING[value];
            validResponses++;
          } else if (value && value !== '') {
            row[questionCode] = value; // Manter valor original se não for Likert
          } else {
            row[questionCode] = null; // Valor vazio
          }
        }
      });

      // VALIDAÇÃO DA LINHA
      const responseRate = totalQuestions > 0 ? (validResponses / totalQuestions) : 0;
      
      // Só adicionar se tiver pelo menos uma questão Likert e taxa de resposta >= 30%
      const hasLikertQuestions = Object.keys(row).some(key => 
        key.startsWith('QS') || key.startsWith('QI') || key.startsWith('QO') || key.startsWith('QT')
      );
      
      if (hasLikertQuestions && responseRate >= 0.3) {
        data.push(row);
      } else {
        invalidRows.push({
          linha: i + 1,
          respostasValidas: validResponses,
          totalQuestoes: totalQuestions,
          taxa: responseRate
        });
      }
    }

    console.log(`📊 Processamento concluído:`);
    console.log(`  ✅ Linhas válidas: ${data.length}`);
    console.log(`  ❌ Linhas inválidas: ${invalidRows.length}`);
    
    if (data.length === 0) {
      throw new Error('Nenhuma linha de dados válida encontrada');
    }
    
    // VALIDAÇÃO FINAL DOS DADOS
    const sampleRow = data[0];
    const questionCodes = Object.keys(sampleRow).filter(key => 
      key.startsWith('QS') || key.startsWith('QI') || key.startsWith('QO')
    );
    
    console.log(`🎯 Códigos de questões identificados: ${questionCodes.length}`);
    console.log(`📝 Códigos: ${questionCodes.join(', ')}`);
    
    if (questionCodes.length === 0) {
      console.warn('⚠️ Nenhum código de questão identificado nos dados');
    }

    // Determinar tipo baseado nas questões presentes
    const hasTransparencyQuestions = data.some(row => 
      Object.keys(row).some(key => key.startsWith('QT'))
    );
    
    const type = hasTransparencyQuestions ? 'transparency' : 'complete';

    console.log(`Processados ${data.length} registros do tipo ${type}`);
    
    const result = {
      data,
      type,
      headers,
      totalRecords: data.length,
      invalidRows: invalidRows.length,
      questionCodes,
      validationSummary: {
        totalLines: lines.length - 1,
        validLines: data.length,
        invalidLines: invalidRows.length,
        questionColumns: questionCodes.length,
        headerColumns: headers.length
      }
    };
    
    console.log('✅ Dados processados com sucesso:', result.validationSummary);
    
    return result;
  } catch (error) {
    console.error('❌ Erro ao processar CSV:', error);
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

    // Processar funcionário público (incluindo variações como servidor público)
    const funcionarioKey = Object.keys(row).find(key => {
      const keyLower = key.toLowerCase();
      return keyLower.includes('funcionário público') || 
             keyLower.includes('funcionario publico') ||
             keyLower.includes('servidor público') ||
             keyLower.includes('servidor publico') ||
             keyLower.includes('funcionário') ||
             keyLower.includes('funcionario') ||
             keyLower.includes('servidor');
    });
    const funcionarioPublico = row[funcionarioKey];
    if (funcionarioPublico) {
      // Normalizar as respostas para padronizar funcionário e servidor público
      let normalizedResponse = funcionarioPublico;
      if (funcionarioPublico.toLowerCase() === 'sim') {
        normalizedResponse = 'Funcionário/Servidor Público';
      } else if (funcionarioPublico.toLowerCase() === 'não' || funcionarioPublico.toLowerCase() === 'nao') {
        normalizedResponse = 'Não é Funcionário Público';
      }
      
      profileData.funcionarioPublico[normalizedResponse] = (profileData.funcionarioPublico[normalizedResponse] || 0) + 1;
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
    // Ações específicas para as 8 questões do Portal da Transparência
    'QS3': [ // O Portal é fácil de usar
      {
        title: 'Pesquisa orientada e inteligente',
        description: 'Implemente uma barra de busca que utilize inteligência artificial para entender a intenção do usuário. Por exemplo, se a pessoa digita "salário do governador", a busca deve direcioná-la diretamente para a página de remuneração de servidores.',
        priority: 'Alta'
      },
      {
        title: 'Testes de usabilidade com o público',
        description: 'Realize sessões periódicas de testes (experimentos) com cidadãos de diferentes perfis (idade, familiaridade com tecnologia, etc.). Observe como eles interagem com o portal e use esses dados para refinar a estrutura de navegação.',
        priority: 'Média'
      }
    ],
    'QS8': [ // É fácil localizar os dados e as informações no Portal
      {
        title: 'Categorização clara e padronizada',
        description: 'Crie um menu principal com categorias lógicas e nomes simples, como "Receitas", "Despesas", "Servidores", "Licitações e Contratos". Dentro de cada categoria, use subcategorias intuitivas.',
        priority: 'Alta'
      },
      {
        title: 'Mapas de calor e análise de cliques',
        description: 'Utilize ferramentas de análise de dados para entender quais páginas são mais acessadas e quais links recebem mais cliques. Identifique "pontos de atrito" onde os usuários desistem da navegação.',
        priority: 'Média'
      }
    ],
    'QS9': [ // A navegação pelo Portal é intuitiva
      {
        title: 'Pesquisa orientada e inteligente',
        description: 'Implemente uma barra de busca que utilize inteligência artificial para entender a intenção do usuário, facilitando a navegação intuitiva.',
        priority: 'Alta'
      },
      {
        title: 'Testes de usabilidade com o público',
        description: 'Realize sessões periódicas de testes com cidadãos de diferentes perfis para refinar a estrutura de navegação e torná-la mais intuitiva.',
        priority: 'Média'
      }
    ],
    'QS1': [ // O Portal funciona sem falhas
      {
        title: 'Dashboard de monitoramento em tempo real',
        description: 'Criar um painel visível para todos os envolvidos mostrando tempo de carregamento, disponibilidade do servidor, taxa de erro e número de usuários ativos em tempo real.',
        priority: 'Alta'
      },
      {
        title: 'Testes de regressão automatizados',
        description: 'Criar scripts automatizados para simular o comportamento de usuário real, verificar funcionalidade dos links principais, testar compatibilidade em múltiplos dispositivos e validar integridade dos dados.',
        priority: 'Alta'
      }
    ],
    'QI1': [ // As informações são fáceis de entender
      {
        title: 'Glossário interativo e linguagem simples',
        description: 'Evite jargões técnicos e termos burocráticos. Crie um glossário interativo onde o usuário pode passar o mouse sobre termos como "Empenho", "Liquidação" e visualizar explicação clara.',
        priority: 'Alta'
      },
      {
        title: 'Visualização de dados e infográficos',
        description: 'Apresente dados complexos em formatos visuais, como gráficos de barras, gráficos de pizza e infográficos, tornando a informação mais digerível.',
        priority: 'Média'
      }
    ],
    'QI2': [ // As informações são precisas
      {
        title: 'Processo de conciliação de dados automatizado',
        description: 'Configure rotinas automatizadas para comparar dados do portal com os sistemas originais. Scripts diários verificam se totais publicados correspondem aos registros dos sistemas financeiros.',
        priority: 'Alta'
      },
      {
        title: 'Formulário indicativo de erro com rastreamento',
        description: 'Criar formulário simples com campos "Página com erro", "Qual informação está incorreta?" e "Sugestão de correção", com sistema de protocolo para acompanhamento.',
        priority: 'Média'
      }
    ],
    'QI7': [ // As informações disponibilizadas estão atualizadas
      {
        title: 'Automação da publicação de dados',
        description: 'Integre o portal de transparência diretamente aos sistemas de gestão do governo para publicação automática dos dados assim que são gerados, eliminando atualização manual.',
        priority: 'Alta'
      },
      {
        title: 'Exibição da data de atualização',
        description: 'Em cada relatório, tabela ou conjunto de dados, inclua uma etiqueta clara que mostre a data e a hora da última atualização, gerando confiança no usuário.',
        priority: 'Média'
      }
    ],
    'QO4': [ // Consigo obter o que preciso no menor tempo possível
      {
        title: 'Dashboard de acesso rápido',
        description: 'Crie uma página inicial com os dados mais acessados (gastos com saúde, salário de servidores, despesas do mês). Dashboard dinâmico que atualiza conforme o uso diário, semanal ou mensal.',
        priority: 'Alta'
      },
      {
        title: 'Caminhos de navegação guiados',
        description: 'Para informações complexas, crie um passo a passo visual. Exemplo: "Como encontrar gasto de uma secretaria: Passo 1: Clique em Despesas > Passo 2: Selecione Órgãos > Passo 3: Escolha a secretaria".',
        priority: 'Média'
      }
    ],
    
    // Ações genéricas para outras questões
    'QS2': [
      {
        title: 'Melhorar Acessibilidade',
        description: 'Implementar recursos de acessibilidade mais visíveis e fáceis de encontrar na interface.',
        priority: 'Alta'
      }
    ],
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

export function filterDataByDemographics(dataset, demographicFilters) {
  if (!dataset || !dataset.data) {
    return dataset;
  }

  // Verificar se há filtros ativos
  const hasActiveFilters = Object.values(demographicFilters).some(filter => filter.length > 0);
  
  if (!hasActiveFilters) {
    return dataset;
  }

  const filteredData = dataset.data.filter(row => {
    // Filtro por sexo
    if (demographicFilters.sexo.length > 0) {
      const sexoKey = Object.keys(row).find(key => key.toLowerCase().includes('sexo'));
      const sexo = row[sexoKey];
      if (!demographicFilters.sexo.includes(sexo)) {
        return false;
      }
    }

    // Filtro por idade
    if (demographicFilters.idade.length > 0) {
      const idadeKey = Object.keys(row).find(key => key.toLowerCase().includes('idade'));
      const idade = parseInt(row[idadeKey]);
      
      let matchesAge = false;
      for (const faixa of demographicFilters.idade) {
        if (faixa === '18-25' && idade >= 18 && idade <= 25) matchesAge = true;
        if (faixa === '26-35' && idade >= 26 && idade <= 35) matchesAge = true;
        if (faixa === '36-45' && idade >= 36 && idade <= 45) matchesAge = true;
        if (faixa === '46-55' && idade >= 46 && idade <= 55) matchesAge = true;
        if (faixa === '56+' && idade >= 56) matchesAge = true;
      }
      
      if (!matchesAge) {
        return false;
      }
    }

    // Filtro por escolaridade
    if (demographicFilters.escolaridade.length > 0) {
      const escolaridadeKey = Object.keys(row).find(key => key.toLowerCase().includes('escolaridade'));
      const escolaridade = row[escolaridadeKey];
      if (!demographicFilters.escolaridade.includes(escolaridade)) {
        return false;
      }
    }

    // Filtro por servidor público
    if (demographicFilters.servidor.length > 0) {
      const servidorKey = Object.keys(row).find(key => 
        key.toLowerCase().includes('servidor') || 
        key.toLowerCase().includes('público')
      );
      const servidor = row[servidorKey];
      if (!demographicFilters.servidor.includes(servidor)) {
        return false;
      }
    }

    return true;
  });

  return {
    ...dataset,
    data: filteredData
  };
}

