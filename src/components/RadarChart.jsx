import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function QualityRadarChart({ questionAverages }) {
  // Preparar dados para o radar chart
  const data = Object.entries(questionAverages).map(([code, questionData]) => ({
    question: code,
    value: questionData.average,
    fullQuestion: questionData.question
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-900 mb-1">{data.question}</p>
          <p className="text-sm text-gray-600 mb-2">{data.fullQuestion}</p>
          <p className="text-sm font-medium" style={{ color: payload[0].color }}>
            Avaliação: {data.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Radar de Qualidade
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="question" 
            tick={{ fontSize: 10, fill: '#6b7280' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 5]} 
            tick={{ fontSize: 10, fill: '#6b7280' }}
          />
          <Radar
            name="Avaliação Atual"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-blue-500 rounded-full opacity-30"></div>
          <span>Avaliação Atual</span>
        </div>
      </div>
    </div>
  );
}

