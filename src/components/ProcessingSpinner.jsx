export default function ProcessingSpinner() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Processando...</span>
      </div>
      <p className="text-muted">Processando números de telefone...</p>
    </div>
  );
}

