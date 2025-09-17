import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

export function FileUpload({ onUpload, onReset }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Verificar se é um arquivo CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus({
        success: false,
        error: 'Por favor, selecione um arquivo CSV válido.'
      });
      return;
    }

    // Ler o arquivo
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const result = onUpload(csvText, file.name);
        setUploadStatus(result);
      } catch (error) {
        setUploadStatus({
          success: false,
          error: 'Erro ao processar o arquivo: ' + error.message
        });
      }
    };
    reader.readAsText(file, 'ISO-8859-1'); // Usar encoding correto para os arquivos
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setUploadStatus(null);
    onReset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Envio de Respostas
      </h3>

      {/* Área de Upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <p className="text-lg font-medium text-gray-900 mb-2">
          Arraste e solte seu arquivo CSV aqui
        </p>
        <p className="text-sm text-gray-600 mb-4">
          ou clique para selecionar um arquivo
        </p>
        
        <button
          onClick={onButtonClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FileText className="w-4 h-4 mr-2" />
          Selecionar Arquivo
        </button>
      </div>

      {/* Status do Upload */}
      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-lg ${
          uploadStatus.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            {uploadStatus.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            )}
            
            <div className="flex-1">
              {uploadStatus.success ? (
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Arquivo processado com sucesso!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Tipo: {uploadStatus.type}
                  </p>
                  <p className="text-sm text-green-700">
                    Respostas processadas: {uploadStatus.responses}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-medium text-red-800">
                  {uploadStatus.error}
                </p>
              )}
            </div>

            <button
              onClick={() => setUploadStatus(null)}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-medium text-gray-900 mb-2">Instruções:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Aceita arquivos CSV com questionários de 8 ou 20 questões</li>
          <li>O sistema identifica automaticamente o tipo de questionário</li>
          <li>Respostas são convertidas para escala numérica (1-5)</li>
          <li>Linhas em branco são removidas automaticamente</li>
        </ul>
      </div>

      {/* Botão para voltar aos dados padrão */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Voltar aos dados padrão
        </button>
      </div>
    </div>
  );
}

