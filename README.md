# PSDigQual - Plataforma de Análise da Qualidade do Serviço Público Digital

## Visão Geral

A PSDigQual é uma plataforma web para análise da qualidade dos serviços públicos digitais com base em questionários do tipo Likert. O sistema permite upload de arquivos CSV/Excel, processamento automático das respostas e visualização em dashboards interativos.

## Funcionalidades

### 🎯 Dashboard Principal
- **KPIs principais**: Total de respostas, médias por dimensão (QS, QO, QI)
- **Gráfico de barras**: Avaliação por dimensão comparando média atual vs meta
- **Gráfico radar**: Visualização da qualidade por questões individuais
- **Distribuição por questão**: Gráfico de barras com cores baseadas no status (crítico, neutro, positivo)

### 📊 Análise de Dados
- **Processamento automático**: Conversão de escala Likert (1-5)
- **Identificação automática**: Distingue questionários de 8 ou 20 questões
- **Limpeza de dados**: Remove linhas em branco automaticamente
- **Cálculo de médias**: Por questão e por dimensão

### 📁 Upload de Arquivos
- **Formatos suportados**: CSV
- **Drag & drop**: Interface intuitiva para upload
- **Validação**: Verificação automática do formato
- **Feedback**: Status do processamento em tempo real

### 🔍 Análises Críticas
- **Pontos críticos**: Questões com média < 3.0
- **Pontos positivos**: Questões com média ≥ meta definida
- **Pontos para melhoria**: Questões entre 3.0 e meta

### ⚙️ Filtros e Configurações
- **Período**: Filtro por período dos dados
- **Tipo de questionário**: Completo (20 questões) ou Portal da Transparência (8 questões)
- **Metas personalizáveis**: Definição de metas por dimensão (QS, QO, QI)

## Estrutura dos Dados

### Questionário Completo (20 questões)
Avalia três dimensões principais:

**Qualidade do Sistema (QS)**
- QS1: O sistema funciona sem falhas
- QS2: Recursos de acessibilidade são fáceis de encontrar
- QS3: O sistema é fácil de usar
- QS5: Desempenho satisfatório
- QS6: Informa sobre políticas de privacidade
- QS7: Dados estão seguros
- QS8: Fácil localizar serviços e informações
- QS9: Navegação intuitiva
- QS10: Oferece instruções úteis

**Qualidade da Informação (QI)**
- QI1: Informações fáceis de entender
- QI2: Informações precisas
- QI3: Informações auxiliam na solicitação
- QI4: Todas as informações necessárias são fornecidas

**Qualidade da Operação (QO)**
- QO1: Suporte técnico eficiente
- QO2: Atendimento resolve problemas
- QO3: Conclusão de tarefas no menor tempo
- QO4: Obter o que precisa no menor tempo
- QO5: Serviços atendem expectativas
- QO6: Dificuldades são resolvidas
- QO7: Dados automaticamente identificados

### Questionário Portal da Transparência (8 questões)
Versão reduzida focada em transparência pública:
- Portal é fácil de usar
- Fácil localizar dados e informações
- Navegação intuitiva
- Portal funciona sem falhas
- Informações fáceis de entender
- Informações precisas
- Informações atualizadas
- Obter o que precisa rapidamente

## Escala de Avaliação

As respostas seguem escala Likert de 5 pontos:
- **1**: Discordo totalmente
- **2**: Discordo
- **3**: Não sei / Indiferente
- **4**: Concordo
- **5**: Concordo totalmente

## Classificação de Status

- **🔴 Crítico**: Média < 3.0
- **🟡 Neutro**: Média entre 3.0 e meta definida
- **🟢 Positivo**: Média ≥ meta definida

## Como Usar

### 1. Visualizar Dashboard
- Acesse a aba "Dashboard PSDigQual"
- Visualize os KPIs e gráficos
- Use os filtros na sidebar para personalizar a análise

### 2. Fazer Upload de Dados
- Acesse a aba "Envio Respostas"
- Arraste e solte seu arquivo CSV ou clique para selecionar
- O sistema identificará automaticamente o tipo de questionário
- Aguarde o processamento e confirmação

### 3. Analisar Resultados
- Acesse a aba "Análises"
- Visualize pontos críticos, positivos e para melhoria
- Use as informações para tomar decisões estratégicas

### 4. Configurar Metas
- Use os controles deslizantes na sidebar
- Defina metas específicas para cada dimensão (QS, QO, QI)
- Os gráficos se atualizarão automaticamente

## Tecnologias Utilizadas

- **Frontend**: React + Vite
- **Estilização**: Tailwind CSS
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Processamento**: JavaScript nativo

## Estrutura do Projeto

```
psdigqual/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Sidebar.jsx     # Barra lateral com filtros
│   │   ├── KPICard.jsx     # Cards de KPIs
│   │   ├── DimensionChart.jsx    # Gráfico de dimensões
│   │   ├── RadarChart.jsx        # Gráfico radar
│   │   ├── QuestionDistributionChart.jsx  # Distribuição por questão
│   │   └── FileUpload.jsx        # Upload de arquivos
│   ├── hooks/
│   │   └── useData.js      # Hook para gerenciamento de dados
│   ├── lib/
│   │   └── dataProcessor.js # Processamento de dados CSV
│   ├── data/
│   │   └── sampleData.js   # Dados de exemplo
│   └── assets/             # Arquivos estáticos
├── public/                 # Arquivos públicos
└── README.md              # Esta documentação
```

## Instalação e Execução

```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

## Suporte

Para dúvidas ou sugestões sobre a plataforma PSDigQual, entre em contato com a equipe de desenvolvimento.

---

**PSDigQual v1.0** - Desenvolvido para análise da qualidade de serviços públicos digitais

