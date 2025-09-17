import { useState, useEffect, useMemo } from 'react';
import { 
  processCSVData, 
  calculateQuestionAverages, 
  calculateDimensionAverages,
  classifyQuestions,
  extractProfileData,
  getRecommendationsForCriticalQuestions
} from '../lib/dataProcessor';
import { sampleCompleteData, sampleTransparencyData } from '../data/sampleData';

export function useData() {
  const [data, setData] = useState({
    complete: null,
    transparency: null,
    combined: null
  });
  
  const [filters, setFilters] = useState({
    period: 'all',
    questionnaire: 'all', // 'all', 'complete', 'transparency'
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
        
        setData({
          complete: sampleCompleteData,
          transparency: sampleTransparencyData,
          combined: {
            data: [...sampleCompleteData.data, ...sampleTransparencyData.data],
            type: 'combined'
          }
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Processar dados com base nos filtros
  const processedData = useMemo(() => {
    if (!data.complete || !data.transparency) return null;

    let filteredData = { ...data };

    // Filtrar por tipo de questionário
    if (filters.questionnaire !== 'all') {
      if (filters.questionnaire === 'complete') {
        filteredData = {
          complete: data.complete,
          transparency: { data: [], type: 'transparency' },
          combined: data.complete
        };
      } else if (filters.questionnaire === 'transparency') {
        filteredData = {
          complete: { data: [], type: 'complete' },
          transparency: data.transparency,
          combined: data.transparency
        };
      }
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

  const uploadNewData = async (file) => {
    try {
      setIsLoading(true);
      
      const text = await file.text();
      const newData = processCSVData(text);
      
      // Determinar tipo baseado no número de questões Likert
      const likertQuestions = Object.keys(newData.data[0] || {}).filter(key => 
        !['Qual o seu sexo?', 'Qual a sua idade?', 'Qual seu nível de escolaridade completo?', 'Você é funcionário público?'].includes(key)
      );
      
      const isTransparency = likertQuestions.length <= 8;
      
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
          data: [...updatedData.complete.data, ...updatedData.transparency.data],
          type: 'combined'
        };
        
        return updatedData;
      });
      
      return { success: true, type: isTransparency ? 'transparency' : 'complete' };
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = () => {
    setData({
      complete: sampleCompleteData,
      transparency: sampleTransparencyData,
      combined: {
        data: [...sampleCompleteData.data, ...sampleTransparencyData.data],
        type: 'combined'
      }
    });
    setFilters({
      period: 'all',
      questionnaire: 'all',
      goals: { QS: 4.0, QO: 4.0, QI: 4.0 }
    });
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

