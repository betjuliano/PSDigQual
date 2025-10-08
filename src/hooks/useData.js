import { useState, useEffect, useMemo } from 'react';
import {
  calculateQuestionAverages,
  calculateDimensionAverages,
  classifyQuestions,
  extractProfileData,
  getRecommendationsForCriticalQuestions,
  filterDataByDemographics,
  processCSVData
} from '../lib/dataProcessor';
import { 
  sampleBase26Data, 
  sampleCompleteData, 
  sampleBase20Data, 
  sampleTransparencyData, 
  sampleBase8Data 
} from '../data/sampleData';

// Função para carregar dados do CSV
async function loadTransparencyDataFromCSV() {
  try {
    console.log('🔄 Carregando dados do basetransp.csv...');
    
    const response = await fetch(`/basetransp-utf8.csv?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar CSV: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('📄 Arquivo CSV carregado, processando...');
    
    const result = processCSVData(csvText, { type: 'transparency' });
    
    if (!result || !result.data || result.data.length === 0) {
      throw new Error('Nenhum dado válido encontrado no CSV');
    }
    
    console.log(`✅ Dados do CSV processados: ${result.data.length} respostas`);
    return result;
    
  } catch (error) {
    console.error('❌ Erro ao carregar dados do CSV:', error);
    console.log('🔄 Usando dados de exemplo como fallback...');
    return sampleTransparencyData;
  }
}

export function useData() {
  const [data, setData] = useState({
    base26: null,
    base20: null,
    complete: null, // Alias para base20 (compatibilidade)
    base8: null,
    transparency: null, // Alias para base8 (compatibilidade)
    combined: null
  });
  
  const [filters, setFilters] = useState({
    period: 'all',
    questionnaire: 'all', // 'all', 'base26', 'base20', 'complete', 'base8', 'transparency'
    goals: {
      QS: 4.0,
      QO: 4.0,
      QI: 4.0
    },
    demographic: {
      sexo: [],
      idade: [],
      escolaridade: [],
      servidor: []
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        console.log('🔄 Carregando dados iniciais do PSDigQual...');
        
        // Carregar dados de transparência do CSV
        const transparencyData = await loadTransparencyDataFromCSV();
        
        setData({
          base26: sampleBase26Data,
          base20: sampleBase20Data,
          complete: sampleCompleteData, // Alias para compatibilidade
          base8: transparencyData, // Usando dados do CSV
          transparency: transparencyData, // Usando dados do CSV
          combined: {
            data: [
              ...sampleBase26Data.data, 
              ...sampleBase20Data.data, 
              ...transparencyData.data
            ],
            type: 'combined'
          }
        });
        
        console.log('✅ Dados iniciais carregados:', {
          base26: sampleBase26Data.data.length,
          base20: sampleBase20Data.data.length,
          transparency: transparencyData.data.length
        });
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Processar dados com base nos filtros
  const processedData = useMemo(() => {
    if (!data.base26 || !data.base20 || !data.base8) return null;

    let filteredData = { ...data };

    // Filtrar por tipo de questionário
    if (filters.questionnaire !== 'all') {
      const emptyData = { data: [], type: 'empty' };
      
      if (filters.questionnaire === 'base26') {
        filteredData = {
          ...data,
          base20: emptyData,
          complete: emptyData,
          base8: emptyData,
          transparency: emptyData,
          combined: data.base26
        };
      } else if (filters.questionnaire === 'base20' || filters.questionnaire === 'complete') {
        filteredData = {
          ...data,
          base26: emptyData,
          base8: emptyData,
          transparency: emptyData,
          combined: data.base20
        };
      } else if (filters.questionnaire === 'base8' || filters.questionnaire === 'transparency') {
        filteredData = {
          ...data,
          base26: emptyData,
          base20: emptyData,
          complete: emptyData,
          combined: data.base8
        };
      }
    }

    // Aplicar filtros demográficos
    const hasActiveFilters = filters.demographic && Object.values(filters.demographic).some(arr => arr.length > 0);
    if (hasActiveFilters) {
      filteredData = {
        base26: {
          ...filteredData.base26,
          data: filterDataByDemographics(filteredData.base26.data, filters.demographic)
        },
        base20: {
          ...filteredData.base20,
          data: filterDataByDemographics(filteredData.base20.data, filters.demographic)
        },
        complete: {
          ...filteredData.complete,
          data: filterDataByDemographics(filteredData.complete.data, filters.demographic)
        },
        base8: {
          ...filteredData.base8,
          data: filterDataByDemographics(filteredData.base8.data, filters.demographic)
        },
        transparency: {
          ...filteredData.transparency,
          data: filterDataByDemographics(filteredData.transparency.data, filters.demographic)
        },
        combined: {
          ...filteredData.combined,
          data: filterDataByDemographics(filteredData.combined.data, filters.demographic)
        }
      };
    }
    return filteredData;
  }, [data, filters]);

  // Análise dos dados processados
  const analysis = useMemo(() => {
    if (!processedData) {
      return {
        questionAverages: {},
        dimensionAverages: {},
        classification: { critical: [], neutral: [], positive: [] },
        profileData: {},
        recommendations: [],
        totalResponses: 0
      };
    }

    // Usar dados combinados ou filtrados
    const dataToAnalyze = processedData.combined;
    
    const questionAverages = calculateQuestionAverages(dataToAnalyze);
    const dimensionAverages = calculateDimensionAverages(questionAverages);
    const classification = classifyQuestions(questionAverages, filters.goals);
    const profileData = extractProfileData(dataToAnalyze);
    const recommendations = getRecommendationsForCriticalQuestions(questionAverages, filters.goals);

    return {
      questionAverages,
      dimensionAverages,
      classification,
      profileData,
      recommendations,
      totalResponses: dataToAnalyze.data.length
    };
  }, [processedData, filters.goals]);

  const uploadNewData = async (processedData) => {
    try {
      setIsLoading(true);
      
      // LIMPEZA COMPLETA: Resetar todos os dados antes de carregar novos
      console.log('🔄 Iniciando limpeza completa de dados...');
      
      // Resetar filtros para estado inicial
      setFilters({
        period: 'all',
        questionnaire: 'all',
        goals: {
          QS: 4.0,
          QO: 4.0,
          QI: 4.0
        },
        demographic: {
          sexo: [],
          idade: [],
          escolaridade: [],
          servidor: []
        }
      });
      
      // processedData já vem processado do FileUpload
      const newData = processedData;
      const dataType = newData.type;
      
      console.log(`📊 Carregando dados do tipo: ${dataType}`);
      console.log(`📈 Total de registros: ${newData.data.length}`);
      
      // SUBSTITUIÇÃO COMPLETA: Não manter dados anteriores
      const emptyData = { data: [], type: 'empty' };
      const cleanData = {
        base26: dataType === 'base26' ? newData : emptyData,
        base20: (dataType === 'base20' || dataType === 'complete') ? newData : emptyData,
        complete: (dataType === 'base20' || dataType === 'complete') ? newData : emptyData,
        base8: (dataType === 'base8' || dataType === 'transparency') ? newData : emptyData,
        transparency: (dataType === 'base8' || dataType === 'transparency') ? newData : emptyData,
        combined: newData // Sempre usar os dados recém-carregados
      };
      
      setData(cleanData);
      
      console.log('✅ Dados carregados com sucesso!');
      console.log('📋 Estrutura final:', {
        base26: cleanData.base26.data.length,
        base20: cleanData.base20.data.length,
        base8: cleanData.base8.data.length,
        combined: cleanData.combined.data.length,
        type: cleanData.combined.type
      });
      
      return { success: true, type: dataType };
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = async () => {
    console.log('🔄 Resetando para dados padrão...');
    
    try {
      setIsLoading(true);
      
      // Recarregar dados de transparência do CSV
      const transparencyData = await loadTransparencyDataFromCSV();
      
      setData({
        base26: sampleBase26Data,
        base20: sampleBase20Data,
        complete: sampleCompleteData,
        base8: transparencyData,
        transparency: transparencyData,
        combined: {
          data: [
            ...sampleBase26Data.data, 
            ...sampleBase20Data.data, 
            ...transparencyData.data
          ],
          type: 'combined'
        }
      });
      
      setFilters({
        period: 'all',
        questionnaire: 'all',
        goals: { QS: 4.0, QO: 4.0, QI: 4.0 },
        demographic: {
          sexo: [],
          idade: [],
          escolaridade: [],
          servidor: []
        }
      });
      
      console.log('✅ Dados resetados para padrão');
    } catch (error) {
      console.error('❌ Erro ao resetar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const updateGoals = (newGoals) => {
    setFilters(prev => ({
      ...prev,
      goals: { ...prev.goals, ...newGoals }
    }));
  };

  return {
    data: processedData,
    analysis,
    filters,
    uploadNewData,
    resetToDefault,
    updateFilters,
    updateGoals,
    isLoading
  };
}

