import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { X, Info, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

// Paleta de cores profissional inspirada em dashboards modernos
const MODERN_COLORS = {
  critical: '#E53E3E',      // Vermelho forte e profissional
  warning: '#F6AD55',       // Laranja/amarelo mais suave
  attention: '#F6AD55',     // Cor para atenção (mesmo que warning)
  neutral: '#68D391',       // Verde suave
  good: '#38B2AC',          // Teal profissional
  excellent: '#4299E1',     // Azul confiável
  background: '#F7FAFC',    // Fundo suave
  border: '#E2E8F0',       // Bordas sutis
  text: '#2D3748',         // Texto escuro
  textLight: '#718096',    // Texto secundário
  gradient: [
    '#E53E3E', '#F6AD55', '#68D391', '#38B2AC', '#4299E1', '#9F7AEA',
    '#ED64A6', '#F687B3', '#FBB6CE', '#C6F6D5', '#9AE6B4', '#68D391'
  ]
};

// Função para obter cor baseada na média e meta
const getQuestionColor = (average, goal) => {
  if (average < 2.5) return MODERN_COLORS.critical;
  if (average < 3.0) return MODERN_COLORS.warning;
  if (average < goal) return MODERN_COLORS.attention;
  if (average < 4.5) return MODERN_COLORS.good;
  return MODERN_COLORS.excellent;
};

// Função para obter cor do gradiente baseada no índice
const getGradientColor = (index) => {
  return MODERN_COLORS.gradient[index % MODERN_COLORS.gradient.length];
};

// Mapeamento de questões para descrições detalhadas
const getQuestionDescription = (questionCode) => {
  const descriptions = {
    'QS1': 'Avalia se o sistema funciona sem falhas técnicas, bugs ou interrupções que prejudiquem a experiência do usuário.',
    'QS3': 'Mede a facilidade de uso do sistema, incluindo interface intuitiva, navegação clara e simplicidade de operação.',
    'QS8': 'Verifica se é fácil localizar dados e informações no sistema, incluindo busca eficiente e organização lógica.',
    'QS9': 'Avalia se a navegação pelo sistema é intuitiva, com fluxos lógicos e elementos de interface compreensíveis.',
    'QI1': 'Mede se as informações são apresentadas de forma clara, compreensível e acessível aos usuários.',
    'QI2': 'Avalia a precisão e exatidão das informações disponibilizadas no sistema.',
    'QI7': 'Verifica se as informações estão atualizadas e refletem a realidade atual dos dados.',
    'QO4': 'Mede se o usuário consegue obter o que precisa no menor tempo possível, avaliando eficiência do serviço.'
  };
  return descriptions[questionCode] || 'Descrição não disponível para esta questão.';
};

// Função para obter recomendações específicas
const getQuestionRecommendation = (questionCode, average) => {
  const recommendations = {
    'QS1': {
      action: 'Implementar monitoramento contínuo e testes automatizados',
      description: 'Estabelecer sistema de monitoramento em tempo real, implementar testes automatizados e criar processo de correção rápida de falhas.',
      priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
    },
    'QS3': {
      action: 'Realizar testes de usabilidade e melhorar interface',
      description: 'Conduzir testes com usuários reais, simplificar interface e implementar design centrado no usuário.',
      priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
    },
    'QS8': {
      action: 'Implementar busca inteligente e reorganizar menu',
      description: 'Desenvolver sistema de busca avançada, categorizar informações logicamente e melhorar arquitetura da informação.',
      priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
    },
    'QS9': {
      action: 'Melhorar arquitetura da informação e fluxos de navegação',
      description: 'Redesenhar fluxos de navegação, implementar breadcrumbs e criar mapa do site mais intuitivo.',
      priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
    },
    'QI1': {
      action: 'Criar glossário interativo e melhorar linguagem',
      description: 'Desenvolver glossário de termos técnicos, simplificar linguagem e implementar explicações contextuais.',
      priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
    },
    'QI2': {
      action: 'Implementar conciliação automatizada de dados',
      description: 'Estabelecer processos de validação automática, implementar controles de qualidade e criar sistema de auditoria.',
      priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
    },
    'QI7': {
      action: 'Automatizar publicação e atualização de dados',
      description: 'Implementar sistema de atualização automática, estabelecer cronograma de publicação e criar alertas de desatualização.',
      priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
    },
    'QO4': {
      action: 'Criar dashboard de acesso rápido e otimizar performance',
      description: 'Desenvolver dashboard personalizado, otimizar tempo de resposta e implementar atalhos para informações frequentes.',
      priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
    }
  };

  return recommendations[questionCode] || {
    action: 'Analisar questão específica e implementar melhorias',
    description: 'Realizar análise detalhada da questão e desenvolver plano de ação específico baseado no feedback dos usuários.',
    priority: average < 3 ? 'Alta' : average < 4 ? 'Média' : 'Baixa'
  };
};

// Tooltip customizado com design moderno
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const average = data.average;
    const goal = data.goal || 4.0;
    
    let status, statusColor;
    if (average < 2.5) {
      status = 'Crítico';
      statusColor = MODERN_COLORS.critical;
    } else if (average < 3.0) {
      status = 'Crítico';
      statusColor = MODERN_COLORS.critical;
    } else if (average < goal) {
      status = 'Atenção';
      statusColor = MODERN_COLORS.attention;
    } else if (average < 4.5) {
      status = 'Bom';
      statusColor = MODERN_COLORS.good;
    } else {
      status = 'Excelente';
      statusColor = MODERN_COLORS.excellent;
    }

    return (
      <div className="bg-white p-4 border-2 rounded-xl shadow-xl max-w-xs" style={{ borderColor: MODERN_COLORS.border }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-lg" style={{ color: MODERN_COLORS.text }}>{label}</h4>
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
            style={{ backgroundColor: statusColor }}
          >
            {status}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span style={{ color: MODERN_COLORS.textLight }}>Média:</span>
            <span className="font-bold text-lg" style={{ color: statusColor }}>{average.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: MODERN_COLORS.textLight }}>Meta:</span>
            <span className="font-semibold" style={{ color: MODERN_COLORS.text }}>{goal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: MODERN_COLORS.textLight }}>Diferença:</span>
            <span className={`font-bold ${average >= goal ? 'text-green-600' : 'text-red-600'}`}>
              {average >= goal ? '+' : ''}{(average - goal).toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${MODERN_COLORS.border}` }}>
          <p className="text-xs" style={{ color: MODERN_COLORS.textLight }}>
            {getQuestionDescription(label)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const QuestionDistributionChart = ({ data, goals, colorMode = 'status' }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleBarClick = (data) => {
    setSelectedQuestion(data);
    setShowDetails(true);
  };

  const closeModal = () => {
    setSelectedQuestion(null);
  };

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

  // Componente Modal para detalhes da questão
  const QuestionDetailModal = ({ question, onClose }) => {
    if (!question) return null;

    const recommendation = getQuestionRecommendation(question.code, question.average);
    const description = getQuestionDescription(question.code);
    
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'Alta': return 'bg-red-100 text-red-800 border-red-200';
        case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Baixa': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Detalhes da Questão {question.code}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Questão */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Questão</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {question.question}
              </p>
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h4>
              <p className="text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{question.average.toFixed(2)}</div>
                <div className="text-sm text-blue-800">Média Atual</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{(goals[question.dimension] || 4.0).toFixed(1)}</div>
                <div className="text-sm text-green-800">Meta</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{question.dimension}</div>
                <div className="text-sm text-purple-800">Dimensão</div>
              </div>
            </div>

            {/* Recomendação */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-orange-600" />
                <h4 className="text-lg font-semibold text-gray-800">Recomendação</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                  Prioridade {recommendation.priority}
                </span>
              </div>
              
              <div className="mb-3">
                <h5 className="font-medium text-gray-800 mb-2">Ação Recomendada:</h5>
                <p className="text-gray-700 font-medium">{recommendation.action}</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Descrição Detalhada:</h5>
                <p className="text-gray-600 leading-relaxed">{recommendation.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8" style={{ backgroundColor: MODERN_COLORS.background, border: `1px solid ${MODERN_COLORS.border}` }}>
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2" style={{ color: MODERN_COLORS.text }}>Distribuição Geral das Respostas por Questão</h3>
        
        {/* Legenda melhorada */}
        <div className="flex flex-wrap gap-6 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'white', border: `1px solid ${MODERN_COLORS.border}` }}>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: MODERN_COLORS.critical }}></div>
            <span className="font-semibold" style={{ color: MODERN_COLORS.text }}>Crítico ({allStats.critical})</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: MODERN_COLORS.attention }}></div>
            <span className="font-semibold" style={{ color: MODERN_COLORS.text }}>Atenção ({allStats.neutral})</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: MODERN_COLORS.excellent }}></div>
            <span className="font-semibold" style={{ color: MODERN_COLORS.text }}>Positivo ({allStats.positive})</span>
          </div>
        </div>
      </div>

      {/* Gráfico Principal */}
      <div className="mb-8">
        <h4 className="text-xl font-bold mb-4" style={{ color: MODERN_COLORS.text }}>
          Visão Geral - Todas as Questões 
          <span className="text-sm font-normal ml-2" style={{ color: MODERN_COLORS.textLight }}>(Clique nas barras para ver detalhes)</span>
        </h4>
        <div className="bg-white p-6 rounded-lg" style={{ border: `1px solid ${MODERN_COLORS.border}` }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={data} 
              margin={{ top: 50, right: 30, left: 20, bottom: 80 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={MODERN_COLORS.border} opacity={0.5} />
              <XAxis 
                dataKey="code" 
                tick={{ fontSize: 12, fill: MODERN_COLORS.text }}
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: MODERN_COLORS.border }}
                tickLine={{ stroke: MODERN_COLORS.border }}
              />
              <YAxis 
                domain={[0, 5]}
                tick={{ fontSize: 12, fill: MODERN_COLORS.text }}
                axisLine={{ stroke: MODERN_COLORS.border }}
                tickLine={{ stroke: MODERN_COLORS.border }}
                label={{ value: 'Média', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: MODERN_COLORS.text } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                 dataKey="average" 
                 onClick={handleBarClick}
                 cursor="pointer"
                 radius={[6, 6, 0, 0]}
                 stroke="white"
                 strokeWidth={2}
               >
                 <LabelList 
                   dataKey="average" 
                   position="top"
                   fill={MODERN_COLORS.text}
                   fontSize={12}
                   fontWeight="bold"
                 />
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
      </div>

      {/* Botão para mostrar/ocultar detalhes */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          style={{ 
            backgroundColor: showDetails ? MODERN_COLORS.critical : MODERN_COLORS.excellent,
            color: 'white'
          }}
        >
          {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <span>{showDetails ? 'Ocultar Detalhes por Dimensão' : 'Mostrar Detalhes por Dimensão'}</span>
        </button>
      </div>

      {/* Gráficos por Dimensão - Mostrar apenas se showDetails for true */}
      {showDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
                <div className="text-xs text-gray-400 mb-3">
                  (Clique nas barras para detalhes)
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
                    <Bar 
                      dataKey="average" 
                      radius={[3, 3, 0, 0]}
                      onClick={handleBarClick}
                      style={{ cursor: 'pointer' }}
                    >
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
                  <span className="text-yellow-600">Atenção: {stats.neutral}</span>
                  <span className="text-green-600">Positivo: {stats.positive}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                <div className="text-sm text-gray-600">Questões de Atenção</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{allStats.positive}</div>
            <div className="text-sm text-gray-600">Questões Positivas</div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <QuestionDetailModal 
        question={selectedQuestion} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default QuestionDistributionChart;

