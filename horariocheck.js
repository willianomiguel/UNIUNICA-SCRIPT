const TIMEZONE = "America/Sao_Paulo";
const HORARIO_SEMANA = { inicio: "08:00", fim: "20:00" }; // segunda-feira a quinta-feira
const HORARIO_SEXTA = { inicio: "08:00", fim: "19:00" }; // sexta-feira
const FERIADOS_URL = (ano) => `https://brasilapi.com.br/api/feriados/v1/${ano}`;

const formatterSP = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const cacheFeriados = new Map();

function paraMinutos(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function parseEntradaString(valor) {
  // Aceita "YYYY-MM-DD HH:mm" e "YYYY-MM-DDTHH:mm"
  const match = valor.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Formato invalido: "${valor}". Use "YYYY-MM-DD HH:mm".`);
  }

  const [, ano, mes, dia, hora, minuto] = match.map(Number);
  return { ano, mes, dia, hora, minuto };
}

function extrairPartesSP(data) {
  // Extrai partes ja convertidas para o fuso de Sao Paulo
  const parts = formatterSP.formatToParts(data);
  const get = (tipo) => Number(parts.find((p) => p.type === tipo)?.value);

  return {
    ano: get("year"),
    mes: get("month"),
    dia: get("day"),
    hora: get("hour"),
    minuto: get("minute"),
  };
}

function normalizarEntrada(entrada) {
  if (entrada instanceof Date) return extrairPartesSP(entrada);
  if (typeof entrada === "string") return parseEntradaString(entrada);
  throw new Error("Entrada deve ser Date ou string 'YYYY-MM-DD HH:mm'.");
}

function ymd({ ano, mes, dia }) {
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function diaSemana({ ano, mes, dia }) {
  // Usa UTC para nao depender do timezone da maquina
  return new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay(); // 0=dom, 6=sab
}

async function carregarFeriados(ano) {
  // Cache simples por ano para evitar chamadas repetidas a API
  if (cacheFeriados.has(ano)) return cacheFeriados.get(ano);

  const resposta = await fetch(FERIADOS_URL(ano));
  if (!resposta.ok) {
    throw new Error(`Nao foi possivel carregar feriados (${ano}): HTTP ${resposta.status}`);
  }

  const dados = await resposta.json();
  const feriados = new Set(dados.map((item) => item.date));
  cacheFeriados.set(ano, feriados);
  return feriados;
}

async function ehFeriado(dataLocal) {
  const feriados = await carregarFeriados(dataLocal.ano);
  return feriados.has(ymd(dataLocal));
}

async function verificarFuncionamento(entrada = new Date()) {
  const dataLocal = normalizarEntrada(entrada);
  const dia = diaSemana(dataLocal);
  const agoraMinutos = dataLocal.hora * 60 + dataLocal.minuto;
  const horaSP = `${String(dataLocal.hora).padStart(2, "0")}:${String(dataLocal.minuto).padStart(2, "0")}`;

  if (dia === 0 || dia === 6) {
    return {
      dentroDoHorario: false,
      motivo: "Fora do horario: fim de semana",
      detalhes: { dataSP: ymd(dataLocal), diaSemana: dia, horaSP },
    };
  }

  // Em dia util, valida primeiro feriado e depois janela de horario
  if (await ehFeriado(dataLocal)) {
    return {
      dentroDoHorario: false,
      motivo: "Fora do horario: feriado",
      detalhes: { dataSP: ymd(dataLocal), diaSemana: dia, horaSP },
    };
  }

  const faixa = dia === 5 ? HORARIO_SEXTA : HORARIO_SEMANA;
  const inicio = paraMinutos(faixa.inicio);
  const fim = paraMinutos(faixa.fim);
  const dentroDoHorario = agoraMinutos >= inicio && agoraMinutos <= fim;

  return {
    dentroDoHorario,
    motivo: dentroDoHorario ? "Dentro do horario de funcionamento" : "Fora do horario de funcionamento",
    detalhes: {
      dataSP: ymd(dataLocal),
      diaSemana: dia,
      horaSP,
      janela: `${faixa.inicio}-${faixa.fim}`,
    },
  };
}

async function rodarExemplos() {
  const exemplos = [
    "2025-12-30 10:15",
    "2025-12-30 19:10",
    "2025-12-28 11:00",
    "2025-12-25 10:00",
  ];

  for (const exemplo of exemplos) {
    const resultado = await verificarFuncionamento(exemplo);
    console.log(`Entrada: ${exemplo}`, resultado);
  }
}

if (typeof process !== "undefined" && process.argv?.includes("--exemplos")) {
  rodarExemplos().catch(console.error);
}

export { verificarFuncionamento };
