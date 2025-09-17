import { ThumbsUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';

export function RecommendationsPage({ analysis, goals }) {
  const { classification, recommendations, dimensionAverages } = analysis;

  const getPriorityBadge = (priority) => {
    const colors = {
      'Alta': 'bg-red-100 text-red-800 border-red-200',
      'Média': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Baixa': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDimensionRecommendations = (dimension) => {
    const dimensionRecs = recommendations.filter(rec => rec.dimension === dimension);
    return dimensionRecs;
  };

  const getAllActions = () => {
    const allActions = [];
    recommendations.forEach(rec => {
      rec.actions.forEach(action => {
        allActions.push({
          ...action,
          questionCode: rec.questionCode,
          question: rec.question,
          dimension: rec.dimension,
          average: rec.average
        });
      });
    });
    
    // Ordenar por prioridade
    const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
    return allActions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Análise Crítica</h2>
        <p className="text-gray-600">Identificação de pontos fortes e críticos com recomendações de ações de melhoria.</p>
      </div>

      {/* Cards de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pontos Positivos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <ThumbsUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pontos Positivos</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Questões com desempenho acima da meta definida
          </p>

          {classification.positive.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma questão atinge as metas definidas</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-green-600">
                  {classification.positive.length}
                </span>
                <span className="text-sm text-gray-600 ml-2">questões positivas</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 mb-2">Recomendações de Manutenção</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Manter processos atuais de validação de informações</li>
                  <li>• Continuar investimentos em recursos de acessibilidade</li>
                  <li>• Reforçar treinamentos da equipe editorial</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Pontos Críticos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pontos Críticos</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Questões com desempenho abaixo da média 3.0
          </p>

          {classification.critical.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma questão está abaixo da média mínima</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-red-600">
                  {classification.critical.length}
                </span>
                <span className="text-sm text-gray-600 ml-2">questões críticas</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 mb-2">Ações Prioritárias</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Implementar dashboard de acesso rápido</li>
                  <li>• Criar sistema de monitoramento de falhas</li>
                  <li>• Desenvolver testes automatizados</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plano de Ações Recomendadas */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Plano de Ações Recomendadas</h3>
          </div>

          <div className="space-y-4">
            {getAllActions().map((action, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-gray-900 mr-3">{action.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityBadge(action.priority)}`}>
                        {action.priority} Prioridade
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Para questões de {action.dimension.toLowerCase()} • {action.questionCode}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Ação:</strong> {action.description}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Benefício:</strong> Melhora direta na experiência do usuário e na eficiência do sistema, 
                    contribuindo para elevar a média da questão "{action.question}" 
                    (atual: {action.average.toFixed(2)}).
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendações por Dimensão */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['QS', 'QO', 'QI'].map(dimension => {
          const dimensionName = {
            'QS': 'Qualidade do Sistema',
            'QO': 'Qualidade da Operação', 
            'QI': 'Qualidade da Informação'
          }[dimension];

          const dimensionRecs = getDimensionRecommendations(dimension);
          const dimensionAvg = dimensionAverages[dimension] || 0;
          const dimensionGoal = goals[dimension] || 4;

          return (
            <div key={dimension} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{dimension}</h3>
                  <p className="text-xs text-gray-600">{dimensionName}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Média Atual</span>
                  <span className={`font-bold ${dimensionAvg >= dimensionGoal ? 'text-green-600' : dimensionAvg >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {dimensionAvg.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Meta</span>
                  <span className="font-medium text-gray-900">{dimensionGoal.toFixed(1)}</span>
                </div>
              </div>

              {dimensionRecs.length > 0 ? (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ações Recomendadas</h4>
                  <div className="space-y-2">
                    {dimensionRecs.slice(0, 2).map((rec, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="font-medium text-gray-800">{rec.questionCode}</p>
                        <p className="text-gray-600">{rec.actions[0]?.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <ThumbsUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600 font-medium">Dimensão em bom estado</p>
                  <p className="text-xs text-gray-500">Manter práticas atuais</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

