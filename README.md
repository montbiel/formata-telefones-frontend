# Formatador de Telefones - Frontend

Aplicação React para processar e validar números de telefone brasileiros a partir de arquivos CSV.

## Funcionalidades

- Upload de arquivo CSV com drag-and-drop ou seleção manual
- Validação de números de telefone brasileiros (11 dígitos, DDD válido)
- Formatação automática com código do país (55)
- Download de números válidos e inválidos em arquivos CSV separados
- Interface moderna usando o tema Modernize Bootstrap 5

## Tecnologias

- React 18
- Vite
- Bootstrap 5.3.3
- PapaParse (processamento de CSV)
- Tema Modernize (estilos)

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:5173` no navegador

## Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist`.

## Como Usar

1. Faça upload de um arquivo CSV contendo números de telefone (um por linha)
2. Clique em "Iniciar Validação"
3. Aguarde o processamento
4. Visualize o resumo com total de números válidos e inválidos
5. Baixe os arquivos CSV com os resultados

## Formato do CSV

O arquivo CSV deve conter números de telefone, um por linha, na primeira coluna. Exemplo:

```
11987654321
21912345678
85991234567
```

## Validação

Os números são validados de acordo com:
- Deve ter exatamente 11 dígitos (DDD + número)
- DDD deve ser válido (lista de DDDs brasileiros)
- Números válidos são formatados com código do país (55) no início

