import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function QuestionDistributionChart({ questionAverages, goals }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const questionData = questionAverages[label];
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-gray-700 mb-2">
            {questionData?.question || 'Questão não encontrada'}
          </p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Média:</span> 
              <span className={`ml-1 ${getScoreColor(data.value)}`}>
                {data.value.toFixed(2)}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Respostas:</span> {questionData?.responseCount || 0}
            </p>
            <p className="text-sm">
              <span className="font-medium">Dimensão:</span> {questionData?.dimension || 'N/A'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span> 
              <span className={`ml-1 font-medium ${getStatusColor(data.value, goals[questionData?.dimension] || 4)}`}>
                {getStatus(data.value, goals[questionData?.dimension] || 4)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (score, goal) => {
    if (score >= goal) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatus = (score, goal) => {
    if (score >= goal) return 'Positivo';
    if (score >= 3) return 'Neutro';
    return 'Crítico';
  };

  const getBarColor = (score, goal) => {
    if (score >= goal) return '#10b981'; // Verde
    if (score >= 3) return '#f59e0b';    // Amarelo
    return '#ef4444';                    // Vermelho
  };

  const data = Object.entries(questionAverages).map(([code, questionData]) => ({
    name: code,
    value: questionData.average,
    goal: goals[questionData.dimension] || 4,
    dimension: questionData.dimension,
    question: questionData.question,
    responseCount: questionData.responseCount
  }));

  // Separar por dimensão para melhor visualização
  const qsData = data.filter(item => item.dimension === 'QS');
  const qoData = data.filter(item => item.dimension === 'QO');
  const qiData = data.filter(item => item.dimension === 'QI');

  const renderChart = (chartData, title, color) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[0, 5]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Média', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill={color}
            radius={[4, 4, 0, 0]}
            stroke="#fff"
            strokeWidth={1}
          />
          <Bar 
            dataKey="goal" 
            fill="none" 
            stroke="#6b7280" 
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legenda personalizada */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>≥ Meta (Positivo)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>Entre 3.0 e Meta (Neutro)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span>&lt; 3.0 (Crítico)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-2 border-2 border-gray-500 border-dashed mr-2"></div>
          <span>Meta</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Visão Geral */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição Geral das Respostas por Questão
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[0, 5]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Média', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              stroke="#fff"
              strokeWidth={1}
            >
              {data.map((entry, index) => (
                <Bar 
                  key={`bar-${index}`} 
                  fill={getBarColor(entry.value, entry.goal)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {data.filter(item => item.value >= item.goal).length}
            </p>
            <p className="text-sm text-gray-600">Questões Positivas</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {data.filter(item => item.value >= 3 && item.value < item.goal).length}
            </p>
            <p className="text-sm text-gray-600">Questões Neutras</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {data.filter(item => item.value < 3).length}
            </p>
            <p className="text-sm text-gray-600">Questões Críticas</p>
          </div>
        </div>
      </div>

      {/* Por Dimensão */}
      {qsData.length > 0 && renderChart(qsData, 'Qualidade do Sistema (QS)', '#3b82f6')}
      {qoData.length > 0 && renderChart(qoData, 'Qualidade da Operação (QO)', '#8b5cf6')}
      {qiData.length > 0 && renderChart(qiData, 'Qualidade da Informação (QI)', '#10b981')}
    </div>
  );
}

