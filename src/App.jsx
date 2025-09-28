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
import { BarChart3, Upload, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Lightbulb, Menu, X, ChevronDown, ChevronUp, Info, Target, Zap } from 'lucide-react';
import './App.css';

// Recomendações específicas para cada questão
const QUESTION_RECOMMENDATIONS = {
  // QS - Qualidade do Sistema
  QS1: {
    title: "O sistema funciona sem falhas",
    recommendations: [
      "Implementar monitoramento contínuo de performance",
      "Realizar testes de carga regulares",
      "Estabelecer planos de contingência para falhas",
      "Criar sistema de alertas automáticos"
    ],
    actions: [
      "Revisar logs de erro do sistema",
      "Implementar testes automatizados",
      "Melhorar infraestrutura de servidores"
    ],
    impact: "Alto - Falhas do sistema afetam diretamente a experiência do usuário"
  },
  QS2: {
    title: "Os recursos de acessibilidade são fáceis de encontrar",
    recommendations: [
      "Adicionar menu de acessibilidade visível",
      "Implementar atalhos de teclado",
      "Melhorar contraste e tamanho de fontes",
      "Adicionar descrições alt em imagens"
    ],
    actions: [
      "Realizar auditoria de acessibilidade",
      "Treinar equipe em WCAG 2.1",
      "Implementar leitor de tela"
    ],
    impact: "Alto - Inclusão digital é fundamental para o serviço público"
  },
  QS3: {
    title: "O sistema é fácil de usar",
    recommendations: [
      "Simplificar interface do usuário",
      "Implementar design intuitivo",
      "Reduzir número de cliques necessários",
      "Adicionar tutoriais interativos"
    ],
    actions: [
      "Realizar testes de usabilidade",
      "Redesenhar fluxos complexos",
      "Implementar feedback visual"
    ],
    impact: "Muito Alto - Usabilidade impacta diretamente na adoção do sistema"
  },
  QS5: {
    title: "O desempenho do sistema é satisfatório",
    recommendations: [
      "Otimizar tempo de carregamento",
      "Implementar cache inteligente",
      "Melhorar responsividade mobile",
      "Reduzir tamanho de arquivos"
    ],
    actions: [
      "Analisar métricas de performance",
      "Otimizar banco de dados",
      "Implementar CDN"
    ],
    impact: "Alto - Performance afeta satisfação e produtividade"
  },
  QS6: {
    title: "O sistema informa sobre políticas de privacidade",
    recommendations: [
      "Criar política de privacidade clara",
      "Implementar avisos de cookies",
      "Adicionar termos de uso visíveis",
      "Explicar uso de dados pessoais"
    ],
    actions: [
      "Revisar conformidade com LGPD",
      "Criar avisos transparentes",
      "Implementar controles de privacidade"
    ],
    impact: "Alto - Transparência é obrigatória por lei"
  },
  QS7: {
    title: "Meus dados estão seguros neste sistema",
    recommendations: [
      "Implementar criptografia end-to-end",
      "Adicionar autenticação de dois fatores",
      "Realizar auditorias de segurança",
      "Criar certificados de segurança visíveis"
    ],
    actions: [
      "Implementar HTTPS em todas as páginas",
      "Revisar políticas de senha",
      "Criar backup seguro de dados"
    ],
    impact: "Crítico - Segurança é fundamental para confiança"
  },
  QS8: {
    title: "É fácil localizar serviços e informações",
    recommendations: [
      "Melhorar sistema de busca",
      "Reorganizar menu de navegação",
      "Implementar filtros inteligentes",
      "Adicionar mapa do site"
    ],
    actions: [
      "Realizar card sorting com usuários",
      "Implementar busca com autocomplete",
      "Criar categorização clara"
    ],
    impact: "Alto - Findabilidade impacta eficiência do usuário"
  },
  QS9: {
    title: "A navegação pelo sistema é intuitiva",
    recommendations: [
      "Simplificar estrutura de navegação",
      "Implementar breadcrumbs",
      "Padronizar elementos de interface",
      "Adicionar indicadores de progresso"
    ],
    actions: [
      "Redesenhar arquitetura da informação",
      "Implementar padrões de design",
      "Criar guia de navegação"
    ],
    impact: "Alto - Navegação intuitiva reduz tempo de aprendizado"
  },
  QS10: {
    title: "O sistema oferece instruções úteis",
    recommendations: [
      "Criar tutoriais passo-a-passo",
      "Implementar tooltips contextuais",
      "Adicionar FAQ dinâmico",
      "Desenvolver sistema de ajuda integrado"
    ],
    actions: [
      "Mapear pontos de dúvida dos usuários",
      "Criar vídeos explicativos",
      "Implementar chat de suporte"
    ],
    impact: "Médio - Instruções claras reduzem suporte técnico"
  },

  // QI - Qualidade da Informação
  QI1: {
    title: "As informações são fáceis de entender",
    recommendations: [
      "Usar linguagem simples e clara",
      "Evitar jargões técnicos",
      "Implementar glossário de termos",
      "Adicionar exemplos práticos"
    ],
    actions: [
      "Revisar todos os textos do sistema",
      "Implementar teste de legibilidade",
      "Criar guia de linguagem simples"
    ],
    impact: "Alto - Clareza da informação é essencial para compreensão"
  },
  QI2: {
    title: "As informações são precisas",
    recommendations: [
      "Implementar processo de validação de dados",
      "Criar sistema de atualização automática",
      "Estabelecer fonte única da verdade",
      "Implementar controle de qualidade"
    ],
    actions: [
      "Auditar precisão dos dados atuais",
      "Criar processo de verificação",
      "Implementar alertas de inconsistência"
    ],
    impact: "Crítico - Informações imprecisas geram desconfiança"
  },
  QI3: {
    title: "As informações auxiliam na solicitação dos serviços",
    recommendations: [
      "Contextualizar informações por serviço",
      "Adicionar exemplos de preenchimento",
      "Implementar ajuda contextual",
      "Criar pré-visualização de resultados"
    ],
    actions: [
      "Mapear jornada do usuário por serviço",
      "Implementar ajuda inline",
      "Criar simuladores de serviços"
    ],
    impact: "Alto - Informações contextuais reduzem erros"
  },
  QI4: {
    title: "Todas as informações necessárias são fornecidas",
    recommendations: [
      "Mapear todas as informações necessárias",
      "Implementar checklist de requisitos",
      "Adicionar validação em tempo real",
      "Criar resumo de informações necessárias"
    ],
    actions: [
      "Auditar completude das informações",
      "Implementar validação progressiva",
      "Criar guias de requisitos"
    ],
    impact: "Alto - Informações incompletas geram retrabalho"
  },

  // QO - Qualidade da Operação
  QO1: {
    title: "Os serviços oferecem suporte técnico eficiente",
    recommendations: [
      "Implementar chat de suporte em tempo real",
      "Criar base de conhecimento abrangente",
      "Estabelecer SLA de atendimento",
      "Treinar equipe de suporte"
    ],
    actions: [
      "Mapear principais dúvidas dos usuários",
      "Implementar sistema de tickets",
      "Criar métricas de satisfação do suporte"
    ],
    impact: "Alto - Suporte eficiente reduz frustração do usuário"
  },
  QO2: {
    title: "O atendimento resolve meus problemas",
    recommendations: [
      "Implementar escalação automática",
      "Criar processo de follow-up",
      "Estabelecer métricas de resolução",
      "Treinar equipe em resolução de problemas"
    ],
    actions: [
      "Analisar taxa de resolução atual",
      "Implementar feedback pós-atendimento",
      "Criar processo de melhoria contínua"
    ],
    impact: "Crítico - Resolução efetiva é essencial para confiança"
  },
  QO3: {
    title: "Os serviços permitem conclusão no menor tempo possível",
    recommendations: [
      "Otimizar fluxos de trabalho",
      "Implementar automação de processos",
      "Reduzir etapas desnecessárias",
      "Criar atalhos para usuários experientes"
    ],
    actions: [
      "Mapear tempo atual de cada processo",
      "Identificar gargalos operacionais",
      "Implementar métricas de tempo"
    ],
    impact: "Alto - Eficiência operacional impacta satisfação"
  },
  QO4: {
    title: "Consigo obter o que preciso no menor tempo possível",
    recommendations: [
      "Implementar busca inteligente",
      "Criar atalhos personalizados",
      "Otimizar tempo de resposta",
      "Implementar cache de resultados"
    ],
    actions: [
      "Analisar jornadas mais comuns",
      "Implementar personalização",
      "Criar dashboards personalizados"
    ],
    impact: "Alto - Rapidez na obtenção de resultados é crucial"
  },
  QO5: {
    title: "Os serviços atendem às minhas expectativas",
    recommendations: [
      "Realizar pesquisas de expectativa",
      "Implementar feedback contínuo",
      "Criar processo de melhoria baseado em feedback",
      "Estabelecer métricas de satisfação"
    ],
    actions: [
      "Mapear expectativas dos usuários",
      "Implementar NPS (Net Promoter Score)",
      "Criar ciclo de melhoria contínua"
    ],
    impact: "Alto - Atender expectativas gera fidelização"
  },
  QO6: {
    title: "Minhas dificuldades são resolvidas quando preciso de ajuda",
    recommendations: [
      "Implementar sistema de suporte multicamadas",
      "Criar documentação abrangente",
      "Estabelecer processo de escalação",
      "Treinar equipe em empatia"
    ],
    actions: [
      "Mapear principais dificuldades",
      "Implementar sistema de conhecimento",
      "Criar métricas de resolução"
    ],
    impact: "Alto - Resolução de dificuldades impacta retenção"
  },
  QO7: {
    title: "Meus dados são automaticamente identificados",
    recommendations: [
      "Implementar integração com sistemas governamentais",
      "Criar perfil único do cidadão",
      "Implementar SSO (Single Sign-On)",
      "Otimizar preenchimento automático"
    ],
    actions: [
      "Integrar com bases de dados governamentais",
      "Implementar autenticação única",
      "Criar cache de dados do usuário"
    ],
    impact: "Médio - Automação reduz fricção no processo"
  }
};

// Recomendações para pontos positivos (como manter e melhorar ainda mais)
const POSITIVE_RECOMMENDATIONS = {
  // Usar as mesmas questões, mas com foco em manutenção e melhoria contínua
  ...Object.fromEntries(
    Object.entries(QUESTION_RECOMMENDATIONS).map(([code, data]) => [
      code,
      {
        ...data,
        recommendations: [
          "Manter as boas práticas atuais que levaram a este resultado",
          "Documentar processos de sucesso para replicação",
          "Compartilhar experiências com outras áreas",
          "Buscar oportunidades de melhoria contínua"
        ],
        actions: [
          "Monitorar indicadores para manter performance",
          "Treinar equipe para manter padrão de qualidade",
          "Criar processo de melhoria contínua"
        ],
        impact: data.impact.replace("Alto -", "Positivo -").replace("Crítico -", "Excelente -").replace("Médio -", "Bom -")
      }
    ])
  )
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedCritical, setExpandedCritical] = useState(null);
  const [expandedPositive, setExpandedPositive] = useState(null);
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

  // Função para scroll suave até seção
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          <div className="space-y-8">
            {/* KPIs Principais */}
            <section id="kpis" className="scroll-mt-32">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Indicadores Principais</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
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
                
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
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
                
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
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
              </div>
            </section>

            {/* Gráficos Principais */}
            <section id="charts" className="scroll-mt-32">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Análises Gráficas</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Médias por Dimensão</h3>
                  </div>
                  <DimensionChart 
                    dimensionAverages={analysis.dimensionAverages}
                    goals={filters.goals}
                  />
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp size={20} className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Radar de Qualidade</h3>
                  </div>
                  <QualityRadarChart 
                    questionAverages={analysis.questionAverages}
                  />
                </div>
              </div>
            </section>

            {/* Distribuição das Questões */}
            <section id="distribution" className="scroll-mt-32">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 size={20} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Distribuição das Questões</h2>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <QuestionDistributionChart 
                  data={Object.entries(analysis.questionAverages || {}).map(([code, questionData]) => ({
                    code,
                    average: questionData?.average || 0,
                    question: code, // Usar código em vez do nome completo
                    dimension: code.substring(0, 2) // QS, QI, QO
                  }))}
                  goals={filters.goals}
                />
              </div>
            </section>

            {/* Análise Detalhada */}
            <section id="critical" className="scroll-mt-32">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Pontos Críticos</h2>
                    <p className="text-sm text-gray-600">
                      Clique em cada item para ver recomendações detalhadas
                    </p>
                  </div>
                </div>
                {analysis.classification.critical.length > 0 && (
                  <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-lg">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="text-red-800 font-semibold">
                      {analysis.classification.critical.length} questão{analysis.classification.critical.length !== 1 ? 'ões' : ''} crítica{analysis.classification.critical.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                {analysis.classification.critical.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <p className="text-gray-600">Nenhum ponto crítico identificado.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysis.classification.critical.map((item, index) => {
                      const isExpanded = expandedCritical === index;
                      const recommendation = QUESTION_RECOMMENDATIONS[item.code];
                      
                      return (
                        <div key={item.code} className="border-l-4 border-red-500 bg-red-50 rounded-r-lg overflow-hidden">
                          <div 
                            className="p-4 cursor-pointer hover:bg-red-100 transition-colors"
                            onClick={() => setExpandedCritical(isExpanded ? null : index)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-red-800 text-lg">{item.code}</span>
                                {isExpanded ? <ChevronUp size={16} className="text-red-600" /> : <ChevronDown size={16} className="text-red-600" />}
                              </div>
                              <span className="text-xl font-bold text-red-600">
                                {item.average.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs text-red-700 mb-1">Dimensão: {item.dimension}</p>
                            {recommendation && (
                              <p className="text-sm text-red-800 font-medium">{recommendation.title}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-red-600 bg-red-200 px-2 py-1 rounded-full">
                                Crítico - Requer ação imediata
                              </span>
                              <span className="text-xs text-red-600">
                                Clique para ver recomendações
                              </span>
                            </div>
                          </div>
                          
                          {isExpanded && recommendation && (
                            <div className="border-t border-red-200 bg-white p-6">
                              <div className="space-y-6">
                                {/* Cabeçalho */}
                                <div className="flex items-start space-x-3">
                                  <div className="p-2 bg-red-100 rounded-lg">
                                    <Target size={20} className="text-red-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                                      Plano de Melhoria para {item.code}
                                    </h4>
                                    <p className="text-gray-700 text-sm mb-4">
                                      {recommendation.title}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm">
                                      <div className="flex items-center space-x-1">
                                        <AlertTriangle size={14} className="text-red-500" />
                                        <span className="text-red-700 font-medium">
                                          Impacto: {recommendation.impact}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Info size={14} className="text-blue-500" />
                                        <span className="text-blue-700">
                                          Meta: ≥ 4.0 (atual: {item.average.toFixed(1)})
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Recomendações */}
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Lightbulb size={16} className="text-blue-600" />
                                      <h5 className="font-semibold text-blue-900">Recomendações Estratégicas</h5>
                                    </div>
                                    <ul className="space-y-2">
                                      {recommendation.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start space-x-2 text-sm">
                                          <CheckCircle size={12} className="text-blue-600 mt-1 flex-shrink-0" />
                                          <span className="text-blue-800">{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Zap size={16} className="text-green-600" />
                                      <h5 className="font-semibold text-green-900">Ações Imediatas</h5>
                                    </div>
                                    <ul className="space-y-2">
                                      {recommendation.actions.map((action, idx) => (
                                        <li key={idx} className="flex items-start space-x-2 text-sm">
                                          <Target size={12} className="text-green-600 mt-1 flex-shrink-0" />
                                          <span className="text-green-800">{action}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                {/* Métricas de Progresso */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                    <TrendingUp size={16} className="text-gray-600" />
                                    <span>Métricas de Acompanhamento</span>
                                  </h5>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="text-center">
                                      <div className="font-bold text-lg text-red-600">{item.average.toFixed(1)}</div>
                                      <div className="text-gray-600">Atual</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold text-lg text-yellow-600">3.5</div>
                                      <div className="text-gray-600">Meta Intermediária</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold text-lg text-green-600">4.0</div>
                                      <div className="text-gray-600">Meta Final</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold text-lg text-blue-600">
                                        {((item.average / 4.0) * 100).toFixed(0)}%
                                      </div>
                                      <div className="text-gray-600">Progresso</div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                      <span>Progresso para Meta</span>
                                      <span>{((item.average / 4.0) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((item.average / 4.0) * 100, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Botão de Ação */}
                                <div className="flex justify-center pt-4 border-t border-gray-200">
                                  <button className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    <Target size={16} />
                                    <span>Iniciar Plano de Melhoria</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section id="positive" className="scroll-mt-32">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Pontos Positivos</h2>
                    <p className="text-sm text-gray-600">
                      Clique em cada item para ver como manter e melhorar ainda mais
                    </p>
                  </div>
                </div>
                {analysis.classification.positive.length > 0 && (
                  <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-800 font-semibold">
                      {analysis.classification.positive.length} questão{analysis.classification.positive.length !== 1 ? 'ões' : ''} positiva{analysis.classification.positive.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                {analysis.classification.positive.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
                    <p className="text-gray-600">Nenhum ponto positivo identificado.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysis.classification.positive.map((item, index) => {
                      const isExpanded = expandedPositive === index;
                      const recommendation = POSITIVE_RECOMMENDATIONS[item.code];
                      
                      return (
                        <div key={item.code} className="border-l-4 border-green-500 bg-green-50 rounded-r-lg overflow-hidden">
                          <div 
                            className="p-4 cursor-pointer hover:bg-green-100 transition-colors"
                            onClick={() => setExpandedPositive(isExpanded ? null : index)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-green-800 text-lg">{item.code}</span>
                                {isExpanded ? <ChevronUp size={16} className="text-green-600" /> : <ChevronDown size={16} className="text-green-600" />}
                              </div>
                              <span className="text-xl font-bold text-green-600">
                                {item.average.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs text-green-700 mb-1">Dimensão: {item.dimension}</p>
                            {recommendation && (
                              <p className="text-sm text-green-800 font-medium">{recommendation.title}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">
                                Excelente - Continue assim!
                              </span>
                              <span className="text-xs text-green-600">
                                Clique para ver como manter
                              </span>
                            </div>
                          </div>
                          
                          {isExpanded && recommendation && (
                            <div className="border-t border-green-200 bg-white p-6">
                              <div className="space-y-6">
                                {/* Cabeçalho */}
                                <div className="flex items-start space-x-3">
                                  <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle size={20} className="text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                                      Plano de Manutenção para {item.code}
                                    </h4>
                                    <p className="text-gray-700 text-sm mb-4">
                                      {recommendation.title}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm">
                                      <div className="flex items-center space-x-1">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span className="text-green-700 font-medium">
                                          {recommendation.impact}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <TrendingUp size={14} className="text-blue-500" />
                                        <span className="text-blue-700">
                                          Meta atingida: {item.average.toFixed(1)} ≥ 4.0
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Recomendações */}
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <CheckCircle size={16} className="text-blue-600" />
                                      <h5 className="font-semibold text-blue-900">Como Manter o Sucesso</h5>
                                    </div>
                                    <ul className="space-y-2">
                                      {recommendation.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start space-x-2 text-sm">
                                          <CheckCircle size={12} className="text-blue-600 mt-1 flex-shrink-0" />
                                          <span className="text-blue-800">{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <TrendingUp size={16} className="text-green-600" />
                                      <h5 className="font-semibold text-green-900">Ações de Melhoria Contínua</h5>
                                    </div>
                                    <ul className="space-y-2">
                                      {recommendation.actions.map((action, idx) => (
                                        <li key={idx} className="flex items-start space-x-2 text-sm">
                                          <Target size={12} className="text-green-600 mt-1 flex-shrink-0" />
                                          <span className="text-green-800">{action}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                {/* Métricas de Sucesso */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                    <TrendingUp size={16} className="text-gray-600" />
                                    <span>Métricas de Sucesso</span>
                                  </h5>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="text-center">
                                      <div className="font-bold text-lg text-green-600">{item.average.toFixed(1)}</div>
                                      <div className="text-gray-600">Atual</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold text-lg text-green-600">4.0</div>
                                      <div className="text-gray-600">Meta Atingida</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold text-lg text-blue-600">4.5</div>
                                      <div className="text-gray-600">Próxima Meta</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-bold text-lg text-green-600">
                                        {((item.average / 4.0) * 100).toFixed(0)}%
                                      </div>
                                      <div className="text-gray-600">Performance</div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                      <span>Performance Atual</span>
                                      <span>{((item.average / 5.0) * 100).toFixed(1)}% da escala máxima</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(item.average / 5.0) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Botão de Ação */}
                                <div className="flex justify-center pt-4 border-t border-gray-200">
                                  <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    <CheckCircle size={16} />
                                    <span>Implementar Melhoria Contínua</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Envio de Respostas</h2>
                  <p className="text-gray-600">Faça upload de arquivos CSV com respostas dos questionários.</p>
                </div>
              </div>
              
              <FileUpload onDataProcessed={uploadNewData} onReset={resetToDefault} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <AlertTriangle size={16} className="mr-2" />
                  Instruções de Upload
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle size={14} className="mr-2 mt-0.5 text-blue-600" />
                    Aceita arquivos CSV com questionários de 8, 20 ou 26 questões
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={14} className="mr-2 mt-0.5 text-blue-600" />
                    O sistema identifica automaticamente o tipo de questionário
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={14} className="mr-2 mt-0.5 text-blue-600" />
                    Respostas são convertidas para escala numérica (1-5)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={14} className="mr-2 mt-0.5 text-blue-600" />
                    Linhas em branco são removidas automaticamente
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Tipos Suportados
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">Base26</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">26 questões</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">Base20</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">20 questões</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">Base8</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">8 questões</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <button
                onClick={resetToDefault}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Clock size={16} className="mr-2" />
                Voltar aos dados padrão
              </button>
            </div>
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
      {/* Sidebar Recolhível */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <Sidebar 
          filters={filters}
          onUpdateFilters={updateFilters}
          onUpdateGoals={updateGoals}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Overlay para mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0' : 'ml-80'
      }`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-6 shadow-lg sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold">
                  PSDigQual - Análise de Qualidade
                </h1>
                <p className="text-blue-100 mt-1 text-sm lg:text-base">
                  Sistema integrado de monitoramento e análise
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Total de Respostas</div>
              <div className="text-2xl font-bold">{analysis.totalResponses}</div>
            </div>
          </div>

          {/* Navegação Rápida - só no dashboard */}
          {activeTab === 'dashboard' && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => scrollToSection('kpis')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                KPIs
              </button>
              <button
                onClick={() => scrollToSection('charts')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Gráficos
              </button>
              <button
                onClick={() => scrollToSection('distribution')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Distribuição
              </button>
              <button
                onClick={() => scrollToSection('critical')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Pontos Críticos
              </button>
              <button
                onClick={() => scrollToSection('positive')}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Pontos Positivos
              </button>
            </div>
          )}
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 shadow-sm">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
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
        <main className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

