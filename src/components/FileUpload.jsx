import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Database } from 'lucide-react';
import { processFileWithMultipleEncodings, parseCSV } from '../lib/dataProcessor';

const FileUpload = ({ onDataProcessed, onReset }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fileName, setFileName] = useState('');
  const [processingDetails, setProcessingDetails] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  // Função para carregar arquivos base do projeto
  const handleLoadBaseFile = async (fileName) => {
    console.log(`🔄 Iniciando carregamento de: ${fileName}`);
    
    setIsProcessing(true);
    setFileName(fileName);
    setUploadStatus(null);
    setProcessingDetails({
      step: 'Carregando arquivo base...',
      progress: 25
    });

    try {
      // Carregar arquivo da pasta public
      const response = await fetch(`/${fileName}`);
      if (!response.ok) {
        throw new Error(`Arquivo ${fileName} não encontrado (Status: ${response.status})`);
      }
      
      setProcessingDetails({
        step: 'Processando dados...',
        progress: 50
      });

      const text = await response.text();
      console.log(`📄 Arquivo carregado, tamanho: ${text.length} caracteres`);
      
      const result = parseCSV(text, { fileName: fileName });
      console.log(`📊 Dados processados: ${result.data.length} registros`);
      
      setProcessingDetails({
        step: 'Finalizando...',
        progress: 100
      });

      // Simular um pequeno delay para mostrar o progresso
      await new Promise(resolve => setTimeout(resolve, 500));

      // DETECÇÃO AUTOMÁTICA ROBUSTA DO TIPO DE QUESTIONÁRIO
      const headers = result.headers || [];
      const questionColumns = headers.filter(header => 
        header && typeof header === 'string' && header.trim().length > 0
      );
      
      console.log(`🔍 Detectando tipo de questionário...`);
      console.log(`📋 Total de colunas: ${headers.length}`);
      console.log(`❓ Colunas de questões detectadas: ${questionColumns.length}`);
      
      // Detecção baseada em múltiplos critérios
      let isTransparency = false;
      
      // Critério 1: Nome do arquivo
      if (fileName.includes('base8') || fileName.includes('transparency')) {
        isTransparency = true;
        console.log(`✅ Tipo detectado por nome do arquivo: Transparência`);
      }
      
      // Critério 2: Número de colunas de questões (mais robusto)
      else if (questionColumns.length <= 12) { // 8 questões + 4 demográficas
        isTransparency = true;
        console.log(`✅ Tipo detectado por número de colunas: Transparência (${questionColumns.length} colunas)`);
      }
      
      // Critério 3: Verificar se contém questões específicas do questionário completo
      else {
        const hasCompleteQuestions = headers.some(header => 
          header && (
            header.includes('recursos de acessibilidade') ||
            header.includes('políticas de privacidade') ||
            header.includes('suporte técnico')
          )
        );
        
        if (hasCompleteQuestions) {
          isTransparency = false;
          console.log(`✅ Tipo detectado por questões específicas: Completo`);
        } else {
          isTransparency = questionColumns.length <= 12;
          console.log(`✅ Tipo detectado por fallback: ${isTransparency ? 'Transparência' : 'Completo'}`);
        }
      }
      
      result.type = isTransparency ? 'transparency' : 'complete';
      
      console.log(`🎯 Tipo final determinado: ${result.type}`);
      console.log(`📈 Resumo dos dados:`, {
        arquivo: fileName,
        tipo: result.type,
        registros: result.data.length,
        colunas: headers.length
      });

      // Determinar tipo de questionário
      const questionarioType = result.type === 'transparency' ? 
        'Portal da Transparência (8 questões)' : 
        'Questionário Completo (20+ questões)';

      // LOGS DETALHADOS PARA DEBUG
      console.log('📊 RESUMO FINAL DO CARREGAMENTO:');
      console.log('================================');
      console.log(`📁 Arquivo: ${fileName}`);
      console.log(`🎯 Tipo: ${result.type}`);
      console.log(`📈 Registros válidos: ${result.data.length}`);
      console.log(`❌ Registros inválidos: ${result.invalidRows || 0}`);
      console.log(`📋 Total de colunas: ${headers.length}`);
      console.log(`❓ Códigos de questões: ${result.questionCodes?.length || 0}`);
      
      if (result.validationSummary) {
        console.log('📊 Resumo da validação:', result.validationSummary);
      }
      
      // Verificar se há questões mapeadas
      const mappedQuestions = result.questionCodes || [];
      if (mappedQuestions.length === 0) {
        console.warn('⚠️ ATENÇÃO: Nenhuma questão foi mapeada corretamente!');
      } else {
        console.log(`✅ Questões mapeadas: ${mappedQuestions.join(', ')}`);
      }
      
      console.log('================================');

      setUploadStatus({
        type: 'success',
        message: `Arquivo base carregado com sucesso! Tipo: ${questionarioType}`,
        details: {
          records: result.data.length,
          type: questionarioType,
          encoding: result.metadata?.encoding || 'UTF-8',
          source: 'Arquivo base do projeto',
          columns: headers.length,
          questionCodes: mappedQuestions.length,
          invalidRows: result.invalidRows || 0,
          characterReplacements: result.metadata?.characterReplacements || 0,
          textQuality: result.metadata?.textQuality ? 
            `${Math.round(result.metadata.textQuality * 100)}%` : '100%',
          validationRate: result.validationSummary ? 
            `${Math.round((result.validationSummary.validLines / result.validationSummary.totalLines) * 100)}%` : 
            'N/A'
        }
      });

      // Passar dados processados para o componente pai
      console.log('🚀 Enviando dados para o componente pai...');
      onDataProcessed(result);

    } catch (error) {
      console.error('❌ Erro ao carregar arquivo base:', error);
      setUploadStatus({
        type: 'error',
        message: `Erro ao carregar arquivo base: ${error.message}`,
        details: {
          suggestion: 'Verifique se o arquivo existe na pasta public do projeto',
          fileName: fileName
        }
      });
    } finally {
      setIsProcessing(false);
      setProcessingDetails(null);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Por favor, selecione um arquivo CSV válido.'
      });
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);
    setUploadStatus(null);
    setProcessingDetails({
      step: 'Lendo arquivo...',
      progress: 25
    });

    try {
      // Enhanced multi-encoding processing
      setProcessingDetails({
        step: 'Detectando codificação...',
        progress: 25
      });

      const result = await processFileWithMultipleEncodings(file);
      
      setProcessingDetails({
        step: 'Validando dados...',
        progress: 60
      });

      // Simular um pequeno delay para mostrar o progresso
      await new Promise(resolve => setTimeout(resolve, 300));

      setProcessingDetails({
        step: 'Processando questões...',
        progress: 80
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      setProcessingDetails({
        step: 'Finalizando...',
        progress: 100
      });

      // Determinar tipo de questionário
      const questionarioType = result.type === 'transparency' ? 
        'Portal da Transparência (8 questões)' : 
        'Questionário Completo (20+ questões)';

      // Enhanced success message with detailed processing info
      setUploadStatus({
        type: 'success',
        message: `Arquivo processado com sucesso! Identificado: ${questionarioType}`,
        details: {
          records: result.data.length,
          type: questionarioType,
          encoding: result.metadata?.encoding || 'Detectado automaticamente',
          source: 'Upload do usuário',
          columns: result.headers?.length || 0,
          questionCodes: result.questionCodes?.length || 0,
          invalidRows: result.invalidRows || 0,
          characterReplacements: result.metadata?.characterReplacements || 0,
          textQuality: result.metadata?.textQuality ? 
            `${Math.round(result.metadata.textQuality * 100)}%` : 'N/A',
          validationRate: result.validationSummary ? 
            `${Math.round((result.validationSummary.validLines / result.validationSummary.totalLines) * 100)}%` : 
            'N/A'
        }
      });

      // Passar dados processados para o componente pai
      onDataProcessed(result);

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setUploadStatus({
        type: 'error',
        message: `Erro ao processar arquivo: ${error.message}`,
        details: {
          suggestion: 'Verifique se o arquivo está no formato CSV correto com separador ponto e vírgula (;)'
        }
      });
    } finally {
      setIsProcessing(false);
      setProcessingDetails(null);
    }
  };

  const handleReset = () => {
    setUploadStatus(null);
    setFileName('');
    setProcessingDetails(null);
    onReset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Envio de Respostas</h3>
      <p className="text-gray-600 mb-6">
        Faça upload de arquivos CSV com respostas dos questionários ou carregue os dados de exemplo.
      </p>

      {/* Botões para carregar arquivos base */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-3">Carregar Dados de Exemplo:</h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleLoadBaseFile('base20.csv')}
            disabled={isProcessing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Database className="w-4 h-4 mr-2" />
            Questionário Completo (20 questões)
          </button>
          <button
            onClick={() => handleLoadBaseFile('base8.csv')}
            disabled={isProcessing}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Database className="w-4 h-4 mr-2" />
            Portal Transparência (8 questões)
          </button>
          <button
            onClick={() => handleLoadBaseFile('test-encoding.csv')}
            disabled={isProcessing}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Database className="w-4 h-4 mr-2" />
            Teste Encoding (com problemas)
          </button>
        </div>
        <p className="text-sm text-blue-700 mt-2">
          Clique nos botões acima para carregar automaticamente os dados de exemplo do projeto.
        </p>
      </div>

      {/* Área de Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : isProcessing
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <div>
              <p className="text-gray-700 font-medium">{fileName}</p>
              {processingDetails && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{processingDetails.step}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${processingDetails.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Arraste e solte seu arquivo CSV aqui
              </p>
              <p className="text-gray-500">ou clique para selecionar um arquivo</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Selecionar Arquivo
            </label>
          </div>
        )}
      </div>

      {/* Status do Upload */}
      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-lg border ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadStatus.message}
              </p>
              {uploadStatus.details && (
                <div className="mt-2 text-sm text-gray-600">
                  {uploadStatus.type === 'success' ? (
                    <div className="space-y-1">
                      <p>• Registros processados: {uploadStatus.details.records}</p>
                      <p>• Tipo: {uploadStatus.details.type}</p>
                      <p>• Codificação: {uploadStatus.details.encoding}</p>
                      <p>• Origem: {uploadStatus.details.source}</p>
                      {uploadStatus.details.columns && (
                        <p>• Total de colunas: {uploadStatus.details.columns}</p>
                      )}
                      {uploadStatus.details.questionCodes && (
                        <p>• Questões mapeadas: {uploadStatus.details.questionCodes}</p>
                      )}
                      {uploadStatus.details.invalidRows > 0 && (
                        <p>• Linhas inválidas removidas: {uploadStatus.details.invalidRows}</p>
                      )}
                      {uploadStatus.details.characterReplacements > 0 && (
                        <p>• Caracteres corrigidos: {uploadStatus.details.characterReplacements}</p>
                      )}
                      {uploadStatus.details.textQuality && (
                        <p>• Qualidade do texto: {uploadStatus.details.textQuality}</p>
                      )}
                      {uploadStatus.details.validationRate && (
                        <p>• Taxa de validação: {uploadStatus.details.validationRate}</p>
                      )}
                    </div>
                  ) : (
                    <p>• {uploadStatus.details.suggestion}</p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setUploadStatus(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Instruções:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Dados de exemplo:</strong> Use os botões azuis acima para carregar dados pré-configurados</li>
          <li>• <strong>Upload personalizado:</strong> Aceita arquivos CSV com questionários de 8 ou 20+ questões</li>
          <li>• <strong>Identificação automática:</strong> O sistema detecta o tipo de questionário automaticamente</li>
          <li>• <strong>Conversão Likert:</strong> Respostas são convertidas para escala numérica (1-5)</li>
          <li>• <strong>Limpeza automática:</strong> Linhas em branco são removidas automaticamente</li>
          <li>• <strong>Múltiplos encodings:</strong> Suporte para UTF-8 e Latin-1</li>
        </ul>
      </div>

      {/* Botão para voltar aos dados padrão */}
      {uploadStatus?.type === 'success' && (
        <div className="mt-4 text-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Voltar aos dados padrão
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

