import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TASK_META, susColor, susLabel, statusColor, likertColor } from '../utils'

const avg  = (arr, fn) => +(arr.reduce((s, x) => s + fn(x), 0) / arr.length).toFixed(1)
const spct = tasks => Math.round(tasks.filter(t => t.completou === 'sim').length / tasks.length * 100)

/* ── 1 — Capa ────────────────────────────────────────────────── */
function S1() {
  return (
    <>
      <div className="slide-eyebrow">IHC · UNEB 2026</div>
      <h1 className="slide-title">Google Maps<br />Análise de Usabilidade</h1>
      <p className="slide-body">
        7 participantes · 6 tarefas cronometradas<br />
        SUS · Likert por tarefa · Think-aloud · Inspeção heurística
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
        {['Kalvin Albuquerque', 'Glenda Santana', 'Ana Carolina Estrela', 'Isabel Veloso'].map(n => (
          <span key={n} style={{
            fontFamily: 'var(--mono)', fontSize: '.68rem', color: 'var(--muted)',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 4, padding: '.25rem .65rem',
          }}>{n}</span>
        ))}
      </div>
    </>
  )
}

/* ── 2 — Contexto ────────────────────────────────────────────── */
function S2() {
  return (
    <>
      <div className="slide-eyebrow">Contexto</div>
      <h1 className="slide-title">Por que avaliar o Google Maps?</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', maxWidth: 700 }}>
        {[
          { label: 'Escala',      title: '+1 bilhão de usuários',  desc: 'Plataforma de navegação mais usada no mundo. Roteirização turn-by-turn, busca de POIs, tráfego em tempo real.' },
          { label: 'Criticidade', title: 'Atenção dividida',       desc: 'Condutor precisa processar instruções em segundos enquanto monitora a via. Falha de usabilidade = risco de segurança.' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.2rem' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.5rem' }}>{c.label}</div>
            <div style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: '.3rem' }}>{c.title}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--text2)', lineHeight: 1.55 }}>{c.desc}</div>
          </div>
        ))}
        <div style={{ gridColumn: '1 / -1', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.2rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.65rem' }}>Funcionalidades avaliadas</div>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {['Busca inteligente com autocomplete', 'Seleção e visão geral de rotas', 'Navegação ativa (voz + visual)', 'Alertas e reporte de incidentes'].map(f => (
              <span key={f} style={{ fontSize: '.78rem', color: 'var(--text2)', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 4, padding: '.2rem .65rem' }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── 3 — Metodologia ─────────────────────────────────────────── */
function S3() {
  const methods = [
    { code: 'Teste moderado',    label: 'Usabilidade',            desc: '6 tarefas cronometradas. Participante pensa em voz alta (Think-aloud). Avaliador registra tempo e cliques.' },
    { code: 'SUS',               label: 'System Usability Scale', desc: '10 questões pós-teste · escala 0–100 · percepção geral do sistema.' },
    { code: 'Likert pós-tarefa', label: 'Satisfação por tarefa',  desc: '5 afirmações imediatamente após cada tarefa · escala 1–5.' },
    { code: 'Heurísticas',       label: '10 de Nielsen',          desc: 'Inspeção estruturada com escala de severidade 0–4. Avaliação independente dos testes com usuários.' },
  ]
  return (
    <>
      <div className="slide-eyebrow">Metodologia</div>
      <h1 className="slide-title">Como avaliamos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', marginTop: '1.5rem', maxWidth: 680 }}>
        {methods.map(m => (
          <div key={m.code} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.2rem' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.3rem' }}>{m.code}</div>
            <div style={{ fontSize: '.92rem', fontWeight: 600, color: 'var(--text)', marginBottom: '.25rem' }}>{m.label}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--text2)', lineHeight: 1.55 }}>{m.desc}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── 4 — Participantes ───────────────────────────────────────── */
function S4({ data }) {
  const sorted = [...data].sort((a, b) => b.sus.sus_score - a.sus.sus_score)
  return (
    <>
      <div className="slide-eyebrow">Participantes</div>
      <h1 className="slide-title">{data.length} perfis testados</h1>
      <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
        {sorted.map(d => (
          <div key={d.perfil.nome} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '.85rem 1rem', minWidth: 152 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.45rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: d._color + '18', color: d._color, border: `1px solid ${d._color}3a`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--mono)', fontSize: '.72rem', fontWeight: 700,
              }}>{d.perfil.nome}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '.8rem' }}>{d.perfil.faixa_etaria}</div>
                <div style={{ fontSize: '.68rem', color: 'var(--muted)' }}>{d.perfil.nivel_experiencia}</div>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: susColor(d.sus.sus_score), fontSize: '.88rem' }}>{d.sus.sus_score}</span>
            </div>
            <div style={{ fontSize: '.7rem', color: 'var(--muted)', marginBottom: '.4rem' }}>
              {d.perfil.frequencia_uso}
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {d.tarefas.map(t => (
                <span key={t.id} style={{ width: 9, height: 4, borderRadius: 2, background: statusColor(t.completou), display: 'inline-block' }} title={t.id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── 5 — Resultados gerais ───────────────────────────────────── */
function S5({ data }) {
  const allTasks = data.flatMap(d => d.tarefas)
  const avgSus   = avg(data, d => d.sus.sus_score)
  const susMin   = Math.min(...data.map(d => d.sus.sus_score))
  const susMax   = Math.max(...data.map(d => d.sus.sus_score))
  const sp       = spct(allTasks)
  const at       = avg(allTasks, t => t.tempo_segundos)
  const al       = avg(allTasks, t => t.likert_media)

  const stats = [
    { label: 'SUS Médio',       value: avgSus,   sub: `${susLabel(avgSus)} · variação ${susMin}–${susMax}`, color: susColor(avgSus) },
    { label: 'Taxa de Sucesso', value: `${sp}%`, sub: 'tarefas completadas',                                color: sp >= 70 ? 'var(--ok)' : 'var(--warn)' },
    { label: 'Tempo Médio',     value: `${at}s`, sub: 'por tarefa',                                         color: undefined },
    { label: 'Likert Médio',    value: al,       sub: 'satisfação 1–5',                                     color: likertColor(al) },
  ]
  return (
    <>
      <div className="slide-eyebrow">Resultados</div>
      <h1 className="slide-title">Visão geral · {data.length} participantes</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.85rem', marginTop: '1.5rem', maxWidth: 780 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.1rem' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.5rem' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: s.color || 'var(--text)', marginBottom: '.3rem' }}>{s.value}</div>
            <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── 6 — Tarefas críticas ────────────────────────────────────── */
function S6({ data }) {
  const COLS = [
    { tid: 'T3', i: 2, label: 'Rota sem pedágio' },
    { tid: 'T4', i: 3, label: 'Reportar incidente' },
  ]
  return (
    <>
      <div className="slide-eyebrow">Pontos críticos</div>
      <h1 className="slide-title">T3 e T4 — 71% de sucesso, maiores desvios</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.4rem', maxWidth: 820 }}>
        {COLS.map(({ tid, i, label }) => {
          const meta   = TASK_META[tid]
          const sorted = [...data].sort((a, b) => b.tarefas[i].tempo_segundos - a.tarefas[i].tempo_segundos)
          return (
            <div key={tid} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', marginBottom: '.8rem' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', fontWeight: 700, background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 4, padding: '.1rem .4rem', color: 'var(--text2)' }}>{tid}</span>
                <span style={{ fontSize: '.88rem', fontWeight: 600 }}>{label}</span>
              </div>
              {sorted.map(d => {
                const t    = d.tarefas[i]
                const overT = !t.dentro_meta_tempo
                const overC = !t.dentro_meta_cliques
                const sc   = statusColor(t.completou)
                const icon = t.completou === 'sim' ? '✓' : t.completou === 'com_dificuldade' ? '~' : '✗'
                return (
                  <div key={d.perfil.nome} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.38rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: sc, fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '.78rem', width: 13 }}>{icon}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.78rem', flex: 1 }}>{d.perfil.nome}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: overT ? 'var(--warn)' : 'var(--muted)' }}>{t.tempo_segundos}s</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: overC ? 'var(--warn)' : 'var(--muted)' }}>{t.cliques}×</span>
                  </div>
                )
              })}
              <div style={{ marginTop: '.45rem', fontSize: '.68rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                meta: {meta.tempo}s · {meta.cliques} cliques
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── 7 — Faixa etária ────────────────────────────────────────── */
function S7({ data }) {
  const ORDER = ['18-25', '26-35', '36-50', '50+']
  const map   = {}
  data.forEach(d => { const g = d.perfil.faixa_etaria; if (!map[g]) map[g] = []; map[g].push(d) })
  const groups = ORDER.filter(g => map[g]).map(g => {
    const m = map[g], tasks = m.flatMap(d => d.tarefas)
    return {
      label: g, members: m,
      avgSus: avg(m, d => d.sus.sus_score),
      sp: spct(tasks),
      al: avg(tasks, t => t.likert_media),
    }
  })
  return (
    <>
      <div className="slide-eyebrow">Análise</div>
      <h1 className="slide-title">Nível de experiência &gt; faixa etária</h1>
      <div style={{ display: 'flex', gap: '.85rem', flexWrap: 'wrap', marginTop: '1.4rem' }}>
        {groups.map(g => {
          const sc         = susColor(g.avgSus)
          const successCol = g.sp >= 70 ? 'var(--ok)' : g.sp >= 50 ? 'var(--warn)' : 'var(--danger)'
          const niveis     = [...new Set(g.members.map(d => d.perfil.nivel_experiencia))]
          return (
            <div key={g.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.2rem', minWidth: 155 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.78rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '.6rem' }}>{g.label}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '1.75rem', fontWeight: 700, color: sc, lineHeight: 1 }}>{g.avgSus}</div>
              <div style={{ fontSize: '.68rem', color: 'var(--muted)', marginTop: '.18rem', marginBottom: '.55rem' }}>SUS · {susLabel(g.avgSus)}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '1.1rem', fontWeight: 700, color: successCol }}>{g.sp}%</div>
              <div style={{ fontSize: '.68rem', color: 'var(--muted)', marginTop: '.12rem', marginBottom: '.5rem' }}>taxa de sucesso</div>
              <div style={{ fontSize: '.68rem', color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: '.35rem' }}>{g.al} Likert</div>
              <div style={{ fontSize: '.65rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '.35rem' }}>
                {g.members.map(d => d.perfil.nome).join(', ')}<br />
                <span style={{ color: 'var(--text2)' }}>{niveis.join(' · ')}</span>
              </div>
            </div>
          )
        })}
      </div>
      <p style={{ marginTop: '1.1rem', fontSize: '.82rem', color: 'var(--text2)', maxWidth: 640, lineHeight: 1.65 }}>
        U5 e U6 têm a mesma faixa etária (36–50), mas U5 (Intermediário) concluiu todas as tarefas enquanto U6 (Iniciante) falhou em T3.
        O <strong style={{ color: 'var(--text)' }}>nível de experiência</strong> foi o fator determinante — não a idade.
      </p>
    </>
  )
}

/* ── 8 — Heurísticas ─────────────────────────────────────────── */
function S8() {
  const sevs = [
    { n: 1, label: 'Cosmético',      desc: 'corrigir se sobrar tempo',       col: 'var(--blue)' },
    { n: 2, label: 'Pequeno',        desc: 'baixa prioridade',               col: 'var(--warn)' },
    { n: 3, label: 'Grande',         desc: 'alta prioridade',                col: 'var(--danger)' },
    { n: 4, label: 'Catastrófico',   desc: 'corrigir antes de lançar',       col: '#c0392b' },
  ]
  const items = [
    { code: 'H10', sev: 2, principle: 'Heurística 10 — Ajuda e documentação',        label: 'Sem suporte durante o uso',      desc: 'Sem botão de ajuda acessível durante a navegação ativa. Tutorial inicial superficial e não revisitável.',                col: 'var(--danger)' },
    { code: 'H7',  sev: 1, principle: 'Heurística 7 — Flexibilidade e eficiência de uso', label: 'Atalhos inacessíveis',      desc: '"Evitar pedágios", "Adicionar parada" e "Reportar incidente" enterrados em menus secundários — barreira para iniciantes.', col: 'var(--warn)' },
    { code: 'H8',  sev: 1, principle: 'Heurística 8 — Estética e design minimalista', label: 'Densidade de informação elevada', desc: 'Telas de POI e seleção de rotas com muitos elementos simultâneos, criando barreira para iniciantes e faixa 50+.',          col: 'var(--warn)' },
    { code: 'H4',  sev: 1, principle: 'Heurística 4 — Consistência e padrões',       label: 'Inconsistências visuais pontuais', desc: 'Pequenas variações nos padrões visuais da interface — ponto de atenção menor, não compromete o fluxo principal.',           col: 'var(--blue)' },
  ]
  return (
    <>
      <div className="slide-eyebrow">Diagnóstico</div>
      <h1 className="slide-title">Problemas heurísticos</h1>

      <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap', marginTop: '1rem', marginBottom: '1rem' }}>
        {sevs.map(s => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', background: 'var(--surface)', border: `1px solid ${s.col}44`, borderRadius: 6, padding: '.28rem .7rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', fontWeight: 700, color: s.col }}>SEV {s.n}</span>
            <span style={{ fontSize: '.7rem', color: 'var(--text2)', fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: '.62rem', color: 'var(--muted)' }}>— {s.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem', maxWidth: 730 }}>
        {items.map(h => (
          <div key={h.code} style={{ display: 'flex', alignItems: 'flex-start', gap: '.9rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 7, padding: '.65rem 1rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', fontWeight: 700, color: h.col, background: h.col + '18', border: `1px solid ${h.col}33`, borderRadius: 4, padding: '.14rem .48rem', flexShrink: 0, marginTop: '.15rem' }}>{h.code}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', letterSpacing: '.04em', marginBottom: '.2rem' }}>{h.principle}</div>
              <div style={{ fontWeight: 600, fontSize: '.85rem', color: 'var(--text)', marginBottom: '.18rem' }}>{h.label}</div>
              <div style={{ fontSize: '.76rem', color: 'var(--text2)', lineHeight: 1.5 }}>{h.desc}</div>
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: h.sev >= 2 ? 'var(--danger)' : 'var(--warn)', flexShrink: 0, marginTop: '.15rem' }}>SEV {h.sev}</span>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '.85rem', fontSize: '.75rem', color: 'var(--muted)', maxWidth: 620, lineHeight: 1.6 }}>
        H1, H2, H3, H5, H6, H9 avaliados como <strong style={{ color: 'var(--ok)' }}>positivos (SEV 0)</strong> — boa base de usabilidade.
      </p>
    </>
  )
}

/* ── 9 — Proposta ────────────────────────────────────────────── */
function S9() {
  const props = [
    { code: 'H6',  col: 'var(--danger)', label: 'Filtros visíveis na seleção de rota', desc: 'Chips "Sem pedágio" e "Mais rápida" diretamente na tela de escolha de rota, antes de iniciar' },
    { code: 'H7',  col: 'var(--warn)',   label: 'Parada no bottom sheet',              desc: '"+ Adicionar parada" visível durante a navegação ativa, sem abrir menus secundários' },
    { code: 'H8',  col: 'var(--warn)',   label: 'Modo Fácil — 50+',                   desc: 'Busca e navegação com fonte e botões ampliados, somente ações essenciais em destaque' },
    { code: 'H10', col: 'var(--danger)', label: 'Ajuda contextual',                    desc: 'Botão ? flutuante no header de navegação com dicas sobre a funcionalidade da tela atual' },
  ]
  return (
    <>
      <div className="slide-eyebrow">Proposta</div>
      <h1 className="slide-title">Protótipo de melhorias</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.75rem', marginTop: '1.3rem', maxWidth: 700 }}>
        {props.map(p => (
          <div key={p.code} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '.95rem 1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', marginBottom: '.5rem' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', fontWeight: 700, color: p.col, background: p.col + '18', border: `1px solid ${p.col}33`, borderRadius: 3, padding: '.1rem .4rem' }}>{p.code}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: '.28rem' }}>{p.label}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--text2)', lineHeight: 1.55 }}>{p.desc}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1rem', fontSize: '.78rem', color: 'var(--muted)', fontFamily: 'var(--mono)', maxWidth: 540, lineHeight: 1.6 }}>
        Protótipo interativo disponível na aba Protótipo do dashboard.
      </p>
    </>
  )
}

/* ── 10 — Conclusão ──────────────────────────────────────────── */
function S10({ data }) {
  const avgSus = avg(data, d => d.sus.sus_score)
  return (
    <>
      <div className="slide-eyebrow">Conclusão</div>
      <h1 className="slide-title">O que encontramos</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginTop: '1.4rem', maxWidth: 700 }}>
        {[
          { icon: '✓', col: 'var(--ok)',    text: `SUS médio ${avgSus} (Boa). Pontos fortes: busca inteligente (T6 · Likert 4,63), navegação básica (T1) e cancelamento de rota — boa base para usuários experientes.` },
          { icon: '⚠', col: 'var(--warn)',  text: 'T3 e T4 tiveram 71% de sucesso, com tempo médio 2–4× acima da meta. "Evitar pedágios" e "Reportar incidente" estão enterrados em menus secundários — barreira crítica para iniciantes.' },
          { icon: '↑', col: 'var(--blue)',  text: 'Nível de experiência é o fator determinante, não a faixa etária. U5 e U6 (mesma faixa 36–50) tiveram resultados opostos: SUS 87,5 vs 47,5. U7 (50+, Iniciante): SUS 40,0 · 50% de conclusão.' },
          { icon: '→', col: 'var(--text2)', text: 'Proposta prioriza acessibilidade: Modo Fácil para 50+ com interface simplificada, filtros visíveis na tela de rota e ajuda contextual durante a navegação.' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '.85rem 1rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: item.col, flexShrink: 0, fontSize: '1rem', marginTop: '.05rem' }}>{item.icon}</span>
            <span style={{ fontSize: '.84rem', color: 'var(--text2)', lineHeight: 1.65 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
const TOTAL = 10

export default function Presentation({ data }) {
  const navigate  = useNavigate()
  const [idx, setIdx] = useState(0)

  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIdx(i => Math.min(TOTAL - 1, i + 1)), [])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
      else if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, prev, next])

  if (!data.length) return (
    <div className="presentation" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: '.8rem' }}>Sem dados carregados.</span>
    </div>
  )

  const slides = [
    <S1  key={0} />,
    <S2  key={1} />,
    <S3  key={2} />,
    <S4  key={3} data={data} />,
    <S5  key={4} data={data} />,
    <S6  key={5} data={data} />,
    <S7  key={6} data={data} />,
    <S8  key={7} />,
    <S9  key={8} />,
    <S10 key={9} data={data} />,
  ]

  return (
    <div className="presentation" tabIndex="-1">
      <div className="slide" key={idx}>
        {slides[idx]}
      </div>

      <div className="slide-nav" style={{ position: 'relative' }}>
        <button className="slide-btn exit" onClick={() => navigate('/')}>✕ Sair</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <button className="slide-btn" disabled={idx === 0} onClick={prev}>← Anterior</button>
          <span className="slide-counter">{idx + 1} / {TOTAL}</span>
          <button className="slide-btn" disabled={idx === TOTAL - 1} onClick={next}>Próximo →</button>
        </div>

        <div style={{ width: 90 }} />
        <div className="slide-progress" style={{ width: `${((idx + 1) / TOTAL) * 100}%` }} />
      </div>
    </div>
  )
}
