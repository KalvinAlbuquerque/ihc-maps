import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useTestData } from './useTestData'
import { susColor, statusColor } from './utils'
import Overview      from './pages/Overview'
import Detail        from './pages/Detail'
import Compare       from './pages/Compare'
import Demographics  from './pages/Demographics'
import Prototype     from './pages/Prototype'
import Presentation  from './pages/Presentation'
import Guide         from './pages/Guide'

/* ── Icons ───────────────────────────────────────────────────── */
const I = {
  overview:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0" y="0" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".7"/><rect x="7.5" y="0" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".7"/><rect x="0" y="7.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity=".7"/><rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1.5" fill="currentColor"/></svg>,
  compare:   <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><path d="M2 2h4v9H2zM7 4h4v7H7z" opacity=".7"/></svg>,
  prototype: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="2" y="1" width="9" height="11" rx="2"/><path d="M5 4h3M5 6.5h2" opacity=".7"/></svg>,
  present:   <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><path d="M1 1h11v7H1z" opacity=".7"/><path d="M6.5 8v3M4.5 11h4"/></svg>,
  demo:      <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><circle cx="3" cy="4" r="2" opacity=".7"/><circle cx="10" cy="4" r="2" opacity=".5"/><path d="M1 11c0-1.66 1.34-3 3-3s3 1.34 3 3" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 9.5c.45-.32 1-.5 1.5-.5a3 3 0 013 3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5"/></svg>,
  guide:     <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><path d="M2 1h9v11H2z" opacity=".5"/><path d="M4 4h5M4 6h5M4 8h3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
}

/* ── Sidebar component ───────────────────────────────────────── */
function Sidebar({ data, compareSet, onToggleCompare, onReload }) {
  const sorted = [...data].sort((a, b) => b.sus.sus_score - a.sus.sus_score)
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-tag">IHC · UNEB 2026</span>
        <div className="brand-name">Google Maps<br /><span>Usabilidade</span></div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navegação</span>

        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          {I.overview} Visão Geral
        </NavLink>

        <NavLink to="/demographics" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          {I.demo} Faixa Etária
        </NavLink>

        <NavLink to="/compare" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          {I.compare} Comparativo
          {compareSet.size >= 2 && (
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '.6rem', background: 'var(--surface3)', border: '1px solid var(--border2)', borderRadius: '3px', padding: '.1rem .3rem', color: 'var(--text2)' }}>
              {compareSet.size}
            </span>
          )}
        </NavLink>

        <NavLink to="/prototype" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          {I.prototype} Protótipo
        </NavLink>

        <NavLink to="/present" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          {I.present} Apresentação
        </NavLink>

        <NavLink to="/guide" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          {I.guide} Guia Técnico
        </NavLink>

        <a href="/teste.html" target="_blank" rel="noopener" className="nav-link" style={{ textDecoration: 'none' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="1" width="11" height="11" rx="2"/><path d="M4.5 6.5h4M6.5 4.5v4" opacity=".7"/></svg>
          Aplicar Teste
        </a>

        <div className="nav-divider" />
        <span className="nav-section-label">Participantes · {data.length}</span>
      </nav>

      <div className="sidebar-participants">
        {sorted.map(d => {
          const sc = susColor(d.sus.sus_score)
          const inCmp = compareSet.has(d.perfil.nome)
          return (
            <button
              key={d.perfil.nome}
              className={`p-nav-item${inCmp ? ' active' : ''}`}
              onClick={() => navigate(`/participant/${encodeURIComponent(d.perfil.nome)}`)}
            >
              <span
                className="p-nav-dot"
                style={{ background: d._color }}
              />
              <span className="p-nav-name">{d.perfil.nome}</span>
              <span className="p-nav-sus" style={{ color: sc }}>{d.sus.sus_score}</span>
              <input
                type="checkbox"
                checked={inCmp}
                onChange={() => onToggleCompare(d.perfil.nome)}
                onClick={e => e.stopPropagation()}
                title="Adicionar ao comparativo"
                style={{ accentColor: 'var(--text2)', cursor: 'pointer', marginLeft: '.2rem' }}
              />
            </button>
          )
        })}
      </div>

      {compareSet.size >= 2 && (
        <div style={{ padding: '0 .75rem .5rem' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
            onClick={() => navigate('/compare')}
          >
            Comparar {compareSet.size}
          </button>
        </div>
      )}

      <div className="sidebar-footer">
        <button className="btn-reload" onClick={onReload}>↺ Recarregar</button>
        <span style={{ fontSize: '.62rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          {data.length} teste{data.length !== 1 ? 's' : ''}
        </span>
      </div>
    </aside>
  )
}

/* ── Detail route wrapper ───────────────────────────────────── */
function DetailRoute({ data }) {
  const { name } = useParams()
  const d = data.find(p => p.perfil.nome === decodeURIComponent(name))
  const navigate = useNavigate()
  if (!d) return <div className="full-center"><span className="muted mono">Participante não encontrado.</span></div>
  return <Detail data={d} onBack={() => navigate('/')} />
}

/* ── Root app ───────────────────────────────────────────────── */
export default function App() {
  const { data, loading, error, reload } = useTestData()
  const [compareSet, setCompareSet] = useState(new Set())

  function toggleCompare(name) {
    setCompareSet(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  if (loading) return (
    <div className="full-center">
      <div className="loading-dot" />
      <span className="muted mono" style={{ fontSize: '.75rem' }}>carregando testes…</span>
    </div>
  )

  if (error) return (
    <div className="full-center">
      <span style={{ color: 'var(--danger)', fontFamily: 'var(--mono)', fontSize: '.8rem' }}>erro: {error}</span>
      <button className="btn" style={{ marginTop: '.75rem' }} onClick={reload}>Tentar novamente</button>
    </div>
  )

  const compareData = data.filter(d => compareSet.has(d.perfil.nome))

  return (
    <BrowserRouter>
      <Routes>
        {/* Fullscreen presentation — no sidebar */}
        <Route path="/present" element={<Presentation data={data} />} />

        {/* Main layout with sidebar */}
        <Route path="/*" element={
          <div className="app">
            <Sidebar
              data={data}
              compareSet={compareSet}
              onToggleCompare={toggleCompare}
              onReload={reload}
            />
            <main className="app-main">
              <Routes>
                <Route path="/"                  element={<Overview      data={data} />} />
                <Route path="/participant/:name" element={<DetailRoute   data={data} />} />
                <Route path="/demographics"      element={<Demographics  data={data} />} />
                <Route path="/compare"           element={<Compare       data={compareData} />} />
                <Route path="/prototype"         element={<Prototype />} />
                <Route path="/guide"             element={<Guide />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
