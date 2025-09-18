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

// Mapeamento das questões para códigos
const COMPLETE_QUESTION_MAPPING = {
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
  'Os serviços permitem interações em tempo real (ex. chatbot, IA).': 'QO9'
};

const TRANSPARENCY_QUESTION_MAPPING = {
  'O Portal é fácil de usar.': 'QS3',
  'É fácil localizar os dados e as informações no Portal.': 'QS8',
  'A navegação pelo Portal é intuitiva.': 'QS9',
  'O Portal funciona sem falhas.': 'QS1'
};

const QUESTION_MAPPING = {
  ...COMPLETE_QUESTION_MAPPING,
  ...TRANSPARENCY_QUESTION_MAPPING
};

// Função para converter dados de exemplo para formato processado
function convertSampleData(rawData) {
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
    data: convertedData
  };
}

const rawCompleteData = {
  type: 'complete',
  data: [
    {
      'O sistema funciona sem falhas.': 'Concordo',
      'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'Concordo',
      'O sistema é fácil de usar.': 'Discordo',
      'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'Concordo totalmente',
      'O sistema informa sobre as políticas de privacidade e segurança.': 'Concordo',
      'Acredito que meus dados estão seguros neste sistema.': 'Não sei',
      'É fácil localizar os serviços e as informações no sistema.': 'Concordo',
      'A navegação pelo sistema é intuitiva.': 'Concordo',
      'O sistema oferece instruções úteis de como utilizar os serviços.': 'Discordo',
      'As informações são fáceis de entender.': 'Concordo',
      'As informações são precisas.': 'Concordo',
      'As informações auxiliam na solicitação dos serviços.': 'Indiferente',
      'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'Indiferente',
      'Os serviços oferecem suporte técnico eficiente.': 'Não sei',
      'O atendimento resolve meus problemas.': 'Não sei',
      'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'Concordo',
      'Consigo obter o que preciso no menor tempo possível.': 'Concordo',
      'Os serviços atendem às minhas expectativas.': 'Concordo',
      'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'Não sei',
      'Meus dados são automaticamente identificados na solicitação dos serviços.': 'Não sei',
      'Os serviços oferecidos são confiáveis.': 'Concordo',
      'Os serviços permitem interações em tempo real (ex. chatbot, IA).': 'Não sei',
      'Qual o seu nível de satisfação com o Sistema?': 'Indiferente',
      'Qual o seu sexo?': 'Masculino',
      'Qual a sua idade?': '39',
      'Qual seu nível de escolaridade completo?': 'Pós-Graduação',
      'Você é funcionário público?': 'Sim'
    },
    {
      'O sistema funciona sem falhas.': 'Concordo totalmente',
      'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'Concordo totalmente',
      'O sistema é fácil de usar.': 'Concordo totalmente',
      'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'Não sei',
      'O sistema informa sobre as políticas de privacidade e segurança.': 'Não sei',
      'Acredito que meus dados estão seguros neste sistema.': 'Concordo',
      'É fácil localizar os serviços e as informações no sistema.': 'Concordo',
      'A navegação pelo sistema é intuitiva.': 'Concordo',
      'O sistema oferece instruções úteis de como utilizar os serviços.': 'Concordo',
      'As informações são fáceis de entender.': 'Concordo',
      'As informações são precisas.': 'Concordo',
      'As informações auxiliam na solicitação dos serviços.': 'Não sei',
      'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'Não sei',
      'Os serviços oferecem suporte técnico eficiente.': 'Não sei',
      'O atendimento resolve meus problemas.': 'Não sei',
      'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'Concordo',
      'Consigo obter o que preciso no menor tempo possível.': 'Não sei',
      'Os serviços atendem às minhas expectativas.': 'Concordo',
      'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'Não sei',
      'Meus dados são automaticamente identificados na solicitação dos serviços.': 'Não sei',
      'Os serviços oferecidos são confiáveis.': 'Concordo',
      'Os serviços permitem interações em tempo real (ex. chatbot, IA).': 'Discordo',
      'Qual o seu nível de satisfação com o Sistema?': 'Satisfeito',
      'Qual o seu sexo?': 'Masculino',
      'Qual a sua idade?': '36',
      'Qual seu nível de escolaridade completo?': 'Pós-Graduação',
      'Você é funcionário público?': 'Sim'
    },
    {
      'O sistema funciona sem falhas.': 'Concordo',
      'Os recursos de acessibilidade do sistema são fáceis de encontrar.': 'Discordo',
      'O sistema é fácil de usar.': 'Concordo',
      'O desempenho do sistema é satisfatório, independentemente da forma de acesso.': 'Discordo',
      'O sistema informa sobre as políticas de privacidade e segurança.': 'Discordo',
      'Acredito que meus dados estão seguros neste sistema.': 'Não sei',
      'É fácil localizar os serviços e as informações no sistema.': 'Não sei',
      'A navegação pelo sistema é intuitiva.': 'Discordo',
      'O sistema oferece instruções úteis de como utilizar os serviços.': 'Concordo',
      'As informações são fáceis de entender.': 'Não sei',
      'As informações são precisas.': 'Concordo',
      'As informações auxiliam na solicitação dos serviços.': 'Indiferente',
      'Todas as informações necessárias para a solicitação dos serviços são fornecidas.': 'Não sei',
      'Os serviços oferecem suporte técnico eficiente.': 'Não sei',
      'O atendimento resolve meus problemas.': 'Não sei',
      'Os serviços permitem a conclusão das tarefas no menor tempo possível.': 'Não sei',
      'Consigo obter o que preciso no menor tempo possível.': 'Concordo',
      'Os serviços atendem às minhas expectativas.': 'Indiferente',
      'Quando preciso de ajuda, minhas dificuldades são resolvidas.': 'Concordo',
      'Meus dados são automaticamente identificados na solicitação dos serviços.': 'Não sei',
      'Os serviços oferecidos são confiáveis.': 'Concordo',
      'Os serviços permitem interações em tempo real (ex. chatbot, IA).': 'Discordo',
      'Qual o seu nível de satisfação com o Sistema?': 'Indiferente',
      'Qual o seu sexo?': 'Feminino',
      'Qual a sua idade?': '33',
      'Qual seu nível de escolaridade completo?': 'Ensino Superior',
      'Você é funcionário público?': 'Sim'
    }
  ]
};

const rawTransparencyData = {
  type: 'transparency',
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
export const sampleCompleteData = convertSampleData(rawCompleteData);
export const sampleTransparencyData = convertSampleData(rawTransparencyData);

