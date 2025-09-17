import { Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Sidebar({ filters, onUpdateFilters, onUpdateGoals }) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const handlePeriodChange = (period) => {
    onUpdateFilters({ period });
  };

  const handleQuestionnaireChange = (questionnaire, checked) => {
    if (questionnaire === 'complete') {
      onUpdateFilters({ 
        questionnaire: checked ? 'complete' : (filters.questionnaire === 'complete' ? 'all' : filters.questionnaire)
      });
    } else if (questionnaire === 'transparency') {
      onUpdateFilters({ 
        questionnaire: checked ? 'transparency' : (filters.questionnaire === 'transparency' ? 'all' : filters.questionnaire)
      });
    }
  };

  const handleGoalChange = (dimension, value) => {
    onUpdateGoals({ [dimension]: parseFloat(value) });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 h-screen overflow-y-auto">
      {/* Header dos Filtros */}
      <div 
        className="flex items-center gap-2 mb-6 cursor-pointer"
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
      >
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {isFiltersOpen && (
        <div className="space-y-6">
          {/* Filtro de Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Período
            </label>
            <select 
              value={filters.period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os dados</option>
              <option value="last_month">Último mês</option>
              <option value="last_quarter">Último trimestre</option>
              <option value="last_year">Último ano</option>
            </select>
          </div>

          {/* Filtro de Questionário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Questionário
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="questionnaire"
                  value="all"
                  checked={filters.questionnaire === 'all'}
                  onChange={(e) => onUpdateFilters({ questionnaire: e.target.value })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Todos os dados
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="questionnaire"
                  value="complete"
                  checked={filters.questionnaire === 'complete'}
                  onChange={(e) => onUpdateFilters({ questionnaire: e.target.value })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Completo (20 questões)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="questionnaire"
                  value="transparency"
                  checked={filters.questionnaire === 'transparency'}
                  onChange={(e) => onUpdateFilters({ questionnaire: e.target.value })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Portal Transparência (8)
                </span>
              </label>
            </div>
          </div>

          {/* Definir Metas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Definir Metas
            </label>
            
            <div className="space-y-4">
              {/* Meta QS (Sistema) */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Meta QS (Sistema)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={filters.goals.QS}
                    onChange={(e) => handleGoalChange('QS', e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {filters.goals.QS}
                  </span>
                </div>
              </div>

              {/* Meta QO (Operação) */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Meta QO (Operação)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={filters.goals.QO}
                    onChange={(e) => handleGoalChange('QO', e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {filters.goals.QO}
                  </span>
                </div>
              </div>

              {/* Meta QI (Informação) */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Meta QI (Informação)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={filters.goals.QI}
                    onChange={(e) => handleGoalChange('QI', e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {filters.goals.QI}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

