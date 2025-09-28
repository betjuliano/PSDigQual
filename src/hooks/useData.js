import { useState, useEffect, useMemo } from 'react';
import {
  calculateQuestionAverages,
  calculateDimensionAverages,
  classifyQuestions,
  extractProfileData,
  getRecommendationsForCriticalQuestions
} from '../lib/dataProcessor';
import { 
  sampleBase26Data, 
  sampleCompleteData, 
  sampleBase20Data, 
  sampleTransparencyData, 
  sampleBase8Data 
} from '../data/sampleData';

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
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('🔄 Carregando dados iniciais do PSDigQual...');
        
        setData({
          base26: sampleBase26Data,
          base20: sampleBase20Data,
          complete: sampleCompleteData, // Alias para compatibilidade
          base8: sampleBase8Data,
          transparency: sampleTransparencyData, // Alias para compatibilidade
          combined: {
            data: [
              ...sampleBase26Data.data, 
              ...sampleBase20Data.data, 
              ...sampleBase8Data.data
            ],
            type: 'combined'
          }
        });
        
        console.log('✅ Dados iniciais carregados:', {
          base26: sampleBase26Data.data.length,
          base20: sampleBase20Data.data.length,
          base8: sampleBase8Data.data.length
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

<<<<<<< HEAD
=======
    // Aplicar filtros demográficos
    const hasActiveFilters = Object.values(filters.demographic).some(arr => arr.length > 0);
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

>>>>>>> d520d7822fd60c11d3048a52078d74002fe285b7
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
      
<<<<<<< HEAD
=======
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

>>>>>>> d520d7822fd60c11d3048a52078d74002fe285b7
      // processedData já vem processado do FileUpload
      const newData = processedData;
      const dataType = newData.type;
      
<<<<<<< HEAD
      setData(prevData => {
        const updatedData = {
          ...prevData,
          [isTransparency ? 'transparency' : 'complete']: {
            ...newData,
            type: isTransparency ? 'transparency' : 'complete'
          }
        };
        
        // Atualizar dados combinados
        updatedData.combined = {
          data: [
            ...(updatedData.complete?.data || []), 
            ...(updatedData.transparency?.data || [])
          ],
          type: 'combined'
        };
        
        return updatedData;
=======
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
>>>>>>> d520d7822fd60c11d3048a52078d74002fe285b7
      });
      
      return { success: true, type: isTransparency ? 'transparency' : 'complete' };
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = () => {
    console.log('🔄 Resetando para dados padrão...');
    
    setData({
      base26: sampleBase26Data,
      base20: sampleBase20Data,
      complete: sampleCompleteData,
      base8: sampleBase8Data,
      transparency: sampleTransparencyData,
      combined: {
        data: [
          ...sampleBase26Data.data, 
          ...sampleBase20Data.data, 
          ...sampleBase8Data.data
        ],
        type: 'combined'
      }
    });
    
    setFilters({
      period: 'all',
      questionnaire: 'all',
      goals: { QS: 4.0, QO: 4.0, QI: 4.0 }
    });
    
    console.log('✅ Dados resetados para padrão');
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

