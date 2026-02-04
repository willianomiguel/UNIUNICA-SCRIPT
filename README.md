<!-- BANNER -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1f6feb,100:58a6ff&height=160&section=header&text=Horário%20Check&fontSize=42&fontColor=ffffff&animation=fadeIn" />
</p>

<h2 align="center">Entrega – Teste Prático de Automação</h2>

<p align="center">
  <img src="https://img.shields.io/badge/node-18%2B-brightgreen" />
  <img src="https://img.shields.io/badge/fuso-America%2FSao_Paulo-blue" />
  <img src="https://img.shields.io/badge/feriados-BrasilAPI-orange" />
  <img src="https://img.shields.io/badge/status-entregue-success" />
</p>

---

## 👤 Autor

**Willian Daniel de Oliveira Miguel**

Este repositório contém minha entrega do desafio técnico de automação.

---

## 📁 Estrutura do projeto

```
📦 UNIUINICA-SCRIPT
 ┣ 📄 horariocheck.js   → Script do Desafio 2
 ┣ 📄 DOCUMENTACAO.md   → Documentação técnica complementar
 ┗ 📄 README.md         → Documentação principal
```

---

## ⏱️ Horário Check

Script simples para validar se uma data/hora está dentro do horário de funcionamento, considerando:

- dia da semana  
- feriados nacionais (via BrasilAPI)  
- fuso de Brasília (`America/Sao_Paulo`)  

---

## 🧠 Regras atuais

- Segunda a quinta: **08:00 às 20:00**  
- Sexta: **08:00 às 19:00**  
- Sábado e domingo: fechado  
- Feriado nacional: fechado  

---

## 🚀 Como usar

### Requisito

- Node.js **18+** (necessário pelo `fetch` nativo)

---

### 1) Rodar exemplos prontos

```bash
node horariocheck.js --exemplos
```

---

### 2) Usar no seu código

```js
import { verificarFuncionamento } from "./horariocheck.js";

const resultado = await verificarFuncionamento("2025-12-30 10:15");
console.log(resultado);
```

#### Formato aceito para entrada

- `Date` (data atual ou qualquer objeto Date)  
- string no formato `YYYY-MM-DD HH:mm`  
- também aceita com `T`: `YYYY-MM-DDTHH:mm`

---

## 📦 Retorno da função

A função retorna um objeto no formato:

```js
{
  dentroDoHorario: true | false,
  motivo: "texto explicando o motivo",
  detalhes: {
    dataSP: "YYYY-MM-DD",
    diaSemana: 0-6,
    horaSP: "HH:mm",
    janela: "HH:mm-HH:mm"
  }
}
```

---

## ⚙️ Observação técnica

Os feriados são carregados por ano e ficam em cache durante a execução, evitando múltiplas chamadas à API e melhorando o desempenho.

---

<p align="center">
  <sub>Desenvolvido como parte do desafio de automação</sub>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1f6feb,100:58a6ff&height=100&section=footer" />
</p>
