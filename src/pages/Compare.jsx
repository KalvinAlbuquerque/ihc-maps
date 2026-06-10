import { Line } from 'react-chartjs-2'
import { TASKS, TASK_META, susColor, statusColor, likertColor, CHART_OPTS } from '../utils'

export default function Compare({ data }) {
  if (!data || data.length < 2) return (
    <div className="full-center">
      <span className="muted mono" style={{ fontSize: '.8rem' }}>Selecione ao menos 2 participantes na sidebar.</span>
    </div>
  )

  const taskLabels = TASKS.map(t => TASK_META[t].short)

  const lineDataset = (d, key) => ({
    label: d.perfil.nome,
    data: d.tarefas.map(t =>
      key === 'tempo'   ? t.tempo_segundos :
      key === 'cliques' ? t.cliques :
      t.likert_media
    ),
    borderColor: d._color,
    backgroundColor: d._color + '15',
    borderWidth: 1.5,
    pointRadius: 3.5,
    pointBackgroundColor: d._color,
    tension: .3,
    fill: false,
  })

  const metaLine = (key) => ({
    label: 'Meta',
    data: TASKS.map(t => key === 'tempo' ? TASK_META[t].tempo : TASK_META[t].cliques),
    borderColor: 'rgba(120,120,120,0.45)',
    backgroundColor: 'transparent',
    borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0,
    fill: false, tension: 0,
  })

  const timeData    = { labels: taskLabels, datasets: [...data.map(d => lineDataset(d, 'tempo')),   metaLine('tempo')]   }
  const cliquesData = { labels: taskLabels, datasets: [...data.map(d => lineDataset(d, 'cliques')), metaLine('cliques')] }
  const likertData  = { labels: taskLabels, datasets: data.map(d => lineDataset(d, 'likert')) }

  const makeOpts = (yMax, yLabel) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: {
      ...CHART_OPTS.plugins,
      legend: {
        display: true,
        labels: {
          color: '#5a5a5a',
          font: { family: "'IBM Plex Mono', monospace", size: 10 },
          boxWidth: 20, boxHeight: 2, padding: 14,
          usePointStyle: false,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a0a0a0', font: { size: 10 } },
        border: { display: false },
      },
      y: {
        min: 0,
        ...(yMax ? { max: yMax } : {}),
        grid: { color: 'rgba(255,255,255,.04)' },
        ticks: { color: '#5a5a5a', font: { size: 10, family: "'IBM Plex Mono', monospace" } },
        border: { display: false },
        ...(yLabel ? { title: { display: true, text: yLabel, color: '#5a5a5a', font: { size: 10 } } } : {}),
      },
    },
  })

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Análise</div>
        <h1 className="page-title">Comparativo</h1>
        <p className="page-sub">
          {data.length} participantes ·&nbsp;
          {data.map(d => d.perfil.nome).join(', ')}
        </p>
      </div>

      {/* ── Row 1: Tempo + Cliques ── */}
      <div className="grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Tempo por Tarefa</span>
            <span className="card-sub">segundos · linha tracejada = meta</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={timeData} options={makeOpts(null, 'segundos')} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Cliques por Tarefa</span>
            <span className="card-sub">toques na tela · linha tracejada = meta</span>
          </div>
          <div style={{ height: 240 }}>
            <Line data={cliquesData} options={makeOpts(null, 'cliques')} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '.75rem' }} />

      {/* ── Satisfação Likert full-width, taller ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Satisfação por Tarefa</span>
          <span className="card-sub">média Likert 1–5</span>
        </div>
        <div style={{ height: 320 }}>
          <Line data={likertData} options={makeOpts(5.5, 'Likert')} />
        </div>
      </div>

      <div style={{ marginBottom: '.75rem' }} />

      {/* ── Comparison table ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Tabela Comparativa</span>
          <span className="card-sub">✓ pleno · ~ com dificuldade · ✗ não concluiu</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="cmp-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Participante</th>
                <th>SUS</th>
                {TASKS.map(t => <th key={t}>{t}</th>)}
                <th>Concluídas</th>
                <th>T. Médio</th>
                <th>Cl. Médio</th>
                <th>Likert</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => {
                const avgTime   = +(d.tarefas.reduce((a, t) => a + t.tempo_segundos, 0) / d.tarefas.length).toFixed(1)
                const avgClicks = +(d.tarefas.reduce((a, t) => a + t.cliques,        0) / d.tarefas.length).toFixed(1)
                const avgLikert = +(d.tarefas.reduce((a, t) => a + t.likert_media,   0) / d.tarefas.length).toFixed(1)
                const successN  = d.tarefas.filter(t => t.completou === 'sim' || t.completou === 'com_dificuldade').length
                return (
                  <tr key={d.perfil.nome}>
                    <td style={{ textAlign: 'left' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: d._color, display: 'inline-block', flexShrink: 0 }} />
                        {d.perfil.nome}
                      </span>
                    </td>
                    <td style={{ color: susColor(d.sus.sus_score), fontFamily: 'var(--mono)', fontWeight: 600 }}>
                      {d.sus.sus_score}
                    </td>
                    {d.tarefas.map(t => (
                      <td key={t.id}>
                        <span style={{ color: statusColor(t.completou), fontFamily: 'var(--mono)', fontSize: '.75rem', fontWeight: 700 }}>
                          {t.completou === 'sim' ? '✓' : t.completou === 'com_dificuldade' ? '~' : '✗'}
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: '.63rem', display: 'block', fontFamily: 'var(--mono)' }}>
                          {t.tempo_segundos}s
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: '.63rem', display: 'block', fontFamily: 'var(--mono)' }}>
                          {t.cliques}×
                        </span>
                      </td>
                    ))}
                    <td style={{ color: successN === 6 ? 'var(--ok)' : successN >= 4 ? 'var(--warn)' : 'var(--danger)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                      {successN}/6
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{avgTime}s</td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{avgClicks}×</td>
                    <td style={{ color: likertColor(avgLikert), fontFamily: 'var(--mono)', fontWeight: 600 }}>{avgLikert}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }} />
    </div>
  )
}
