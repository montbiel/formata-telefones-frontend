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
 * Verifica se o número já está formatado corretamente (55 + DDD válido + 9 + 8 dígitos)
 */
export function isAlreadyFormatted(cleanedNumber) {
  if (cleanedNumber.length === 13 && cleanedNumber.startsWith('55')) {
    const dddPart = cleanedNumber.substring(2, 4);
    const afterDDD = cleanedNumber.substring(4);
    // Verifica se tem DDD válido, se o 5º dígito é 9, e se tem 8 dígitos restantes
    return isValidBrazilianDDD(dddPart) && afterDDD.length === 9 && afterDDD[0] === '9';
  }
  return false;
}

/**
 * Analisa e formata um número de telefone para o padrão: 55 + DDD + 9 + 8 dígitos
 * @param {string} cleanedNumber - Número limpo (apenas dígitos)
 * @returns {string|null} - Número formatado ou null se não for possível formatar
 */
export function formatPhoneNumber(cleanedNumber) {
  const length = cleanedNumber.length;
  
  if (length === 10) {
    // 10 dígitos: DDD + 8 dígitos (antigo formato sem o 9)
    const dddPart = cleanedNumber.substring(0, 2);
    if (isValidBrazilianDDD(dddPart)) {
      // Adiciona 55 + DDD + 9 + 8 dígitos
      return `55${dddPart}9${cleanedNumber.substring(2)}`;
    }
  } else if (length === 11) {
    // 11 dígitos: DDD + número (já com 9 dígitos) - precisa adicionar código do país
    if (isValidBrazilianDDD(cleanedNumber)) {
      // Apenas adiciona 55, não mexe no 9 (mesmo que tenha dois 9 naturalmente)
      return `55${cleanedNumber}`;
    }
  } else if (length === 12) {
    // 12 dígitos
    if (cleanedNumber.startsWith('55')) {
      // Formato: 55 + DDD (2) + número com 8 dígitos (ainda sem o 9)
      const dddPart = cleanedNumber.substring(2, 4);
      if (isValidBrazilianDDD(dddPart)) {
        // Adiciona o 9 após o DDI (55) + DDD, padronizando para 13 dígitos
        return `55${dddPart}9${cleanedNumber.substring(4)}`;
      }
    } else {
      // Número sem o 55: DDD (2) + número (10 dígitos)
      const dddPart = cleanedNumber.substring(0, 2);
      const afterDDD = cleanedNumber.substring(2);
      
      if (isValidBrazilianDDD(dddPart)) {
        // Verifica se há dois ou mais 9 após o DDD
        if (/^9{2,}/.test(afterDDD)) {
          // Tem 9 duplicado: remove um 9 e adiciona 55
          // Resultado: 55 + DDD + 9 + 8 dígitos = 13 dígitos
          const correctedAfterDDD = afterDDD.substring(1); // Remove um 9
          return `55${dddPart}${correctedAfterDDD}`;
        }
        // Se não tem 9 duplicado, não processa (retorna null - mantém como original)
      }
    }
  } else if (length === 13) {
    // 13 dígitos
    if (cleanedNumber.startsWith('55')) {
      // Verifica se está formatado corretamente (já verificado em isAlreadyFormatted)
      // Mas se não passou em isAlreadyFormatted, verifica DDD antes de retornar
      const dddPart = cleanedNumber.substring(2, 4);
      if (isValidBrazilianDDD(dddPart)) {
        return cleanedNumber;
      }
      // DDD inválido, não retorna
      return null;
    } else {
      // Número com 13 dígitos que não começa com 55
      const dddPart = cleanedNumber.substring(0, 2);
      if (isValidBrazilianDDD(dddPart)) {
        // Parece ser um número válido mas não no formato brasileiro padrão, mantém como está
        return cleanedNumber;
      }
    }
  } else if (length === 14) {
    // 14 dígitos – APENAS este caso verifica e remove 9 duplicado
    if (cleanedNumber.startsWith('55')) {
      const dddPart = cleanedNumber.substring(2, 4);
      const afterDDD = cleanedNumber.substring(4);
      
      if (isValidBrazilianDDD(dddPart)) {
        // Verifica se há 9 duplicado NO INÍCIO após o DDD (dois ou mais 9 em sequência)
        const hasDuplicate9 = /^9{2,}/.test(afterDDD);
        if (hasDuplicate9) {
          // Remove apenas um "9" após o DDI + DDD, ficando com 55 + DDD + 9 + 8 dígitos (13 no total)
          const corrected = `55${dddPart}${afterDDD.substring(1)}`;
          // Garante que o resultado tem exatamente 13 dígitos
          if (corrected.length === 13) {
            return corrected;
          }
        }
        // Se tem DDD válido mas não tem 9 duplicado, não processa (retorna null)
      }
      // Se não tem DDD válido, não processa (retorna null)
    }
    // Se não começa com 55, não processa (retorna null)
  }
  
  return null;
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
    
    // Tenta formatar o número usando a lógica sistemática
    const formattedNumber = formatPhoneNumber(cleanedNumber);
    
    if (formattedNumber) {
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

