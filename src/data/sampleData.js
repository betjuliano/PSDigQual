// Dados de exemplo para teste da aplicação PSDigQual

// Mapeamento de respostas Likert para números
const LIKERT_MAPPING = {
  'Discordo totalmente': 1,
  'Discordo': 2,
  'Não sei': 3,
  'Indiferente': 3,
  'Concordo': 4,
  'Concordo totalmente': 5
};

// Mapeamento CORRETO das questões para códigos - Base20 (20 questões conforme especificação)
const BASE20_QUESTION_MAPPING = {
  // QS - Qualidade do Sistema (10 questões: QS1, QS2, QS3, QS5, QS6, QS7, QS8, QS9, QS10)
  'O sistema funciona sem falhas.': 'QS1',
  'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'QS2',
  'O sistema é fácil de usar.': 'QS3',
  'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'QS5',
  'O sistema informa sobre as políticas de privacidade e segurança.': 'QS6',
  'Acredito que meus dados estão seguros neste sistema.': 'QS7',
  'É fácil localizar os serviços e as informações no sistema.': 'QS8',
  'A navegação pelo sistema é intuitiva.': 'QS9',
  'O sistema oferece instruções úteis de como utilizar os serviços.': 'QS10',
  
  // QI - Qualidade da Informação (4 questões: QI1, QI2, QI3, QI4)
  'As informações são fáceis de entender.': 'QI1',
  'As informações são precisas.': 'QI2',
  'As informações auxiliam na solicitação dos serviços.': 'QI3',
  'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'QI4',
  
  // QO - Qualidade da Operação (7 questões: QO1, QO2, QO3, QO4, QO5, QO6, QO7)
  'Os serviços oferecem suporte técnico eficiente.': 'QO1',
  'O atendimento resolve meus problemas.': 'QO2',
  'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'QO3',
  'Consigo obter o que preciso no menor tempo possível.': 'QO4',
  'Os serviços atendem às minhas expectativas.': 'QO5',
  'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'QO6',
  'Meus dados são automaticamente identificados na solicitação dos serviços.': 'QO7'
};

// Base26 - Questionário Completo (26 questões) - FUTURO
const BASE26_QUESTION_MAPPING = {
  // Incluir todas as questões do Base20 + questões adicionais
  ...BASE20_QUESTION_MAPPING,
  
  // Questões adicionais para Base26 (a serem definidas)
  'O sistema está disponível para uso em qualquer dia e hora.': 'QS4',
  'O prazo de entrega dos serviços é informado.': 'QI5',
  'As taxas cobradas pelos serviços são informadas.': 'QI6',
  'As informações disponibilizadas estão atualizadas.': 'QI7',
  'Os serviços oferecidos são confiáveis.': 'QO8',
  'Os serviços permitem interações em tempo real (ex. chatbot, IA).': 'QO9'
};

// Mapeamento compatível com o sistema anterior (Base20)
const COMPLETE_QUESTION_MAPPING = BASE20_QUESTION_MAPPING;

// Mapeamento das questões para códigos - Base8 (Portal da Transparência)
const BASE8_QUESTION_MAPPING = {
  'O Portal é fácil de usar.': 'QS3',
  'É fácil localizar os dados e as informações no Portal.': 'QS8',
  'A navegação pelo Portal é intuitiva.': 'QS9',
  'O Portal funciona sem falhas.': 'QS1',
  'As informações são fáceis de entender.': 'QI1',
  'As informações são precisas.': 'QI2',
  'As informações disponibilizadas estão atualizadas.': 'QI7',
  'Consigo obter o que preciso no menor tempo possível.': 'QO4'
};

// Mapeamento compatível com o sistema anterior (Base8)
const TRANSPARENCY_QUESTION_MAPPING = BASE8_QUESTION_MAPPING;

// Mapeamento unificado de todas as questões
const QUESTION_MAPPING = {
  ...BASE26_QUESTION_MAPPING,
  ...BASE20_QUESTION_MAPPING,
  ...BASE8_QUESTION_MAPPING,
  ...TRANSPARENCY_QUESTION_MAPPING
};

// Definir conjuntos de códigos para cada tipo de questionário
const QUESTION_SETS = {
  base26: new Set(Object.values(BASE26_QUESTION_MAPPING)),
  base20: new Set(Object.values(BASE20_QUESTION_MAPPING)),
  base8: new Set(Object.values(BASE8_QUESTION_MAPPING)),
  transparency: new Set(Object.values(TRANSPARENCY_QUESTION_MAPPING))
};

// Estrutura correta das dimensões por tipo
const DIMENSION_STRUCTURE = {
  base20: {
    QS: 9, // QS1, QS2, QS3, QS5, QS6, QS7, QS8, QS9, QS10
    QI: 4, // QI1, QI2, QI3, QI4
    QO: 7  // QO1, QO2, QO3, QO4, QO5, QO6, QO7
  },
  base8: {
    QS: 4, // QS1, QS3, QS8, QS9
    QI: 3, // QI1, QI2, QI7
    QO: 1  // QO4
  },
  base26: {
    QS: 10, // QS1-QS10
    QI: 7,  // QI1-QI7
    QO: 9   // QO1-QO9
  }
};

// Função para detectar o tipo de questionário baseado nas questões presentes
function detectQuestionnaireType(questions) {
  const questionCodes = new Set(
    questions
      .map(q => QUESTION_MAPPING[q])
      .filter(Boolean)
  );
  
  // Verificar correspondência com cada tipo
  const matches = {
    base26: Array.from(QUESTION_SETS.base26).filter(code => questionCodes.has(code)).length,
    base20: Array.from(QUESTION_SETS.base20).filter(code => questionCodes.has(code)).length,
    base8: Array.from(QUESTION_SETS.base8).filter(code => questionCodes.has(code)).length
  };
  
  // Determinar o tipo com maior correspondência
  const maxMatch = Math.max(...Object.values(matches));
  const detectedType = Object.keys(matches).find(type => matches[type] === maxMatch);
  
  console.log(`🔍 Detecção de questionário:`, {
    questionsFound: questionCodes.size,
    matches,
    detectedType,
    confidence: maxMatch / questionCodes.size
  });
  
  return {
    type: detectedType,
    confidence: maxMatch / questionCodes.size,
    questionCount: questionCodes.size,
    matches
  };
}

// Função para converter dados de exemplo para formato processado
function convertSampleData(rawData) {
  const questions = Object.keys(rawData.data[0] || {});
  const detectionResult = detectQuestionnaireType(questions);
  
  console.log(`📊 Convertendo dados de exemplo:`, {
    originalType: rawData.type,
    detectedType: detectionResult.type,
    questionCount: detectionResult.questionCount
  });
  
  const convertedData = rawData.data.map(row => {
    const convertedRow = {};
    
    Object.keys(row).forEach(question => {
      const questionCode = QUESTION_MAPPING[question];
      if (questionCode) {
        // Converter resposta Likert para número
        const numericValue = LIKERT_MAPPING[row[question]] || 3;
        convertedRow[questionCode] = numericValue;
      } else if (question.toLowerCase().includes('sexo') || 
                 question.toLowerCase().includes('idade') || 
                 question.toLowerCase().includes('escolaridade') || 
                 question.toLowerCase().includes('funcionário público') ||
                 question.toLowerCase().includes('funcionario publico') ||
                 question.toLowerCase().includes('satisfação')) {
        // Manter dados de perfil
        convertedRow[question] = row[question];
      }
    });
    
    return convertedRow;
  });
  
  return {
    ...rawData,
    type: detectionResult.type || rawData.type,
    questionnaireInfo: {
      detectedType: detectionResult.type,
      confidence: detectionResult.confidence,
      questionCount: detectionResult.questionCount,
      originalType: rawData.type
    },
    data: convertedData
  };
}

// Dados de exemplo para Base20 (20 questões CORRETAS conforme especificação)
const rawBase20Data = {
  type: 'base20',
  data: [
    {
      // QS - Qualidade do Sistema (9 questões)
      'O sistema funciona sem falhas.': 'Concordo',
      'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'Concordo',
      'O sistema é fácil de usar.': 'Concordo totalmente',
      'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'Concordo',
      'O sistema informa sobre as políticas de privacidade e segurança.': 'Concordo',
      'Acredito que meus dados estão seguros neste sistema.': 'Concordo',
      'É fácil localizar os serviços e as informações no sistema.': 'Concordo',
      'A navegação pelo sistema é intuitiva.': 'Concordo totalmente',
      'O sistema oferece instruções úteis de como utilizar os serviços.': 'Concordo',
      
      // QI - Qualidade da Informação (4 questões)
      'As informações são fáceis de entender.': 'Concordo totalmente',
      'As informações são precisas.': 'Concordo',
      'As informações auxiliam na solicitação dos serviços.': 'Concordo',
      'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'Concordo',
      
      // QO - Qualidade da Operação (7 questões)
      'Os serviços oferecem suporte técnico eficiente.': 'Concordo',
      'O atendimento resolve meus problemas.': 'Concordo',
      'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'Concordo',
      'Consigo obter o que preciso no menor tempo possível.': 'Concordo',
      'Os serviços atendem às minhas expectativas.': 'Concordo',
      'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'Concordo',
      'Meus dados são automaticamente identificados na solicitação dos serviços.': 'Concordo',
      
      // Dados demográficos
      'Qual o seu nível de satisfação com o Sistema?': 'Satisfeito',
      'Qual o seu sexo?': 'Masculino',
      'Qual a sua idade?': '35',
      'Qual seu nível de escolaridade completo?': 'Ensino Superior',
      'Você é funcionário público?': 'Sim'
    }
  ]
};

// Dados de exemplo para Base26 (26 questões) - FUTURO
const rawBase26Data = {
  type: 'base26',
  data: [
    {
      // Incluir todas as questões do Base20 + questões adicionais
      ...rawBase20Data.data[0],
      
      // Questões adicionais para Base26
      'O sistema está disponível para uso em qualquer dia e hora.': 'Concordo',
      'O prazo de entrega dos serviços é informado.': 'Indiferente',
      'As taxas cobradas pelos serviços são informadas.': 'Indiferente',
      'As informações disponibilizadas estão atualizadas.': 'Concordo',
      'Os serviços oferecidos são confiáveis.': 'Concordo totalmente',
      'Os serviços permitem interações em tempo real (ex. chatbot, IA).': 'Indiferente'
    }
  ]
};

// Dados de exemplo para compatibilidade (Base20)
const rawCompleteData = {
  type: 'complete',
  data: [
    {
      // QS - Qualidade do Sistema (9 questões)
      'O sistema funciona sem falhas.': 'Concordo',
      'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'Concordo',
      'O sistema é fácil de usar.': 'Discordo',
      'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'Concordo totalmente',
      'O sistema informa sobre as políticas de privacidade e segurança.': 'Concordo',
      'Acredito que meus dados estão seguros neste sistema.': 'Não sei',
      'É fácil localizar os serviços e as informações no sistema.': 'Concordo',
      'A navegação pelo sistema é intuitiva.': 'Concordo',
      'O sistema oferece instruções úteis de como utilizar os serviços.': 'Discordo',
      
      // QI - Qualidade da Informação (4 questões)
      'As informações são fáceis de entender.': 'Concordo',
      'As informações são precisas.': 'Concordo',
      'As informações auxiliam na solicitação dos serviços.': 'Indiferente',
      'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'Indiferente',
      
      // QO - Qualidade da Operação (7 questões)
      'Os serviços oferecem suporte técnico eficiente.': 'Não sei',
      'O atendimento resolve meus problemas.': 'Não sei',
      'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'Concordo',
      'Consigo obter o que preciso no menor tempo possível.': 'Concordo',
      'Os serviços atendem às minhas expectativas.': 'Concordo',
      'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'Não sei',
      'Meus dados são automaticamente identificados na solicitação dos serviços.': 'Não sei',
      
      // Dados demográficos
      'Qual o seu nível de satisfação com o Sistema?': 'Indiferente',
      'Qual o seu sexo?': 'Masculino',
      'Qual a sua idade?': '39',
      'Qual seu nível de escolaridade completo?': 'Pós-Graduação',
      'Você é funcionário público?': 'Sim'
    },
    {
      // QS - Qualidade do Sistema (9 questões)
      'O sistema funciona sem falhas.': 'Concordo totalmente',
      'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'Concordo totalmente',
      'O sistema é fácil de usar.': 'Concordo totalmente',
      'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'Não sei',
      'O sistema informa sobre as políticas de privacidade e segurança.': 'Não sei',
      'Acredito que meus dados estão seguros neste sistema.': 'Concordo',
      'É fácil localizar os serviços e as informações no sistema.': 'Concordo',
      'A navegação pelo sistema é intuitiva.': 'Concordo',
      'O sistema oferece instruções úteis de como utilizar os serviços.': 'Concordo',
      
      // QI - Qualidade da Informação (4 questões)
      'As informações são fáceis de entender.': 'Concordo',
      'As informações são precisas.': 'Concordo',
      'As informações auxiliam na solicitação dos serviços.': 'Não sei',
      'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'Não sei',
      
      // QO - Qualidade da Operação (7 questões)
      'Os serviços oferecem suporte técnico eficiente.': 'Não sei',
      'O atendimento resolve meus problemas.': 'Não sei',
      'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'Concordo',
      'Consigo obter o que preciso no menor tempo possível.': 'Não sei',
      'Os serviços atendem às minhas expectativas.': 'Concordo',
      'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'Não sei',
      'Meus dados são automaticamente identificados na solicitação dos serviços.': 'Não sei',
      
      // Dados demográficos
      'Qual o seu nível de satisfação com o Sistema?': 'Satisfeito',
      'Qual o seu sexo?': 'Masculino',
      'Qual a sua idade?': '36',
      'Qual seu nível de escolaridade completo?': 'Pós-Graduação',
      'Você é funcionário público?': 'Sim'
    },
    {
      // QS - Qualidade do Sistema (9 questões)
      'O sistema funciona sem falhas.': 'Concordo',
      'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'Discordo',
      'O sistema é fácil de usar.': 'Concordo',
      'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'Discordo',
      'O sistema informa sobre as políticas de privacidade e segurança.': 'Discordo',
      'Acredito que meus dados estão seguros neste sistema.': 'Não sei',
      'É fácil localizar os serviços e as informações no sistema.': 'Não sei',
      'A navegação pelo sistema é intuitiva.': 'Discordo',
      'O sistema oferece instruções úteis de como utilizar os serviços.': 'Concordo',
      
      // QI - Qualidade da Informação (4 questões)
      'As informações são fáceis de entender.': 'Não sei',
      'As informações são precisas.': 'Concordo',
      'As informações auxiliam na solicitação dos serviços.': 'Indiferente',
      'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'Não sei',
      
      // QO - Qualidade da Operação (7 questões)
      'Os serviços oferecem suporte técnico eficiente.': 'Não sei',
      'O atendimento resolve meus problemas.': 'Não sei',
      'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'Não sei',
      'Consigo obter o que preciso no menor tempo possível.': 'Concordo',
      'Os serviços atendem às minhas expectativas.': 'Indiferente',
      'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'Concordo',
      'Meus dados são automaticamente identificados na solicitação dos serviços.': 'Não sei',
      
      // Dados demográficos
      'Qual o seu nível de satisfação com o Sistema?': 'Indiferente',
      'Qual o seu sexo?': 'Feminino',
      'Qual a sua idade?': '33',
      'Qual seu nível de escolaridade completo?': 'Ensino Superior',
      'Você é funcionário público?': 'Sim'
    }
  ]
};

// Dados de exemplo para Base8 (8 questões - Portal da Transparência)
const rawTransparencyData = {
  type: 'base8',
  data: [
    {
      'O Portal é fácil de usar.': 'Concordo',
      'É fácil localizar os dados e as informações no Portal.': 'Concordo',
      'A navegação pelo Portal é intuitiva.': 'Concordo',
      'O Portal funciona sem falhas.': 'Indiferente',
      'As informações são fáceis de entender.': 'Concordo',
      'As informações são precisas.': 'Concordo',
      'As informações disponibilizadas estão atualizadas.': 'Concordo',
      'Consigo obter o que preciso no menor tempo possível.': 'Concordo totalmente',
      'Qual o seu nível de satisfação com o Portal da Transparência do RS?': 'Satisfeito',
      'Qual o seu sexo?': 'Masculino',
      'Qual a sua idade?': '36',
      'Qual seu nível de escolaridade completo?': 'Ensino Superior',
      'Você é funcionário público?': 'Sim'
    },
    {
      'O Portal é fácil de usar.': 'Concordo',
      'É fácil localizar os dados e as informações no Portal.': 'Concordo',
      'A navegação pelo Portal é intuitiva.': 'Concordo',
      'O Portal funciona sem falhas.': 'Não sei',
      'As informações são fáceis de entender.': 'Concordo',
      'As informações são precisas.': 'Concordo',
      'As informações disponibilizadas estão atualizadas.': 'Discordo',
      'Consigo obter o que preciso no menor tempo possível.': 'Concordo',
      'Qual o seu nível de satisfação com o Portal da Transparência do RS?': 'Satisfeito',
      'Qual o seu sexo?': 'Masculino',
      'Qual a sua idade?': '65',
      'Qual seu nível de escolaridade completo?': 'Pós-Graduação',
      'Você é funcionário público?': 'Sim'
    },
    {
      'O Portal é fácil de usar.': 'Concordo totalmente',
      'É fácil localizar os dados e as informações no Portal.': 'Concordo totalmente',
      'A navegação pelo Portal é intuitiva.': 'Concordo totalmente',
      'O Portal funciona sem falhas.': 'Concordo',
      'As informações são fáceis de entender.': 'Concordo totalmente',
      'As informações são precisas.': 'Concordo totalmente',
      'As informações disponibilizadas estão atualizadas.': 'Concordo',
      'Consigo obter o que preciso no menor tempo possível.': 'Concordo',
      'Qual o seu nível de satisfação com o Portal da Transparência do RS?': 'Muito satisfeito',
      'Qual o seu sexo?': 'Feminino',
      'Qual a sua idade?': '28',
      'Qual seu nível de escolaridade completo?': 'Pós-Graduação',
      'Você é funcionário público?': 'Não'
    }
  ]
};

// Converter e exportar dados
export const sampleBase20Data = convertSampleData(rawBase20Data);
export const sampleCompleteData = convertSampleData(rawCompleteData); // Compatibilidade
export const sampleBase26Data = convertSampleData(rawBase26Data);
export const sampleTransparencyData = convertSampleData(rawTransparencyData); // Base8
export const sampleBase8Data = sampleTransparencyData; // Alias para clareza

// Exportar mapeamentos e funções utilitárias
export { 
  QUESTION_MAPPING, 
  BASE26_QUESTION_MAPPING, 
  BASE20_QUESTION_MAPPING, 
  BASE8_QUESTION_MAPPING,
  QUESTION_SETS,
  DIMENSION_STRUCTURE,
  detectQuestionnaireType,
  LIKERT_MAPPING 
};

