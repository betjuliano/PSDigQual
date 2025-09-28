import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

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

  // Preparar dados para visualização - apenas radar simples por questões
  const radarData = questionData.map(item => ({
    dimension: item.code,
    fullName: item.code,
    value: item.average,
    dimensionGroup: item.dimension
  }));
  
  const chartTitle = "Radar de Qualidade";
  const chartSubtitle = `Análise de ${questionData.length} questões`;

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
    </div>
  );
}

