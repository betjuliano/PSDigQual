import { Filter, ChevronDown, Users, X } from 'lucide-react';
import { useState } from 'react';

export function Sidebar({ filters, onUpdateFilters, onUpdateGoals, collapsed, onToggle }) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [isDemographicFiltersOpen, setIsDemographicFiltersOpen] = useState(true);

  const handlePeriodChange = (period) => {
    onUpdateFilters({ period });
  };

  const handleGoalChange = (dimension, value) => {
    onUpdateGoals({ [dimension]: parseFloat(value) });
  };

  const handleDemographicFilterChange = (filterType, value, checked) => {
    const currentFilters = filters.demographic || {};
    const currentValues = currentFilters[filterType] || [];
    
    let newValues;
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    onUpdateFilters({
      demographic: {
        ...currentFilters,
        [filterType]: newValues
      }
    });
  };

  const clearDemographicFilters = () => {
    onUpdateFilters({
      demographic: {
        sexo: [],
        idade: [],
        escolaridade: [],
        servidor: []
      }
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto shadow-lg">
      {/* Header dos Filtros */}
      <div className="p-6 border-b border-gray-200">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      <div className="p-6">
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
                Tipo de Questionário
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
                    value="base26"
                    checked={filters.questionnaire === 'base26'}
                    onChange={(e) => onUpdateFilters({ questionnaire: e.target.value })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Base26 (26 questões)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="questionnaire"
                    value="base20"
                    checked={filters.questionnaire === 'base20' || filters.questionnaire === 'complete'}
                    onChange={(e) => onUpdateFilters({ questionnaire: e.target.value })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Base20 (20 questões)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="questionnaire"
                    value="base8"
                    checked={filters.questionnaire === 'base8' || filters.questionnaire === 'transparency'}
                    onChange={(e) => onUpdateFilters({ questionnaire: e.target.value })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Base8 (8 questões)
                  </span>
                </label>
              </div>
            </div>

            {/* Definir Metas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Definir Metas de Qualidade
              </label>
              
              <div className="space-y-4">
                {/* Meta QS (Sistema) */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    QS - Qualidade do Sistema: {filters.goals.QS}
                  </label>
                  <div className="flex items-center space-x-2">
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

                {/* Meta QI (Informação) */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    QI - Qualidade da Informação: {filters.goals.QI}
                  </label>
                  <div className="flex items-center space-x-2">
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

                {/* Meta QO (Operação) */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    QO - Qualidade da Operação: {filters.goals.QO}
                  </label>
                  <div className="flex items-center space-x-2">
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
              </div>
            </div>

            {/* Filtros Demográficos */}
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => setIsDemographicFiltersOpen(!isDemographicFiltersOpen)}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Filtros Demográficos
                  </label>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-500 transition-transform ${isDemographicFiltersOpen ? 'rotate-180' : ''}`} 
                />
              </div>

              {isDemographicFiltersOpen && (
                <div className="space-y-4 pl-6">
                  {/* Filtro por Sexo */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Sexo</label>
                    <div className="space-y-1">
                      {['Masculino', 'Feminino', 'Prefiro não responder'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(filters.demographic?.sexo || []).includes(option)}
                            onChange={(e) => handleDemographicFilterChange('sexo', option, e.target.checked)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-xs text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filtro por Escolaridade */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Escolaridade</label>
                    <div className="space-y-1">
                      {['Ensino Fundamental', 'Ensino Médio', 'Ensino Superior', 'Pós-Graduação'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(filters.demographic?.escolaridade || []).includes(option)}
                            onChange={(e) => handleDemographicFilterChange('escolaridade', option, e.target.checked)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-xs text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filtro por Servidor Público */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Funcionário Público</label>
                    <div className="space-y-1">
                      {['Sim', 'Não'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(filters.demographic?.servidor || []).includes(option)}
                            onChange={(e) => handleDemographicFilterChange('servidor', option, e.target.checked)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-xs text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Botão para limpar filtros demográficos */}
                  <button
                    onClick={clearDemographicFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Limpar filtros demográficos
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}