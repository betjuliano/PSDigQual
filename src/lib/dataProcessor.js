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

// Questões específicas do questionário do Portal da Transparência
const TRANSPARENCY_QUESTION_MAPPING = {
  'O Portal é fácil de usar.': 'QS3',
  'É fácil localizar os dados e as informações no Portal.': 'QS8',
  'A navegação pelo Portal é intuitiva.': 'QS9',
  'O Portal funciona sem falhas.': 'QS1',
  // Questões adicionais do Base8
  'As informações são fáceis de entender.': 'QI1',
  'As informações são precisas.': 'QI2',
  'As informações disponibilizadas estão atualizadas.': 'QI7',
  'Consigo obter o que preciso no menor tempo possível.': 'QO4'
};

const QUESTION_MAPPING = {
  ...COMPLETE_QUESTION_MAPPING,
  ...TRANSPARENCY_QUESTION_MAPPING
};

const TRANSPARENCY_CODES = new Set(['QS1', 'QS3', 'QS8', 'QS9', 'QI1', 'QI2', 'QI7', 'QO4']);
const TRANSPARENCY_SPECIFIC_LABELS = new Set(Object.keys(TRANSPARENCY_QUESTION_MAPPING));
const NORMALIZED_QUESTION_CODE_MAP = new Map(
  Object.entries(QUESTION_MAPPING).map(([text, code]) => [createNormalizedQuestionKey(text), code])
);
const DEFAULT_QUESTION_TEXT = Object.fromEntries(
  Object.entries(COMPLETE_QUESTION_MAPPING).map(([text, code]) => [code, text])
);
const TRANSPARENCY_QUESTION_TEXT = Object.fromEntries(
  Object.entries(TRANSPARENCY_QUESTION_MAPPING).map(([text, code]) => [code, text])
);

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

// Faixas etárias utilizadas na aplicação
const AGE_RANGE_LABELS = [
  'Até 20 anos',
  'De 21 a 23 anos',
  'De 24 a 32 anos',
  'Acima de 33 anos'
];

function normalizeText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

function createNormalizedQuestionKey(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[aeiou]/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeProfileKey(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getProfileTokens(value) {
  if (value === null || value === undefined) {
    return [];
  }

  const normalized = normalizeProfileKey(value)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  if (!normalized) {
    return [];
  }

  return normalized.split(/\s+/).filter(Boolean);
}

function getProfileCategory(header) {
  if (!header) {
    return null;
  }

  const tokens = getProfileTokens(header);
  if (tokens.length === 0) {
    return null;
  }

  const tokenSet = new Set(tokens);

  if (tokenSet.has('sexo') || tokenSet.has('genero')) {
    return 'sexo';
  }

  const hasIdade = tokenSet.has('idade') ||
    tokenSet.has('faixaidade') ||
    (tokenSet.has('faixa') && tokenSet.has('etaria')) ||
    tokenSet.has('etaria');
  if (hasIdade) {
    return 'idade';
  }

  const hasEscolaridade = tokenSet.has('escolaridade') ||
    tokenSet.has('escolar') ||
    tokenSet.has('instrucao') ||
    tokenSet.has('formacao');
  if (hasEscolaridade) {
    return 'escolaridade';
  }

  const hasFuncionario = tokens.some(token => token.startsWith('funcionari'));
  const hasServidor = tokens.some(token => token.startsWith('servidor'));
  const hasPublico = tokens.some(token => token.startsWith('public'));
  const hasPublicServiceContext = hasPublico && (
    hasFuncionario ||
    hasServidor ||
    tokenSet.has('setor') ||
    tokenSet.has('servico') ||
    tokenSet.has('servicos') ||
    tokenSet.has('trabalha') ||
    tokenSet.has('atua') ||
    tokenSet.has('agente')
  );

  if (hasFuncionario || hasServidor || hasPublicServiceContext) {
    return 'servidor';
  }

  return null;
}

function assignProfileValue(row, category, rawValue) {
  if (!row || !category) {
    return;
  }

  const canonicalKey = `__profile__${category}`;
  const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

  if (value === undefined || value === null || value === '') {
    if (!(canonicalKey in row)) {
      row[canonicalKey] = null;
    }
    return;
  }

  row[canonicalKey] = value;
}

function getProfileValue(row, category) {
  if (!row || !category) {
    return undefined;
  }

  const canonicalKey = `__profile__${category}`;
  if (canonicalKey in row) {
    return row[canonicalKey];
  }

  const matchingKey = Object.keys(row).find(key => getProfileCategory(key) === category);
  return matchingKey ? row[matchingKey] : undefined;
}

function getAgeRangeFromNumber(age) {
  if (age === null || age === undefined || Number.isNaN(age)) {
    return null;
  }

  if (age <= 20) return 'Até 20 anos';
  if (age <= 23) return 'De 21 a 23 anos';
  if (age <= 32) return 'De 24 a 32 anos';
  return 'Acima de 33 anos';
}

function determineAgeRange(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return getAgeRangeFromNumber(value);
  }

  const stringValue = String(value).trim();
  if (stringValue === '') {
    return null;
  }

  if (AGE_RANGE_LABELS.includes(stringValue)) {
    return stringValue;
  }

  const normalizedNumber = Number(stringValue.replace(',', '.'));
  if (!Number.isNaN(normalizedNumber)) {
    return getAgeRangeFromNumber(normalizedNumber);
  }

  const numberMatches = stringValue.match(/\d+/g);
  if (numberMatches && numberMatches.length > 0) {
    const numbers = numberMatches
      .map(match => Number(match))
      .filter(num => !Number.isNaN(num));

    if (numbers.length > 0) {
      if (numbers.length >= 2) {
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        const rangeCategories = new Set([
          getAgeRangeFromNumber(min),
          getAgeRangeFromNumber(max)
        ].filter(Boolean));

        if (rangeCategories.size === 1) {
          return rangeCategories.values().next().value;
        }

        const average = (min + max) / 2;
        return getAgeRangeFromNumber(average);
      }

      return getAgeRangeFromNumber(numbers[0]);
    }
  }

  return stringValue;
}

function normalizeServidorResponse(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const stringValue = String(value).trim();
  if (stringValue === '') {
    return null;
  }

  const normalized = stringValue.toLowerCase();

  if (normalized === 'sim' || normalized === 'yes') {
    return 'Sim';
  }

  if (normalized === 'não' || normalized === 'nao' || normalized === 'no') {
    return 'Não';
  }

  if (normalized.includes('não') || normalized.includes('nao')) {
    return 'Não';
  }

  if (normalized.includes('funcion') || normalized.includes('servid')) {
    return 'Sim';
  }

  return stringValue;
}

function getQuestionCodeForHeader(header) {
  if (!header) {
    return null;
  }

  if (QUESTION_MAPPING[header]) {
    return QUESTION_MAPPING[header];
  }

  const normalizedKey = createNormalizedQuestionKey(header);
  return NORMALIZED_QUESTION_CODE_MAP.get(normalizedKey) || null;
}

// Enhanced character replacement patterns for Portuguese corruptions with comprehensive coverage
const CHARACTER_REPLACEMENTS = {
  // UTF-8 to Latin-1 corruptions - lowercase vowels with accents
  'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
  'Ã ': 'à', 'Ã¢': 'â', 'Ã£': 'ã', 'Ãª': 'ê', 'Ã´': 'ô',
  'Ã¨': 'è', 'Ã¬': 'ì', 'Ã²': 'ò', 'Ã¹': 'ù', 'Ã¯': 'ï',
  'Ã«': 'ë', 'Ã¼': 'ü', 'Ã¶': 'ö', 'Ã¤': 'ä', 'Ã§': 'ç',
  
  // UTF-8 to Latin-1 corruptions - uppercase vowels with accents
  'Ã\u0081': 'Á', 'Ã\u0089': 'É', 'Ã\u008d': 'Í', 'Ã\u0093': 'Ó', 'Ã\u009a': 'Ú',
  'Ã\u0080': 'À', 'Ã\u0082': 'Â', 'Ã\u0083': 'Ã', 'Ã\u008a': 'Ê', 'Ã\u0094': 'Ô',
  'Ã\u0088': 'È', 'Ã\u008c': 'Ì', 'Ã\u0092': 'Ò', 'Ã\u0099': 'Ù', 'Ã\u008f': 'Ï',
  'Ã\u008b': 'Ë', 'Ã\u009c': 'Ü', 'Ã\u0096': 'Ö', 'Ã\u0084': 'Ä', 'Ã\u0087': 'Ç',
  
  // Alternative uppercase patterns (different byte representations)
  'Ã\u0081': 'Á', 'Ã\u0089': 'É', 'Ã\u008D': 'Í', 'Ã\u0093': 'Ó', 'Ã\u009A': 'Ú',
  'Ã\u0087': 'Ç', 'Ã\u0080': 'À', 'Ã\u0082': 'Â', 'Ã\u0083': 'Ã', 'Ã\u008A': 'Ê',
  'Ã\u0094': 'Ô', 'Ã\u0088': 'È',
  
  // Portuguese-specific multi-character patterns (highest priority)
  'Ã§Ã£o': 'ção', 'Ã§Ãµes': 'ções', 'Ã§Ã£': 'ção',
  'sÃ£o': 'são', 'nÃ£o': 'não', 'entÃ£o': 'então', 'mÃ£o': 'mão',
  'coraÃ§Ã£o': 'coração', 'liÃ§Ã£o': 'lição', 'posiÃ§Ã£o': 'posição',
  'informaÃ§Ã£o': 'informação', 'informaÃ§Ãµes': 'informações',
  'navegaÃ§Ã£o': 'navegação', 'operaÃ§Ã£o': 'operação',
  'situaÃ§Ã£o': 'situação', 'aplicaÃ§Ã£o': 'aplicação',
  'organizaÃ§Ã£o': 'organização', 'comunicaÃ§Ã£o': 'comunicação',
  'administraÃ§Ã£o': 'administração', 'configuraÃ§Ã£o': 'configuração',
  'integraÃ§Ã£o': 'integração', 'implementaÃ§Ã£o': 'implementação',
  'documentaÃ§Ã£o': 'documentação', 'apresentaÃ§Ã£o': 'apresentação',
  
  // Common Portuguese words with corruptions
  'fÃ¡cil': 'fácil', 'difÃ­cil': 'difícil', 'pÃºblico': 'público',
  'nÃ­vel': 'nível', 'possÃ­vel': 'possível', 'disponÃ­vel': 'disponível',
  'VocÃª': 'Você', 'vocÃª': 'você', 'tambÃ©m': 'também',
  'atÃ©': 'até', 'jÃ¡': 'já', 'sÃ³': 'só', 'nÃ³s': 'nós',
  'estÃ¡': 'está', 'serÃ¡': 'será', 'poderÃ¡': 'poderá',
  'qualidade': 'qualidade', 'serviÃ§o': 'serviço', 'serviÃ§os': 'serviços',
  'atendimento': 'atendimento', 'satisfaÃ§Ã£o': 'satisfação',
  'expectativas': 'expectativas', 'funcionalidade': 'funcionalidade',
  'acessibilidade': 'acessibilidade', 'usabilidade': 'usabilidade',
  'seguranÃ§a': 'segurança', 'privacidade': 'privacidade',
  'transparÃªncia': 'transparência', 'eficiÃªncia': 'eficiência',
  
  // Windows-1252 specific corruptions (smart quotes, dashes, etc.)
  'â€™': "'", 'â€œ': '"', 'â€\u009d': '"', 'â€"': '–', 'â€"': '—',
  'â€¦': '...', 'â€¢': '•', 'Â': '', 'â€': '"', 'â€˜': "'",
  'â€š': ',', 'â€ž': '„', 'â€º': '›', 'â€¹': '‹',
  
  // ISO-8859-1 to UTF-8 double encoding issues
  'Ã‚Â': '', 'Ã‚': '', 'Â©': '©', 'Â®': '®', 'Â°': '°',
  'Â±': '±', 'Â²': '²', 'Â³': '³', 'Âµ': 'µ', 'Â¶': '¶',
  'Â·': '·', 'Â¹': '¹', 'Âº': 'º', 'Â¼': '¼', 'Â½': '½', 'Â¾': '¾',
  
  // Additional corruption patterns found in real CSV files
  'Ã¢â‚¬â„¢': "'", 'Ã¢â‚¬Å"': '"', 'Ã¢â‚¬\u009d': '"',
  'Ã¢â‚¬â€œ': '–', 'Ã¢â‚¬â€"': '—', 'Ã¢â‚¬Â¦': '...',
  
  // Specific questionnaire-related terms
  'questionÃ¡rio': 'questionário', 'avaliaÃ§Ã£o': 'avaliação',
  'pesquisa': 'pesquisa', 'resposta': 'resposta', 'pergunta': 'pergunta',
  'sistema': 'sistema', 'portal': 'portal', 'plataforma': 'plataforma',
  'governo': 'governo', 'eletrÃ´nico': 'eletrônico', 'digital': 'digital',
  
  // Generic cleanup patterns (lowest priority)
  '�': '', '\ufffd': '', '\u0000': '', '\uFEFF': '', // BOM and replacement chars
  '\x00': '', '\x01': '', '\x02': '', '\x03': '', '\x04': '', // Control chars
  '\x05': '', '\x06': '', '\x07': '', '\x08': '', '\x0B': '',
  '\x0C': '', '\x0E': '', '\x0F': '', '\x10': '', '\x11': '',
  '\x12': '', '\x13': '', '\x14': '', '\x15': '', '\x16': '',
  '\x17': '', '\x18': '', '\x19': '', '\x1A': '', '\x1B': '',
  '\x1C': '', '\x1D': '', '\x1E': '', '\x1F': '', '\x7F': ''
};

// Enhanced encoding detection strategies with comprehensive fallback mechanisms
const ENCODING_STRATEGIES = [
  { 
    name: 'UTF-8', 
    priority: 1,
    description: 'Padrão moderno Unicode (UTF-8)',
    confidence: 0.9,
    fallbackMechanisms: ['character-replacement', 'partial-recovery', 'aggressive-cleanup'],
    indicators: ['valid-utf8-sequences', 'no-replacement-chars', 'proper-portuguese-chars'],
    commonIssues: ['double-encoding', 'bom-issues', 'mixed-encodings']
  },
  { 
    name: 'ISO-8859-1', 
    priority: 2,
    description: 'Latin-1 (ISO-8859-1) - sistemas legados',
    confidence: 0.8,
    fallbackMechanisms: ['character-replacement', 'byte-mapping', 'extended-ascii-mapping'],
    indicators: ['extended-ascii-range', 'portuguese-accents', 'legacy-systems'],
    commonIssues: ['utf8-to-latin1-corruption', 'missing-chars', 'control-chars']
  },
  { 
    name: 'Windows-1252', 
    priority: 3,
    description: 'Windows Latin-1 (CP1252) - Microsoft systems',
    confidence: 0.7,
    fallbackMechanisms: ['character-replacement', 'smart-quotes-fix', 'windows-specific-chars'],
    indicators: ['smart-quotes', 'windows-dashes', 'cp1252-chars'],
    commonIssues: ['smart-quote-corruption', 'dash-issues', 'currency-symbols']
  },
  {
    name: 'UTF-16LE',
    priority: 4,
    description: 'UTF-16 Little Endian (menos comum)',
    confidence: 0.5,
    fallbackMechanisms: ['encoding-conversion', 'bom-detection', 'character-replacement'],
    indicators: ['utf16-bom', 'wide-chars', 'null-bytes'],
    commonIssues: ['bom-confusion', 'endianness-issues', 'truncation']
  },
  {
    name: 'UTF-16BE',
    priority: 5,
    description: 'UTF-16 Big Endian (raro)',
    confidence: 0.4,
    fallbackMechanisms: ['encoding-conversion', 'bom-detection', 'character-replacement'],
    indicators: ['utf16-bom-be', 'reversed-bytes', 'wide-chars'],
    commonIssues: ['bom-confusion', 'endianness-issues', 'truncation']
  }
];

// Enhanced function to apply character replacements with robust fallback mechanisms
export function applyCharacterReplacements(text, options = {}) {
  if (!text || typeof text !== 'string') {
    return { text, replacementCount: 0, replacementLog: [] };
  }

  let cleanedText = text;
  let replacementCount = 0;
  const replacementLog = [];
  const startTime = Date.now();
  
  console.log('🔧 Iniciando correção avançada de caracteres...');
  console.log(`📏 Tamanho do texto: ${text.length} caracteres`);
  
  // Pre-analysis: Detect encoding issues and corruption patterns
  const corruptionAnalysis = analyzeTextCorruption(text);
  console.log(`🔍 Análise de corrupção: ${corruptionAnalysis.totalIssues} problemas detectados`);
  
  if (corruptionAnalysis.totalIssues === 0) {
    console.log('✅ Texto já está limpo, nenhuma correção necessária');
    return { text, replacementCount: 0, replacementLog: [] };
  }
  
  // Phase 1: Multi-character Portuguese patterns (highest priority)
  console.log('🔄 Fase 1: Correção de padrões multi-caractere...');
  const multiCharResult = applyMultiCharacterPatterns(cleanedText, options);
  cleanedText = multiCharResult.text;
  replacementCount += multiCharResult.count;
  replacementLog.push(...multiCharResult.log);
  
  // Phase 2: Single character replacements from mapping
  console.log('🔄 Fase 2: Correção de caracteres individuais...');
  const singleCharResult = applySingleCharacterReplacements(cleanedText, options);
  cleanedText = singleCharResult.text;
  replacementCount += singleCharResult.count;
  replacementLog.push(...singleCharResult.log);
  
  // Phase 3: Advanced regex patterns for complex corruptions
  console.log('🔄 Fase 3: Padrões regex avançados...');
  const regexResult = applyAdvancedRegexPatterns(cleanedText, options);
  cleanedText = regexResult.text;
  replacementCount += regexResult.count;
  replacementLog.push(...regexResult.log);
  
  // Phase 4: Contextual corrections based on surrounding text
  console.log('🔄 Fase 4: Correções contextuais...');
  const contextualResult = applyContextualCorrections(cleanedText, options);
  cleanedText = contextualResult.text;
  replacementCount += contextualResult.count;
  replacementLog.push(...contextualResult.log);
  
  // Phase 5: Final cleanup and normalization
  console.log('🔄 Fase 5: Limpeza final...');
  const cleanupResult = applyFinalCleanup(cleanedText, options);
  cleanedText = cleanupResult.text;
  replacementCount += cleanupResult.count;
  replacementLog.push(...cleanupResult.log);
  
  const processingTime = Date.now() - startTime;
  
  // Final quality assessment
  const finalQuality = calculateTextQuality(cleanedText);
  const qualityScore = typeof finalQuality === 'object' ? finalQuality.score : finalQuality;
  
  // Log comprehensive results
  console.log(`✅ Correção concluída em ${processingTime}ms`);
  console.log(`📊 Estatísticas finais:`);
  console.log(`  • Total de correções: ${replacementCount}`);
  console.log(`  • Qualidade final: ${(qualityScore * 100).toFixed(1)}%`);
  console.log(`  • Tipos de correção: ${replacementLog.length}`);
  
  if (options.verbose && replacementLog.length > 0) {
    console.log('📋 Detalhes das correções:');
    const topCorrections = replacementLog
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 15);
    
    topCorrections.forEach(log => {
      if (typeof log === 'string') {
        console.log(`  • ${log}`);
      } else {
        console.log(`  • ${log.description}: ${log.count} correções`);
      }
    });
    
    if (replacementLog.length > 15) {
      console.log(`  • ... e mais ${replacementLog.length - 15} tipos de correções`);
    }
  }
  
  return {
    text: cleanedText,
    replacementCount,
    replacementLog: options.verbose ? replacementLog : replacementLog.slice(0, 10),
    qualityImprovement: qualityScore - corruptionAnalysis.originalQuality,
    processingTime
  };
}

// Helper function to analyze text corruption patterns
function analyzeTextCorruption(text) {
  const corruptionPatterns = [
    { pattern: /Ã[¡-ÿ]/g, name: 'UTF-8 to Latin-1 corruptions', severity: 'high' },
    { pattern: /â€[™œ\u009d""]/g, name: 'Windows-1252 smart quotes', severity: 'medium' },
    { pattern: /[�\ufffd]/g, name: 'Replacement characters', severity: 'high' },
    { pattern: /[\u0000-\u001f\u007f-\u009f]/g, name: 'Control characters', severity: 'medium' },
    { pattern: /Ã§Ã£o|Ã§Ãµes/g, name: 'Portuguese word corruptions', severity: 'high' },
    { pattern: /\s{4,}/g, name: 'Excessive whitespace', severity: 'low' }
  ];
  
  let totalIssues = 0;
  const issueDetails = [];
  
  corruptionPatterns.forEach(({ pattern, name, severity }) => {
    const matches = (text.match(pattern) || []).length;
    if (matches > 0) {
      const weight = severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;
      totalIssues += matches * weight;
      issueDetails.push({ name, matches, severity, weight: matches * weight });
    }
  });
  
  const originalQuality = calculateTextQuality(text);
  const qualityScore = typeof originalQuality === 'object' ? originalQuality.score : originalQuality;
  
  return {
    totalIssues,
    issueDetails,
    originalQuality: qualityScore,
    needsCorrection: totalIssues > 0
  };
}

// Phase 1: Multi-character Portuguese patterns
function applyMultiCharacterPatterns(text, options = {}) {
  const patterns = {
    // Portuguese-specific multi-character corruptions (highest priority)
    'Ã§Ã£o': 'ção', 'Ã§Ãµes': 'ções', 'Ã§Ã£': 'ção',
    'sÃ£o': 'são', 'nÃ£o': 'não', 'entÃ£o': 'então', 'mÃ£o': 'mão',
    'coraÃ§Ã£o': 'coração', 'liÃ§Ã£o': 'lição', 'posiÃ§Ã£o': 'posição',
    'informaÃ§Ã£o': 'informação', 'informaÃ§Ãµes': 'informações',
    'navegaÃ§Ã£o': 'navegação', 'operaÃ§Ã£o': 'operação',
    'situaÃ§Ã£o': 'situação', 'aplicaÃ§Ã£o': 'aplicação',
    'organizaÃ§Ã£o': 'organização', 'comunicaÃ§Ã£o': 'comunicação',
    'administraÃ§Ã£o': 'administração', 'configuraÃ§Ã£o': 'configuração',
    'integraÃ§Ã£o': 'integração', 'implementaÃ§Ã£o': 'implementação',
    'documentaÃ§Ã£o': 'documentação', 'apresentaÃ§Ã£o': 'apresentação',
    
    // Common Portuguese words with corruptions
    'fÃ¡cil': 'fácil', 'difÃ­cil': 'difícil', 'pÃºblico': 'público',
    'nÃ­vel': 'nível', 'possÃ­vel': 'possível', 'disponÃ­vel': 'disponível',
    'VocÃª': 'Você', 'vocÃª': 'você', 'tambÃ©m': 'também',
    'atÃ©': 'até', 'jÃ¡': 'já', 'sÃ³': 'só', 'nÃ³s': 'nós',
    'estÃ¡': 'está', 'serÃ¡': 'será', 'poderÃ¡': 'poderá',
    
    // Questionnaire-specific terms
    'questionÃ¡rio': 'questionário', 'avaliaÃ§Ã£o': 'avaliação',
    'qualidade': 'qualidade', 'serviÃ§o': 'serviço', 'serviÃ§os': 'serviços',
    'atendimento': 'atendimento', 'satisfaÃ§Ã£o': 'satisfação',
    'expectativas': 'expectativas', 'funcionalidade': 'funcionalidade',
    'acessibilidade': 'acessibilidade', 'usabilidade': 'usabilidade',
    'seguranÃ§a': 'segurança', 'privacidade': 'privacidade',
    'transparÃªncia': 'transparência', 'eficiÃªncia': 'eficiência'
  };
  
  let cleanedText = text;
  let count = 0;
  const log = [];
  
  // Sort patterns by length (longest first) to avoid partial replacements
  const sortedPatterns = Object.entries(patterns)
    .sort(([a], [b]) => b.length - a.length);
  
  sortedPatterns.forEach(([corrupted, correct]) => {
    const regex = new RegExp(escapeRegExp(corrupted), 'gi');
    const matches = (cleanedText.match(regex) || []).length;
    if (matches > 0) {
      cleanedText = cleanedText.replace(regex, correct);
      count += matches;
      log.push({
        type: 'multi-char',
        pattern: `${corrupted} → ${correct}`,
        count: matches,
        description: `Padrão multi-caractere: ${corrupted} → ${correct}`
      });
    }
  });
  
  return { text: cleanedText, count, log };
}

// Phase 2: Single character replacements
function applySingleCharacterReplacements(text, options = {}) {
  let cleanedText = text;
  let count = 0;
  const log = [];
  
  // Group replacements by frequency to optimize performance
  const frequentReplacements = {};
  const rareReplacements = {};
  
  Object.entries(CHARACTER_REPLACEMENTS).forEach(([corrupted, correct]) => {
    if (corrupted.length === 1 || corrupted.length === 2) {
      // Estimate frequency based on pattern complexity
      if (corrupted.includes('Ã') || corrupted.includes('â€')) {
        frequentReplacements[corrupted] = correct;
      } else {
        rareReplacements[corrupted] = correct;
      }
    }
  });
  
  // Apply frequent replacements first
  Object.entries(frequentReplacements).forEach(([corrupted, correct]) => {
    const regex = new RegExp(escapeRegExp(corrupted), 'g');
    const matches = (cleanedText.match(regex) || []).length;
    if (matches > 0) {
      cleanedText = cleanedText.replace(regex, correct);
      count += matches;
      if (matches > 3) { // Only log significant replacements
        log.push({
          type: 'single-char-frequent',
          pattern: `${corrupted} → ${correct}`,
          count: matches,
          description: `Caractere frequente: ${corrupted} → ${correct}`
        });
      }
    }
  });
  
  // Apply rare replacements
  Object.entries(rareReplacements).forEach(([corrupted, correct]) => {
    const regex = new RegExp(escapeRegExp(corrupted), 'g');
    const matches = (cleanedText.match(regex) || []).length;
    if (matches > 0) {
      cleanedText = cleanedText.replace(regex, correct);
      count += matches;
      if (matches > 1) {
        log.push({
          type: 'single-char-rare',
          pattern: `${corrupted} → ${correct}`,
          count: matches,
          description: `Caractere raro: ${corrupted} → ${correct}`
        });
      }
    }
  });
  
  return { text: cleanedText, count, log };
}

// Phase 3: Advanced regex patterns
function applyAdvancedRegexPatterns(text, options = {}) {
  let cleanedText = text;
  let count = 0;
  const log = [];
  
  const regexPatterns = [
    // UTF-8 to Latin-1 corruption pattern
    { 
      pattern: /Ã([¡-ÿ])/g, 
      replacement: (match, char) => {
        const charCode = char.charCodeAt(0);
        const mapping = {
          161: 'á', 169: 'é', 173: 'í', 179: 'ó', 186: 'ú',
          167: 'ç', 160: 'à', 162: 'â', 163: 'ã', 170: 'ê',
          180: 'ô', 168: 'è', 172: 'ì', 178: 'ò', 185: 'ù',
          175: 'ï', 171: 'ë', 188: 'ü', 182: 'ö', 164: 'ä',
          129: 'Á', 137: 'É', 141: 'Í', 147: 'Ó', 154: 'Ú',
          135: 'Ç', 128: 'À', 130: 'Â', 131: 'Ã', 138: 'Ê',
          148: 'Ô', 136: 'È'
        };
        const replacement = mapping[charCode];
        if (replacement) {
          count++;
          return replacement;
        }
        return match;
      },
      description: 'UTF-8 to Latin-1 character mapping'
    },
    
    // Windows-1252 smart quotes pattern
    { 
      pattern: /â€([™œ\u009d""])/g, 
      replacement: (match, char) => {
        const mapping = {
          '™': "'", 'œ': '"', '\u009d': '"', '"': '"', '"': '"'
        };
        const replacement = mapping[char] || match;
        if (replacement !== match) count++;
        return replacement;
      },
      description: 'Windows-1252 smart quotes fix'
    },
    
    // Portuguese word endings
    { 
      pattern: /([a-zA-Z])Ã§Ã£o/g, 
      replacement: '$1ção',
      description: 'Portuguese -ção endings'
    },
    
    // Portuguese plurals
    { 
      pattern: /([a-zA-Z])Ã§Ãµes/g, 
      replacement: '$1ções',
      description: 'Portuguese -ções plurals'
    },
    
    // Isolated corrupted characters in whitespace
    { 
      pattern: /\s+Ã([¡-ÿ])\s+/g, 
      replacement: (match, char) => {
        const charCode = char.charCodeAt(0);
        const mapping = {
          161: ' á ', 169: ' é ', 173: ' í ', 179: ' ó ', 186: ' ú ',
          167: ' ç ', 160: ' à ', 162: ' â ', 163: ' ã ', 170: ' ê ',
          180: ' ô ', 168: ' è '
        };
        const replacement = mapping[charCode];
        if (replacement) {
          count++;
          return replacement;
        }
        return match;
      },
      description: 'Isolated corrupted characters'
    }
  ];
  
  regexPatterns.forEach(({ pattern, replacement, description }) => {
    const beforeCount = count;
    if (typeof replacement === 'function') {
      cleanedText = cleanedText.replace(pattern, replacement);
    } else {
      const matches = (cleanedText.match(pattern) || []).length;
      if (matches > 0) {
        cleanedText = cleanedText.replace(pattern, replacement);
        count += matches;
      }
    }
    
    const appliedCount = count - beforeCount;
    if (appliedCount > 0) {
      log.push({
        type: 'regex-pattern',
        description,
        count: appliedCount
      });
    }
  });
  
  return { text: cleanedText, count, log };
}

// Phase 4: Contextual corrections
function applyContextualCorrections(text, options = {}) {
  let cleanedText = text;
  let count = 0;
  const log = [];
  
  // Context-aware corrections based on surrounding text
  const contextualPatterns = [
    // Fix corrupted words in CSV headers (common questionnaire terms)
    {
      pattern: /\b(sistema|portal|serviÃ§o|informaÃ§Ã£o|navegaÃ§Ã£o|qualidade)\b/gi,
      replacement: (match) => {
        const corrections = {
          'serviÃ§o': 'serviço',
          'informaÃ§Ã£o': 'informação',
          'navegaÃ§Ã£o': 'navegação'
        };
        const corrected = corrections[match.toLowerCase()];
        if (corrected && match !== corrected) {
          count++;
          return match[0].toUpperCase() === match[0] ? 
            corrected.charAt(0).toUpperCase() + corrected.slice(1) : corrected;
        }
        return match;
      },
      description: 'Contextual word corrections'
    },
    
    // Fix corrupted Likert scale responses
    {
      pattern: /\b(concordo|discordo|nÃ£o sei|indiferente)\b/gi,
      replacement: (match) => {
        if (match.toLowerCase().includes('nÃ£o')) {
          count++;
          return match.replace(/nÃ£o/gi, 'não');
        }
        return match;
      },
      description: 'Likert scale response corrections'
    }
  ];
  
  contextualPatterns.forEach(({ pattern, replacement, description }) => {
    const beforeCount = count;
    cleanedText = cleanedText.replace(pattern, replacement);
    const appliedCount = count - beforeCount;
    if (appliedCount > 0) {
      log.push({
        type: 'contextual',
        description,
        count: appliedCount
      });
    }
  });
  
  return { text: cleanedText, count, log };
}

// Phase 5: Final cleanup
function applyFinalCleanup(text, options = {}) {
  let cleanedText = text;
  let count = 0;
  const log = [];
  
  const cleanupPatterns = [
    // Remove replacement characters
    { pattern: /[�\ufffd]/g, replacement: '', description: 'Replacement characters' },
    { pattern: /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, replacement: '', description: 'Control characters' },
    
    // Normalize whitespace
    { pattern: /\s{4,}/g, replacement: '   ', description: 'Excessive whitespace' },
    { pattern: /\t{2,}/g, replacement: '\t', description: 'Multiple tabs' },
    
    // Clean up orphaned corruption markers
    { pattern: /\bÃ\b/g, replacement: '', description: 'Orphaned Ã characters' },
    { pattern: /â€(?![™œ\u009d""])/g, replacement: '', description: 'Incomplete smart quote sequences' },
    
    // Fix common CSV formatting issues
    { pattern: /;{2,}/g, replacement: ';', description: 'Multiple semicolons' },
    { pattern: /^;|;$/gm, replacement: '', description: 'Leading/trailing semicolons' }
  ];
  
  cleanupPatterns.forEach(({ pattern, replacement, description }) => {
    const matches = (cleanedText.match(pattern) || []).length;
    if (matches > 0) {
      cleanedText = cleanedText.replace(pattern, replacement);
      count += matches;
      log.push({
        type: 'cleanup',
        description,
        count: matches
      });
    }
  });
  
  return { text: cleanedText, count, log };
}

// Helper function to escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Enhanced function to detect encoding issues in text with detailed analysis
function hasEncodingIssues(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  // Check for common encoding corruption patterns with detailed detection
  const corruptionPatterns = [
    { pattern: /Ã[¡-ÿ]/g, name: 'UTF-8 to Latin-1 corruptions', weight: 1.0 },
    { pattern: /â€[™œ\u009d""]/g, name: 'Windows-1252 smart quotes', weight: 0.8 },
    { pattern: /�/g, name: 'Generic replacement character', weight: 1.0 },
    { pattern: /\ufffd/g, name: 'Unicode replacement character', weight: 1.0 },
    { pattern: /[\u0080-\u009f]/g, name: 'Control characters', weight: 0.6 },
    { pattern: /Ã§Ã£o|Ã§Ãµes/g, name: 'Portuguese word corruptions', weight: 1.0 },
    { pattern: /[^\x00-\x7F\u00A0-\u00FF\u0100-\u017F\u1E00-\u1EFF]/g, name: 'Non-Latin characters', weight: 0.3 }
  ];
  
  let totalIssues = 0;
  let issueDetails = [];
  
  corruptionPatterns.forEach(({ pattern, name, weight }) => {
    const matches = (text.match(pattern) || []).length;
    if (matches > 0) {
      const weightedScore = matches * weight;
      totalIssues += weightedScore;
      issueDetails.push({ name, matches, weightedScore });
    }
  });
  
  const hasIssues = totalIssues > 0;
  
  if (hasIssues) {
    console.log(`⚠️ Detectados problemas de encoding (score: ${totalIssues.toFixed(1)})`);
    issueDetails.forEach(({ name, matches, weightedScore }) => {
      console.log(`  • ${name}: ${matches} ocorrências (peso: ${weightedScore.toFixed(1)})`);
    });
  }
  
  return hasIssues;
}

// Enhanced function to calculate text quality score with detailed metrics
function calculateTextQuality(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  
  const totalChars = text.length;
  if (totalChars === 0) return 0;
  
  // Count different types of problematic characters with weights
  const qualityMetrics = {
    // High impact issues (major encoding problems)
    replacementChars: (text.match(/[�\ufffd]/g) || []).length,
    nullChars: (text.match(/\u0000/g) || []).length,
    utf8Corruptions: (text.match(/Ã[¡-ÿ]/g) || []).length,
    
    // Medium impact issues
    controlChars: (text.match(/[\u0000-\u001f\u007f-\u009f]/g) || []).length,
    smartQuoteCorruptions: (text.match(/â€[™œ\u009d""]/g) || []).length,
    
    // Low impact issues
    extendedAscii: (text.match(/[\u0080-\u00ff]/g) || []).length,
    
    // Positive indicators (good signs)
    validPortugueseChars: (text.match(/[áéíóúàâãêôçÁÉÍÓÚÀÂÃÊÔÇ]/g) || []).length,
    validAscii: (text.match(/[a-zA-Z0-9\s.,;:!?()-]/g) || []).length
  };
  
  // Calculate weighted quality score
  const highImpactPenalty = (qualityMetrics.replacementChars + qualityMetrics.nullChars + qualityMetrics.utf8Corruptions) * 2.0;
  const mediumImpactPenalty = (qualityMetrics.controlChars + qualityMetrics.smartQuoteCorruptions) * 1.0;
  const lowImpactPenalty = qualityMetrics.extendedAscii * 0.1;
  
  const totalPenalty = highImpactPenalty + mediumImpactPenalty + lowImpactPenalty;
  const penaltyRatio = totalPenalty / totalChars;
  
  // Base quality score (1.0 = perfect, 0.0 = completely corrupted)
  let qualityScore = Math.max(0, 1.0 - penaltyRatio);
  
  // Bonus for valid Portuguese characters (indicates successful encoding)
  const portugueseBonus = Math.min(0.1, (qualityMetrics.validPortugueseChars / totalChars) * 0.5);
  qualityScore = Math.min(1.0, qualityScore + portugueseBonus);
  
  // Additional metrics for detailed analysis
  const detailedMetrics = {
    ...qualityMetrics,
    totalChars,
    qualityScore,
    penaltyRatio,
    portugueseBonus,
    encoding: qualityScore > 0.9 ? 'Excelente' : 
              qualityScore > 0.7 ? 'Boa' : 
              qualityScore > 0.5 ? 'Aceitável' : 
              qualityScore > 0.3 ? 'Problemática' : 'Crítica'
  };
  
  return {
    score: qualityScore,
    metrics: detailedMetrics
  };
}

// Enhanced CSV processing function with robust encoding detection
export function processCSVData(csvText, options = {}) {
  try {
    console.log('🔍 Iniciando processamento avançado do CSV...');
    
    let processedText = csvText;
    let encodingUsed = options.encoding || 'UTF-8';
    let characterReplacements = 0;
    let replacementLog = [];
    
    // Enhanced encoding issue detection and correction
    if (hasEncodingIssues(csvText)) {
      console.log('⚠️ Detectados problemas de encoding, aplicando correções...');
      
      const originalQuality = calculateTextQuality(csvText);
      const originalScore = typeof originalQuality === 'object' ? originalQuality.score : originalQuality;
      console.log(`📊 Qualidade original do texto: ${(originalScore * 100).toFixed(1)}%`);
      
      // Apply enhanced character replacements
      const replacementResult = applyCharacterReplacements(csvText, { verbose: true });
      processedText = replacementResult.text;
      characterReplacements = replacementResult.replacementCount;
      replacementLog = replacementResult.replacementLog;
      
      const newQuality = calculateTextQuality(processedText);
      const newScore = typeof newQuality === 'object' ? newQuality.score : newQuality;
      
      console.log(`✅ Aplicadas ${characterReplacements} correções de caracteres`);
      console.log(`📈 Nova qualidade do texto: ${(newScore * 100).toFixed(1)}%`);
      
      // Update encoding information based on improvement
      if (newScore > originalScore + 0.1) {
        encodingUsed = `${encodingUsed} (corrigido automaticamente)`;
      } else if (characterReplacements > 0) {
        encodingUsed = `${encodingUsed} (parcialmente corrigido)`;
      }
    } else {
      console.log('✅ Nenhum problema de encoding detectado');
    }

    const lines = processedText.trim().split('\n');
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
    const questionCodesSet = new Set();
    const headerMetadata = headers.map(header => {
      const profileCategory = getProfileCategory(header);
      const questionCode = profileCategory ? null : getQuestionCodeForHeader(header);

      if (questionCode) {
        questionCodesSet.add(questionCode);
      }

      const isQuestionHeader = Boolean(questionCode) || (!profileCategory && header && header.includes('?'));

      return {
        header,
        questionCode,
        isQuestionHeader,
        profileCategory
      };
    });

    const questionHeaders = headerMetadata.filter(meta => meta.isQuestionHeader);

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
      
      headerMetadata.forEach((meta, index) => {
        const { header, questionCode, profileCategory } = meta;
        const value = values[index];

        if (profileCategory) {
          row[header] = value;
          assignProfileValue(row, profileCategory, value);
          return;
        }

        if (!questionCode) {
          return;
        }

        questionCodesSet.add(questionCode);
        totalQuestions++;

        if (LIKERT_MAPPING[value]) {
          row[questionCode] = LIKERT_MAPPING[value];
          validResponses++;
        } else if (value && value !== '') {
          row[questionCode] = value; // Manter valor original se não for Likert
        } else {
          row[questionCode] = null; // Valor vazio
        }
      });

      // VALIDAÇÃO DA LINHA - MAIS PERMISSIVA
      const responseRate = totalQuestions > 0 ? (validResponses / totalQuestions) : 0;
      
      // Verificar se tem pelo menos uma questão válida
      const hasValidQuestions = Object.keys(row).some(key => 
        (key.startsWith('QS') || key.startsWith('QI') || key.startsWith('QO') || key.startsWith('QT')) &&
        row[key] !== null && row[key] !== undefined && row[key] !== ''
      );
      
      // Aceitar linha se tiver pelo menos uma questão válida (taxa mínima de 10%)
      if (hasValidQuestions && responseRate >= 0.1) {
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
    const questionCodes = Array.from(questionCodesSet);

    console.log(`🎯 Códigos de questões identificados: ${questionCodes.length}`);
    console.log(`📝 Códigos: ${questionCodes.join(', ')}`);

    if (questionCodes.length === 0) {
      console.warn('⚠️ Nenhum código de questão identificado nos dados');
    }

    // Determinar tipo baseado nas questões presentes
    const containsTransparencyLabels = headers.some(header => TRANSPARENCY_SPECIFIC_LABELS.has(header));
    const matchesTransparencyCodes = questionCodes.length > 0 &&
      questionCodes.every(code => TRANSPARENCY_CODES.has(code)) &&
      questionCodes.length <= TRANSPARENCY_CODES.size;

    const type = (containsTransparencyLabels || matchesTransparencyCodes) ? 'transparency' : 'complete';

    console.log(`Processados ${data.length} registros do tipo ${type}`);
    
    const result = {
      data,
      type,
      headers,
      totalRecords: data.length,
      invalidRows: invalidRows.length,
      questionCodes,
      metadata: {
        originalFileName: options.fileName || 'unknown',
        encoding: encodingUsed,
        processedAt: new Date(),
        characterReplacements,
        textQuality: calculateTextQuality(processedText)
      },
      validationSummary: {
        totalLines: lines.length - 1,
        validLines: data.length,
        invalidLines: invalidRows.length,
        questionColumns: questionCodes.length,
        headerColumns: headers.length,
        encodingIssues: characterReplacements,
        cleanupActions: [
          characterReplacements > 0 ? `Corrigidos ${characterReplacements} caracteres` : null,
          invalidRows.length > 0 ? `Removidas ${invalidRows.length} linhas inválidas` : null,
          `Processadas ${data.length} linhas válidas`
        ].filter(Boolean)
      }
    };
    
    console.log('✅ Dados processados com sucesso:', result.validationSummary);
    console.log('📊 Metadados do processamento:', result.metadata);
    
    return result;
  } catch (error) {
    console.error('❌ Erro ao processar CSV:', error);
    throw error;
  }
}

// Alias para compatibilidade com FileUpload
export const parseCSV = processCSVData;

// Enhanced multi-encoding file processing with robust fallback mechanisms
export async function processFileWithMultipleEncodings(file) {
  console.log('🔄 Iniciando processamento robusto com múltiplos encodings...');
  console.log(`📁 Arquivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  
  const startTime = Date.now();
  const encodingAttempts = [];
  let bestResult = null;
  let bestScore = -1;
  
  // Pre-analysis: Try to detect encoding hints from file content
  const encodingHints = await detectEncodingHints(file);
  console.log(`🔍 Dicas de encoding detectadas: ${encodingHints.join(', ') || 'Nenhuma'}`);
  
  // Reorder strategies based on hints
  const orderedStrategies = reorderStrategiesByHints(ENCODING_STRATEGIES, encodingHints);
  
  // Try each encoding strategy with enhanced error handling
  for (const strategy of orderedStrategies) {
    try {
      console.log(`🔍 Tentando encoding: ${strategy.name} - ${strategy.description}`);
      console.log(`  Confiança: ${(strategy.confidence * 100).toFixed(0)}% | Prioridade: ${strategy.priority}`);
      
      // Read file with specific encoding approach
      const text = await readFileWithStrategy(file, strategy);
      
      // Enhanced text quality analysis with detailed metrics
      const qualityAnalysis = calculateTextQuality(text);
      const textQuality = typeof qualityAnalysis === 'object' ? qualityAnalysis.score : qualityAnalysis;
      const qualityMetrics = typeof qualityAnalysis === 'object' ? qualityAnalysis.metrics : null;
      
      console.log(`📊 Qualidade do texto com ${strategy.name}: ${(textQuality * 100).toFixed(1)}%`);
      if (qualityMetrics) {
        console.log(`  • Caracteres problemáticos: ${qualityMetrics.replacementChars + qualityMetrics.utf8Corruptions}`);
        console.log(`  • Caracteres portugueses válidos: ${qualityMetrics.validPortugueseChars}`);
        console.log(`  • Classificação: ${qualityMetrics.encoding}`);
      }
      
      // Apply pre-processing corrections if needed
      let processedText = text;
      let characterReplacements = 0;
      
      if (textQuality < 0.8 || hasEncodingIssues(text)) {
        console.log(`🔧 Aplicando correções pré-processamento para ${strategy.name}...`);
        const correctionResult = applyCharacterReplacements(text, { 
          verbose: false,
          strategy: strategy.name 
        });
        processedText = correctionResult.text;
        characterReplacements = correctionResult.replacementCount;
        
        const newQuality = calculateTextQuality(processedText);
        const newScore = typeof newQuality === 'object' ? newQuality.score : newQuality;
        console.log(`📈 Qualidade após correções: ${(newScore * 100).toFixed(1)}% (+${((newScore - textQuality) * 100).toFixed(1)}%)`);
      }
      
      // Process the CSV data with enhanced error handling
      const result = await processCSVDataRobust(processedText, {
        fileName: file.name,
        encoding: strategy.name,
        textQuality,
        qualityMetrics,
        strategy,
        characterReplacements,
        originalTextLength: text.length,
        processedTextLength: processedText.length
      });
      
      // Calculate comprehensive score for this encoding attempt
      const score = calculateEncodingScore(result, textQuality, strategy.priority, qualityMetrics);
      
      const attemptInfo = {
        encoding: strategy.name,
        description: strategy.description,
        confidence: strategy.confidence,
        result,
        score,
        textQuality,
        qualityMetrics,
        characterReplacements,
        success: result && result.data && result.data.length > 0,
        fallbackMechanisms: strategy.fallbackMechanisms,
        processingTime: Date.now() - startTime
      };
      
      encodingAttempts.push(attemptInfo);
      
      console.log(`📈 Score para ${strategy.name}: ${score.toFixed(3)} (confiança: ${(strategy.confidence * 100).toFixed(0)}%)`);
      
      // Keep track of the best result with weighted scoring
      const weightedScore = score * strategy.confidence;
      if (weightedScore > bestScore && attemptInfo.success) {
        bestScore = weightedScore;
        bestResult = result;
        console.log(`🏆 Novo melhor resultado: ${strategy.name} (score ponderado: ${weightedScore.toFixed(3)})`);
      }
      
      // Early termination for excellent results
      if (score > 0.95 && result.data.length > 0 && textQuality > 0.9 && strategy.confidence > 0.8) {
        console.log(`✅ Encoding ${strategy.name} produziu resultado excelente, parando tentativas`);
        break;
      }
      
      // Continue if result is poor but we haven't tried all high-confidence strategies
      if (score < 0.3 && strategy.confidence > 0.7) {
        console.log(`⚠️ Resultado ruim com ${strategy.name}, mas continuando devido à alta confiança`);
      }
      
    } catch (error) {
      console.warn(`⚠️ Falha com encoding ${strategy.name}:`, error.message);
      encodingAttempts.push({
        encoding: strategy.name,
        description: strategy.description,
        confidence: strategy.confidence,
        result: null,
        score: 0,
        textQuality: 0,
        success: false,
        error: error.message,
        fallbackMechanisms: strategy.fallbackMechanisms,
        processingTime: Date.now() - startTime
      });
    }
  }
  
  // Log comprehensive summary of all attempts
  console.log('📋 Resumo detalhado das tentativas de encoding:');
  console.log('='.repeat(70));
  encodingAttempts.forEach((attempt, index) => {
    const status = attempt.success ? '✅' : '❌';
    const quality = attempt.textQuality ? `${(attempt.textQuality * 100).toFixed(1)}%` : 'N/A';
    const records = attempt.success ? attempt.result.data.length : 0;
    const confidence = `${(attempt.confidence * 100).toFixed(0)}%`;
    
    console.log(`${status} ${index + 1}. ${attempt.encoding} (${attempt.description})`);
    console.log(`   Qualidade: ${quality} | Score: ${attempt.score.toFixed(3)} | Confiança: ${confidence} | Registros: ${records}`);
    
    if (attempt.characterReplacements > 0) {
      console.log(`   Correções aplicadas: ${attempt.characterReplacements}`);
    }
    
    if (attempt.error) {
      console.log(`   Erro: ${attempt.error}`);
    }
    
    if (attempt.success && attempt.result.metadata) {
      const meta = attempt.result.metadata;
      console.log(`   Encoding final: ${meta.encoding} | Tempo: ${attempt.processingTime}ms`);
    }
  });
  console.log('='.repeat(70));
  
  // Return the best result or attempt fallback recovery
  if (bestResult && bestResult.data.length > 0) {
    const processingTime = Date.now() - startTime;
    console.log(`🎯 Melhor resultado selecionado: ${bestResult.metadata.encoding}`);
    console.log(`📊 Estatísticas finais: ${bestResult.data.length} registros válidos em ${processingTime}ms`);
    
    // Add comprehensive encoding attempts info to metadata
    bestResult.metadata.encodingAttempts = encodingAttempts;
    bestResult.metadata.bestScore = bestScore;
    bestResult.metadata.totalAttempts = encodingAttempts.length;
    bestResult.metadata.successfulAttempts = encodingAttempts.filter(a => a.success).length;
    bestResult.metadata.totalProcessingTime = processingTime;
    bestResult.metadata.encodingHints = encodingHints;
    
    return bestResult;
  }
  
  // If no encoding worked, try comprehensive fallback recovery mechanisms
  console.log('🔧 Nenhum encoding padrão funcionou, iniciando recuperação avançada...');
  
  const fallbackResults = await attemptComprehensiveFallbackRecovery(file, encodingAttempts);
  
  // Return best fallback result if available
  if (fallbackResults.length > 0) {
    const bestFallback = fallbackResults.reduce((best, current) => {
      const bestScore = calculateFallbackScore(best.result);
      const currentScore = calculateFallbackScore(current.result);
      return currentScore > bestScore ? current : best;
    });
    
    console.log(`🎯 Usando resultado de recuperação: ${bestFallback.mechanism} (${bestFallback.result.data.length} registros)`);
    
    bestFallback.result.metadata.recoveryMethod = bestFallback.mechanism;
    bestFallback.result.metadata.baseEncoding = bestFallback.baseEncoding;
    bestFallback.result.metadata.encodingAttempts = encodingAttempts;
    bestFallback.result.metadata.fallbackResults = fallbackResults;
    bestFallback.result.metadata.totalProcessingTime = Date.now() - startTime;
    
    return bestFallback.result;
  }
  
  // Final error with comprehensive diagnostic information
  const totalProcessingTime = Date.now() - startTime;
  const errorDetails = encodingAttempts.map(a => 
    `${a.encoding} (${(a.confidence * 100).toFixed(0)}%): ${a.success ? `${a.result.data.length} registros` : a.error || 'Falhou'}`
  ).join('; ');
  
  throw new Error(
    `Não foi possível processar o arquivo após ${totalProcessingTime}ms de tentativas.\n\n` +
    `📊 Resumo das tentativas:\n${errorDetails}\n\n` +
    `🔍 Diagnóstico:\n` +
    `• Arquivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)\n` +
    `• Tentativas de encoding: ${encodingAttempts.length}\n` +
    `• Tentativas bem-sucedidas: ${encodingAttempts.filter(a => a.success).length}\n` +
    `• Dicas de encoding detectadas: ${encodingHints.join(', ') || 'Nenhuma'}\n\n` +
    `💡 Sugestões:\n` +
    `• Verifique se o arquivo é um CSV válido com separador ';'\n` +
    `• Confirme se o arquivo não está corrompido\n` +
    `• Tente salvar o arquivo em UTF-8 antes do upload\n` +
    `• Verifique se há caracteres especiais não suportados`
  );
}

// Helper function to detect encoding hints from file content
async function detectEncodingHints(file) {
  const hints = [];
  
  try {
    // Read first few bytes to check for BOM
    const firstBytes = await readFileBytes(file, 0, 4);
    
    // Check for UTF-8 BOM
    if (firstBytes[0] === 0xEF && firstBytes[1] === 0xBB && firstBytes[2] === 0xBF) {
      hints.push('UTF-8-BOM');
    }
    
    // Check for UTF-16 BOM
    if ((firstBytes[0] === 0xFF && firstBytes[1] === 0xFE) || 
        (firstBytes[0] === 0xFE && firstBytes[1] === 0xFF)) {
      hints.push('UTF-16-BOM');
    }
    
    // Read a sample of the file to analyze content
    const sampleSize = Math.min(1024, file.size);
    const sampleBytes = await readFileBytes(file, 0, sampleSize);
    
    // Analyze byte patterns
    let hasHighAscii = false;
    let hasNullBytes = false;
    let utf8Sequences = 0;
    
    for (let i = 0; i < sampleBytes.length; i++) {
      const byte = sampleBytes[i];
      
      if (byte === 0) {
        hasNullBytes = true;
      } else if (byte > 127) {
        hasHighAscii = true;
        
        // Check for valid UTF-8 sequences
        if ((byte & 0xE0) === 0xC0 && i + 1 < sampleBytes.length) {
          const next = sampleBytes[i + 1];
          if ((next & 0xC0) === 0x80) {
            utf8Sequences++;
            i++; // Skip next byte
          }
        }
      }
    }
    
    // Add hints based on analysis
    if (hasNullBytes) {
      hints.push('UTF-16-likely');
    } else if (utf8Sequences > 0) {
      hints.push('UTF-8-sequences');
    } else if (hasHighAscii) {
      hints.push('Latin1-likely');
    } else {
      hints.push('ASCII-compatible');
    }
    
  } catch (error) {
    console.warn('⚠️ Erro ao detectar dicas de encoding:', error.message);
  }
  
  return hints;
}

// Helper function to read specific bytes from file
function readFileBytes(file, start, length) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      resolve(uint8Array);
    };
    reader.onerror = () => reject(new Error('Erro ao ler bytes do arquivo'));
    
    const blob = file.slice(start, start + length);
    reader.readAsArrayBuffer(blob);
  });
}

// Helper function to reorder strategies based on detected hints
function reorderStrategiesByHints(strategies, hints) {
  const reordered = [...strategies];
  
  // Boost confidence for strategies that match hints
  reordered.forEach(strategy => {
    if (hints.includes('UTF-8-BOM') || hints.includes('UTF-8-sequences')) {
      if (strategy.name === 'UTF-8') {
        strategy.confidence = Math.min(1.0, strategy.confidence + 0.2);
        strategy.priority = 0; // Highest priority
      }
    } else if (hints.includes('UTF-16-BOM') || hints.includes('UTF-16-likely')) {
      if (strategy.name.startsWith('UTF-16')) {
        strategy.confidence = Math.min(1.0, strategy.confidence + 0.3);
        strategy.priority = Math.max(0, strategy.priority - 2);
      }
    } else if (hints.includes('Latin1-likely')) {
      if (strategy.name === 'ISO-8859-1' || strategy.name === 'Windows-1252') {
        strategy.confidence = Math.min(1.0, strategy.confidence + 0.1);
        strategy.priority = Math.max(0, strategy.priority - 1);
      }
    }
  });
  
  // Sort by priority (lower number = higher priority) then by confidence
  return reordered.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return b.confidence - a.confidence;
  });
}

// Enhanced function to read file with specific strategy
async function readFileWithStrategy(file, strategy) {
  switch (strategy.name) {
    case 'UTF-16LE':
    case 'UTF-16BE':
      // For UTF-16, we need to handle it differently
      return await readFileAsUTF16(file, strategy.name === 'UTF-16BE');
    
    default:
      // Standard text reading
      return await readFileAsText(file, strategy.name);
  }
}

// Helper function to read file as UTF-16
async function readFileAsUTF16(file, bigEndian = false) {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const dataView = new DataView(arrayBuffer);
  let text = '';
  
  // Check for BOM and skip it
  let offset = 0;
  if (arrayBuffer.byteLength >= 2) {
    const bom = dataView.getUint16(0, !bigEndian);
    if (bom === 0xFEFF || bom === 0xFFFE) {
      offset = 2;
    }
  }
  
  // Read UTF-16 characters
  for (let i = offset; i < arrayBuffer.byteLength - 1; i += 2) {
    const charCode = dataView.getUint16(i, !bigEndian);
    text += String.fromCharCode(charCode);
  }
  
  return text;
}

// Enhanced comprehensive fallback recovery
async function attemptComprehensiveFallbackRecovery(file, encodingAttempts) {
  const fallbackResults = [];
  
  console.log('🛠️ Iniciando recuperação abrangente com múltiplos mecanismos...');
  
  // Try each fallback mechanism from all attempts
  const allMechanisms = new Set();
  encodingAttempts.forEach(attempt => {
    if (attempt.fallbackMechanisms) {
      attempt.fallbackMechanisms.forEach(mechanism => allMechanisms.add(mechanism));
    }
  });
  
  // Add default fallback mechanisms if none were found
  if (allMechanisms.size === 0) {
    allMechanisms.add('character-replacement');
    allMechanisms.add('byte-mapping');
    allMechanisms.add('aggressive-cleanup');
  }
  
  console.log(`🔧 Tentando ${allMechanisms.size} mecanismos de recuperação: ${Array.from(allMechanisms).join(', ')}`);
  
  // Try each mechanism with different base encodings
  const baseEncodings = ['UTF-8', 'ISO-8859-1', 'Windows-1252'];
  
  for (const mechanism of allMechanisms) {
    for (const baseEncoding of baseEncodings) {
      try {
        console.log(`🔄 Tentando recuperação: ${mechanism} com base ${baseEncoding}`);
        
        const recoveryResult = await attemptFallbackRecovery(file, {
          mechanism,
          baseEncoding
        });
        
        if (recoveryResult && recoveryResult.data && recoveryResult.data.length > 0) {
          fallbackResults.push({
            mechanism,
            baseEncoding,
            result: recoveryResult,
            score: calculateFallbackScore(recoveryResult)
          });
          
          console.log(`✅ Recuperação bem-sucedida: ${mechanism} + ${baseEncoding} (${recoveryResult.data.length} registros)`);
        }
        
      } catch (error) {
        console.warn(`⚠️ Falha na recuperação ${mechanism} + ${baseEncoding}:`, error.message);
      }
    }
  }
  
  return fallbackResults;
}

// Helper function to calculate fallback result score
function calculateFallbackScore(result) {
  if (!result || !result.data) return 0;
  
  const dataLength = result.data.length;
  const hasValidQuestions = result.data.some(row => 
    Object.keys(row).some(key => key.startsWith('QS') || key.startsWith('QI') || key.startsWith('QO'))
  );
  
  let score = dataLength * 0.1; // Base score from data length
  if (hasValidQuestions) score += 0.5; // Bonus for valid questions
  if (result.metadata && result.metadata.textQuality) {
    score += result.metadata.textQuality * 0.4; // Quality bonus
  }
  
  return score;
}

// Enhanced function to calculate encoding score based on multiple comprehensive factors
function calculateEncodingScore(result, textQuality, priority, qualityMetrics = null) {
  if (!result || !result.data || result.data.length === 0) {
    return 0;
  }
  
  let score = 0;
  const weights = {
    textQuality: 0.30,      // Text encoding quality
    dataSuccess: 0.25,      // Data processing success rate
    questionDetection: 0.20, // Question mapping success
    dataIntegrity: 0.15,    // Data integrity and completeness
    encodingPriority: 0.10  // Encoding method priority
  };
  
  // 1. Text quality score (0-0.30)
  const qualityScore = typeof textQuality === 'object' ? textQuality.score : textQuality;
  score += qualityScore * weights.textQuality;
  
  // 2. Data processing success rate (0-0.25)
  const validationSummary = result.validationSummary || {};
  const totalLines = validationSummary.totalLines || 1;
  const validLines = validationSummary.validLines || result.data.length;
  const dataSuccessRate = validLines / Math.max(1, totalLines);
  score += dataSuccessRate * weights.dataSuccess;
  
  // 3. Question detection and mapping success (0-0.20)
  const questionCodes = result.questionCodes || [];
  const expectedQuestionCount = result.type === 'transparency' ? 8 : 20;
  const questionDetectionRate = Math.min(1, questionCodes.length / expectedQuestionCount);
  score += questionDetectionRate * weights.questionDetection;
  
  // 4. Data integrity and completeness (0-0.15)
  let integrityScore = 0;
  
  // Check for valid Likert responses
  const hasValidLikertData = result.data.some(row => 
    Object.keys(row).some(key => 
      (key.startsWith('QS') || key.startsWith('QI') || key.startsWith('QO')) && 
      typeof row[key] === 'number' && row[key] >= 1 && row[key] <= 5
    )
  );
  if (hasValidLikertData) integrityScore += 0.4;
  
  // Check for profile data presence
  const hasProfileData = result.data.some(row => 
    Object.keys(row).some(key => key.startsWith('__profile__'))
  );
  if (hasProfileData) integrityScore += 0.3;
  
  // Check for reasonable data distribution
  const avgResponsesPerRow = result.data.reduce((sum, row) => {
    const responses = Object.keys(row).filter(key => 
      (key.startsWith('QS') || key.startsWith('QI') || key.startsWith('QO')) && 
      row[key] !== null && row[key] !== undefined
    ).length;
    return sum + responses;
  }, 0) / Math.max(1, result.data.length);
  
  const expectedResponses = expectedQuestionCount;
  const responseCompleteness = Math.min(1, avgResponsesPerRow / expectedResponses);
  integrityScore += responseCompleteness * 0.3;
  
  score += integrityScore * weights.dataIntegrity;
  
  // 5. Encoding priority bonus/penalty (0-0.10)
  const priorityBonus = Math.max(0, (4 - priority) / 3) * weights.encodingPriority;
  score += priorityBonus;
  
  // Bonus factors for exceptional quality
  if (qualityMetrics) {
    // Bonus for high Portuguese character presence
    const portugueseRatio = qualityMetrics.validPortugueseChars / Math.max(1, qualityMetrics.totalChars);
    if (portugueseRatio > 0.05) { // More than 5% Portuguese characters
      score += Math.min(0.05, portugueseRatio * 0.5);
    }
    
    // Penalty for high corruption
    const corruptionRatio = (qualityMetrics.replacementChars + qualityMetrics.utf8Corruptions) / 
                           Math.max(1, qualityMetrics.totalChars);
    if (corruptionRatio > 0.1) { // More than 10% corrupted characters
      score -= Math.min(0.1, corruptionRatio * 0.5);
    }
  }
  
  // Character replacement effectiveness bonus
  if (result.metadata && result.metadata.characterReplacements > 0) {
    const replacementEffectiveness = Math.min(0.05, result.metadata.characterReplacements / 1000);
    score += replacementEffectiveness;
  }
  
  // Ensure score is within bounds
  const finalScore = Math.max(0, Math.min(1, score));
  
  // Log detailed scoring breakdown for debugging
  if (process.env.NODE_ENV === 'development' || result.metadata?.verbose) {
    console.log(`📊 Detalhamento do score para ${result.metadata?.encoding || 'Unknown'}:`);
    console.log(`  • Qualidade do texto: ${(qualityScore * weights.textQuality).toFixed(3)}`);
    console.log(`  • Taxa de sucesso: ${(dataSuccessRate * weights.dataSuccess).toFixed(3)}`);
    console.log(`  • Detecção de questões: ${(questionDetectionRate * weights.questionDetection).toFixed(3)}`);
    console.log(`  • Integridade dos dados: ${(integrityScore * weights.dataIntegrity).toFixed(3)}`);
    console.log(`  • Prioridade do encoding: ${priorityBonus.toFixed(3)}`);
    console.log(`  • Score final: ${finalScore.toFixed(3)}`);
  }
  
  return finalScore;
}

// Robust CSV processing with enhanced error handling
async function processCSVDataRobust(csvText, options = {}) {
  try {
    const result = processCSVData(csvText, options);
    
    // Add encoding-specific metadata
    result.metadata = {
      ...result.metadata,
      ...options
    };
    
    return result;
  } catch (error) {
    console.error(`❌ Erro no processamento robusto:`, error);
    throw error;
  }
}

// Enhanced fallback recovery with multiple specialized mechanisms
async function attemptFallbackRecovery(file, options = {}) {
  const { mechanism = 'aggressive-cleanup', baseEncoding = 'UTF-8' } = options;
  
  console.log(`🔧 Tentando recuperação: ${mechanism} com encoding base ${baseEncoding}`);
  console.log(`📁 Arquivo: ${file.name} | Encoding base: ${baseEncoding}`);
  
  try {
    let recoveredText = '';
    let recoveryMethod = '';
    
    switch (mechanism) {
      case 'character-replacement':
        recoveredText = await attemptCharacterReplacementRecovery(file, baseEncoding);
        recoveryMethod = 'Substituição de caracteres corrompidos';
        break;
        
      case 'byte-mapping':
        recoveredText = await attemptByteMappingRecovery(file);
        recoveryMethod = 'Mapeamento direto de bytes';
        break;
        
      case 'smart-quotes-fix':
        recoveredText = await attemptSmartQuotesRecovery(file, baseEncoding);
        recoveryMethod = 'Correção de aspas inteligentes';
        break;
        
      case 'partial-recovery':
        recoveredText = await attemptPartialRecovery(file, baseEncoding);
        recoveryMethod = 'Recuperação parcial de dados válidos';
        break;
        
      case 'aggressive-cleanup':
      default:
        recoveredText = await attemptAggressiveCleanupRecovery(file);
        recoveryMethod = 'Limpeza agressiva de caracteres';
        break;
    }
    
    if (!recoveredText) {
      throw new Error(`Mecanismo ${mechanism} não produziu texto válido`);
    }
    
    console.log(`🔧 Texto recuperado com ${recoveryMethod}`);
    console.log(`📏 Tamanho do texto recuperado: ${recoveredText.length} caracteres`);
    
    // Apply additional character replacements to the recovered text
    const replacementResult = applyCharacterReplacements(recoveredText, { verbose: false });
    const finalText = replacementResult.text;
    
    // Calculate quality of recovered text
    const qualityAnalysis = calculateTextQuality(finalText);
    const textQuality = typeof qualityAnalysis === 'object' ? qualityAnalysis.score : qualityAnalysis;
    
    console.log(`📊 Qualidade do texto recuperado: ${(textQuality * 100).toFixed(1)}%`);
    
    // Try to process the recovered text
    const result = processCSVData(finalText, {
      fileName: file.name,
      encoding: `${baseEncoding} (${recoveryMethod})`,
      textQuality,
      recoveryMethod: mechanism,
      characterReplacements: replacementResult.replacementCount
    });
    
    if (result && result.data && result.data.length > 0) {
      console.log(`✅ Recuperação bem-sucedida: ${result.data.length} registros processados`);
      return result;
    } else {
      throw new Error('Nenhum dado válido foi recuperado');
    }
    
  } catch (error) {
    console.error(`❌ Falha na recuperação ${mechanism}:`, error.message);
    throw error;
  }
}

// Character replacement recovery - focuses on fixing encoding issues
async function attemptCharacterReplacementRecovery(file, baseEncoding) {
  const text = await readFileAsText(file, baseEncoding);
  const replacementResult = applyCharacterReplacements(text, { verbose: true });
  return replacementResult.text;
}

// Byte mapping recovery - reads file as binary and maps bytes to characters
async function attemptByteMappingRecovery(file) {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  let text = '';
  for (let i = 0; i < uint8Array.length; i++) {
    const byte = uint8Array[i];
    
    // Handle standard ASCII (0-126)
    if (byte >= 32 && byte <= 126) {
      text += String.fromCharCode(byte);
    } else if (byte >= 128 && byte <= 255) {
      // Extended ASCII - map to Portuguese characters
      const char = mapExtendedAscii(byte);
      text += char || String.fromCharCode(byte);
    } else if (byte === 10 || byte === 13) {
      // Line breaks
      text += String.fromCharCode(byte);
    } else if (byte === 9) {
      // Tab
      text += '\t';
    }
    // Skip other control characters
  }
  
  return text;
}

// Smart quotes recovery - specifically handles Windows-1252 smart quotes
async function attemptSmartQuotesRecovery(file, baseEncoding) {
  let text = await readFileAsText(file, baseEncoding);
  
  // Fix Windows-1252 smart quotes and special characters
  const smartQuoteFixes = {
    'â€™': "'", 'â€œ': '"', 'â€\u009d': '"', 'â€"': '–', 'â€"': '—',
    'â€¦': '...', 'â€¢': '•', 'Â': '', 'â€': '"', 'â€˜': "'",
    // Additional Windows-1252 corruptions
    'Ã¢â‚¬â„¢': "'", 'Ã¢â‚¬Å"': '"', 'Ã¢â‚¬\u009d': '"'
  };
  
  Object.entries(smartQuoteFixes).forEach(([corrupted, correct]) => {
    text = text.replace(new RegExp(escapeRegExp(corrupted), 'g'), correct);
  });
  
  return text;
}

// Partial recovery - attempts to salvage readable portions of the file
async function attemptPartialRecovery(file, baseEncoding) {
  const text = await readFileAsText(file, baseEncoding);
  const lines = text.split('\n');
  
  // Try to identify and keep lines that look like valid CSV data
  const validLines = [];
  const semicolonThreshold = 3; // Minimum semicolons for CSV line
  
  for (const line of lines) {
    const semicolonCount = (line.match(/;/g) || []).length;
    const hasValidChars = /[a-zA-Z0-9]/.test(line);
    const notTooCorrupted = (line.match(/[�\ufffd]/g) || []).length < line.length * 0.3;
    
    if (semicolonCount >= semicolonThreshold && hasValidChars && notTooCorrupted) {
      validLines.push(line);
    }
  }
  
  if (validLines.length < 2) {
    throw new Error('Não foi possível recuperar linhas válidas suficientes');
  }
  
  return validLines.join('\n');
}

// Aggressive cleanup recovery - most comprehensive cleanup approach
async function attemptAggressiveCleanupRecovery(file) {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  let text = '';
  for (let i = 0; i < uint8Array.length; i++) {
    const byte = uint8Array[i];
    
    // Keep only printable ASCII and common extended characters
    if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
      text += String.fromCharCode(byte);
    } else if (byte >= 128 && byte <= 255) {
      // Try to map extended ASCII to Portuguese characters
      const mapped = mapExtendedAscii(byte);
      if (mapped) {
        text += mapped;
      } else {
        // Replace with space for unknown extended characters
        text += ' ';
      }
    }
    // Skip all other control characters
  }
  
  // Additional cleanup: remove excessive whitespace and fix common patterns
  text = text
    .replace(/\s{3,}/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n\s*\n\s*\n/g, '\n\n')  // Remove excessive line breaks
    .replace(/[^\x20-\x7E\n\r\t\u00C0-\u017F]/g, '')  // Remove non-printable chars except Portuguese
    .trim();
  
  return text;
}

// Map extended ASCII bytes to Portuguese characters
function mapExtendedAscii(byte) {
  const extendedAsciiMap = {
    128: 'Ç', 129: 'ü', 130: 'é', 131: 'â', 132: 'ä', 133: 'à', 134: 'å', 135: 'ç',
    136: 'ê', 137: 'ë', 138: 'è', 139: 'ï', 140: 'î', 141: 'ì', 142: 'Ä', 143: 'Å',
    144: 'É', 145: 'æ', 146: 'Æ', 147: 'ô', 148: 'ö', 149: 'ò', 150: 'û', 151: 'ù',
    152: 'ÿ', 153: 'Ö', 154: 'Ü', 155: '¢', 156: '£', 157: '¥', 158: '₧', 159: 'ƒ',
    160: 'á', 161: 'í', 162: 'ó', 163: 'ú', 164: 'ñ', 165: 'Ñ', 166: 'ª', 167: 'º',
    168: '¿', 169: '⌐', 170: '¬', 171: '½', 172: '¼', 173: '¡', 174: '«', 175: '»',
    224: 'α', 225: 'ß', 226: 'Γ', 227: 'π', 228: 'Σ', 229: 'σ', 230: 'µ', 231: 'τ',
    232: 'Φ', 233: 'Θ', 234: 'Ω', 235: 'δ', 236: '∞', 237: 'φ', 238: 'ε', 239: '∩'
  };
  
  return extendedAsciiMap[byte] || String.fromCharCode(byte);
}

// Helper function to read file as ArrayBuffer
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error('Erro ao ler arquivo como ArrayBuffer'));
    reader.readAsArrayBuffer(file);
  });
}

// Legacy function for backward compatibility
export async function processFileWithEncoding(file) {
  console.log('⚠️ Usando função legada processFileWithEncoding, recomenda-se usar processFileWithMultipleEncodings');
  return processFileWithMultipleEncodings(file);
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
  if (!dataset || !Array.isArray(dataset.data) || dataset.data.length === 0) {
    return {};
  }

  const accumulator = {};

  dataset.data.forEach(row => {
    if (!row) return;

    Object.entries(row).forEach(([key, value]) => {
      if (!key || (!key.startsWith('QS') && !key.startsWith('QI') && !key.startsWith('QO'))) {
        return;
      }

      if (!accumulator[key]) {
        accumulator[key] = { sum: 0, count: 0 };
      }

      const numericValue = typeof value === 'number' ? value : Number(value);
      if (!Number.isNaN(numericValue)) {
        accumulator[key].sum += numericValue;
        accumulator[key].count += 1;
      }
    });
  });

  const result = {};

  Object.entries(accumulator).forEach(([code, stats]) => {
    if (!stats || stats.count === 0) {
      return;
    }

    const dimension = DIMENSION_MAPPING[code];
    result[code] = {
      average: stats.sum / stats.count,
      count: stats.count,
      sum: stats.sum,
      dimension,
      question: getQuestionText(code)
    };
  });

  return result;
}

// Função para calcular médias por dimensão
export function calculateDimensionAverages(questionAverages) {
  const dimensionTotals = {
    QS: { sum: 0, count: 0 },
    QO: { sum: 0, count: 0 },
    QI: { sum: 0, count: 0 }
  };

  Object.entries(questionAverages || {}).forEach(([questionCode, data]) => {
    const dimension = DIMENSION_MAPPING[questionCode];
    if (!dimension || !dimensionTotals[dimension]) {
      return;
    }

    if (data && typeof data === 'object' && typeof data.sum === 'number' && typeof data.count === 'number' && data.count > 0) {
      dimensionTotals[dimension].sum += data.sum;
      dimensionTotals[dimension].count += data.count;
      return;
    }

    const value = typeof data === 'number' ? data : data?.average;
    if (typeof value === 'number' && !Number.isNaN(value)) {
      dimensionTotals[dimension].sum += value;
      dimensionTotals[dimension].count += 1;
    }
  });

  const dimensionAverages = {};

  Object.entries(dimensionTotals).forEach(([dimension, stats]) => {
    if (stats.count > 0) {
      dimensionAverages[dimension] = stats.sum / stats.count;
    } else {
      dimensionAverages[dimension] = 0;
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

  Object.entries(questionAverages || {}).forEach(([questionCode, data]) => {
    const average = typeof data === 'number' ? data : data?.average;
    if (typeof average !== 'number' || Number.isNaN(average)) {
      return;
    }
    const dimension = DIMENSION_MAPPING[questionCode];
    const goal = goals[dimension] || 4.0;

    const item = {
      code: questionCode,
      average,
      dimension,
      question: (typeof data === 'object' && data?.question) ? data.question : getQuestionText(questionCode),
      count: typeof data === 'object' ? data?.count : undefined
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
  return DEFAULT_QUESTION_TEXT[questionCode] ||
    TRANSPARENCY_QUESTION_TEXT[questionCode] ||
    questionCode;
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
    if (!row) {
      return;
    }

    // Processar sexo
    const sexoValue = getProfileValue(row, 'sexo');
    if (sexoValue) {
      const normalizedSexo = typeof sexoValue === 'string' ? sexoValue.trim() : sexoValue;
      if (normalizedSexo) {
        profileData.sexo[normalizedSexo] = (profileData.sexo[normalizedSexo] || 0) + 1;
      }
    }

    // Processar idade com categorização
    const idadeValue = getProfileValue(row, 'idade');
    const faixaIdade = determineAgeRange(idadeValue);
    if (faixaIdade) {
      profileData.idade[faixaIdade] = (profileData.idade[faixaIdade] || 0) + 1;
    }

    // Processar escolaridade
    const escolaridadeValue = getProfileValue(row, 'escolaridade');
    if (escolaridadeValue) {
      const normalizedEscolaridade = typeof escolaridadeValue === 'string' ? escolaridadeValue.trim() : escolaridadeValue;
      if (normalizedEscolaridade) {
        profileData.escolaridade[normalizedEscolaridade] = (profileData.escolaridade[normalizedEscolaridade] || 0) + 1;
      }
    }

    // Processar funcionário público (incluindo variações como servidor público)
    const funcionarioPublico = getProfileValue(row, 'servidor');
    if (funcionarioPublico) {
      const normalizedResponse = normalizeServidorResponse(funcionarioPublico);
      if (normalizedResponse) {
        const label = normalizedResponse === 'Sim'
          ? 'Funcionário/Servidor Público'
          : normalizedResponse === 'Não'
            ? 'Não é Funcionário Público'
            : normalizedResponse;

        profileData.funcionarioPublico[label] = (profileData.funcionarioPublico[label] || 0) + 1;
      }
    }
  });

  return profileData;
}

// Função para obter recomendações para questões críticas
export function getRecommendationsForCriticalQuestions(questionAverages, goals) {
  const recommendations = [];

  Object.entries(questionAverages || {}).forEach(([questionCode, data]) => {
    const average = typeof data === 'number' ? data : data?.average;
    if (typeof average !== 'number' || Number.isNaN(average)) {
      return;
    }
    const dimension = (typeof data === 'object' && data?.dimension) ? data.dimension : DIMENSION_MAPPING[questionCode];
    const goal = goals?.[dimension] ?? 4.0;
    const gap = goal - average;
    const isCritical = average < 3.0 || gap >= 0.5;

    if (!isCritical) {
      return;
    }

    const recommendation = {
      questionCode,
      question: (typeof data === 'object' && data?.question) ? data.question : getQuestionText(questionCode),
      average,
      dimension: getDimensionName(dimension),
      goal,
      gap,
      actions: getActionsForQuestion(questionCode)
    };
    recommendations.push(recommendation);
  });

  recommendations.sort((a, b) => b.gap - a.gap);
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
function getActionsForQuestion(questionCode) {
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
  if (!dataset) {
    return dataset;
  }

  const dataArray = Array.isArray(dataset) ? dataset : dataset.data;

  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return dataset;
  }

  const filters = demographicFilters || { sexo: [], idade: [], escolaridade: [], servidor: [] };
  const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);

  if (!hasActiveFilters) {
    return dataset;
  }

  const normalizedSexFilters = (filters.sexo || []).map(option => normalizeText(option));
  const normalizedEducationFilters = (filters.escolaridade || []).map(option => normalizeText(option));
  const normalizedServidorFilters = (filters.servidor || []).map(option => normalizeText(normalizeServidorResponse(option) || option));

  const filteredData = dataArray.filter(row => {
    if (!row) {
      return false;
    }

    // Filtro por sexo
    if (filters.sexo.length > 0) {
      const sexo = getProfileValue(row, 'sexo');
      const normalizedSexo = normalizeText(sexo);
      const hasSexoMatch = normalizedSexFilters.some(option => option === normalizedSexo);
      if (!hasSexoMatch) {
        return false;
      }
    }

    // Filtro por idade
    if (filters.idade.length > 0) {
      const idadeValue = getProfileValue(row, 'idade');
      const faixaIdade = determineAgeRange(idadeValue);
      if (!faixaIdade) {
        return false;
      }

      const hasAgeMatch = filters.idade.some(faixa => faixa === faixaIdade);
      if (!hasAgeMatch) {
        return false;
      }
    }

    // Filtro por escolaridade
    if (filters.escolaridade.length > 0) {
      const escolaridade = getProfileValue(row, 'escolaridade');
      const normalizedEscolaridade = normalizeText(escolaridade);
      const hasEscolaridadeMatch = normalizedEducationFilters.some(option => option === normalizedEscolaridade);
      if (!hasEscolaridadeMatch) {
        return false;
      }
    }

    // Filtro por servidor público
    if (filters.servidor.length > 0) {
      const servidor = getProfileValue(row, 'servidor');
      const normalizedServidor = normalizeServidorResponse(servidor);
      const normalizedServidorValue = normalizeText(normalizedServidor);
      const hasServidorMatch = normalizedServidorFilters.some(option => option === normalizedServidorValue);
      if (!hasServidorMatch) {
        return false;
      }
    }

    return true;
  });

  if (Array.isArray(dataset)) {
    return filteredData;
  }

  return {
    ...dataset,
    data: filteredData
  };
}

