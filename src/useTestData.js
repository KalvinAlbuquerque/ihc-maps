import { useState, useEffect } from 'react'
import { PALETTE } from './utils'

const AGE_ORDER = ['18-25', '26-35', '36-50', '50+']

function anonymize(results) {
  const sorted = [...results].sort((a, b) => {
    const ai = AGE_ORDER.indexOf(a.perfil.faixa_etaria)
    const bi = AGE_ORDER.indexOf(b.perfil.faixa_etaria)
    if (ai !== bi) return ai - bi
    return b.sus.sus_score - a.sus.sus_score
  })
  return sorted.map((d, i) => ({
    ...d,
    perfil: { ...d.perfil, nome: `U${i + 1}` },
  }))
}

export function useTestData() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [tick, setTick]       = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        const { files } = await fetch('/testes/manifest.json').then(r => r.json())
        const results   = await Promise.all(
          files.map(f => fetch(`/testes/${f}`).then(r => r.json()))
        )
        if (!cancelled)
          setData(anonymize(results).map((d, i) => ({ ...d, _color: PALETTE[i % PALETTE.length] })))
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [tick])

  return { data, loading, error, reload: () => setTick(t => t + 1) }
}
