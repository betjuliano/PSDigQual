import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { calculateDimensionAverages } from '../lib/dataProcessor';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

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
      question: data.question || `Questão ${code}`
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

  // Determinar tipo de visualização baseado na quantidade de dados
  const useQuestionLevel = questionData.length >= 6; // Se tiver 6+ questões, usar nível de questão
  const validDimensions = Object.values(dimensionAverages).filter(val => !isNaN(val) && val > 0);
  
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
      return {
        dimension: item.code,
        fullName: item.question,
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const IconComponent = data.icon;
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border-2" style={{ borderColor: data.color, maxWidth: '280px' }}>
          <div className="flex items-center space-x-2 mb-3">
            <IconComponent size={16} style={{ color: data.color }} />
            <p className="font-bold text-gray-900">{data.fullName}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Média:</span>
              <span className="font-bold text-lg" style={{ color: data.color }}>
                {data.value.toFixed(2)}
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
      
      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: MODERN_COLORS.background }}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium" style={{ color: MODERN_COLORS.text }}>
            Média Geral:
          </span>
          <span className="font-bold text-lg" style={{ color: MODERN_COLORS.text }}>
            {overallAverage.toFixed(2)}
          </span>
        </div>
        <div className="mt-2 text-xs" style={{ color: MODERN_COLORS.textLight }}>
          Meta recomendada: 4.0 | Total de dados: {questionData.length}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {radarData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border-2 hover:shadow-lg transition-all duration-300" 
                 style={{ borderColor: `${item.color}30` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                    <IconComponent size={16} style={{ color: item.color }} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.fullName}</h4>
                </div>
                <span 
                  className="text-xs px-3 py-1 rounded-full font-bold"
                  style={{ 
                    backgroundColor: `${item.color}20`, 
                    color: item.color 
                  }}
                >
                  {item.analysis}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.value.toFixed(2)}
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
                        width: `${(item.value / 5) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{((item.value / 5) * 100).toFixed(0)}%</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 italic">{item.message}</p>
            </div>
          );
        })}
      </div>

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
                stroke: '#ffffff'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

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
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <IconComponent size={14} style={{ color: item.color }} />
                    <span className="font-medium text-gray-900 text-sm">{item.fullName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${(item.value / 5) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <span className="font-bold text-sm w-12 text-right" style={{ color: item.color }}>
                      {item.value.toFixed(2)}
                    </span>
                  </div>
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
                  {overallAverage.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: `${(overallAverage / 5) * 100}%`,
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
    </div>
  );
}

