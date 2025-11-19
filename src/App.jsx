import { useState } from 'react';
import Papa from 'papaparse';
import FileUpload from './components/FileUpload';
import ProcessingSpinner from './components/ProcessingSpinner';
import ResultsSummary from './components/ResultsSummary';
import { processPhoneNumbers } from './utils/phoneProcessor';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResults(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo CSV primeiro.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      // Lê o arquivo como texto
      const fileContent = await readFileAsText(selectedFile);
      
      // Parse do CSV usando PapaParse
      Papa.parse(fileContent, {
        complete: (parsedData) => {
          // Processa os números
          const processedResults = processPhoneNumbers(parsedData.data);
          setResults(processedResults);
          setIsProcessing(false);
        },
        error: (error) => {
          setError('Erro ao processar o arquivo CSV: ' + error.message);
          setIsProcessing(false);
        },
        skipEmptyLines: true,
        header: false
      });
    } catch (err) {
      setError('Erro ao ler o arquivo: ' + err.message);
      setIsProcessing(false);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  const handleNewCheck = () => {
    setSelectedFile(null);
    setResults(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h1 className="text-center mb-5 fw-bold">Formatador de Telefones</h1>
          
          <div className="card shadow-sm">
            <div className="card-body p-4">
              {!results && !isProcessing && (
                <>
                  <FileUpload 
                    onFileSelect={handleFileSelect} 
                    selectedFile={selectedFile}
                  />
                  
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  
                  <div className="d-grid">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={handleProcess}
                      disabled={!selectedFile}
                    >
                      <i className="ti ti-play me-2"></i>
                      Iniciar Validação
                    </button>
                  </div>
                </>
              )}

              {isProcessing && <ProcessingSpinner />}

              {results && !isProcessing && (
                <ResultsSummary
                  results={results}
                  originalFileName={selectedFile.name}
                  onNewCheck={handleNewCheck}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

