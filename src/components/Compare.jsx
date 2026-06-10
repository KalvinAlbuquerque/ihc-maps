import { Bar, Line } from 'react-chartjs-2'
import { TASKS, TASK_META, susColor, susLabel, statusColor, statusLabel, CHART_OPTS } from '../utils'

const SHORT = TASKS.map(t => TASK_META[t].short)

function gradientDataset(d, key, chartRef) {
  return {
    label: d.perfil.nome,
    data: d.tarefas.map(t =>
      key === 'tempo'   ? t.tempo_segundos :
      key === 'cliques' ? t.cliques :
      t.likert_media
    ),
    borderColor: d._color,
    backgroundColor: (ctx) => {
      const chart = ctx.chart
      const { chartArea } = chart
      if (!chartArea) return d._color + '22'
      const g = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
      g.addColorStop(0, d._color + '55')
      g.addColorStop(1, d._color + '00')
      return g
    },
    fill: true,
    borderWidth: 2, tension: 0.35,
    pointRadius: 5, pointBackgroundColor: d._color,
    pointBorderColor: 'var(--surface)',
    pointBorderWidth: 2,
  }
}

export default function Compare({ data, onBack }) {
  if (!data || data.length < 2) return (
    <div className="view-wrap">
      <button className="back-btn" onClick={onBack}>← Voltar</button>
      <div className="full-center muted mono" style={{ marginTop: '4rem', flexDirection: 'column', gap: '.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>⇄</span>
        Selecione ao menos 2 participantes na barra lateral.
      </div>
    </div>
  )

  const lineOpts = (yLabel, yMin = 0) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: CHART_OPTS.plugins,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#546278', font: { size: 10 } } },
      y: { min: yMin, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#546278' }, title: { display: true, text: yLabel, color: '#546278', font: { size: 10 } } },
    }
  })

  const metaLine = (key) => ({
    label: 'Meta',
    data: TASKS.map(t => key === 'tempo' ? TASK_META[t].tempo : TASK_META[t].cliques),
    borderColor: 'rgba(255,255,255,.35)',
    backgroundColor: 'transparent',
    borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0,
    fill: false, tension: 0,
  })

  const tempoData   = { labels: SHORT, datasets: [...data.map(d => gradientDataset(d, 'tempo')),   metaLine('tempo')]   }
  const cliquesData = { labels: SHORT, datasets: [...data.map(d => gradientDataset(d, 'cliques')), metaLine('cliques')] }
  const likertData  = { labels: SHORT, datasets: data.map(d => gradientDataset(d, 'likert')) }

  const susData = {
    labels: data.map(d => d.perfil.nome),
    datasets: [{
      data: data.map(d => d.sus.sus_score),
      backgroundColor: data.map(d => susColor(d.sus.sus_score) + '88'),
      borderColor:     data.map(d => susColor(d.sus.sus_score)),
      borderWidth: 2, borderRadius: 8,
    }]
  }

  return (
    <div className="view-wrap">

      {/* ── Hero header ── */}
      <div className="compare-hero">
        <span className="compare-title">Comparativo</span>
        {data.map(d => (
          <span key={d.perfil.nome} className="cmp-participant-chip">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: d._color, flexShrink: 0 }} />
            {d.perfil.nome}
            <span style={{ color: susColor(d.sus.sus_score), fontWeight: 700 }}>{d.sus.sus_score}</span>
          </span>
        ))}
      </div>

      {/* ── SUS ── */}
      <div className="card">
        <div className="section-header">
          <span className="section-dot" style={{ background: '#4af0c4' }} />
          <span className="section-title">SUS Score</span>
        </div>
        <div style={{ height: 160 }}>
          <Bar data={susData} options={{
            responsive: true, maintainAspectRatio: false,
            plugins: { ...CHART_OPTS.plugins, legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#c8d6ec', font: { weight: '600', size: 12 } } },
              y: { min: 0, max: 105, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#546278' } },
            }
          }} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '.85rem', flexWrap: 'wrap' }}>
          {data.map(d => (
            <div key={d.perfil.nome} style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '1.1rem', fontWeight: 800, color: susColor(d.sus.sus_score), lineHeight: 1 }}>{d.sus.sus_score}</span>
              <span style={{ fontSize: '.68rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{d.perfil.nome} · {susLabel(d.sus.sus_score)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lines ── */}
      <div className="grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="section-header">
            <span className="section-dot" style={{ background: '#f0a84a' }} />
            <span className="section-title">Tempo por Tarefa</span>
          </div>
          <div style={{ height: 220 }}><Line data={tempoData} options={lineOpts('segundos')} /></div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="section-header">
            <span className="section-dot" style={{ background: '#a06af0' }} />
            <span className="section-title">Cliques por Tarefa</span>
          </div>
          <div style={{ height: 220 }}><Line data={cliquesData} options={lineOpts('cliques')} /></div>
        </div>
      </div>
      <div style={{ marginBottom: '1.25rem' }} />

      <div className="card">
        <div className="section-header">
          <span className="section-dot" style={{ background: '#4af09a' }} />
          <span className="section-title">Satisfação Likert por Tarefa</span>
        </div>
        <div style={{ height: 220 }}><Line data={likertData} options={lineOpts('Média Likert', 0)} /></div>
      </div>

      {/* ── Comparison table ── */}
      <div className="card">
        <div className="section-header">
          <span className="section-dot" style={{ background: '#f0a84a' }} />
          <span className="section-title">Tabela Comparativa</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="cmp-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Tarefa</th>
                {data.map(d => (
                  <th key={d.perfil.nome} colSpan={3}>
                    <span style={{ color: d._color, fontWeight: 700 }}>{d.perfil.nome}</span>
                  </th>
                ))}
              </tr>
              <tr>
                <th></th>
                {data.flatMap(d => [
                  <th key={d.perfil.nome + 't'}>Tempo</th>,
                  <th key={d.perfil.nome + 'c'}>Cliques</th>,
                  <th key={d.perfil.nome + 's'}>Status</th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {TASKS.map((tid, i) => (
                <tr key={tid}>
                  <td className="cmp-tid">{tid}</td>
                  {data.flatMap(d => {
                    const t   = d.tarefas[i]
                    const okT = t.tempo_segundos <= TASK_META[tid].tempo
                    const okC = t.cliques        <= TASK_META[tid].cliques
                    return [
                      <td key={d.perfil.nome + 't'} className="mono" style={{ color: okT ? '#4af09a' : '#f05a4a', fontSize: '.78rem' }}>{t.tempo_segundos}s</td>,
                      <td key={d.perfil.nome + 'c'} className="mono" style={{ color: okC ? '#4af09a' : '#f05a4a', fontSize: '.78rem' }}>{t.cliques}×</td>,
                      <td key={d.perfil.nome + 's'}>
                        <span className="mini-tag" style={{ color: statusColor(t.completou), borderColor: statusColor(t.completou) + '55', background: statusColor(t.completou) + '16' }}>
                          {statusLabel(t.completou)}
                        </span>
                      </td>,
                    ]
                  })}
                </tr>
              ))}
              <tr className="sus-row-final">
                <td className="cmp-tid" style={{ color: '#4af0c4' }}>SUS</td>
                {data.flatMap(d => (
                  <td key={d.perfil.nome} colSpan={3} style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.05rem', color: susColor(d.sus.sus_score) }}>
                    {d.sus.sus_score} <span style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--muted)', fontWeight: 400 }}>{susLabel(d.sus.sus_score)}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
