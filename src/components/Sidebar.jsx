import { Filter, ChevronDown, Users } from 'lucide-react';
import { useState } from 'react';

export function Sidebar({ filters, onUpdateFilters, onUpdateGoals }) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [isDemographicFiltersOpen, setIsDemographicFiltersOpen] = useState(true);

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

      {/* Filtros Demográficos */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div 
          className="flex items-center gap-2 mb-4 cursor-pointer"
          onClick={() => setIsDemographicFiltersOpen(!isDemographicFiltersOpen)}
        >
          <Users className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros de Perfil</h2>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform ${isDemographicFiltersOpen ? 'rotate-180' : ''}`} 
          />
        </div>

        {isDemographicFiltersOpen && (
          <div className="space-y-4">
            {/* Botão Limpar Filtros */}
            <button
              onClick={clearDemographicFilters}
              className="w-full text-sm text-purple-600 hover:text-purple-800 underline"
            >
              Limpar todos os filtros de perfil
            </button>

            {/* Filtro por Sexo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexo
              </label>
              <div className="space-y-1">
                {['Masculino', 'Feminino', 'Outro'].map((sexo) => (
                  <label key={sexo} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters.demographic?.sexo || []).includes(sexo)}
                      onChange={(e) => handleDemographicFilterChange('sexo', sexo, e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{sexo}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Idade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa Etária
              </label>
              <div className="space-y-1">
                {['Até 20 anos', 'De 21 a 23 anos', 'De 24 a 32 anos', 'Acima de 33 anos'].map((idade) => (
                  <label key={idade} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters.demographic?.idade || []).includes(idade)}
                      onChange={(e) => handleDemographicFilterChange('idade', idade, e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{idade}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Escolaridade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escolaridade
              </label>
              <div className="space-y-1">
                {[
                  'Ensino Fundamental',
                  'Ensino Médio',
                  'Curso Técnico',
                  'Ensino Superior',
                  'Pós-Graduação'
                ].map((escolaridade) => (
                  <label key={escolaridade} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters.demographic?.escolaridade || []).includes(escolaridade)}
                      onChange={(e) => handleDemographicFilterChange('escolaridade', escolaridade, e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{escolaridade}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Servidor Público */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servidor Público
              </label>
              <div className="space-y-1">
                {['Sim', 'Não'].map((servidor) => (
                  <label key={servidor} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(filters.demographic?.servidor || []).includes(servidor)}
                      onChange={(e) => handleDemographicFilterChange('servidor', servidor, e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{servidor}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Indicador de Filtros Ativos */}
            {filters.demographic && Object.values(filters.demographic).some(arr => arr && arr.length > 0) && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Filtros Ativos:</h4>
                <div className="space-y-1">
                  {Object.entries(filters.demographic).map(([key, values]) => {
                    if (!values || values.length === 0) return null;
                    const labels = {
                      sexo: 'Sexo',
                      idade: 'Idade',
                      escolaridade: 'Escolaridade',
                      servidor: 'Servidor Público'
                    };
                    return (
                      <div key={key} className="text-xs text-purple-700">
                        <strong>{labels[key]}:</strong> {values.join(', ')}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

