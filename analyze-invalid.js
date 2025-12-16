// Script de análise dos números inválidos
import { processPhoneNumbers, cleanNumber, isValidBrazilianDDD } from './src/utils/phoneProcessor.js';
import { readFileSync } from 'fs';
import Papa from 'papaparse';

const csvContent = readFileSync('terapeutas-trg-15-12-25.csv', 'utf-8');

Papa.parse(csvContent, {
  complete: (parsedData) => {
    const results = processPhoneNumbers(parsedData.data);
    
    console.log(`Total processado: ${results.formattedNumbers.length}`);
    console.log(`Total inválidos: ${results.invalidNumbers.length}\n`);
    
    // Agrupa inválidos por motivo
    const invalidByReason = {};
    results.invalidNumbers.forEach(inv => {
      if (!invalidByReason[inv.reason]) {
        invalidByReason[inv.reason] = [];
      }
      invalidByReason[inv.reason].push(inv);
    });
    
    console.log('=== ANÁLISE DOS NÚMEROS INVÁLIDOS ===\n');
    Object.keys(invalidByReason).sort().forEach(reason => {
      console.log(`${reason}: ${invalidByReason[reason].length} números`);
      // Mostra os primeiros 5 exemplos
      invalidByReason[reason].slice(0, 5).forEach(inv => {
        const cleaned = cleanNumber(inv.number);
        console.log(`  - ${inv.number} (limpo: ${cleaned}, ${cleaned.length} dígitos)`);
      });
      if (invalidByReason[reason].length > 5) {
        console.log(`  ... e mais ${invalidByReason[reason].length - 5} números`);
      }
      console.log('');
    });
    
    // Análise específica de números que começam com 11
    const numbersStartingWith11 = results.invalidNumbers.filter(inv => {
      const cleaned = cleanNumber(inv.number);
      return cleaned.startsWith('11') && cleaned.length > 11;
    });
    
    if (numbersStartingWith11.length > 0) {
      console.log(`\n=== NÚMEROS QUE COMEÇAM COM 11 E TÊM MAIS DE 11 DÍGITOS ===`);
      console.log(`Total: ${numbersStartingWith11.length}\n`);
      numbersStartingWith11.slice(0, 10).forEach(inv => {
        const cleaned = cleanNumber(inv.number);
        console.log(`  - ${inv.number} -> ${cleaned} (${cleaned.length} dígitos) - ${inv.reason}`);
      });
    }
  },
  skipEmptyLines: true,
  header: false
});