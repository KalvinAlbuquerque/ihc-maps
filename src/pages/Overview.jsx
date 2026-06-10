import { Bar, Chart } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import { TASKS, TASK_META, susColor, susLabel, statusColor, CHART_OPTS } from '../utils'

/* ── Helpers ─────────────────────────────────────────────────── */
function pct(v) { return `${Math.round(v * 100)}%` }

const TASK_SHORTS = TASKS.map(t => TASK_META[t].short)

/* ── Stat card ───────────────────────────────────────────────── */
function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={color ? { color } : {}}>{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

/* ── Task heatmap ────────────────────────────────────────────── */
function TaskHeatmap({ data }) {
  const items = []

  // corner + column headers
  items.push(<div key="corner" />)
  TASKS.forEach(t => {
    items.push(
      <div key={`h-${t}`} className="heatmap-header" style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 600, color: 'var(--text2)', fontSize: '.68rem' }}>{t}</div>
        <div style={{ fontSize: '.55rem', color: 'var(--muted)', marginTop: '2px' }}>{TASK_META[t].short}</div>
      </div>
    )
  })

  // rows
  data.forEach(d => {
    items.push(
      <div key={`lbl-${d.perfil.nome}`} className="heatmap-row-label">
        <span
          style={{ width: 6, height: 6, borderRadius: '50%', background: d._color, display: 'inline-block', marginRight: '.4rem', flexShrink: 0 }}
        />
        {d.perfil.nome}
      </div>
    )
    TASKS.forEach((tid, i) => {
      const t = d.tarefas[i]
      if (!t) { items.push(<div key={`${d.perfil.nome}-${tid}`} className="heatmap-cell empty">—</div>); return }
      const cls   = t.completou === 'sim' ? 'ok' : t.completou === 'com_dificuldade' ? 'warn' : 'danger'
      const icon  = t.completou === 'sim' ? '✓' : t.completou === 'com_dificuldade' ? '~' : '✗'
      const overT = !t.dentro_meta_tempo
      const overC = !t.dentro_meta_cliques
      items.push(
        <div
          key={`${d.perfil.nome}-${tid}`}
          className={`heatmap-cell ${cls}`}
          title={`${d.perfil.nome} / ${tid} — ${t.tempo_segundos}s · ${t.cliques}× · ${t.completou}`}
        >
          <span className="cell-time" style={overT ? { color: 'var(--warn)', fontWeight: 700 } : {}}>
            {t.tempo_segundos}s
          </span>
          <span className="cell-label" style={overC ? { color: 'var(--warn)', fontWeight: 700 } : {}}>
            {icon} {t.cliques}×
          </span>
        </div>
      )
    })
  })

  return (
    <div className="heatmap-wrap">
      <div
        className="heatmap"
        style={{ gridTemplateColumns: `100px repeat(${TASKS.length}, 1fr)` }}
      >
        {items}
      </div>
      <p style={{ fontSize: '.65rem', color: 'var(--muted)', marginTop: '.65rem', fontFamily: 'var(--mono)' }}>
        ✓ completou · ~ com dificuldade · ✗ não completou &nbsp;·&nbsp; <span style={{ color: 'var(--warn)' }}>amarelo</span> = acima da meta (tempo ou cliques)
      </p>
    </div>
  )
}

/* ── SUS band chips ──────────────────────────────────────────── */
const SUS_BANDS = [
  { label: '≥ 85  Excelente', color: '#4ade80' },
  { label: '68–84  Boa',       color: '#60a5fa' },
  { label: '51–67  Razoável',  color: '#fbbf24' },
  { label: '< 51  Abaixo',     color: '#f87171' },
]

/* ── Main ────────────────────────────────────────────────────── */
export default function Overview({ data }) {
  const navigate = useNavigate()

  if (!data.length) return (
    <div className="full-center">
      <span className="muted mono" style={{ fontSize: '.78rem' }}>Sem dados carregados.</span>
    </div>
  )

  const sorted = [...data].sort((a, b) => b.sus.sus_score - a.sus.sus_score)
  const n      = data.length

  // aggregate metrics
  const allTasks    = data.flatMap(d => d.tarefas)
  const allStatuses = allTasks.map(t => t.completou)
  const avgSus      = +(data.reduce((s, d) => s + d.sus.sus_score, 0) / n).toFixed(1)
  const susMin      = Math.min(...data.map(d => d.sus.sus_score))
  const susMax      = Math.max(...data.map(d => d.sus.sus_score))
  const successPct  = Math.round(allStatuses.filter(s => s === 'sim').length / allStatuses.length * 100)
  const difPct      = Math.round(allStatuses.filter(s => s === 'com_dificuldade').length / allStatuses.length * 100)
  const avgTempo    = +(allTasks.reduce((a, t) => a + t.tempo_segundos, 0) / allTasks.length).toFixed(1)
  const avgCliques  = +(allTasks.reduce((a, t) => a + t.cliques, 0) / allTasks.length).toFixed(1)

  const successColor = successPct >= 70 ? '#4ade80' : successPct >= 50 ? '#fbbf24' : '#f87171'

  // User tempo/cliques vs meta ideal
  const metaTempoAvg   = +(TASKS.reduce((s, t) => s + TASK_META[t].tempo,   0) / TASKS.length).toFixed(1)
  const metaCliquesAvg = +(TASKS.reduce((s, t) => s + TASK_META[t].cliques, 0) / TASKS.length).toFixed(1)

  const mkMixedData = (key, metaAvg) => ({
    labels: sorted.map(d => d.perfil.nome),
    datasets: [
      {
        type: 'bar',
        label: key === 'tempo' ? 'Tempo médio (s)' : 'Cliques médios',
        data: sorted.map(d => +(d.tarefas.reduce((s, t) => s + (key === 'tempo' ? t.tempo_segundos : t.cliques), 0) / d.tarefas.length).toFixed(1)),
        backgroundColor: sorted.map(d => d._color + '44'),
        borderColor:     sorted.map(d => d._color),
        borderWidth: 1.5,
        borderRadius: 4,
      },
      {
        type: 'line',
        label: `Meta ideal (${metaAvg}${key === 'tempo' ? 's' : ''})`,
        data: Array(sorted.length).fill(metaAvg),
        borderColor: 'rgba(200,200,200,0.45)',
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
    ],
  })

  const mixedOpts = (yLabel) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: {
      ...CHART_OPTS.plugins,
      legend: {
        display: true,
        labels: { color: '#5a5a5a', font: { family: "'IBM Plex Mono', monospace", size: 10 }, boxWidth: 20, boxHeight: 2, padding: 14 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a0a0a0', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        min: 0,
        grid: { color: 'rgba(255,255,255,.04)' },
        ticks: { color: '#5a5a5a', font: { size: 10, family: "'IBM Plex Mono', monospace" } },
        border: { display: false },
        title: { display: true, text: yLabel, color: '#5a5a5a', font: { size: 10 } },
      },
    },
  })

  // SUS chart (horizontal bar)
  const susChartData = {
    labels: sorted.map(d => d.perfil.nome),
    datasets: [{
      data: sorted.map(d => d.sus.sus_score),
      backgroundColor: sorted.map(d => susColor(d.sus.sus_score) + '28'),
      borderColor:     sorted.map(d => susColor(d.sus.sus_score)),
      borderWidth: 1.5,
      borderRadius: 3,
    }],
  }

  const susOpts = {
    responsive: true, maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      ...CHART_OPTS.plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        min: 0, max: 105,
        grid: { color: 'rgba(255,255,255,.04)' },
        ticks: { color: '#5a5a5a', font: { size: 10, family: "'IBM Plex Mono', monospace" } },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#a0a0a0', font: { size: 11 } },
        border: { display: false },
      },
    },
    onClick: (_, els) => {
      if (els.length) navigate(`/participant/${encodeURIComponent(sorted[els[0].index].perfil.nome)}`)
    },
    onHover: (e) => { e.native.target.style.cursor = 'pointer' },
  }

  // Task success stacked chart
  const stackedData = {
    labels: TASK_SHORTS,
    datasets: [
      {
        label: 'Completou',
        stack: 's',
        data: TASKS.map((_, i) => data.filter(d => d.tarefas[i]?.completou === 'sim').length),
        backgroundColor: 'rgba(74,222,128,.55)',
        borderColor: '#4ade80',
        borderWidth: 1,
      },
      {
        label: 'Com dificuldade',
        stack: 's',
        data: TASKS.map((_, i) => data.filter(d => d.tarefas[i]?.completou === 'com_dificuldade').length),
        backgroundColor: 'rgba(251,191,36,.5)',
        borderColor: '#fbbf24',
        borderWidth: 1,
      },
      {
        label: 'Não completou',
        stack: 's',
        data: TASKS.map((_, i) => data.filter(d => d.tarefas[i]?.completou === 'nao').length),
        backgroundColor: 'rgba(248,113,113,.5)',
        borderColor: '#f87171',
        borderWidth: 1,
      },
    ],
  }

  const stackedOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      ...CHART_OPTS.plugins,
      legend: {
        display: true,
        labels: { color: '#5a5a5a', font: { family: "'IBM Plex Mono', monospace", size: 10 }, boxWidth: 10, boxHeight: 10, padding: 16 },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#a0a0a0', font: { size: 10 } },
        border: { display: false },
      },
      y: {
        stacked: true,
        min: 0, max: n + .5,
        grid: { color: 'rgba(255,255,255,.04)' },
        ticks: { color: '#5a5a5a', stepSize: 1, font: { size: 10, family: "'IBM Plex Mono', monospace" } },
        border: { display: false },
      },
    },
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Dashboard</div>
        <h1 className="page-title">Visão Geral</h1>
        <p className="page-sub">{n} participantes · 6 tarefas · SUS + Likert + Think-aloud</p>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid">
        <StatCard
          label="Participantes"
          value={n}
          sub={`SUS ${susMin}–${susMax}`}
        />
        <StatCard
          label="SUS Médio"
          value={avgSus}
          sub={susLabel(avgSus)}
          color={susColor(avgSus)}
        />
        <StatCard
          label="Taxa Sucesso"
          value={`${successPct}%`}
          sub={`${difPct}% c/ dificuldade`}
          color={successColor}
        />
        <StatCard
          label="Tempo Médio"
          value={`${avgTempo}s`}
          sub="por tarefa"
        />
        <StatCard
          label="Cliques Médios"
          value={avgCliques}
          sub="por tarefa"
        />
      </div>

      {/* ── Heatmap ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Mapa de Tarefas</span>
          <span className="card-sub">participantes × tarefas</span>
        </div>
        <TaskHeatmap data={sorted} />
      </div>

      {/* ── Tempo/Cliques por usuário vs meta ── */}
      <div className="grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Tempo Médio por Participante</span>
            <span className="card-sub">vs. média ideal ({metaTempoAvg}s)</span>
          </div>
          <div style={{ height: 220 }}>
            <Chart type="bar" data={mkMixedData('tempo', metaTempoAvg)} options={mixedOpts('segundos')} />
          </div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Cliques Médios por Participante</span>
            <span className="card-sub">vs. média ideal ({metaCliquesAvg} cliques)</span>
          </div>
          <div style={{ height: 220 }}>
            <Chart type="bar" data={mkMixedData('cliques', metaCliquesAvg)} options={mixedOpts('cliques')} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '.75rem' }} />

      {/* ── Charts row ── */}
      <div className="grid-2">
        {/* SUS chart */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">SUS por Participante</span>
            <span className="card-sub">clique → detalhes</span>
          </div>
          <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap', marginBottom: '.75rem' }}>
            {SUS_BANDS.map(b => (
              <span
                key={b.label}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontFamily: 'var(--mono)', fontSize: '.6rem', fontWeight: 500,
                  padding: '.15rem .45rem', borderRadius: '3px',
                  color: b.color, background: b.color + '14', border: `1px solid ${b.color}33`,
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
          <div style={{ height: 42 * sorted.length + 32 }}>
            <Bar data={susChartData} options={susOpts} />
          </div>
        </div>

        {/* Task success stacked */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Taxa de Conclusão por Tarefa</span>
          </div>
          <div style={{ height: 42 * sorted.length + 32 }}>
            <Bar data={stackedData} options={stackedOpts} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }} />

      {/* ── Participant grid ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Participantes</span>
          <span className="card-sub">por SUS decrescente</span>
        </div>
        <div className="p-grid">
          {sorted.map(d => {
            const sc = susColor(d.sus.sus_score)
            return (
              <div
                key={d.perfil.nome}
                className="p-card"
                onClick={() => navigate(`/participant/${encodeURIComponent(d.perfil.nome)}`)}
              >
                <div className="p-card-top">
                  <div
                    className="p-avatar"
                    style={{
                      background: d._color + '18',
                      color: d._color,
                      border: `1px solid ${d._color}3a`,
                      fontSize: '.82rem',
                    }}
                  >
                    {d.perfil.nome[0]}
                  </div>
                  <span className="p-card-name">{d.perfil.nome}</span>
                  <span className="p-card-sus" style={{ color: sc }}>{d.sus.sus_score}</span>
                </div>
                <p className="p-card-meta">
                  {d.perfil.faixa_etaria} · {d.perfil.nivel_experiencia} · {d.perfil.frequencia_uso}
                </p>
                <div className="p-pip-row">
                  {d.tarefas.map(t => (
                    <span
                      key={t.id}
                      className="p-pip"
                      style={{ background: statusColor(t.completou) }}
                      title={`${t.id}: ${t.completou}`}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
