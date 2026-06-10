import { useState } from 'react'

/* ── Shared map SVG ──────────────────────────────────────────── */
function MapBg({ routeColor = '#1a73e8' }) {
  return (
    <div className="map-bg">
      <svg viewBox="0 0 280 480" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="480" fill="#e8e0d0"/>
        {[
          [10,10,60,55],[80,10,60,55],[150,10,80,55],[240,10,30,55],
          [10,80,40,60],[60,80,70,60],[140,80,60,60],[210,80,60,60],
          [10,155,80,55],[100,155,50,55],[160,155,80,55],[250,155,20,55],
          [10,225,60,70],[80,225,80,55],[170,225,50,70],[230,225,40,55],
          [10,310,100,45],[120,310,80,45],[210,310,60,45],
          [10,370,60,80],[80,370,80,45],[170,370,50,80],[230,370,40,45],
        ].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#d6cfc4" rx="2"/>
        ))}
        {[0,75,150,220,300,365,460].map((y,i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="280" y2={y} stroke="white" strokeWidth={y===150?4:5}/>
        ))}
        {[55,135,205].map((x,i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x} y2="480" stroke="white" strokeWidth="5"/>
        ))}
        <polyline
          points="135,480 135,365 205,365 205,220 135,220 135,150 205,150 205,75 280,75"
          fill="none" stroke={routeColor} strokeWidth="5"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="270" cy="65" r="9" fill={routeColor} opacity=".25"/>
        <circle cx="270" cy="65" r="5" fill={routeColor}/>
        <circle cx="135" cy="470" r="8" fill="white" stroke="#1a73e8" strokeWidth="2.5"/>
        <circle cx="135" cy="470" r="4" fill="#1a73e8"/>
      </svg>
    </div>
  )
}

/* ── Screen A0 — Busca ───────────────────────────────────────── */
function ScreenSearch() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'white', fontFamily: 'Roboto, sans-serif' }}>
      <div style={{ background: 'white', padding: '10px 10px 8px', boxShadow: '0 1px 4px rgba(0,0,0,.13)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f3f4', borderRadius: 24, padding: '8px 14px' }}>
          <span style={{ fontSize: 13, color: '#5f6368' }}>←</span>
          <span style={{ fontSize: 11, color: '#aaa', flex: 1 }}>Para onde?</span>
          <span style={{ fontSize: 12 }}>🎤</span>
        </div>
      </div>
      {[
        ['📍', 'Av. Brasil, 1200 — Salvador, BA'],
        ['🏥', 'Hospital Roberto Santos'],
        ['🛒', 'Shopping Iguatemi'],
        ['⭐', 'Casa (Rua das Flores, 45)'],
        ['🕐', 'Faculdade UNEB — Cabula'],
      ].map(([icon, label], i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 14px', borderBottom: '1px solid #f1f3f4',
        }}>
          <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{icon}</span>
          <span style={{ fontSize: 11, color: '#3c4043', flex: 1, lineHeight: 1.35 }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Screen A1 — Seleção de rota (H6) ───────────────────────── */
function ScreenRoute({ filter, setFilter }) {
  const filters = [
    { id: 'fast', label: '⚡ Mais rápida' },
    { id: 'toll', label: '✓ Sem pedágio' },
    { id: 'short', label: '📏 Menor' },
  ]
  const routes = [
    { name: 'Via Av. Brasil', time: '25 min', dist: '14 km', toll: '⚠ R$4,50 pedágio', hasToll: true },
    { name: 'Via Rua Secundária', time: '32 min', dist: '18 km', toll: '✓ Sem pedágio', hasToll: false },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'Roboto, sans-serif' }}>
      <MapBg />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'white', borderRadius: '16px 16px 0 0',
        padding: '10px 12px 0', boxShadow: '0 -2px 14px rgba(0,0,0,.15)',
      }}>
        <div style={{ width: 32, height: 3, background: '#e0e0e0', borderRadius: 2, margin: '0 auto 9px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#5f6368' }}>←</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#202124', flex: 1 }}>Hospital Roberto Santos</span>
        </div>
        {/* H6 — filter chips */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 9, overflowX: 'auto', paddingBottom: 1 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flexShrink: 0, padding: '4px 10px', borderRadius: 16,
              border: `1.5px solid ${filter === f.id ? '#1a73e8' : '#dadce0'}`,
              background: filter === f.id ? '#e8f0fe' : 'white',
              color: filter === f.id ? '#1a73e8' : '#5f6368',
              fontSize: 10, fontWeight: filter === f.id ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{f.label}</button>
          ))}
        </div>
        {routes.map((r, i) => {
          const dim = filter === 'toll' && r.hasToll
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 0', borderTop: i > 0 ? '1px solid #f1f3f4' : 'none',
              opacity: dim ? .35 : 1,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                background: dim ? '#f1f3f4' : '#e8f0fe',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
              }}>🚗</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#202124' }}>{r.name}</div>
                <div style={{ fontSize: 10, color: '#5f6368', marginTop: 1 }}>
                  {r.time} · {r.dist} ·{' '}
                  <span style={{ color: r.hasToll ? '#f29900' : '#1e8e3e' }}>{r.toll}</span>
                </div>
              </div>
              {!dim && !r.hasToll && <span style={{ fontSize: 9, color: '#1a73e8', fontWeight: 600 }}>✓ Ideal</span>}
            </div>
          )
        })}
        <div style={{ padding: '9px 0 14px' }}>
          <button style={{
            width: '100%', padding: '10px', borderRadius: 24,
            background: '#1a73e8', color: 'white',
            border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Iniciar</button>
        </div>
      </div>
    </div>
  )
}

/* ── Screen B0 — Navegação ativa (H7 + H10) ─────────────────── */
function ScreenNav({ help, setHelp }) {
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'Roboto, sans-serif' }}>
      <MapBg routeColor="#1e8e3e" />
      {/* H10 — nav bar with help button */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: '#1a73e8', padding: '9px 12px 7px',
        display: 'flex', alignItems: 'center', gap: 8, zIndex: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,.75)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Próximo</div>
          <div style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>→ Vire à direita em 300m</div>
        </div>
        <button
          onClick={() => setHelp(!help)}
          style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: help ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.15)',
            border: '1.5px solid rgba(255,255,255,.5)',
            color: 'white', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >?</button>
      </div>
      {/* H10 — help panel */}
      {help && (
        <div style={{
          position: 'absolute', top: 52, left: 8, right: 8,
          background: 'white', borderRadius: 10, padding: '10px 12px',
          boxShadow: '0 3px 14px rgba(0,0,0,.22)', zIndex: 30,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#202124', marginBottom: 7 }}>Central de Ajuda</div>
          {['Como adicionar uma parada?', 'Como evitar pedágios?', 'Reportar um incidente', 'Alterar rota atual'].map((item, i, arr) => (
            <div key={i} style={{
              fontSize: 10.5, color: '#1a73e8', padding: '5px 0',
              borderBottom: i < arr.length - 1 ? '1px solid #f1f3f4' : 'none',
            }}>{item}</div>
          ))}
        </div>
      )}
      {/* bottom sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'white', borderRadius: '16px 16px 0 0',
        padding: '10px 12px 16px', boxShadow: '0 -2px 14px rgba(0,0,0,.15)', zIndex: 20,
      }}>
        <div style={{ width: 32, height: 3, background: '#e0e0e0', borderRadius: 2, margin: '0 auto 9px' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#202124' }}>32 min</span>
            <span style={{ fontSize: 10, color: '#5f6368', marginLeft: 6 }}>Chega às 14:32 · 18 km</span>
          </div>
          <span style={{ fontSize: 9.5, color: '#1e8e3e', fontWeight: 600 }}>✓ Sem pedágio</span>
        </div>
        {/* H7 — Add stop */}
        <button style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          background: '#e8f0fe', border: '1.5px solid #1a73e8',
          color: '#1a73e8', fontSize: 11, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        }}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Adicionar parada
        </button>
      </div>
    </div>
  )
}

/* ── Screen B1 — Modo Fácil (H8) ────────────────────────────── */
function ScreenEasy() {
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: 'Roboto, sans-serif' }}>
      <MapBg routeColor="#1e8e3e" />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: '#1a73e8', padding: '14px 16px 16px', zIndex: 20,
      }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,.75)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 5 }}>Próxima direção</div>
        <div style={{ fontSize: 20, color: 'white', fontWeight: 700, lineHeight: 1.25 }}>→ Vire à direita em 300 m</div>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'white', borderRadius: '16px 16px 0 0',
        padding: '14px 16px 22px', boxShadow: '0 -2px 14px rgba(0,0,0,.15)', zIndex: 20,
      }}>
        <div style={{ width: 32, height: 3, background: '#e0e0e0', borderRadius: 2, margin: '0 auto 12px' }} />
        <div style={{ fontSize: 26, fontWeight: 700, color: '#202124', marginBottom: 3 }}>32 min</div>
        <div style={{ fontSize: 13, color: '#5f6368', marginBottom: 16 }}>Chega às 14:32 · 18 km · ✓ Sem pedágio</div>
        <button style={{
          width: '100%', padding: '14px', borderRadius: 12, marginBottom: 10,
          background: '#e8f0fe', border: '2px solid #1a73e8',
          color: '#1a73e8', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> Adicionar parada
        </button>
        <button style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: '#fce8e6', border: '2px solid #d93025',
          color: '#d93025', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>
          ✕ Encerrar rota
        </button>
      </div>
    </div>
  )
}

/* ── Screen B2 — Modo Fácil: Busca ──────────────────────────── */
function ScreenEasySearch() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'white', fontFamily: 'Roboto, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: '#1a73e8', padding: '14px 14px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 18, color: 'white', lineHeight: 1 }}>←</span>
        <div style={{
          flex: 1, background: 'white', borderRadius: 28,
          padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 16, color: '#5f6368' }}>🔍</span>
          <span style={{ fontSize: 14, color: '#aaa', flex: 1 }}>Para onde você quer ir?</span>
          <span style={{ fontSize: 20 }}>🎤</span>
        </div>
      </div>
      {/* Suggestions */}
      <div style={{ padding: '10px 0' }}>
        {[
          ['🏠', 'Casa', 'Rua das Flores, 45'],
          ['⭐', 'Favoritos', 'Farmácia, Mercado...'],
          ['🕐', 'Recentes', 'Hospital Roberto Santos'],
        ].map(([icon, title, sub], i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 18px',
            borderBottom: i < 2 ? '1px solid #f1f3f4' : 'none',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: '#e8f0fe', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20,
            }}>{icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>{title}</div>
              <div style={{ fontSize: 13, color: '#5f6368', marginTop: 2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Big mic button */}
      <div style={{ padding: '20px 18px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#5f6368', marginBottom: 12 }}>ou use a voz</div>
        <button style={{
          width: 64, height: 64, borderRadius: '50%',
          background: '#1a73e8', border: 'none',
          fontSize: 26, cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(26,115,232,.4)',
        }}>🎤</button>
      </div>
    </div>
  )
}

/* ── Annotation data ─────────────────────────────────────────── */
const ANNOTS = [
  {
    id: 'search', label: '1. Busca',
    heuristic: null, sev: null, sevLabel: null,
    title: 'Contexto: busca de destino',
    desc: 'Ponto de partida do fluxo. O usuário digita o destino normalmente. Esta etapa já funciona bem no Google Maps — nenhuma mudança aqui.',
    before: null, after: null, ref: null,
  },
  {
    id: 'route', label: '2. Seleção de rota',
    heuristic: 'H6 — Reconhecimento vs. Recall', sev: 'danger', sevLabel: 'SEV 3 · Crítico',
    title: 'Filtro "Sem pedágio" visível na tela de rota',
    desc: 'Na versão atual, evitar pedágios exige 3 toques em menus ocultos após iniciar a navegação. Trazer o filtro como chip aplica H6: o usuário reconhece a opção em vez de ter que lembrar onde ela está enterrada.',
    before: 'Iniciar → menu ··· → Opções de rota → Evitar pedágios (3 níveis, pós-início)',
    after: 'Chip "Sem pedágio" visível diretamente na tela de escolha de rota, antes de iniciar',
    ref: 'U7 (50+) — T3: 184s · 20 cliques · falhou\nU5 (36–50) — T3: 107s · 25 cliques · "a opção não estava fácil de ser acessada"',
  },
  {
    id: 'nav', label: '3. Navegação',
    heuristic: 'H7 · H10', sev: 'warn', sevLabel: 'SEV 2–3',
    title: 'Parada e ajuda em contexto',
    desc: 'Duas melhorias na tela de navegação ativa. Toque no "?" para ver a ajuda contextual (H10). "+ Adicionar parada" está visível diretamente, sem precisar abrir menus (H7).',
    before: '"Adicionar parada" escondido em ···; sem acesso à ajuda durante a rota',
    after: 'Botão de parada no bottom sheet; ícone ? no header de navegação',
    ref: 'U7 (50+) — T5: 276s · 30 cliques · desistiu\nU1 (18–25) — T5: 54s · Likert 2.4 (menor satisfação da sessão)',
  },
  {
    id: 'easy-search', label: '4. Modo Fácil — Busca',
    heuristic: 'H8 — Estética e Design Minimalista', sev: 'warn', sevLabel: 'SEV 2 · Moderado',
    title: 'Modo Fácil: busca simplificada',
    desc: 'A barra de busca padrão tem fonte pequena, sugestões densas e toque-alvo reduzido. No Modo Fácil a barra é maior, as sugestões são espaçadas com ícones ampliados e há um botão de voz em destaque — reduzindo a fricção logo no primeiro passo da navegação.',
    before: 'Barra de busca compacta, lista densa de sugestões com fonte pequena e ícone de microfone discreto',
    after: 'Barra ampliada no header, 3 sugestões espaçadas com ícone de 44px e botão de voz central em destaque',
    ref: 'U7 (50+) — T1: 68s · 11 cliques · "não sabia onde ficava o campo de busca no começo"',
  },
  {
    id: 'easy-nav', label: '5. Modo Fácil — Nav.',
    heuristic: 'H8 — Estética e Design Minimalista', sev: 'warn', sevLabel: 'SEV 2 · Moderado',
    title: 'Modo Fácil: navegação acessível para usuários idosos',
    desc: 'A interface padrão tem elementos visuais densos e botões pequenos, criando barreira para usuários 50+ e iniciantes. O Modo Fácil exibe somente as informações essenciais com tipografia e botões ampliados, reduzindo a carga cognitiva durante a condução.',
    before: 'Interface padrão com alta densidade de ícones, fonte pequena e menus encadeados',
    after: 'Fonte e botões ampliados; somente ações essenciais (Adicionar parada, Encerrar rota) em destaque',
    ref: 'U7 (50+) — SUS 40,0 · completou apenas 3/6 tarefas · Likert médio 1,57\nU6 (36–50, Iniciante) — SUS 47,5 · T3 não concluída',
  },
]

/* ── Main ────────────────────────────────────────────────────── */
export default function Prototype() {
  const [idx,    setIdx]    = useState(0)
  const [filter, setFilter] = useState('toll')
  const [help,   setHelp]   = useState(false)

  const annot = ANNOTS[idx]

  const screens = [
    <ScreenSearch     key="s"  />,
    <ScreenRoute      key="r"  filter={filter} setFilter={setFilter} />,
    <ScreenNav        key="n"  help={help} setHelp={setHelp} />,
    <ScreenEasySearch key="es" />,
    <ScreenEasy       key="e"  />,
  ]

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Solução proposta</div>
        <h1 className="page-title">Protótipo de Melhorias</h1>
        <p className="page-sub">H6 · H7 · H8 · H10 — fluxo unificado e realista</p>
      </div>

      <div className="proto-layout">

        {/* ── Annotations (left) ── */}
        <div className="proto-annot">
          <div className="annot-step-nav">
            {ANNOTS.map((a, i) => (
              <button
                key={a.id}
                className={`annot-step${idx === i ? ' active' : ''}`}
                onClick={() => setIdx(i)}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="annot-card">
            {annot.heuristic && (
              <div className={`annot-hpill ${annot.sev}`}>
                {annot.heuristic}&nbsp;&nbsp;·&nbsp;&nbsp;{annot.sevLabel}
              </div>
            )}
            <div className="annot-title">{annot.title}</div>
            <p className="annot-desc">{annot.desc}</p>

            {annot.before && (
              <div className="before-after">
                <div className="ba-card ba-before">
                  <span className="ba-label">Antes</span>
                  <p>{annot.before}</p>
                </div>
                <div className="ba-card ba-after">
                  <span className="ba-label">Depois</span>
                  <p>{annot.after}</p>
                </div>
              </div>
            )}

            {annot.ref && (
              <div className="annot-ref">
                <strong>Evidência nos testes:</strong><br />
                {annot.ref.split('\n').map((ln, i) => <span key={i}>{ln}<br /></span>)}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <button className="btn" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>
              ← Anterior
            </button>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--muted)' }}>
              {idx + 1} / {ANNOTS.length}
            </span>
            <button className="btn" disabled={idx === ANNOTS.length - 1} onClick={() => setIdx(i => i + 1)}>
              Próximo →
            </button>
          </div>
        </div>

        {/* ── Phone (right, sticky) ── */}
        <div className="proto-phone-wrap">
          <div className="phone">
            <div className="phone-di" />
            <div className="phone-status">
              <span className="phone-time">14:23</span>
              <span className="phone-icons">● ▲ ■■■</span>
            </div>
            <div className="phone-scr">
              {screens.map((scr, i) => (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  opacity:   i === idx ? 1 : 0,
                  transform: i === idx ? 'scale(1)' : 'scale(.97)',
                  transition: 'opacity .22s ease, transform .22s ease',
                  pointerEvents: i === idx ? 'auto' : 'none',
                }}>
                  {scr}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div style={{ marginBottom: '1rem' }} />
    </div>
  )
}
