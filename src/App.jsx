import { useState } from 'react';
import { useData } from './hooks/useData';
import { Sidebar } from './components/Sidebar';
import { KPICard } from './components/KPICard';
import { DimensionChart } from './components/DimensionChart';
import { QualityRadarChart } from './components/RadarChart';
import QuestionDistributionChart from './components/QuestionDistributionChart';
import FileUpload from './components/FileUpload';
import { ProfileCharts } from './components/ProfileCharts';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { RecommendationsPage } from './components/RecommendationsPage';
import { BarChart3, Upload, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    data, 
    analysis, 
    filters, 
    uploadNewData, 
    resetToDefault, 
    updateFilters, 
    updateGoals,
    isLoading 
  } = useData();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard PSDigQual', icon: BarChart3 },
    { id: 'upload', label: 'Envio Respostas', icon: Upload },
    { id: 'profile', label: 'Perfil', icon: Users },
    { id: 'recommendations', label: 'Recomendações', icon: Lightbulb },
    { id: 'analysis', label: 'Análises', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Header Modernizado */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Dashboard PSDigQual</h2>
                  <p className="text-blue-100 text-lg">Análise abrangente da qualidade dos serviços públicos digitais</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={20} className="text-green-300" />
                    <span className="font-semibold">Qualidade Monitorada</span>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={20} className="text-yellow-300" />
                    <span className="font-semibold">Análise em Tempo Real</span>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Lightbulb size={20} className="text-orange-300" />
                    <span className="font-semibold">Recomendações Inteligentes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs Modernizados */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Respostas</p>
                    <p className="text-3xl font-bold text-gray-900">{analysis.totalResponses}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Média QS</p>
                    <p className="text-3xl font-bold text-blue-600">{analysis.dimensionAverages.QS?.toFixed(1) || '0.0'}</p>
                    <p className="text-xs text-gray-400">Qualidade do Sistema</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <BarChart3 size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Média QO</p>
                    <p className="text-3xl font-bold text-purple-600">{analysis.dimensionAverages.QO?.toFixed(1) || '0.0'}</p>
                    <p className="text-xs text-gray-400">Qualidade da Operação</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <TrendingUp size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Média QI</p>
                    <p className="text-3xl font-bold text-green-600">{analysis.dimensionAverages.QI?.toFixed(1) || '0.0'}</p>
                    <p className="text-xs text-gray-400">Qualidade da Informação</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos Principais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Médias por Dimensão</h3>
                </div>
                <DimensionChart 
                  dimensionAverages={analysis.dimensionAverages}
                  goals={filters.goals}
                />
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp size={20} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Radar de Qualidade</h3>
                </div>
                <QualityRadarChart 
                  questionAverages={analysis.questionAverages}
                />
              </div>
            </div>

            {/* Question Distribution */}
            <QuestionDistributionChart 
              data={Object.entries(analysis.questionAverages || {}).map(([code, questionData]) => ({
                code,
                average: questionData?.average || 0,
                question: questionData?.question || code,
                dimension: code.substring(0, 2) // QS, QI, QO
              }))}
              goals={filters.goals}
            />
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Envio de Respostas</h2>
              <p className="text-gray-600">Faça upload de arquivos CSV com respostas dos questionários.</p>
            </div>
            
            <FileUpload onDataProcessed={uploadNewData} onReset={resetToDefault} />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Instruções:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Aceita arquivos CSV com questionários de 8 ou 20 questões</li>
                <li>• O sistema identifica automaticamente o tipo de questionário</li>
                <li>• Respostas são convertidas para escala numérica (1-5)</li>
                <li>• Linhas em branco são removidas automaticamente</li>
              </ul>
            </div>

            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voltar aos dados padrão
            </button>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Perfil dos Respondentes</h2>
              <p className="text-gray-600">Análise demográfica e características dos participantes da pesquisa.</p>
            </div>
            
            <ProfileCharts 
              profileData={analysis.profileData}
              totalResponses={analysis.totalResponses}
            />
          </div>
        );

      case 'recommendations':
        return (
          <RecommendationsPage 
            analysis={analysis}
            goals={filters.goals}
          />
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Análises Detalhadas</h2>
              <p className="text-gray-600">Identificação de pontos críticos, de atenção e positivos com recomendações de melhoria.</p>
            </div>

            {/* Recomendações para Questões Críticas */}
            <RecommendationsPanel recommendations={analysis.recommendations} />

            {/* Pontos Críticos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Pontos Críticos (Média &lt; 3.0)
                </h3>
              </div>
              {analysis.classification.critical.length === 0 ? (
                <p className="text-gray-600">Nenhum ponto crítico identificado.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.classification.critical.map((item) => (
                    <div key={item.code} className="border-l-4 border-red-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{item.code}</p>
                          <p className="text-sm text-gray-600">{item.question}</p>
                          <p className="text-xs text-gray-500">Dimensão: {item.dimension}</p>
                        </div>
                        <span className="text-lg font-bold text-red-600">
                          {item.average.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pontos Positivos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Pontos Positivos (Média ≥ Meta)
                </h3>
              </div>
              {analysis.classification.positive.length === 0 ? (
                <p className="text-gray-600">Nenhum ponto positivo identificado.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.classification.positive.map((item) => (
                    <div key={item.code} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{item.code}</p>
                          <p className="text-sm text-gray-600">{item.question}</p>
                          <p className="text-xs text-gray-500">Dimensão: {item.dimension}</p>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          {item.average.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pontos para Melhoria */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Pontos para Melhoria (Entre 3.0 e Meta)
                </h3>
              </div>
              {analysis.classification.neutral.length === 0 ? (
                <p className="text-gray-600">Nenhum ponto para melhoria identificado.</p>
              ) : (
                <div className="space-y-3">
                  {analysis.classification.neutral.map((item) => (
                    <div key={item.code} className="border-l-4 border-yellow-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{item.code}</p>
                          <p className="text-sm text-gray-600">{item.question}</p>
                          <p className="text-xs text-gray-500">Dimensão: {item.dimension}</p>
                        </div>
                        <span className="text-lg font-bold text-yellow-600">
                          {item.average.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        filters={filters}
        onUpdateFilters={updateFilters}
        onUpdateGoals={updateGoals}
      />

      {/* Main Content */}
      <div className="flex-1 ml-80">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Plataforma de Análise da Qualidade do Serviço Público Digital
          </h1>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <main className="p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default App;

