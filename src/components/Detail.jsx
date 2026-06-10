import { Bar } from 'react-chartjs-2'
import { TASKS, TASK_META, SUS_Qs, susColor, susLabel, statusColor, statusLabel, likertColor, CHART_OPTS } from '../utils'

function SusRing({ score, color }) {
  const r    = 34
  const circ = 2 * Math.PI * r
  const off  = circ - (score / 100) * circ
  return (
    <div className="sus-ring-wrap">
      <svg className="sus-ring-svg" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="7" />
        <circle
          cx="45" cy="45" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={off}
          strokeLinecap="round" transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dashoffset .6s ease', filter: `drop-shadow(0 0 6px ${color}99)` }}
        />
      </svg>
      <div className="sus-ring-inner">
        <span className="sus-ring-score" style={{ color }}>{score}</span>
        <span className="sus-ring-label">SUS</span>
      </div>
    </div>
  )
}

export default function Detail({ data, onBack }) {
  const { perfil, tarefas, sus } = data
  const sc    = sus.sus_score
  const color = susColor(sc)

  // ── Likert chart (por tarefa) ────────────────────────────────
  const likertData = {
    labels: tarefas.map(t => TASK_META[t.id]?.short || t.id),
    datasets: [{
      label: 'Likert médio',
      data: tarefas.map(t => t.likert_media),
      backgroundColor: tarefas.map(t => likertColor(t.likert_media) + '99'),
      borderColor:     tarefas.map(t => likertColor(t.likert_media)),
      borderWidth: 2, borderRadius: 6, borderSkipped: false,
    }]
  }

  // ── Métricas gerais deste participante ───────────────────────
  const totalTarefas  = tarefas.length
  const concluidas    = tarefas.filter(t => t.completou === 'sim').length
  const avgLikert     = +(tarefas.reduce((a, t) => a + t.likert_media, 0) / totalTarefas).toFixed(2)
  const tasksPassed   = tarefas.filter(t => t.dentro_meta_tempo && t.dentro_meta_cliques).length

  return (
    <div className="view-wrap">
      <button className="back-btn" onClick={onBack}>← Voltar</button>

      {/* ── Hero ── */}
      <div className="detail-hero" style={{ background: `linear-gradient(135deg, ${data._color}0a 0%, var(--surface) 60%)`, borderColor: data._color + '33' }}>
        <div className="detail-hero-bg" style={{ '--hc-soft': data._color + '0d' }} />

        <div
          className="detail-avatar-lg"
          style={{ background: data._color + '1a', borderColor: data._color + '55', color: data._color }}
        >
          {perfil.nome[0]}
        </div>

        <div className="detail-info">
          <h2 className="detail-name">{perfil.nome}</h2>
          <div className="tag-row">
            {[perfil.faixa_etaria, perfil.nivel_experiencia, perfil.frequencia_uso, perfil.contexto_uso].map(t => (
              <span key={t} className="profile-tag">{t}</span>
            ))}
          </div>
          {/* mini-stats row */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '.75rem', flexWrap: 'wrap' }}>
            <MiniStat label="concluídas" value={`${concluidas}/${totalTarefas}`} color={data._color} />
            <MiniStat label="Likert médio" value={avgLikert} color={likertColor(avgLikert)} />
            <MiniStat label="dentro da meta" value={`${tasksPassed}/${totalTarefas}`} color={tasksPassed >= 4 ? '#4af09a' : '#f0a84a'} />
          </div>
        </div>

        <SusRing score={sc} color={color} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.2rem' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {susLabel(sc)}
          </span>
          <span style={{ fontSize: '.65rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{perfil.data || '—'}</span>
        </div>
      </div>

      {/* ── Task grid ── */}
      <div className="tasks-grid">
        {tarefas.map(t => {
          const m   = TASK_META[t.id] || {}
          const sc2 = statusColor(t.completou)
          const okT = t.tempo_segundos <= (m.tempo  || Infinity)
          const okC = t.cliques       <= (m.cliques || Infinity)
          return (
            <div key={t.id} className="task-card" style={{ '--tc': sc2, borderLeftColor: sc2 }}>
              <div className="task-card-top">
                <span className="task-id-chip">{t.id}</span>
                <span className="task-short">{m.short || t.titulo}</span>
                <span className="status-tag" style={{ color: sc2, borderColor: sc2 + '55', background: sc2 + '16' }}>
                  {statusLabel(t.completou)}
                </span>
              </div>

              <div className="task-metrics">
                <Metric label="Tempo"   value={`${t.tempo_segundos}s`} meta={m.tempo  ? `meta ${m.tempo}s` : null}  ok={okT} />
                <Metric label="Cliques" value={`${t.cliques}×`}        meta={m.cliques ? `meta ${m.cliques}` : null} ok={okC} />
                <div className="metric-row">
                  <span className="metric-lbl">Likert</span>
                  <span className="metric-val" style={{ color: likertColor(t.likert_media) }}>{t.likert_media.toFixed(1)}</span>
                  <span className="metric-meta">/5</span>
                  <div className="likert-track" style={{ flex: 1 }}>
                    <div className="likert-fill" style={{ width: `${(t.likert_media / 5) * 100}%`, background: likertColor(t.likert_media) }} />
                  </div>
                </div>
              </div>

              {t.comentario && <p className="task-comment">"{t.comentario}"</p>}
            </div>
          )
        })}
      </div>

      {/* ── Charts ── */}
      <div className="grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="section-header">
            <span className="section-dot" style={{ background: '#4af0c4' }} />
            <span className="section-title">Satisfação por Tarefa</span>
          </div>
          <div style={{ height: 200 }}>
            <Bar data={likertData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { ...CHART_OPTS.plugins, legend: { display: false } },
              scales: {
                x: { grid: { display: false }, ticks: { color: '#546278' } },
                y: { min: 0, max: 5.5, grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#546278' } },
              }
            }} />
          </div>
        </div>

        {/* SUS breakdown */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="section-header">
            <span className="section-dot" style={{ background: color }} />
            <span className="section-title">Respostas SUS</span>
            <span className="section-sub">{sus.classificacao || susLabel(sc)}</span>
          </div>
          <div className="sus-list">
            {SUS_Qs.map((q, i) => {
              const v = sus.respostas[i] || 0
              return (
                <div key={i} className="sus-row">
                  <span className="muted mono" style={{ fontSize: '.7rem', textAlign: 'right' }}>{i + 1}</span>
                  <span className="sus-q">{q.p}</span>
                  <span className={`sus-type-chip ${q.t}`}>{q.t}</span>
                  <span className="sus-val" style={{ color }}>{v}</span>
                  <div className="sus-bar-track">
                    <div className="sus-bar-fill" style={{ width: `${(v / 5) * 100}%`, background: color + '99' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, meta, ok }) {
  const vc = ok === undefined ? 'var(--text)' : ok ? '#4af09a' : '#f05a4a'
  return (
    <div className="metric-row">
      <span className="metric-lbl">{label}</span>
      <span className="metric-val" style={{ color: vc }}>{value}</span>
      {meta && <span className="metric-meta">{meta}</span>}
      {ok !== undefined && <span className="metric-ok" style={{ color: vc }}>{ok ? '✓' : '✗'}</span>}
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.06rem' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '.65rem', color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '.04em' }}>{label}</span>
    </div>
  )
}
