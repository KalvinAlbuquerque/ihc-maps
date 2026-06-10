import { Bar } from 'react-chartjs-2'
import { TASKS, TASK_META, susColor, statusColor, CHART_OPTS } from '../utils'

const SHORT = TASKS.map(t => TASK_META[t].short)

function SectionCard({ title, color, sub, children, mb = true }) {
  return (
    <div className="card" style={{ marginBottom: mb ? undefined : 0 }}>
      <div className="section-header">
        <span className="section-dot" style={{ background: color }} />
        <span className="section-title">{title}</span>
        {sub && <span className="section-sub">{sub}</span>}
      </div>
      {children}
    </div>
  )
}

export default function Overview({ data, onDetail }) {
  if (!data.length) return <div className="full-center muted mono">nenhum dado carregado</div>

  const sorted = [...data].sort((a, b) => b.sus.sus_score - a.sus.sus_score)

  // ── Métricas derivadas dos dados ─────────────────────────────
  const n            = data.length
  const allStatuses  = data.flatMap(d => d.tarefas.map(t => t.completou))
  const avgSus       = +(data.reduce((s, d) => s + d.sus.sus_score, 0) / n).toFixed(1)
  const susMin       = Math.min(...data.map(d => d.sus.sus_score))
  const susMax       = Math.max(...data.map(d => d.sus.sus_score))
  const successPct   = Math.round(allStatuses.filter(s => s === 'sim').length / allStatuses.length * 100)
  const difPct       = Math.round(allStatuses.filter(s => s === 'com_dificuldade').length / allStatuses.length * 100)
  const allTempos    = data.flatMap(d => d.tarefas.map(t => t.tempo_segundos))
  const avgTempo     = +(allTempos.reduce((a, b) => a + b, 0) / allTempos.length).toFixed(1)
  const avgCliques   = +(data.flatMap(d => d.tarefas.map(t => t.cliques)).reduce((a, b) => a + b, 0) / allStatuses.length).toFixed(1)

  // ── Chart: SUS ───────────────────────────────────────────────
  const susChartData = {
    labels: sorted.map(d => d.perfil.nome),
    datasets: [{
      data: sorted.map(d => d.sus.sus_score),
      backgroundColor: sorted.map(d => susColor(d.sus.sus_score) + '99'),
      borderColor:     sorted.map(d => susColor(d.sus.sus_score)),
      borderWidth: 2, borderRadius: 6,
    }]
  }

  // ── Chart: Tempo ─────────────────────────────────────────────
  const tempoChartData = {
    labels: SHORT,
    datasets: [
      ...data.map(d => ({
        type: 'bar', label: d.perfil.nome,
        data: d.tarefas.map(t => t.tempo_segundos),
        backgroundColor: d._color + '77', borderColor: d._color,
        borderWidth: 1.5, borderRadius: 3,
      })),
      {
        type: 'line', label: 'Meta',
        data: TASKS.map(t => TASK_META[t].tempo),
        borderColor: 'rgba(255,255,255,.5)', borderWidth: 2,
        borderDash: [6, 4], pointRadius: 4,
        pointBackgroundColor: 'rgba(255,255,255,.8)',
        fill: false, tension: 0, order: -1,
      }
    ]
  }

  // ── Chart: Taxa de sucesso ────────────────────────────────────
  const successChartData = {
    labels: SHORT,
    datasets: [
      { label: 'Completou',       stack: 's', data: TASKS.map((_, i) => data.filter(d => d.tarefas[i]?.completou === 'sim').length),             backgroundColor: 'rgba(74,240,154,.65)', borderColor: '#4af09a', borderWidth: 1.5 },
      { label: 'Com dificuldade', stack: 's', data: TASKS.map((_, i) => data.filter(d => d.tarefas[i]?.completou === 'com_dificuldade').length),  backgroundColor: 'rgba(240,168,74,.65)', borderColor: '#f0a84a', borderWidth: 1.5 },
      { label: 'Não completou',   stack: 's', data: TASKS.map((_, i) => data.filter(d => d.tarefas[i]?.completou === 'nao').length),             backgroundColor: 'rgba(240,90,74,.65)',  borderColor: '#f05a4a', borderWidth: 1.5 },
    ]
  }

  // ── Chart: Likert médio ──────────────────────────────────────
  const likertChartData = {
    labels: SHORT,
    datasets: [{
      label: 'Satisfação média',
      data: TASKS.map((_, i) => {
        const vals = data.map(d => d.tarefas[i]?.likert_media ?? 0)
        return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
      }),
      backgroundColor: TASKS.map((_, i) => {
        const avg = data.map(d => d.tarefas[i]?.likert_media ?? 0).reduce((a, b) => a + b, 0) / n
        return avg >= 4 ? 'rgba(74,240,154,.7)' : avg >= 3 ? 'rgba(74,176,240,.65)' : avg >= 2 ? 'rgba(240,168,74,.65)' : 'rgba(240,90,74,.65)'
      }),
      borderRadius: 7, borderSkipped: false,
    }]
  }

  function baseOpts(yLabel, extra = {}) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: CHART_OPTS.plugins,
      scales: {
        x: { grid: { display: false }, ticks: { color: '#546278', font: { size: 10 } }, ...extra.x },
        y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#546278' }, title: { display: !!yLabel, text: yLabel, color: '#546278', font: { size: 10 } }, ...extra.y },
      },
    }
  }

  const avgSusColor = susColor(avgSus)

  return (
    <div className="view-wrap">

      {/* ── Stats ── */}
      <div className="stats-row">
        <StatCard label="Participantes" value={n} color="#4af0c4" glow="rgba(74,240,196,.12)" sub={`${susMin}–${susMax} range SUS`} />
        <StatCard label="SUS Médio"     value={avgSus} color={avgSusColor} glow={avgSusColor + '22'} sub="/ 100 pontos" />
        <StatCard label="Taxa Sucesso"  value={`${successPct}%`} color="#4af09a" glow="rgba(74,240,154,.1)" sub={`${difPct}% com dificuldade`} />
        <StatCard label="Tempo Médio"   value={`${avgTempo}s`} color="#f0a84a" glow="rgba(240,168,74,.1)" sub="por tarefa" />
        <StatCard label="Cliques Médios" value={avgCliques} color="#a06af0" glow="rgba(160,106,240,.1)" sub="toques por tarefa" />
      </div>

      {/* ── SUS Chart ── */}
      <SectionCard title="SUS Score por Participante" color="#4af0c4" sub="clique na barra para ver detalhes">
        <div style={{ height: 42 * sorted.length + 40, minHeight: 140 }}>
          <Bar
            data={susChartData}
            options={{
              ...baseOpts(),
              indexAxis: 'y',
              plugins: { ...CHART_OPTS.plugins, legend: { display: false } },
              scales: {
                x: { min: 0, max: 105, grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#546278' } },
                y: { grid: { display: false }, ticks: { color: '#c8d6ec', font: { weight: '600', size: 12 } } },
              },
              onClick: (_, els) => els.length && onDetail(sorted[els[0].index].perfil.nome),
              onHover: (e) => { e.native.target.style.cursor = 'pointer' },
            }}
          />
        </div>
        <div className="band-legend">
          {[['≥ 85  Excelente','#4af09a'],['68–84  Boa','#4ab0f0'],['51–67  Razoável','#f0a84a'],['< 51  Abaixo da média','#f05a4a']].map(([l, c]) => (
            <span key={l} className="band-chip" style={{ color: c, borderColor: c + '44', background: c + '14' }}>{l}</span>
          ))}
        </div>
      </SectionCard>

      {/* ── Tempo + Sucesso ── */}
      <div className="grid-2">
        <SectionCard title="Tempo por Tarefa (s)" color="#f0a84a" mb={false}>
          <div style={{ height: 248 }}>
            <Bar data={tempoChartData} options={baseOpts('segundos')} />
          </div>
        </SectionCard>
        <SectionCard title="Taxa de Conclusão" color="#a06af0" mb={false}>
          <div style={{ height: 248 }}>
            <Bar data={successChartData} options={{
              ...baseOpts('participantes'),
              scales: {
                x: { stacked: true, grid: { display: false }, ticks: { color: '#546278', font: { size: 10 } } },
                y: { stacked: true, min: 0, max: n + .5, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#546278', stepSize: 1 } },
              }
            }} />
          </div>
        </SectionCard>
      </div>
      <div style={{ marginBottom: '1.25rem' }} />

      {/* ── Likert ── */}
      <SectionCard title="Satisfação Média por Tarefa — Likert (1–5)" color="#4ab0f0">
        <div style={{ height: 192 }}>
          <Bar data={likertChartData} options={{
            ...baseOpts('média'),
            plugins: { ...CHART_OPTS.plugins, legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#546278', font: { size: 10 } } },
              y: { min: 0, max: 5.5, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#546278' } },
            }
          }} />
        </div>
      </SectionCard>

      {/* ── Participant Cards ── */}
      <SectionCard title="Participantes" color="#f0a84a">
        <div className="p-grid">
          {sorted.map(d => (
            <div
              key={d.perfil.nome}
              className="p-mini-card"
              style={{ '--pc': d._color }}
              onClick={() => onDetail(d.perfil.nome)}
            >
              <div className="p-mini-top">
                <div className="p-mini-avatar" style={{ background: d._color + '22', color: d._color, border: `1.5px solid ${d._color}55` }}>
                  {d.perfil.nome[0]}
                </div>
                <span className="p-mini-name">{d.perfil.nome}</span>
                <span className="p-mini-sus" style={{ color: susColor(d.sus.sus_score) }}>{d.sus.sus_score}</span>
              </div>
              <div className="p-mini-meta">{d.perfil.faixa_etaria} · {d.perfil.nivel_experiencia} · {d.perfil.frequencia_uso}</div>
              <div className="p-mini-tasks">
                {d.tarefas.map(t => (
                  <span key={t.id} className="task-pip" style={{ background: statusColor(t.completou) + 'cc' }} title={`${t.id}: ${t.completou}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function StatCard({ label, value, color, glow, sub }) {
  return (
    <div
      className="stat-card"
      style={{ '--sc': color, '--scg': glow, '--scg2': glow }}
    >
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-sub">{sub}</span>
    </div>
  )
}
