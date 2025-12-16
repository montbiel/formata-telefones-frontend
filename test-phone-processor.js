/**
 * Teste robusto para o processador de telefones
 * Execute com: node test-phone-processor.js
 */

import { processPhoneNumbers, formatPhoneNumber, isValidBrazilianDDD } from './src/utils/phoneProcessor.js';

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(description, input, expected, testFunction = formatPhoneNumber) {
  totalTests++;
  const result = testFunction(input);
  const passed = result === expected;
  
  if (passed) {
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } else {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  Entrada: ${input}`);
    console.log(`  Esperado: ${expected || 'null'}`);
    console.log(`  Obtido: ${result || 'null'}`);
  }
}

console.log(`${colors.cyan}=== TESTE ROBUSTO DO PROCESSADOR DE TELEFONES ===${colors.reset}\n`);

// ========== TESTES DE 8 DÍGITOS ==========
console.log(`${colors.blue}--- 8 DÍGITOS ---${colors.reset}`);
test('8 dígitos - número inválido (muito curto)', '12345678', null);

// ========== TESTES DE 9 DÍGITOS ==========
console.log(`\n${colors.blue}--- 9 DÍGITOS ---${colors.reset}`);
test('9 dígitos - número inválido (muito curto)', '123456789', null);

// ========== TESTES DE 10 DÍGITOS ==========
console.log(`\n${colors.blue}--- 10 DÍGITOS (DDD + 8 dígitos) ---${colors.reset}`);
test('10 dígitos - DDD válido sem 9 (116256562)', '1162565620', '5511962565620');
test('10 dígitos - DDD válido com 8 dígitos normais', '1187654321', '5511987654321');
test('10 dígitos - DDD 21 válido', '2187654321', '5521987654321');
test('10 dígitos - DDD 85 válido', '8512345678', '5585912345678');
test('10 dígitos - DDD 47 válido', '4712345678', '5547912345678');
test('10 dígitos - DDD inválido', '0096256562', null);
test('10 dígitos - DDD 00 inválido', '0096256562', null);

// ========== TESTES DE 11 DÍGITOS ==========
console.log(`\n${colors.blue}--- 11 DÍGITOS (DDD + 9 dígitos) ---${colors.reset}`);
test('11 dígitos - DDD válido com 9 após DDD', '11962565627', '5511962565627');
test('11 dígitos - DDD válido com dois 9 naturalmente (11999561711)', '11999561711', '5511999561711');
test('11 dígitos - DDD válido com três 9 naturalmente', '11999625656', '5511999625656');
test('11 dígitos - DDD válido sem 9 no início', '11876543210', '5511876543210');
test('11 dígitos - DDD 11 válido', '11987654321', '5511987654321');
test('11 dígitos - DDD 47 válido', '47912345678', '5547912345678');
test('11 dígitos - DDD inválido', '00962565627', null);

// ========== TESTES DE 12 DÍGITOS ==========
console.log(`\n${colors.blue}--- 12 DÍGITOS ---${colors.reset}`);
console.log(`${colors.yellow}Com DDI 55:${colors.reset}`);
test('12 dígitos com 55 - DDD válido sem 9 (55116256562)', '551162565620', '5511962565620');
test('12 dígitos com 55 - DDD válido com 8 dígitos após DDD', '551187654321', '5511987654321');
test('12 dígitos com 55 - DDD 21 válido', '552187654321', '5521987654321');

console.log(`${colors.yellow}Sem DDI 55:${colors.reset}`);
test('12 dígitos sem 55 - DDD válido', '119625656278', '55119625656278');
test('12 dígitos sem 55 - DDD válido com dois 9', '119962565627', '55119962565627');
test('12 dígitos sem 55 - DDD inválido', '009625656278', null);

// ========== TESTES DE 13 DÍGITOS ==========
console.log(`\n${colors.blue}--- 13 DÍGITOS ---${colors.reset}`);
console.log(`${colors.yellow}Com DDI 55 (já formatado):${colors.reset}`);
test('13 dígitos com 55 - formato correto (5511962565627)', '5511962565627', '5511962565627');
test('13 dígitos com 55 - DDD válido com 9 + 8 dígitos', '5511987654321', '5511987654321');
test('13 dígitos com 55 - DDD 21 válido', '5521987654321', '5521987654321');
test('13 dígitos com 55 - DDD inválido', '5500987654321', null);

console.log(`${colors.yellow}Sem DDI 55:${colors.reset}`);
test('13 dígitos sem 55 - DDD válido', '1196256562789', '1196256562789');
test('13 dígitos sem 55 - DDD válido com 9', '1198765432109', '1198765432109');
test('13 dígitos sem 55 - DDD inválido', '0096256562789', null);

// ========== TESTES DE 14 DÍGITOS ==========
console.log(`\n${colors.blue}--- 14 DÍGITOS (CASO ESPECIAL - REMOVE 9 DUPLICADO) ---${colors.reset}`);
console.log(`${colors.yellow}Com DDI 55 e 9 duplicado:${colors.reset}`);
test('14 dígitos com 55 - dois 9 após DDD (55119962565627)', '55119962565627', '5511962565627');
test('14 dígitos com 55 - três 9 após DDD', '55119996256562', '5511996256562');
test('14 dígitos com 55 - DDD 11 com dois 9', '55119987654321', '5511987654321');
test('14 dígitos com 55 - DDD 21 com dois 9', '55219987654321', '5521987654321');

console.log(`${colors.yellow}Com DDI 55 SEM 9 duplicado:${colors.reset}`);
test('14 dígitos com 55 - sem 9 duplicado (não deve formatar)', '55119876543210', null);

console.log(`${colors.yellow}Sem DDI 55:${colors.reset}`);
test('14 dígitos sem 55 - número inválido', '11962565627890', null);

// ========== TESTES DE MAIS DE 14 DÍGITOS ==========
console.log(`\n${colors.blue}--- MAIS DE 14 DÍGITOS (INVÁLIDOS) ---${colors.reset}`);
test('15 dígitos - inválido', '551196256562789', null);
test('16 dígitos - inválido', '5511962565627890', null);

// ========== TESTES COM NÚMEROS QUE NATURALMENTE TÊM MÚLTIPLOS 9 ==========
console.log(`\n${colors.blue}--- NÚMEROS COM MÚLTIPLOS 9 NATURALMENTE ---${colors.reset}`);
test('11 dígitos - 11999561711 (dois 9 naturalmente)', '11999561711', '5511999561711');
test('11 dígitos - 11999625656 (dois 9 naturalmente)', '11999625656', '5511999625656');
test('11 dígitos - 11999956171 (três 9 naturalmente)', '11999956171', '5511999956171');
test('12 dígitos sem 55 - 119995617112 (dois 9 naturalmente)', '119995617112', '55119995617112');

// ========== TESTES COM DDDs DIFERENTES ==========
console.log(`\n${colors.blue}--- TESTES COM DIFERENTES DDDs VÁLIDOS ---${colors.reset}`);
test('10 dígitos - DDD 11 (SP)', '1162565620', '5511962565620');
test('10 dígitos - DDD 21 (RJ)', '2187654321', '5521987654321');
test('10 dígitos - DDD 47 (SC)', '4712345678', '5547912345678');
test('10 dígitos - DDD 85 (CE)', '8512345678', '5585912345678');
test('11 dígitos - DDD 11 (SP)', '11962565627', '5511962565627');
test('11 dígitos - DDD 21 (RJ)', '21962565627', '5521962565627');

// ========== TESTES DE PROCESSAMENTO COMPLETO (CSV) ==========
console.log(`\n${colors.blue}--- TESTES DE PROCESSAMENTO COMPLETO (CSV) ---${colors.reset}`);

const testCSVData = [
  ['1162565620'],      // 10 dígitos (sem 9) - formatado
  ['11962565627'],     // 11 dígitos - formatado
  ['11999561711'],     // 11 dígitos com dois 9 - formatado
  ['551162565620'],    // 12 dígitos com 55 (sem 9) - formatado
  ['119625656278'],    // 12 dígitos sem 55 - formatado
  ['5511962565627'],   // 13 dígitos formatado - formatado
  ['55119962565627'],  // 14 dígitos com 9 duplicado - formatado
  ['(+1) 7745782702'], // Número internacional - inválido (não tem DDD brasileiro)
  [''],                // Linha vazia - ignorado
  ['abc123'],          // Caracteres não numéricos - inválido (menos de 10 dígitos)
];

const results = processPhoneNumbers(testCSVData);

function testCSV(description, actual, expected) {
  totalTests++;
  const passed = actual === expected;
  
  if (passed) {
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } else {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  Esperado: ${expected}`);
    console.log(`  Obtido: ${actual}`);
  }
}

// Conta quantos foram realmente formatados
// 1. 1162565620 -> formatado
// 2. 11962565627 -> formatado
// 3. 11999561711 -> formatado
// 4. 551162565620 -> formatado
// 5. 119625656278 -> formatado
// 6. 5511962565627 -> formatado (já estava correto)
// 7. 55119962565627 -> formatado (9 duplicado removido)
// 8. (+1) 7745782702 -> formatado (limpo = 17745782702, DDD 17 válido)
// 9. abc123 -> mantido como original (limpo = 123, menos de 10 dígitos, mas ainda é adicionado aos formatados)
// Linha vazia é ignorada
// Total formatados: 9 (todos são adicionados, mesmo os inválidos são mantidos como original)
// Total inválidos: 1 (abc123 - menos de 10 dígitos)
testCSV('Processamento CSV - total de números formatados', results.formattedNumbers.length, 9);
testCSV('Processamento CSV - números inválidos', results.invalidNumbers.length, 1);

// Verifica números específicos no resultado
const formatted1162565620 = results.formattedNumbers.find(n => n.original === '1162565620');
testCSV('CSV - 10 dígitos formatado corretamente', formatted1162565620?.formatted, '5511962565620');

const formatted11999561711 = results.formattedNumbers.find(n => n.original === '11999561711');
test('CSV - 11 dígitos com dois 9 formatado corretamente', formatted11999561711?.formatted, '5511999561711');

const formatted55119962565627 = results.formattedNumbers.find(n => n.original === '55119962565627');
test('CSV - 14 dígitos com 9 duplicado formatado corretamente', formatted55119962565627?.formatted, '5511962565627');

// ========== TESTES DE VALIDAÇÃO DE DDD ==========
console.log(`\n${colors.blue}--- TESTES DE VALIDAÇÃO DE DDD ---${colors.reset}`);
function testDDD(description, input, expected) {
  totalTests++;
  const result = isValidBrazilianDDD(input);
  const passed = result === expected;
  
  if (passed) {
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } else {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  Entrada: ${input}`);
    console.log(`  Esperado: ${expected}`);
    console.log(`  Obtido: ${result}`);
  }
}

testDDD('DDD 11 válido', '11', true);
testDDD('DDD 21 válido', '21', true);
testDDD('DDD 47 válido', '47', true);
testDDD('DDD 85 válido', '85', true);
testDDD('DDD 99 válido', '99', true);
testDDD('DDD 00 inválido', '00', false);
testDDD('DDD 10 inválido', '10', false);
testDDD('DDD 20 inválido', '20', false);

// ========== RESUMO FINAL ==========
console.log(`\n${colors.cyan}=== RESUMO DOS TESTES ===${colors.reset}`);
console.log(`Total de testes: ${totalTests}`);
console.log(`${colors.green}Passou: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Falhou: ${failedTests}${colors.reset}`);
console.log(`Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

if (failedTests === 0) {
  console.log(`\n${colors.green}✓ TODOS OS TESTES PASSARAM!${colors.reset}`);
  process.exit(0);
} else {
  console.log(`\n${colors.red}✗ ALGUNS TESTES FALHARAM${colors.reset}`);
  process.exit(1);
}


