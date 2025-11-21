/**
 * Valida se o número possui um DDD brasileiro válido nas 2 primeiras posições.
 * DDDs brasileiros válidos: 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 
 * 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 
 * 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 
 * 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99
 */
export function isValidBrazilianDDD(number) {
  const validDDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
    71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99
  ];
  
  if (number.length >= 2) {
    const ddd = parseInt(number.substring(0, 2), 10);
    return validDDDs.includes(ddd);
  }
  return false;
}

/**
 * Remove caracteres não numéricos do número de telefone.
 */
export function cleanNumber(numberStr) {
  return String(numberStr).replace(/\D/g, '');
}

/**
 * Verifica se o número já está formatado corretamente (55 + DDD válido + número)
 */
export function isAlreadyFormatted(cleanedNumber) {
  if (cleanedNumber.length === 13 && cleanedNumber.startsWith('55')) {
    const dddPart = cleanedNumber.substring(2, 4);
    return isValidBrazilianDDD(dddPart);
  }
  return false;
}

/**
 * Processa os números de telefone do CSV.
 * @param {Array} csvData - Array de linhas do CSV
 * @returns {Object} Objeto com arrays de números formatados e inválidos
 */
export function processPhoneNumbers(csvData) {
  const formattedNumbers = [];
  const invalidNumbers = [];
  let lineNum = 0;
  
  csvData.forEach((row) => {
    lineNum++;
    
    // Pega o primeiro campo da linha (assumindo que o número está na primeira coluna)
    let number;
    if (Array.isArray(row)) {
      // Se for array, pega o primeiro elemento não vazio
      number = row.find(cell => cell && String(cell).trim()) || row[0];
    } else if (typeof row === 'object' && row !== null) {
      // Se for objeto, pega o primeiro valor
      const values = Object.values(row);
      number = values.find(val => val && String(val).trim()) || values[0];
    } else {
      number = row;
    }
    
    // Remove espaços em branco
    const trimmedNumber = String(number || '').trim();
    
    // Pula linhas vazias
    if (!trimmedNumber) {
      return;
    }
    
    // Limpa o número removendo caracteres não numéricos
    const cleanedNumber = cleanNumber(trimmedNumber);
    
    // Se após limpar não sobrou nenhum dígito, pula esta linha
    if (!cleanedNumber || cleanedNumber.length === 0) {
      return;
    }
    
    // Verifica se o número já está formatado corretamente
    if (isAlreadyFormatted(cleanedNumber)) {
      // Número já está formatado, mantém como está
      formattedNumbers.push({
        original: trimmedNumber,
        formatted: cleanedNumber,
        line: lineNum
      });
      return;
    }
    
    // Tenta formatar o número
    let formattedNumber = null;
    let canFormat = false;
    
    if (cleanedNumber.length === 11) {
      // Número com 11 dígitos (DDD + número) - precisa adicionar código do país
      if (isValidBrazilianDDD(cleanedNumber)) {
        formattedNumber = `55${cleanedNumber}`;
        canFormat = true;
      }
    } else if (cleanedNumber.length === 13) {
      // Número com 13 dígitos que não começa com 55 - não pode adicionar 55 (ficaria com 15 dígitos)
      // Mantém como está se parecer válido, senão vai para a lógica de manter original
      const dddPart = cleanedNumber.substring(0, 2);
      if (isValidBrazilianDDD(dddPart)) {
        // Parece ser um número válido mas não no formato brasileiro padrão, mantém como está
        formattedNumber = cleanedNumber;
        canFormat = true;
      }
    } else if (cleanedNumber.length === 12) {
      // Número com 12 dígitos
      if (cleanedNumber.startsWith('55')) {
        const dddPart = cleanedNumber.substring(2, 4);
        if (isValidBrazilianDDD(dddPart)) {
          formattedNumber = cleanedNumber;
          canFormat = true;
        }
      } else {
        const dddPart = cleanedNumber.substring(0, 2);
        if (isValidBrazilianDDD(dddPart)) {
          formattedNumber = `55${cleanedNumber}`;
          canFormat = true;
        }
      }
    } else if (cleanedNumber.length === 10) {
      // Número com 10 dígitos (antigo formato sem o 9)
      const dddPart = cleanedNumber.substring(0, 2);
      if (isValidBrazilianDDD(dddPart)) {
        formattedNumber = `55${cleanedNumber.substring(0, 2)}9${cleanedNumber.substring(2)}`;
        canFormat = true;
      }
    }
    
    if (canFormat && formattedNumber) {
      // Conseguiu formatar, adiciona aos formatados
      formattedNumbers.push({
        original: trimmedNumber,
        formatted: formattedNumber,
        line: lineNum
      });
    } else {
      // Não foi possível formatar, mantém o original na planilha de formatados
      // mas também adiciona aos inválidos para a outra planilha
      const reason = cleanedNumber.length < 10 
        ? `Menos de 10 dígitos (${cleanedNumber.length})` 
        : cleanedNumber.length > 13
        ? `Mais de 13 dígitos (${cleanedNumber.length})`
        : cleanedNumber.length >= 2 && !isValidBrazilianDDD(cleanedNumber)
        ? `DDD inválido (${cleanedNumber.substring(0, 2)})`
        : `Tamanho inválido (${cleanedNumber.length} dígitos)`;
      
      formattedNumbers.push({
        original: trimmedNumber,
        formatted: trimmedNumber, // Mantém o original
        line: lineNum
      });
      
      invalidNumbers.push({
        number: trimmedNumber,
        reason: reason,
        line: lineNum
      });
    }
  });
  
  return {
    formattedNumbers,
    invalidNumbers
  };
}

