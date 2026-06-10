import { Bar } from 'react-chartjs-2'
import { TASK_META, SUS_Qs, susColor, susLabel, statusColor, likertColor, CHART_OPTS } from '../utils'

/* ── SUS Ring ────────────────────────────────────────────────── */
function SusRing({ score }) {
  const color = susColor(score)
  const R     = 34
  const circ  = 2 * Math.PI * R
  const fill  = (score / 100) * circ
  return (
    <div className="sus-ring-wrap">
      <svg className="sus-ring-svg" viewBox="0 0 88 88" style={{ width: '100%', height: '100%' }}>
        <circle cx="44" cy="44" r={R} stroke="rgba(255,255,255,.06)" strokeWidth="6" fill="none" />
        <circle
          cx="44" cy="44" r={R}
          stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
        />
      </svg>
      <div className="sus-ring-inner">
        <span className="sus-ring-score" style={{ color }}>{score}</span>
        <span className="sus-ring-label">{susLabel(score)}</span>
      </div>
    </div>
  )
}

/* ── Task Card ───────────────────────────────────────────────── */
function TaskCard({ task }) {
  const meta    = TASK_META[task.id]
  const lc      = likertColor(task.likert_media)
  const sc      = statusColor(task.completou)
  const icon    = task.completou === 'sim' ? '✓' : task.completou === 'com_dificuldade' ? '~' : '✗'
  const overT   = !task.dentro_meta_tempo
  const overC   = !task.dentro_meta_cliques

  return (
    <div className="task-card" style={{ borderLeftColor: sc }}>
      <div className="task-card-top">
        <span className="task-id">{task.id}</span>
        <span className="task-short">{meta.short}</span>
        <span style={{ color: sc, fontFamily: 'var(--mono)', fontSize: '.75rem', fontWeight: 700, marginLeft: 'auto' }}>{icon}</span>
      </div>
      <div className="task-metrics">
        <div className="metric-row">
          <span className="metric-lbl">Tempo</span>
          <span className="metric-val" style={overT ? { color: 'var(--warn)' } : {}}>{task.tempo_segundos}s</span>
          <span className="metric-meta">/ {meta.tempo}s</span>
        </div>
        <div className="metric-row">
          <span className="metric-lbl">Cliques</span>
          <span className="metric-val" style={overC ? { color: 'var(--warn)' } : {}}>{task.cliques}</span>
          <span className="metric-meta">/ {meta.cliques}</span>
        </div>
        <div className="metric-row">
          <span className="metric-lbl">Likert</span>
          <span className="metric-val" style={{ color: lc }}>{task.likert_media.toFixed(1)}</span>
          <div className="likert-track" style={{ flex: 1, marginLeft: '.3rem' }}>
            <div className="likert-fill" style={{ width: `${task.likert_media / 5 * 100}%`, background: lc }} />
          </div>
        </div>
      </div>
      {task.comentario && <p className="task-comment">"{task.comentario}"</p>}
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────── */
export default function Detail({ data }) {
  const { sus, perfil, tarefas } = data

  const avgTime   = +(tarefas.reduce((a, t) => a + t.tempo_segundos, 0) / tarefas.length).toFixed(1)
  const avgLikert = +(tarefas.reduce((a, t) => a + t.likert_media,   0) / tarefas.length).toFixed(1)
  const successN  = tarefas.filter(t => t.completou === 'sim').length

  // Likert bar chart
  const likertChartData = {
    labels: tarefas.map(t => TASK_META[t.id].short),
    datasets: [{
      label: 'Média Likert',
      data: tarefas.map(t => t.likert_media),
      backgroundColor: tarefas.map(t => likertColor(t.likert_media) + '28'),
      borderColor:     tarefas.map(t => likertColor(t.likert_media)),
      borderWidth: 1.5,
      borderRadius: 3,
    }],
  }

  const likertOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { ...CHART_OPTS.plugins, legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a0a0a0', font: { size: 10 } },
        border: { display: false },
      },
      y: {
        min: 0, max: 5,
        grid: { color: 'rgba(255,255,255,.04)' },
        ticks: { color: '#5a5a5a', stepSize: 1, font: { size: 10, family: "'IBM Plex Mono', monospace" } },
        border: { display: false },
      },
    },
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Participante</div>
        <h1 className="page-title">{perfil.nome}</h1>
        <p className="page-sub">{perfil.faixa_etaria} · {perfil.nivel_experiencia} · {perfil.frequencia_uso}</p>
      </div>

      {/* ── Hero ── */}
      <div className="detail-hero">
        <div
          className="detail-avatar"
          style={{ background: data._color + '18', color: data._color, borderColor: data._color + '3a' }}
        >
          {perfil.nome[0]}
        </div>

        <div className="detail-info">
          <div className="detail-name">{perfil.nome}</div>
          <div style={{ fontSize: '.72rem', color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: '.5rem' }}>
            {perfil.contexto_uso}
          </div>
          <div className="tag-row">
            {[perfil.faixa_etaria, perfil.nivel_experiencia, perfil.frequencia_uso].map(tag => (
              <span key={tag} className="tag tag-neutral">{tag}</span>
            ))}
          </div>
          <div className="detail-stats">
            <div className="mini-stat">
              <span className="mini-stat-val" style={{ color: successN === 6 ? 'var(--ok)' : successN >= 4 ? 'var(--warn)' : 'var(--danger)' }}>
                {successN}/6
              </span>
              <span className="mini-stat-lbl">Sucesso</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-val">{avgTime}s</span>
              <span className="mini-stat-lbl">T. Médio</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-val" style={{ color: likertColor(avgLikert) }}>{avgLikert}</span>
              <span className="mini-stat-lbl">Likert Médio</span>
            </div>
          </div>
        </div>

        <SusRing score={sus.sus_score} />
      </div>

      {/* ── Tasks ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Tarefas</span>
          <span className="card-sub">{successN}/{tarefas.length} concluídas</span>
        </div>
        <div className="tasks-grid">
          {tarefas.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      </div>

      {/* ── Likert chart + SUS breakdown ── */}
      <div className="grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Satisfação por Tarefa</span>
            <span className="card-sub">média Likert 1–5</span>
          </div>
          <div style={{ height: 200 }}>
            <Bar data={likertChartData} options={likertOpts} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">SUS · {sus.sus_score}</span>
            <span className="card-sub">{sus.classificacao}</span>
          </div>
          <div className="sus-list">
            {SUS_Qs.map((q, i) => {
              const raw    = sus.respostas[i]
              const contrib = q.t === 'pos' ? raw - 1 : 5 - raw
              const barPct  = (contrib / 4) * 100
              const bc      = contrib >= 3 ? '#4ade80' : contrib >= 2 ? '#60a5fa' : contrib >= 1 ? '#fbbf24' : '#f87171'
              return (
                <div key={i} className="sus-row">
                  <span className="sus-num">{i + 1}</span>
                  <span className="sus-q">{q.p}</span>
                  <span className={`sus-type ${q.t}`}>{q.t === 'pos' ? '+' : '−'}</span>
                  <span className="sus-val" style={{ color: bc }}>{raw}</span>
                  <div className="sus-bar-track">
                    <div className="sus-bar-fill" style={{ width: `${barPct}%`, background: bc }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }} />
    </div>
  )
}
