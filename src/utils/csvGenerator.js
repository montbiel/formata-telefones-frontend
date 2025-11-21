/**
 * Gera CSV de números formatados para download
 */
export function generateFormattedCSV(formattedNumbers, originalFileName) {
  const header = ['Número Formatado'];
  // Filtra valores vazios ou undefined antes de gerar o CSV
  const rows = formattedNumbers
    .filter(item => item && item.formatted && String(item.formatted).trim())
    .map(item => [item.formatted]);
  
  const csvContent = [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Remove extensão do nome original e adiciona "_formatados.csv"
  const baseName = originalFileName.replace(/\.csv$/i, '');
  const fileName = `${baseName}_formatados.csv`;
  
  return { csvContent, fileName };
}

/**
 * Gera CSV de números inválidos para download
 */
export function generateInvalidCSV(invalidNumbers, originalFileName) {
  const header = ['Linha', 'Número', 'Motivo'];
  const rows = invalidNumbers.map(item => [
    item.line,
    `"${item.number.replace(/"/g, '""')}"`, // Escapa aspas no CSV
    item.reason
  ]);
  
  const csvContent = [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Remove extensão do nome original e adiciona "_invalidos.csv"
  const baseName = originalFileName.replace(/\.csv$/i, '');
  const fileName = `${baseName}_invalidos.csv`;
  
  return { csvContent, fileName };
}

/**
 * Faz download de um arquivo CSV
 */
export function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

