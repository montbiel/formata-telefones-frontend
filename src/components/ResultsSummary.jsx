import { generateFormattedCSV, generateInvalidCSV, downloadCSV } from '../utils/csvGenerator';

export default function ResultsSummary({ results, originalFileName, onNewCheck }) {
  const { formattedNumbers, invalidNumbers } = results;
  // O total deve ser apenas formattedNumbers.length, pois esse array já contém todos os números processados
  // (incluindo os inválidos que são mantidos como original)
  const total = formattedNumbers.length;

  const handleDownloadFormatted = () => {
    const { csvContent, fileName } = generateFormattedCSV(formattedNumbers, originalFileName);
    downloadCSV(csvContent, fileName);
  };

  const handleDownloadInvalid = () => {
    const { csvContent, fileName } = generateInvalidCSV(invalidNumbers, originalFileName);
    downloadCSV(csvContent, fileName);
  };

  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">Resumo do Processamento</h5>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="text-center p-3 bg-light rounded">
                <h3 className="text-primary mb-1">{total}</h3>
                <p className="text-muted mb-0">Total Processado</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 bg-light-success rounded">
                <h3 className="text-success mb-1">{formattedNumbers.length}</h3>
                <p className="text-muted mb-0">Formatados</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 bg-light-danger rounded">
                <h3 className="text-danger mb-1">{invalidNumbers.length}</h3>
                <p className="text-muted mb-0">Inválidos</p>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <button
              className="btn btn-success flex-grow-1"
              onClick={handleDownloadFormatted}
              disabled={formattedNumbers.length === 0}
            >
              <i className="ti ti-download me-2"></i>
              Baixar Números Formatados
            </button>
            <button
              className="btn btn-danger flex-grow-1"
              onClick={handleDownloadInvalid}
              disabled={invalidNumbers.length === 0}
            >
              <i className="ti ti-download me-2"></i>
              Baixar Números Inválidos
            </button>
            <button
              className="btn btn-outline-primary flex-grow-1"
              onClick={onNewCheck}
            >
              <i className="ti ti-refresh me-2"></i>
              Nova Verificação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

