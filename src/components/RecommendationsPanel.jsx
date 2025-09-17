import { Lightbulb, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export function RecommendationsPanel({ recommendations }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'text-red-600 bg-red-50 border-red-200';
      case 'Média': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Baixa': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Alta': return AlertCircle;
      case 'Média': return Clock;
      case 'Baixa': return CheckCircle;
      default: return Lightbulb;
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Recomendações para Melhoria
          </h3>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">
            Parabéns! Não há questões abaixo das metas definidas que necessitem de ações imediatas.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Todas as questões estão com média igual ou superior a 3.0 e a diferença para a meta é inferior a 0.5 ponto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Lightbulb className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Recomendações para Melhoria
        </h3>
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {recommendations.length} questão{recommendations.length > 1 ? 'ões' : ''} crítica{recommendations.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            {/* Header da questão */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-gray-900 mr-2">{rec.questionCode}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                    Média: {rec.average.toFixed(2)}
                  </span>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {rec.dimension}
                  </span>
                  {typeof rec.goal === 'number' && !Number.isNaN(rec.goal) && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Meta: {rec.goal.toFixed(1)}
                    </span>
                  )}
                  {typeof rec.gap === 'number' && rec.gap > 0 && (
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      Desvio: {rec.gap.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-3">{rec.question}</p>
              </div>
            </div>

            {/* Ações recomendadas */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Lightbulb className="h-4 w-4 mr-1 text-blue-500" />
                Ações Recomendadas:
              </h4>
              
              {rec.actions.map((action, actionIndex) => {
                const PriorityIcon = getPriorityIcon(action.priority);
                return (
                  <div 
                    key={actionIndex} 
                    className={`border rounded-lg p-3 ${getPriorityColor(action.priority)}`}
                  >
                    <div className="flex items-start">
                      <PriorityIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{action.title}</h5>
                          <span className="text-xs font-medium px-2 py-1 rounded">
                            {action.priority}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Resumo das prioridades */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Resumo das Prioridades:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-700">
              <strong>Alta:</strong> Implementar imediatamente
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-yellow-700">
              <strong>Média:</strong> Planejar para próximos meses
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-green-700">
              <strong>Baixa:</strong> Considerar para futuro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

