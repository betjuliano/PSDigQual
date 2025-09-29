import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, BarChart3, Layers } from 'lucide-react';
import { useState } from 'react';

const MODERN_COLORS = {
  critical: '#E53E3E',
  attention: '#F6AD55', 
  excellent: '#4299E1',
  background: '#F7FAFC',
  border: '#E2E8F0',
  text: '#2D3748',
  textLight: '#718096',
  qs: '#8b5cf6',
  qi: '#10b981',
  qo: '#f59e0b'
};

const DIMENSION_NAMES = {
  QS: 'Qualidade do Sistema',
  QI: 'Qualidade da Informação',
  QO: 'Qualidade da Operação'
};

const DIMENSION_COLORS = {
  QS: MODERN_COLORS.qs,
  QI: MODERN_COLORS.qi,
  QO: MODERN_COLORS.qo
};

export function QualityRadarChart({ questionAverages, onQuestionClick }) {
  const [selectedView, setSelectedView] = useState('all'); // 'all', 'QS', 'QI', 'QO'
  
  // Verificar se há dados válidos
  if (!questionAverages || Object.keys(questionAverages).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8" style={{ border: `1px solid ${MODERN_COLORS.border}` }}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: MODERN_COLORS.text }}>
            Radar de Qualidade
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
      question: code
    }));

  // Verificar se há dados suficientes
  if (questionData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8" style={{ border: `1px solid ${MODERN_COLORS.border}` }}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: MODERN_COLORS.text }}>
            Radar de Qualidade
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

  // Filtrar dados por dimensão selecionada
  const filteredData = selectedView === 'all' 
    ? questionData 
    : questionData.filter(item => item.dimension === selectedView);

  // Agrupar dados por dimensão para estatísticas
  const dimensionStats = questionData.reduce((acc, item) => {
    if (!acc[item.dimension]) {
      acc[item.dimension] = { total: 0, count: 0, questions: [] };
    }
    acc[item.dimension].total += item.average;
    acc[item.dimension].count += 1;
    acc[item.dimension].questions.push(item);
    return acc;
  }, {});

  // Calcular médias por dimensão
  Object.keys(dimensionStats).forEach(dim => {
    dimensionStats[dim].average = dimensionStats[dim].total / dimensionStats[dim].count;
  });

  // Preparar dados para visualização baseado na view selecionada
  const radarData = filteredData.map(item => ({
    dimension: item.code,
    fullName: item.code,
    value: item.average,
    dimensionGroup: item.dimension
  }));
  
  const getChartTitle = () => {
    if (selectedView === 'all') return 'Radar de Qualidade - Todas as Dimensões';
    return `Radar de Qualidade - ${DIMENSION_NAMES[selectedView]}`;
  };
  
  const chartTitle = getChartTitle();
  const chartSubtitle = `Análise de ${filteredData.length} questões`;

  // Função para lidar com cliques nos pontos do radar
  const handleRadarClick = (data) => {
    if (onQuestionClick && data && data.activePayload && data.activePayload[0]) {
      const questionCode = data.activePayload[0].payload.dimension;
      onQuestionClick(questionCode);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-bold text-gray-900 mb-1">{data.fullName}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Média:</span>
            <span className="font-bold text-lg text-purple-600">
              {data.value.toFixed(2)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8" style={{ border: `1px solid ${MODERN_COLORS.border}` }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
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
        
        {/* Controles de Dimensão */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedView('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'all' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Layers size={16} className="inline mr-1" />
            Todas
          </button>
          {Object.keys(dimensionStats).map(dim => (
            <button
              key={dim}
              onClick={() => setSelectedView(dim)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === dim 
                  ? 'border-2' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedView === dim ? `${DIMENSION_COLORS[dim]}20` : undefined,
                color: selectedView === dim ? DIMENSION_COLORS[dim] : undefined,
                borderColor: selectedView === dim ? DIMENSION_COLORS[dim] : 'transparent'
              }}
            >
              <BarChart3 size={16} className="inline mr-1" />
              {dim}
            </button>
          ))}
        </div>
      </div>
      
      {/* Estatísticas das Dimensões */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(dimensionStats).map(([dim, stats]) => (
          <div 
            key={dim} 
            className="p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md"
            style={{ 
              borderColor: selectedView === dim ? DIMENSION_COLORS[dim] : MODERN_COLORS.border,
              backgroundColor: selectedView === dim ? `${DIMENSION_COLORS[dim]}10` : MODERN_COLORS.background
            }}
            onClick={() => setSelectedView(dim)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm" style={{ color: DIMENSION_COLORS[dim] }}>
                {DIMENSION_NAMES[dim]}
              </h4>
              <span className="text-xs text-gray-500">{stats.count} questões</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: DIMENSION_COLORS[dim] }}>
              {stats.average.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
              data={radarData} 
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              onClick={handleRadarClick}
            >
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
              stroke={selectedView === 'all' ? "#8b5cf6" : DIMENSION_COLORS[selectedView] || "#8b5cf6"}
              fill={selectedView === 'all' ? "#8b5cf6" : DIMENSION_COLORS[selectedView] || "#8b5cf6"}
              fillOpacity={0.15}
              strokeWidth={3}
              dot={{ 
                fill: selectedView === 'all' ? "#8b5cf6" : DIMENSION_COLORS[selectedView] || "#8b5cf6", 
                strokeWidth: 2, 
                r: 5,
                stroke: '#ffffff',
                cursor: 'pointer'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

