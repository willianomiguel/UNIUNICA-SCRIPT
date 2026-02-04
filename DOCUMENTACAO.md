# Entrega - Teste Pratico (Automacao)
Willian Daniel de Oliveira Miguel
Este repositorio contem minha entrega do desafio.

## Estrutura do projeto

- `horariocheck.js`: script do Desafio 2
- `DOCUMENTACAO.md`: documentacao tecnica complementar

# Horário Check

Script simples para validar se uma data/hora está dentro do horário de funcionamento, considerando:

- dia da semana
- feriados nacionais (via BrasilAPI)
- fuso de Brasília (`America/Sao_Paulo`)

## Regras atuais

- Segunda a quinta: **08:00 às 20:00**
- Sexta: **08:00 às 19:00**
- Sábado e domingo: fechado
- Feriado nacional: fechado

## Como usar

Requisito: Node.js 18+ (por causa do `fetch` nativo).

### 1) Rodar exemplos prontos

```bash
node horariocheck.js --exemplos
```

### 2) Usar no seu código

```js
import { verificarFuncionamento } from "./horariocheck.js";

const resultado = await verificarFuncionamento("2025-12-30 10:15");
console.log(resultado);
```

Formato aceito para entrada:

- `Date` (data atual ou qualquer objeto Date)
- string no formato `YYYY-MM-DD HH:mm` (também aceita com `T`)

## Retorno da função

A função retorna um objeto assim:

```js
{
  dentroDoHorario: true | false,
  motivo: "texto explicando o motivo",
  detalhes: {
    dataSP: "YYYY-MM-DD",
    diaSemana: 0-6,
    horaSP: "HH:mm",
    janela: "HH:mm-HH:mm" // quando aplicável
  }
}
```

## Observação
Os feriados são carregados por ano e ficam em cache durante a execução, então não fica chamando a API toda hora.
