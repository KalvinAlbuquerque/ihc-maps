import { Bar } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import { TASKS, TASK_META, susColor, susLabel, statusColor, likertColor, CHART_OPTS } from '../utils'

/* ── Age group order ─────────────────────────────────────────── */
const AGE_ORDER = ['18-25', '26-35', '36-50', '50+']

function groupByAge(data) {
  const map = {}
  data.forEach(d => {
    const g = d.perfil.faixa_etaria
    if (!map[g]) map[g] = []
    map[g].push(d)
  })
  return AGE_ORDER.filter(g => map[g]).map(g => ({ label: g, members: map[g] }))
}

function groupMetrics(members) {
  const allTasks   = members.flatMap(d => d.tarefas)
  const avgSus     = +(members.reduce((s, d) => s + d.sus.sus_score, 0) / members.length).toFixed(1)
  const successPct = Math.round(allTasks.filter(t => t.completou === 'sim').length / allTasks.length * 100)
  const avgTime    = +(allTasks.reduce((a, t) => a + t.tempo_segundos, 0) / allTasks.length).toFixed(1)
  const avgLikert  = +(allTasks.reduce((a, t) => a + t.likert_media,   0) / allTasks.length).toFixed(1)
  return { avgSus, successPct, avgTime, avgLikert }
}

/* ── Group Card ──────────────────────────────────────────────── */
function GroupCard({ group }) {
  const { avgSus, successPct, avgTime, avgLikert } = groupMetrics(group.members)
  const navigate = useNavigate()
  const sc = susColor(avgSus)
  const successColor = successPct >= 70 ? 'var(--ok)' : successPct >= 50 ? 'var(--warn)' : 'var(--danger)'

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <span className="card-title" style={{ fontFamily: 'var(--mono)' }}>{group.label}</span>
        <span className="card-sub">{group.members.length} participante{group.members.length !== 1 ? 's' : ''}</span>
      </div>

      {/* mini stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem', marginBottom: '1rem' }}>
        {[
          { label: 'SUS Médio',    val: avgSus,          color: sc },
          { label: 'Sucesso',      val: `${successPct}%`, color: successColor },
          { label: 'T. Médio',     val: `${avgTime}s`,    color: undefined },
          { label: 'Likert Médio', val: avgLikert,        color: likertColor(avgLikert) },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface2)', borderRadius: '6px', padding: '.6rem .7rem' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '.25rem' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: 700, color: s.color || 'var(--text)' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* task success per task for this group */}
      <div style={{ display: 'flex', gap: '.3rem', marginBottom: '.9rem', flexWrap: 'wrap' }}>
        {TASKS.map((tid, i) => {
          const tasksForTid = group.members.map(d => d.tarefas[i]).filter(Boolean)
          const ok   = tasksForTid.filter(t => t.completou === 'sim').length
          const dif  = tasksForTid.filter(t => t.completou === 'com_dificuldade').length
          const fail = tasksForTid.filter(t => t.completou === 'nao').length
          const topColor = ok === tasksForTid.length ? 'var(--ok)' : fail > 0 ? 'var(--danger)' : 'var(--warn)'
          const avgT = +(tasksForTid.reduce((a, t) => a + t.tempo_segundos, 0) / tasksForTid.length).toFixed(0)
          const avgC = +(tasksForTid.reduce((a, t) => a + t.cliques, 0) / tasksForTid.length).toFixed(1)
          const meta = TASK_META[tid]
          const overT = avgT > meta.tempo
          const overC = avgC > meta.cliques
          return (
            <div key={tid} style={{ flex: '1 1 0', minWidth: 56, background: 'var(--surface3)', borderRadius: '4px', padding: '.4rem .35rem', textAlign: 'center', border: `1px solid ${topColor}22` }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', marginBottom: '.2rem' }}>{tid}</div>
              <div style={{ fontSize: '.62rem', fontFamily: 'var(--mono)', color: topColor, fontWeight: 700 }}>
                {ok}✓{dif > 0 ? ` ${dif}~` : ''}{fail > 0 ? ` ${fail}✗` : ''}
              </div>
              <div style={{ fontSize: '.58rem', fontFamily: 'var(--mono)', color: overT ? 'var(--warn)' : 'var(--muted)', marginTop: '.15rem' }}>
                {avgT}s
              </div>
              <div style={{ fontSize: '.58rem', fontFamily: 'var(--mono)', color: overC ? 'var(--warn)' : 'var(--muted)' }}>
                {avgC}×
              </div>
            </div>
          )
        })}
      </div>

      {/* participants */}
      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
        {group.members.map(d => (
          <button
            key={d.perfil.nome}
            onClick={() => navigate(`/participant/${encodeURIComponent(d.perfil.nome)}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.4rem',
              background: d._color + '12', border: `1px solid ${d._color}30`,
              borderRadius: '6px', padding: '.3rem .65rem', cursor: 'pointer',
              fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'var(--text2)',
              transition: 'border-color .12s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = d._color + '70'}
            onMouseLeave={e => e.currentTarget.style.borderColor = d._color + '30'}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: d._color, display: 'inline-block' }} />
            {d.perfil.nome}
            <span style={{ color: susColor(d.sus.sus_score), fontWeight: 600 }}>{d.sus.sus_score}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────── */
export default function Demographics({ data }) {
  if (!data.length) return (
    <div className="full-center">
      <span className="muted mono" style={{ fontSize: '.78rem' }}>Sem dados carregados.</span>
    </div>
  )

  const groups = groupByAge(data)

  // Bar chart — SUS by age group
  const susChartData = {
    labels: groups.map(g => g.label),
    datasets: [{
      label: 'SUS Médio',
      data: groups.map(g => groupMetrics(g.members).avgSus),
      backgroundColor: groups.map(g => {
        const s = groupMetrics(g.members).avgSus
        return susColor(s) + '28'
      }),
      borderColor: groups.map(g => susColor(groupMetrics(g.members).avgSus)),
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  }

  const susOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { ...CHART_OPTS.plugins, legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a0a0a0', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        min: 0, max: 105,
        grid: { color: 'rgba(255,255,255,.04)' },
        ticks: { color: '#5a5a5a', font: { size: 10, family: "'IBM Plex Mono', monospace" } },
        border: { display: false },
      },
    },
  }

  // Bar chart — Success % by age group
  const successChartData = {
    labels: groups.map(g => g.label),
    datasets: [{
      label: 'Taxa de Sucesso (%)',
      data: groups.map(g => groupMetrics(g.members).successPct),
      backgroundColor: groups.map(g => {
        const p = groupMetrics(g.members).successPct
        return (p >= 70 ? '#4ade80' : p >= 50 ? '#fbbf24' : '#f87171') + '28'
      }),
      borderColor: groups.map(g => {
        const p = groupMetrics(g.members).successPct
        return p >= 70 ? '#4ade80' : p >= 50 ? '#fbbf24' : '#f87171'
      }),
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  }

  const successOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { ...CHART_OPTS.plugins, legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a0a0a0', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        min: 0, max: 105,
        grid: { color: 'rgba(255,255,255,.04)' },
        ticks: {
          color: '#5a5a5a',
          font: { size: 10, family: "'IBM Plex Mono', monospace" },
          callback: v => `${v}%`,
        },
        border: { display: false },
      },
    },
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Análise</div>
        <h1 className="page-title">Por Faixa Etária</h1>
        <p className="page-sub">{groups.length} grupos · {data.length} participantes</p>
      </div>

      {/* ── Charts ── */}
      <div className="grid-2">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">SUS Médio por Faixa</span>
          </div>
          <div style={{ height: 180 }}>
            <Bar data={susChartData} options={susOpts} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Taxa de Sucesso por Faixa</span>
          </div>
          <div style={{ height: 180 }}>
            <Bar data={successChartData} options={successOpts} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '.75rem' }} />

      {/* ── Aggregate comparison table ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Resumo por Faixa Etária</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="cmp-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Faixa</th>
                <th>N</th>
                <th>SUS Médio</th>
                <th>Sucesso</th>
                {TASKS.map(t => <th key={t}>{t}</th>)}
                <th>T. Médio</th>
                <th>Likert</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => {
                const m = groupMetrics(g.members)
                const sc = susColor(m.avgSus)
                const successColor = m.successPct >= 70 ? 'var(--ok)' : m.successPct >= 50 ? 'var(--warn)' : 'var(--danger)'
                return (
                  <tr key={g.label}>
                    <td style={{ textAlign: 'left', fontFamily: 'var(--mono)', fontWeight: 600 }}>{g.label}</td>
                    <td style={{ color: 'var(--muted)' }}>{g.members.length}</td>
                    <td style={{ color: sc, fontFamily: 'var(--mono)', fontWeight: 600 }}>{m.avgSus}</td>
                    <td style={{ color: successColor, fontFamily: 'var(--mono)', fontWeight: 600 }}>{m.successPct}%</td>
                    {TASKS.map((tid, i) => {
                      const tasks = g.members.map(d => d.tarefas[i]).filter(Boolean)
                      const ok   = tasks.filter(t => t.completou === 'sim').length
                      const fail = tasks.filter(t => t.completou === 'nao').length
                      const color = ok === tasks.length ? 'var(--ok)' : fail > 0 ? 'var(--danger)' : 'var(--warn)'
                      const avgT = +(tasks.reduce((a, t) => a + t.tempo_segundos, 0) / tasks.length).toFixed(0)
                      const avgC = +(tasks.reduce((a, t) => a + t.cliques, 0) / tasks.length).toFixed(1)
                      const meta = TASK_META[tid]
                      const overT = avgT > meta.tempo
                      const overC = avgC > meta.cliques
                      return (
                        <td key={tid} style={{ fontFamily: 'var(--mono)', verticalAlign: 'middle' }}>
                          <div style={{ color, fontWeight: 600 }}>{ok}/{tasks.length}</div>
                          <div style={{ fontSize: '.65rem', color: overT ? 'var(--warn)' : 'var(--muted)' }}>{avgT}s</div>
                          <div style={{ fontSize: '.65rem', color: overC ? 'var(--warn)' : 'var(--muted)' }}>{avgC}×</div>
                        </td>
                      )
                    })}
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{m.avgTime}s</td>
                    <td style={{ color: likertColor(m.avgLikert), fontFamily: 'var(--mono)', fontWeight: 600 }}>{m.avgLikert}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '.75rem' }} />

      {/* ── Group cards ── */}
      <div className="grid-2">
        {groups.map(g => <GroupCard key={g.label} group={g} />)}
      </div>

      <div style={{ marginBottom: '1rem' }} />
    </div>
  )
}
