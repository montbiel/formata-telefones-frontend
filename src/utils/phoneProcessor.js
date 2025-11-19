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
 * Processa os números de telefone do CSV.
 * @param {Array} csvData - Array de linhas do CSV
 * @returns {Object} Objeto com arrays de números válidos e inválidos
 */
export function processPhoneNumbers(csvData) {
  const validNumbers = [];
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
    
    // Verifica se o número tem 11 dígitos
    if (cleanedNumber.length === 11) {
      // Número com 11 dígitos (DDD + número) - precisa adicionar código do país
      if (isValidBrazilianDDD(cleanedNumber)) {
        const formattedNumber = `55${cleanedNumber}`;
        validNumbers.push({
          original: trimmedNumber,
          formatted: formattedNumber,
          line: lineNum
        });
      } else {
        invalidNumbers.push({
          number: trimmedNumber,
          reason: `DDD inválido (${cleanedNumber.substring(0, 2)})`,
          line: lineNum
        });
      }
    } else if (cleanedNumber.length === 13) {
      // Número com 13 dígitos - pode já estar formatado com código do país
      if (cleanedNumber.startsWith('55')) {
        // Verifica se o DDD (posições 2-3) é válido
        const dddPart = cleanedNumber.substring(2, 4);
        if (isValidBrazilianDDD(dddPart)) {
          // Número já está formatado corretamente
          validNumbers.push({
            original: trimmedNumber,
            formatted: cleanedNumber,
            line: lineNum
          });
        } else {
          invalidNumbers.push({
            number: trimmedNumber,
            reason: `DDD inválido (${dddPart})`,
            line: lineNum
          });
        }
      } else {
        // Número de 13 dígitos que não começa com 55 - verifica se tem DDD válido
        const dddPart = cleanedNumber.substring(0, 2);
        if (isValidBrazilianDDD(dddPart)) {
          // Aceita e adiciona código do país se necessário
          const formattedNumber = cleanedNumber.startsWith('55') ? cleanedNumber : `55${cleanedNumber}`;
          // Verifica se após adicionar 55 não ultrapassa 13 dígitos
          if (formattedNumber.length === 13) {
            validNumbers.push({
              original: trimmedNumber,
              formatted: formattedNumber,
              line: lineNum
            });
          } else {
            invalidNumbers.push({
              number: trimmedNumber,
              reason: `Tamanho inválido após formatação (${formattedNumber.length} dígitos)`,
              line: lineNum
            });
          }
        } else {
          invalidNumbers.push({
            number: trimmedNumber,
            reason: `DDD inválido (${dddPart})`,
            line: lineNum
          });
        }
      }
    } else if (cleanedNumber.length === 12) {
      // Número com 12 dígitos - pode ser número brasileiro com código de país diferente ou formato especial
      if (cleanedNumber.startsWith('55')) {
        // Se começa com 55 mas tem 12 dígitos, pode estar faltando um dígito ou ter formato incorreto
        // Verifica se o DDD (posições 2-3) é válido
        const dddPart = cleanedNumber.substring(2, 4);
        if (isValidBrazilianDDD(dddPart)) {
          // Aceita como válido mesmo com 12 dígitos (pode ser número especial ou formato alternativo)
          validNumbers.push({
            original: trimmedNumber,
            formatted: cleanedNumber,
            line: lineNum
          });
        } else {
          invalidNumbers.push({
            number: trimmedNumber,
            reason: `DDD inválido (${dddPart})`,
            line: lineNum
          });
        }
      } else {
        // Verifica se começa com DDD válido
        const dddPart = cleanedNumber.substring(0, 2);
        if (isValidBrazilianDDD(dddPart)) {
          // Adiciona código do país
          const formattedNumber = `55${cleanedNumber}`;
          // Verifica se após adicionar não ultrapassa 13 dígitos
          if (formattedNumber.length === 14) {
            // Se ficou com 14 dígitos, pode ser que precise remover um dígito ou é formato especial
            // Aceita mesmo assim se o DDD for válido
            validNumbers.push({
              original: trimmedNumber,
              formatted: formattedNumber,
              line: lineNum
            });
          } else {
            validNumbers.push({
              original: trimmedNumber,
              formatted: formattedNumber,
              line: lineNum
            });
          }
        } else {
          invalidNumbers.push({
            number: trimmedNumber,
            reason: `DDD inválido (${dddPart})`,
            line: lineNum
          });
        }
      }
    } else if (cleanedNumber.length === 10) {
      // Número com 10 dígitos (antigo formato sem o 9)
      const dddPart = cleanedNumber.substring(0, 2);
      if (isValidBrazilianDDD(dddPart)) {
        // Adiciona o 9 e o código do país
        const formattedNumber = `55${cleanedNumber.substring(0, 2)}9${cleanedNumber.substring(2)}`;
        validNumbers.push({
          original: trimmedNumber,
          formatted: formattedNumber,
          line: lineNum
        });
      } else {
        invalidNumbers.push({
          number: trimmedNumber,
          reason: `DDD inválido (${dddPart})`,
          line: lineNum
        });
      }
    } else if (cleanedNumber.length > 0) {
      invalidNumbers.push({
        number: trimmedNumber,
        reason: cleanedNumber.length < 10 
          ? `Menos de 10 dígitos (${cleanedNumber.length})` 
          : `Tamanho inválido (${cleanedNumber.length} dígitos)`,
        line: lineNum
      });
    }
  });
  
  return {
    validNumbers,
    invalidNumbers
  };
}

