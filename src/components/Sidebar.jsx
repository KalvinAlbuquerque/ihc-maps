import { susColor, statusColor } from '../utils'

export default function Sidebar({ data, view, activeDetail, compareSet, onOverview, onDetail, onToggleCompare, onCompare, onReload }) {
  const sorted = [...data].sort((a, b) => b.sus.sus_score - a.sus.sus_score)

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <span className="badge">IHC · UNEB 2026</span>
        <h1 className="sidebar-title">Google Maps<br /><span>Usabilidade</span></h1>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-btn ${view === 'overview' ? 'nav-btn-active' : ''}`}
          onClick={onOverview}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="0" y="0" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".7"/>
            <rect x="7.5" y="0" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".7"/>
            <rect x="0" y="7.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".7"/>
            <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1.5" fill="currentColor"/>
          </svg>
          Visão Geral
        </button>
      </nav>

      <p className="sidebar-section-label">PARTICIPANTES · {data.length}</p>

      <div className="p-list">
        {sorted.map(d => {
          const name   = d.perfil.nome
          const sus    = d.sus.sus_score
          const active = view === 'detail' && activeDetail === name
          const inCmp  = compareSet.has(name)
          const sc     = susColor(sus)

          return (
            <div key={name} className={`p-card${active ? ' p-card-active' : ''}${inCmp ? ' p-card-cmp' : ''}`}>
              <input
                type="checkbox" className="p-check"
                checked={inCmp} onChange={() => onToggleCompare(name)}
                onClick={e => e.stopPropagation()}
                title="Adicionar à comparação"
              />

              <div
                className="p-avatar"
                style={{ background: d._color + '22', border: `1.5px solid ${d._color}55`, color: d._color }}
              >
                {name[0]}
              </div>

              <div className="p-info" onClick={() => onDetail(name)}>
                <div className="p-name">{name}</div>
                <div className="p-meta">{d.perfil.faixa_etaria} · {d.perfil.nivel_experiencia}</div>
                <div className="p-pip-row">
                  {d.tarefas.map(t => (
                    <span key={t.id} className="p-pip" style={{ background: statusColor(t.completou) + 'bb' }} title={`${t.id}: ${t.completou}`} />
                  ))}
                </div>
              </div>

              <span
                className="p-sus-badge"
                style={{ color: sc, borderColor: sc + '44', background: sc + '14' }}
                title={`SUS: ${sus}`}
              >
                {sus}
              </span>
            </div>
          )
        })}
      </div>

      {compareSet.size >= 2 && (
        <div style={{ padding: '0 .75rem' }}>
          <button className="btn-compare" onClick={onCompare}>
            ⇄ Comparar {compareSet.size} participantes
          </button>
        </div>
      )}

      <div className="sidebar-footer">
        <button className="btn-reload" onClick={onReload}>↺ Recarregar</button>
        <span className="muted" style={{ fontSize: '.66rem', fontFamily: 'var(--mono)' }}>
          {data.length} arquivo{data.length !== 1 ? 's' : ''}
        </span>
      </div>
    </aside>
  )
}
