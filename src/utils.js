export const TASKS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6']

export const TASK_META = {
  T1: { label: 'Busca e início de navegação',  short: 'Busca',      tempo: 30, cliques: 5 },
  T2: { label: 'Busca com filtro',             short: 'Filtro',     tempo: 45, cliques: 7 },
  T3: { label: 'Rota sem pedágio',             short: 'Sem pedágio',tempo: 40, cliques: 6 },
  T4: { label: 'Reportar incidente',           short: 'Incidente',  tempo: 20, cliques: 3 },
  T5: { label: 'Parada intermediária',         short: 'Parada',     tempo: 35, cliques: 5 },
  T6: { label: 'Busca c/ erro ortográfico',    short: 'Autocomplete',tempo: 20, cliques: 4 },
}

/* Participant colors — used only for identification (dots, avatars) */
export const PALETTE = [
  '#60a5fa', '#f59e0b', '#a78bfa', '#34d399',
  '#f87171', '#38bdf8', '#fb7185', '#a3e635',
]

export const SUS_Qs = [
  { t: 'pos', p: 'Eu gostaria de usar esse sistema com frequência.' },
  { t: 'neg', p: 'Achei o sistema desnecessariamente complexo.' },
  { t: 'pos', p: 'Achei o sistema fácil de usar.' },
  { t: 'neg', p: 'Acho que precisaria de ajuda técnica.' },
  { t: 'pos', p: 'As funções do sistema estão bem integradas.' },
  { t: 'neg', p: 'Achei que havia muita inconsistência.' },
  { t: 'pos', p: 'A maioria das pessoas aprenderia rapidamente.' },
  { t: 'neg', p: 'Achei o sistema muito difícil de usar.' },
  { t: 'pos', p: 'Me senti confiante ao usar o sistema.' },
  { t: 'neg', p: 'Precisei aprender muitas coisas antes de usar.' },
]

export function susColor(s) {
  if (s >= 85) return '#4ade80'
  if (s >= 68) return '#60a5fa'
  if (s >= 51) return '#fbbf24'
  return '#f87171'
}

export function susLabel(s) {
  if (s >= 85) return 'Excelente'
  if (s >= 68) return 'Boa'
  if (s >= 51) return 'Razoável'
  return 'Abaixo da média'
}

export function statusColor(s) {
  return s === 'sim' ? '#4ade80' : s === 'com_dificuldade' ? '#fbbf24' : '#f87171'
}

export function statusLabel(s) {
  return s === 'sim' ? 'OK' : s === 'com_dificuldade' ? 'c/ dif.' : 'falhou'
}

export function likertColor(v) {
  if (v < 2)   return '#f87171'
  if (v < 3)   return '#fbbf24'
  if (v < 3.8) return '#a0a0a0'
  if (v < 4.5) return '#60a5fa'
  return '#4ade80'
}

export const CHART_OPTS = {
  plugins: {
    legend: {
      labels: {
        color: '#5a5a5a',
        font: { family: "'IBM Plex Mono', monospace", size: 10 },
        boxWidth: 10, boxHeight: 10,
      },
    },
    tooltip: {
      backgroundColor: '#1c1c1c',
      borderColor: 'rgba(255,255,255,.12)',
      borderWidth: 1,
      titleColor: '#e2e2e2',
      bodyColor: '#a0a0a0',
      padding: 10,
      cornerRadius: 6,
    },
  },
}
