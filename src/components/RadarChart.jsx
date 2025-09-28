import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { calculateDimensionAverages } from '../lib/dataProcessor';
import { QUESTION_MAPPING } from '../data/sampleData';
import { Target, TrendingUp, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';

// Função para obter o texto da questão baseado no código
const getQuestionText = (questionCode) => {
  const questionTexts = {
    'QS1': 'O sistema funciona sem falhas.',
    'QS2': 'Os recursos de acessibilidade do sistema são fáceis de encontrar.',
    'QS3': 'O sistema é fácil de usar.',
    'QS4': 'O sistema está disponível para uso em qualquer dia e hora.',
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
    'QI5': 'O prazo de entrega dos serviços é informado.',
    'QI6': 'As taxas cobradas pelos serviços são informadas.',
    'QI7': 'As informações disponibilizadas estão atualizadas.',
    'QO1': 'Os serviços oferecem suporte técnico eficiente.',
    'QO2': 'O atendimento resolve meus problemas.',
    'QO3': 'Os serviços permitem a conclusão das tarefas no menor tempo possível.',
    'QO4': 'Consigo obter o que preciso no menor tempo possível.',
    'QO5': 'Os serviços atendem às minhas expectativas.',
    'QO6': 'Quando preciso de ajuda, minhas dificuldades são resolvidas.',
    'QO7': 'Meus dados são automaticamente identificados na solicitação dos serviços.',
    'QO8': 'Os serviços oferecidos são confiáveis.'
  };
  
  return questionTexts[questionCode] || questionCode;
};

const MODERN_COLORS = {
  critical: '#E53E3E',
  attention: '#F6AD55', 
  excellent: '#4299E1',
  background: '#F7FAFC',
  border: '#E2E8F0',
  text: '#2D3748',
  textLight: '#718096'
};

export function QualityRadarChart({ questionAverages }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRadarPoint, setSelectedRadarPoint] = useState(null);

  // Verificar se há dados válidos
  if (!questionAverages || Object.keys(questionAverages).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8" style={{ border: `1px solid ${MODERN_COLORS.border}` }}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: MODERN_COLORS.text }}>
            Radar de Qualidade Profissional
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Nenhum dado disponível para análise</p>
            <p className="text-sm mt-2">Carregue dados para visualizar o radar</p>
          </div>
        </div>
      </div>
    );
  }

  // Processar dados das questões individuais
  const questionData = Object.entries(questionAverages)
    .filter(([code, data]) => data && typeof data.average === 'number' && !isNaN(data.average))
    .map(([code, data]) => ({
      code,
      average: data.average,
      dimension: code.substring(0, 2),
      question: code // Usar código em vez do nome completo
    }));

  // Calcular médias das dimensões
  const dimensionAverages = calculateDimensionAverages(
    Object.fromEntries(questionData.map(item => [item.code, item.average]))
  );

  // Verificar se há dados suficientes
  if (questionData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8" style={{ border: `1px solid ${MODERN_COLORS.border}` }}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: MODERN_COLORS.text }}>
            Radar de Qualidade Profissional
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
            <p className="font-medium">Nenhum dado válido disponível</p>
            <p className="text-sm mt-2">Verifique os filtros aplicados ou carregue novos dados</p>
          </div>
        </div>
      </div>
    );
  }

  // Preparar dados para visualização - apenas radar simples por questões
  const radarData = questionData.map(item => ({
    dimension: item.code,
    fullName: item.code, // Usar apenas o código da questão
    value: item.average,
    dimensionGroup: item.dimension
  }));
  
<<<<<<< HEAD
  const chartTitle = "Radar de Qualidade";
  const chartSubtitle = `Análise de ${questionData.length} questões`;
=======
  // Calcular média geral
  const overallAverage = questionData.reduce((sum, item) => sum + item.average, 0) / questionData.length;

  // Nomes das dimensões
  const dimensionNames = {
    QS: 'Qualidade do Sistema',
    QI: 'Qualidade da Informação', 
    QO: 'Qualidade da Operação'
  };

  // Função de análise melhorada
  const getAnalysis = (value, target = 4.0) => {
    if (value < 3.0) return { 
      status: 'Crítico', 
      color: MODERN_COLORS.critical, 
      icon: AlertTriangle,
      message: 'Necessita ação imediata' 
    };
    if (value >= 3.0 && value < target) return { 
      status: 'Atenção', 
      color: MODERN_COLORS.attention, 
      icon: Target,
      message: 'Pode melhorar com ações direcionadas' 
    };
    return { 
      status: 'Excelente', 
      color: MODERN_COLORS.excellent, 
      icon: CheckCircle,
      message: 'Mantendo boas práticas' 
    };
  };

  // Preparar dados para visualização
  let radarData, chartTitle, chartSubtitle;
  
  if (useQuestionLevel && questionData.length >= 6) {
    // Radar por questões individuais (quando há dados suficientes)
    radarData = questionData.map(item => {
      const analysis = getAnalysis(item.average);
      const questionText = getQuestionText(item.code);
      return {
        dimension: item.code,
        fullName: `${item.code} - ${questionText}`, // Código + texto da questão
        code: item.code,
        questionText: questionText,
        value: item.average,
        dimensionGroup: item.dimension,
        analysis: analysis.status,
        color: analysis.color,
        message: analysis.message,
        icon: analysis.icon
      };
    });
    chartTitle = "Radar Detalhado por Questão";
    chartSubtitle = `Análise de ${questionData.length} questões individuais`;
  } else {
    // Radar por dimensões (fallback para poucos dados)
    radarData = Object.entries(dimensionAverages)
      .filter(([dimension, value]) => !isNaN(value) && value > 0)
      .map(([dimension, value]) => {
        const analysis = getAnalysis(value);
        const questionsInDimension = questionData.filter(q => q.dimension === dimension);
        return {
          dimension: dimensionNames[dimension] || dimension,
          fullName: dimensionNames[dimension] || dimension,
          value: value,
          dimensionGroup: dimension,
          analysis: analysis.status,
          color: analysis.color,
          message: analysis.message,
          icon: analysis.icon,
          questionCount: questionsInDimension.length
        };
      });
    chartTitle = "Radar por Dimensão";
    chartSubtitle = `Análise de ${validDimensions.length} dimensões de qualidade`;
  }
>>>>>>> d520d7822fd60c11d3048a52078d74002fe285b7

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
<<<<<<< HEAD
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-bold text-gray-900 mb-1">{data.fullName}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Média:</span>
            <span className="font-bold text-lg text-purple-600">
              {data.value.toFixed(2)}
            </span>
=======
        <div className="bg-white p-4 rounded-xl shadow-2xl border-2" style={{ borderColor: data.color, maxWidth: '280px' }}>
          <div className="flex items-center space-x-2 mb-3">
            <IconComponent size={16} style={{ color: data.color }} />
            <p className="font-bold text-gray-900">{data.fullName}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Média:</span>
              <span className="font-bold text-lg" style={{ color: data.color }}>
                {data.value.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="font-medium text-sm px-2 py-1 rounded-full" 
                    style={{ backgroundColor: `${data.color}20`, color: data.color }}>
                {data.analysis}
              </span>
            </div>
            {data.questionCount && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Questões:</span>
                <span className="font-medium text-sm">{data.questionCount}</span>
              </div>
            )}
            <p className="text-xs text-gray-600 mt-2 italic">{data.message}</p>
>>>>>>> d520d7822fd60c11d3048a52078d74002fe285b7
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8" style={{ border: `1px solid ${MODERN_COLORS.border}` }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <TrendingUp size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold" style={{ color: MODERN_COLORS.text }}>
            {chartTitle}
          </h3>
          <p className="text-sm" style={{ color: MODERN_COLORS.textLight }}>
            {chartSubtitle}
          </p>
        </div>
      </div>
      
<<<<<<< HEAD

=======
      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: MODERN_COLORS.background }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium" style={{ color: MODERN_COLORS.text }}>
              Média Geral:
            </span>
            <span className="font-bold text-lg" style={{ color: MODERN_COLORS.text }}>
              {overallAverage.toFixed(1)}
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 px-3 py-1 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
          >
            <Info size={14} className="text-blue-600" />
            <span className="text-blue-600 font-medium">
              {showDetails ? 'Ocultar' : 'Ver'} Detalhes
            </span>
            {showDetails ? <ChevronUp size={14} className="text-blue-600" /> : <ChevronDown size={14} className="text-blue-600" />}
          </button>
        </div>
        <div className="mt-2 text-xs" style={{ color: MODERN_COLORS.textLight }}>
          Meta recomendada: 4.0 | Total de dados: {questionData.length}
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-gray-600 text-xs mb-1">Média Geral</div>
                <div className="font-bold text-lg text-blue-600">{overallAverage.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-gray-600 text-xs mb-1">Meta</div>
                <div className="font-bold text-lg text-gray-700">4.00</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-gray-600 text-xs mb-1">Diferença</div>
                <div className={`font-bold text-lg ${overallAverage >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overallAverage >= 4.0 ? '+' : ''}{(overallAverage - 4.0).toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-gray-600 text-xs mb-1">Atingimento da Meta</div>
                <div className={`font-bold text-lg ${overallAverage >= 4.0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {((overallAverage / 4.0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        {radarData.map((item, index) => {
          const IconComponent = item.icon;
          const isExpanded = expandedCard === index;
          return (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 hover:shadow-lg transition-all duration-300" 
                 style={{ borderColor: `${item.color}30` }}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                      <IconComponent size={16} style={{ color: item.color }} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.fullName}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-xs px-3 py-1 rounded-full font-bold"
                      style={{ 
                        backgroundColor: `${item.color}20`, 
                        color: item.color 
                      }}
                    >
                      {item.analysis}
                    </span>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.value.toFixed(1)}
                    </p>
                    {item.questionCount && (
                      <p className="text-xs text-gray-500">{item.questionCount} questões</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min((item.value / 4.0) * 100, 100)}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Meta: {Math.min(((item.value / 4.0) * 100), 100).toFixed(0)}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 italic">{item.message}</p>
              </div>
              
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <Info size={14} style={{ color: item.color }} />
                      <h5 className="font-semibold text-gray-900 text-sm">Detalhes da Análise</h5>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-gray-600 text-xs mb-1">Valor Atual</div>
                        <div className="font-bold text-lg" style={{ color: item.color }}>
                          {item.value.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-gray-600 text-xs mb-1">Meta Recomendada</div>
                        <div className="font-bold text-lg text-gray-700">4.0</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-gray-600 text-xs mb-1">Diferença da Meta</div>
                        <div className={`font-bold text-lg ${item.value >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.value >= 4.0 ? '+' : ''}{(item.value - 4.0).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-gray-600 text-xs mb-1">Atingimento da Meta</div>
                        <div className={`font-bold text-lg ${item.value >= 4.0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {((item.value / 4.0) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-gray-600 text-xs mb-2">Recomendações</div>
                      <div className="text-sm text-gray-700">
                        {item.value < 3.0 && (
                          <div className="text-red-700">
                            • Implementar ações corretivas imediatas<br/>
                            • Revisar processos e procedimentos<br/>
                            • Monitoramento contínuo necessário
                          </div>
                        )}
                        {item.value >= 3.0 && item.value < 4.0 && (
                          <div className="text-yellow-700">
                            • Identificar oportunidades de melhoria<br/>
                            • Implementar melhorias incrementais<br/>
                            • Acompanhar evolução dos indicadores
                          </div>
                        )}
                        {item.value >= 4.0 && (
                          <div className="text-green-700">
                            • Manter as boas práticas atuais<br/>
                            • Compartilhar experiências de sucesso<br/>
                            • Buscar excelência contínua
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
>>>>>>> d520d7822fd60c11d3048a52078d74002fe285b7

      <div className="h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
            <PolarGrid 
              stroke={MODERN_COLORS.border} 
              strokeWidth={1}
              radialLines={true}
            />
            <PolarAngleAxis 
              dataKey="fullName" 
              tick={{ fontSize: 11, fill: MODERN_COLORS.text, fontWeight: 'bold' }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 5]} 
              tick={{ fontSize: 9, fill: MODERN_COLORS.textLight }}
              tickCount={6}
              axisLine={false}
            />
            <Radar
              name="Qualidade"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.15}
              strokeWidth={3}
              dot={{ 
                fill: '#8b5cf6', 
                strokeWidth: 2, 
                r: 5,
                stroke: '#ffffff',
                cursor: 'pointer'
              }}
              onClick={(data, index) => {
                if (data && data.payload) {
                  setSelectedRadarPoint(selectedRadarPoint === index ? null : index);
                }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

<<<<<<< HEAD

=======
      {/* Detalhes do Ponto Selecionado no Radar */}
      {selectedRadarPoint !== null && radarData[selectedRadarPoint] && (
        <div className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Info size={20} className="text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-purple-900">
                Detalhes da Questão Selecionada
              </h4>
            </div>
            <button
              onClick={() => setSelectedRadarPoint(null)}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ChevronUp size={16} className="text-purple-600" />
            </button>
          </div>
          
          {(() => {
            const selectedItem = radarData[selectedRadarPoint];
            const IconComponent = selectedItem.icon;
            return (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${selectedItem.color}20` }}>
                    <IconComponent size={24} style={{ color: selectedItem.color }} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 text-xl mb-2">
                      {selectedItem.code}
                    </h5>
                    {selectedItem.questionText && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h6 className="font-semibold text-blue-900 mb-1">Texto da Questão:</h6>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {selectedItem.questionText}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-3xl font-bold" style={{ color: selectedItem.color }}>
                        {selectedItem.value.toFixed(1)}
                      </span>
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{ 
                          backgroundColor: `${selectedItem.color}20`, 
                          color: selectedItem.color 
                        }}
                      >
                        {selectedItem.analysis}
                      </span>
                    </div>
                    <p className="text-gray-600 italic">{selectedItem.message}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="font-bold text-lg" style={{ color: selectedItem.color }}>
                      {selectedItem.value.toFixed(2)}
                    </div>
                    <div className="text-gray-600">Valor Atual</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="font-bold text-lg text-gray-700">4.00</div>
                    <div className="text-gray-600">Meta</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className={`font-bold text-lg ${selectedItem.value >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedItem.value >= 4.0 ? '+' : ''}{(selectedItem.value - 4.0).toFixed(2)}
                    </div>
                    <div className="text-gray-600">Diferença</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className={`font-bold text-lg ${selectedItem.value >= 4.0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {((selectedItem.value / 4.0) * 100).toFixed(1)}%
                    </div>
                    <div className="text-gray-600">Atingimento</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progresso para Meta</span>
                    <span>{((selectedItem.value / 4.0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((selectedItem.value / 4.0) * 100, 100)}%`,
                        backgroundColor: selectedItem.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border" 
             style={{ borderColor: MODERN_COLORS.border }}>
          <div className="flex items-center space-x-2 mb-4">
            <Target size={18} className="text-blue-600" />
            <h4 className="font-bold text-blue-900">Análise Detalhada</h4>
          </div>
          <div className="space-y-3">
            {radarData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <IconComponent size={14} style={{ color: item.color }} />
                      <span className="font-bold text-gray-900 text-sm">{item.code}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${Math.min((item.value / 4.0) * 100, 100)}%`,
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                      <span className="font-bold text-sm w-12 text-right" style={{ color: item.color }}>
                        {item.value.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {item.questionText && (
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {item.questionText}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border" 
             style={{ borderColor: MODERN_COLORS.border }}>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle size={18} className="text-green-600" />
            <h4 className="font-bold text-green-900">Resumo Executivo</h4>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Média Geral</span>
                <span className="text-xl font-bold" style={{ color: MODERN_COLORS.excellent }}>
                  {overallAverage.toFixed(1)}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: `${Math.min((overallAverage / 4.0) * 100, 100)}%`,
                    backgroundColor: MODERN_COLORS.excellent 
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de {useQuestionLevel ? 'Questões' : 'Dimensões'}:</span>
                <span className="font-bold text-gray-900">{radarData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dados Processados:</span>
                <span className="font-bold text-gray-900">{questionData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status Geral:</span>
                <span className="font-bold" style={{ 
                  color: overallAverage >= 4 ? MODERN_COLORS.excellent : 
                        overallAverage >= 3 ? MODERN_COLORS.attention : 
                        MODERN_COLORS.critical 
                }}>
                  {overallAverage >= 4 ? 'Excelente' : overallAverage >= 3 ? 'Bom' : 'Precisa Melhorar'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meta (4.0):</span>
                <span className="font-bold" style={{ 
                  color: overallAverage >= 4 ? MODERN_COLORS.excellent : MODERN_COLORS.attention 
                }}>
                  {overallAverage >= 4 ? 'Atingida' : 'Não Atingida'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
>>>>>>> d520d7822fd60c11d3048a52078d74002fe285b7
    </div>
  );
}

