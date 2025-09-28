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
    { id: 'recommendations', label: 'Recomendações', icon: Lightbulb }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard PSDigQual</h2>
              <p className="text-gray-600">Análise abrangente da qualidade dos serviços públicos digitais por dimensões.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <KPICard
                title="Total Respostas"
                value={analysis.totalResponses}
                icon={Users}
                color="blue"
              />
              <KPICard
                title="Média QS"
                value={analysis.dimensionAverages.QS?.toFixed(1) || '0.0'}
                subtitle="Qualidade do Sistema"
                icon={BarChart3}
                color="blue"
              />
              <KPICard
                title="Média QO"
                value={analysis.dimensionAverages.QO?.toFixed(1) || '0.0'}
                subtitle="Qualidade da Operação"
                icon={TrendingUp}
                color="purple"
              />
              <KPICard
                title="Média QI"
                value={analysis.dimensionAverages.QI?.toFixed(1) || '0.0'}
                subtitle="Qualidade da Informação"
                icon={CheckCircle}
                color="green"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DimensionChart 
                dimensionAverages={analysis.dimensionAverages}
                goals={filters.goals}
              />
              <QualityRadarChart 
                questionAverages={analysis.questionAverages}
              />
            </div>

            {/* Question Distribution */}
            <QuestionDistributionChart 
              questionAverages={analysis.questionAverages}
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

