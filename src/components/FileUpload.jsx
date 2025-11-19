import { useState, useRef } from 'react';

export default function FileUpload({ onFileSelect, selectedFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Valida se é CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Por favor, selecione um arquivo CSV.');
      return;
    }
    
    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-semibold mb-3">Upload dos números no formato CSV</label>
      <div
        className={`border rounded p-5 text-center ${isDragging ? 'border-primary bg-light-primary' : 'border-dashed'}`}
        style={{ 
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isDragging ? 'var(--bs-light-primary)' : 'transparent'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <div className="d-flex flex-column align-items-center">
          <i className="ti ti-cloud-upload text-primary mb-3" style={{ fontSize: '4rem' }}></i>
          <p className="mb-2" style={{ color: '#2A3547', fontWeight: '500' }}>
            {selectedFile 
              ? <strong className="text-primary">{selectedFile.name}</strong>
              : <>
                  Arraste o arquivo CSV aqui ou <span className="text-primary">clique para selecionar</span>
                </>
            }
          </p>
          {!selectedFile && (
            <small style={{ color: '#5A6A85' }}>Apenas arquivos .csv são aceitos</small>
          )}
        </div>
      </div>
    </div>
  );
}

