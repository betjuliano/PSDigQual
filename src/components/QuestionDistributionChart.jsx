import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Paleta de cores moderna e vibrante
const MODERN_COLORS = {
  critical: '#FF6B6B',      // Vermelho coral moderno
  warning: '#FFD93D',       // Amarelo vibrante
  neutral: '#6BCF7F',       // Verde menta
  good: '#4ECDC4',          // Turquesa
  excellent: '#45B7D1',     // Azul céu
  gradient: [
    '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCF7F', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
  ]
};

// Função para obter cor baseada na média e meta
const getQuestionColor = (average, goal) => {
  if (average < 2.5) return MODERN_COLORS.critical;
  if (average < 3.0) return MODERN_COLORS.warning;
  if (average < goal) return MODERN_COLORS.neutral;
  if (average < 4.5) return MODERN_COLORS.good;
  return MODERN_COLORS.excellent;
};

// Função para obter cor do gradiente baseada no índice
const getGradientColor = (index) => {
  return MODERN_COLORS.gradient[index % MODERN_COLORS.gradient.length];
};

// Tooltip customizado com design moderno
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const average = data.average;
    const goal = data.goal || 4.0;
    
    let status = 'Excelente';
    let statusColor = MODERN_COLORS.excellent;
    
    if (average < 2.5) {
      status = 'Crítico';
      statusColor = MODERN_COLORS.critical;
    } else if (average < 3.0) {
      status = 'Atenção';
      statusColor = MODERN_COLORS.warning;
    } else if (average < goal) {
      status = 'Neutro';
      statusColor = MODERN_COLORS.neutral;
    } else if (average < 4.5) {
      status = 'Bom';
      statusColor = MODERN_COLORS.good;
    }

    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-xs">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Média:</span>
            <span className="font-bold text-lg" style={{ color: statusColor }}>
              {average.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Meta:</span>
            <span className="font-medium text-gray-700">{goal.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: statusColor }}
            >
              {status}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Dimensão: {data.dimension}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const QuestionDistributionChart = ({ data, goals, colorMode = 'status' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Distribuição Geral das Respostas por Questão
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    );
  }

  // Separar dados por dimensão
  const dimensionData = {
    QS: data.filter(item => item.dimension === 'QS'),
    QO: data.filter(item => item.dimension === 'QO'),
    QI: data.filter(item => item.dimension === 'QI')
  };

  const dimensionNames = {
    QS: 'Qualidade do Sistema',
    QO: 'Qualidade da Operação',
    QI: 'Qualidade da Informação'
  };

  // Estatísticas por categoria
  const getStats = (items) => {
    const critical = items.filter(item => item.average < 3.0).length;
    const neutral = items.filter(item => item.average >= 3.0 && item.average < (goals[item.dimension] || 4.0)).length;
    const positive = items.filter(item => item.average >= (goals[item.dimension] || 4.0)).length;
    
    return { critical, neutral, positive, total: items.length };
  };

  const allStats = getStats(data);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Distribuição Geral das Respostas por Questão
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MODERN_COLORS.critical }}></div>
            <span className="text-gray-600">Crítico ({allStats.critical})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MODERN_COLORS.neutral }}></div>
            <span className="text-gray-600">Neutro ({allStats.neutral})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MODERN_COLORS.excellent }}></div>
            <span className="text-gray-600">Positivo ({allStats.positive})</span>
          </div>
        </div>
      </div>

      {/* Gráfico Geral */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">Visão Geral - Todas as Questões</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="code" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              stroke="#666"
            />
            <YAxis 
              domain={[0, 5]}
              fontSize={12}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="average" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colorMode === 'gradient' 
                    ? getGradientColor(index) 
                    : getQuestionColor(entry.average, goals[entry.dimension] || 4.0)
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos por Dimensão */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(dimensionData).map(([dimension, items]) => {
          if (items.length === 0) return null;
          
          const stats = getStats(items);
          
          return (
            <div key={dimension} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-800">{dimensionNames[dimension]}</h5>
                <div className="text-xs text-gray-500">
                  {stats.total} questões
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={items} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="code" 
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    fontSize={10}
                    stroke="#666"
                  />
                  <YAxis 
                    domain={[0, 5]}
                    fontSize={10}
                    stroke="#666"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="average" radius={[3, 3, 0, 0]}>
                    {items.map((entry, index) => (
                      <Cell 
                        key={`cell-${dimension}-${index}`} 
                        fill={getQuestionColor(entry.average, goals[dimension] || 4.0)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span className="text-red-600">Crítico: {stats.critical}</span>
                <span className="text-yellow-600">Neutro: {stats.neutral}</span>
                <span className="text-green-600">Positivo: {stats.positive}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo Estatístico */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h5 className="font-medium text-gray-800 mb-3">Resumo Estatístico</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{allStats.total}</div>
            <div className="text-sm text-gray-600">Total de Questões</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{allStats.critical}</div>
            <div className="text-sm text-gray-600">Questões Críticas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{allStats.neutral}</div>
            <div className="text-sm text-gray-600">Questões Neutras</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{allStats.positive}</div>
            <div className="text-sm text-gray-600">Questões Positivas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDistributionChart;

