import { TASKS, TASK_META, SUS_Qs } from '../utils'

const TASK_LIKERT_Qs = [
  'Consegui completar a tarefa sem dificuldades.',
  'A interface mostrou claramente o que eu devia fazer.',
  'O número de passos necessários foi adequado.',
  'Fiquei confiante durante a execução da tarefa.',
  'Eu recomendaria esta funcionalidade para outra pessoa.',
]

const TASK_INSTRUCOES = {
  T1: 'Abra o Google Maps.\nBusque por "Aeroporto Internacional de Salvador"\ne inicie a navegação a partir da sua localização atual.',
  T2: 'Busque um restaurante de culinária japonesa próximo à sua localização atual\ne verifique o horário de funcionamento dele.',
  T3: 'Com qualquer destino já definido, compare as rotas alternativas disponíveis\ne selecione a opção "Evitar pedágios".',
  T4: 'Com uma rota ativa, reporte um incidente do tipo\n"Radar / Fiscalização" na via.',
  T5: 'Com uma rota ativa, adicione uma parada intermediária\nbuscando por "Posto de gasolina" no caminho.',
  T6: 'Na barra de busca, digite: "Shoppin Barra"\n(sem o "g" — erro proposital).\nVerifique se o autocomplete corrigiu e encontrou o local.',
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function CodeBlock({ children }) {
  return <div className="code-block">{children}</div>
}

function InlineCode({ children }) {
  return (
    <code style={{
      fontFamily: 'var(--mono)', fontSize: '.72rem',
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: '3px', padding: '.05rem .35rem', color: 'var(--text2)',
    }}>{children}</code>
  )
}

function Table({ head, rows }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '.75rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.78rem' }}>
        <thead>
          <tr>
            {head.map(h => (
              <th key={h} style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                padding: '.4rem .7rem', textAlign: 'left', fontFamily: 'var(--mono)',
                fontSize: '.62rem', color: 'var(--muted)', letterSpacing: '.06em',
                fontWeight: 500, whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  border: '1px solid var(--border)', padding: '.38rem .7rem',
                  color: 'var(--text2)', verticalAlign: 'top',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Guide() {
  return (
    <div className="guide-content">
      <div className="page-header">
        <div className="page-eyebrow">Documentação</div>
        <h1 className="page-title">Guia Técnico</h1>
        <p className="page-sub">Protocolo de testes · estrutura de dados · fórmulas</p>
      </div>

      {/* ── 1. Visão geral ── */}
      <Section title="1. Visão geral">
        <p>
          Este projeto avalia a usabilidade do Google Maps com testes moderados presenciais.
          Cada sessão combina métricas objetivas (tempo e cliques por tarefa) com métricas
          subjetivas (SUS e Likert por tarefa) e observação verbal via think-aloud.
        </p>
        <p>
          Os dados são coletados por uma aplicação web de avaliação separada e exportados
          como arquivos JSON individuais. Este dashboard lê esses arquivos de <InlineCode>public/testes/</InlineCode> e
          os agrega automaticamente.
        </p>
      </Section>

      {/* ── 2. Protocolo ── */}
      <Section title="2. Protocolo de teste">
        <p>Cada sessão segue a sequência abaixo:</p>
        <ul>
          <li><strong>Briefing</strong> — explicar o objetivo sem revelar as tarefas; obter consentimento verbal.</li>
          <li><strong>Perfil</strong> — coletar faixa etária, nível de experiência com o app e frequência de uso.</li>
          <li><strong>Tarefas</strong> — 6 tarefas cronometradas; participante pensa em voz alta; avaliador conta cliques manualmente e registra comentários.</li>
          <li><strong>Likert por tarefa</strong> — 5 questões de satisfação imediatamente após cada tarefa.</li>
          <li><strong>SUS</strong> — 10 questões ao final da sessão, antes do debriefing.</li>
          <li><strong>Debriefing</strong> — espaço para comentários livres do participante.</li>
        </ul>
        <p>
          Duração média por sessão: <strong>25–35 minutos</strong>. Dispositivo utilizado: smartphone Android
          com Google Maps versão padrão, sem conta logada.
        </p>
      </Section>

      {/* ── 3. Tarefas ── */}
      <Section title="3. Tarefas e metas">
        <p>
          As metas de tempo e cliques foram definidas por inspeção prévia da interface,
          realizando cada tarefa o caminho mais eficiente possível.
          Exceder uma meta não invalida a tarefa — serve como indicador de dificuldade.
        </p>
        <Table
          head={['ID', 'Tarefa', 'Instrução ao participante', 'Meta tempo', 'Meta cliques']}
          rows={TASKS.map(t => [
            t,
            TASK_META[t].label,
            <span style={{ whiteSpace: 'pre-line', fontSize: '.72rem' }}>{TASK_INSTRUCOES[t]}</span>,
            `${TASK_META[t].tempo}s`,
            `${TASK_META[t].cliques} cliques`,
          ])}
        />
      </Section>

      {/* ── 4. Likert por tarefa ── */}
      <Section title="4. Likert por tarefa">
        <p>
          Após cada tarefa, o participante responde 5 afirmações em escala 1–5
          (1 = discordo totalmente, 5 = concordo totalmente).
          A média das 5 respostas forma o <InlineCode>likert_media</InlineCode> da tarefa.
        </p>
        <ul>
          {TASK_LIKERT_Qs.map((q, i) => <li key={i}>{i + 1}. {q}</li>)}
        </ul>
      </Section>

      {/* ── 5. SUS ── */}
      <Section title="5. System Usability Scale (SUS)">
        <p>
          O SUS consiste em 10 afirmações alternadas entre positivas e negativas,
          respondidas em escala 1–5. O score final é calculado assim:
        </p>
        <ul>
          <li>Questões <strong>positivas</strong> (Q1, Q3, Q5, Q7, Q9): contribuição = resposta − 1</li>
          <li>Questões <strong>negativas</strong> (Q2, Q4, Q6, Q8, Q10): contribuição = 5 − resposta</li>
          <li>Somar as 10 contribuições e multiplicar por 2,5 → score 0–100</li>
        </ul>
        <CodeBlock>{'score = (Σ contribuições) × 2,5\n\nBandas:\n  ≥ 85   Excelente\n  68–84  Boa\n  51–67  Razoável\n  < 51   Abaixo da média'}</CodeBlock>
        <Table
          head={['#', 'Tipo', 'Afirmação']}
          rows={SUS_Qs.map((q, i) => [
            String(i + 1),
            q.t === 'pos' ? '+ positiva' : '− negativa',
            q.p,
          ])}
        />
      </Section>

      {/* ── 6. Estrutura do JSON ── */}
      <Section title="6. Estrutura do arquivo JSON">
        <p>
          Cada teste é um arquivo <InlineCode>.json</InlineCode> nomeado com o padrão
          {' '}<InlineCode>teste_{'<nome>'}_{'{timestamp}'}.json</InlineCode> e colocado
          em <InlineCode>public/testes/</InlineCode>. O arquivo também deve ser listado em
          {' '}<InlineCode>public/testes/manifest.json</InlineCode>.
        </p>
        <CodeBlock>{`{
  "metadata": {
    "app": "Google Maps",
    "data": "09/06/2026, 11:09:54",
    "versao": "v2"
  },
  "perfil": {
    "nome": "Nome do participante",
    "faixa_etaria": "18-25",          // "18-25" | "26-35" | "36-50" | "50+"
    "frequencia_uso": "Raramente",    // frequência de uso do app
    "contexto_uso": "Transporte público",
    "nivel_experiencia": "Intermediário"
  },
  "tarefas": [
    {
      "id": "T1",
      "titulo": "Busca e início de navegação",
      "tempo_segundos": 12.08,
      "meta_tempo_s": 30,
      "dentro_meta_tempo": true,
      "cliques": 5,
      "meta_cliques": 5,
      "dentro_meta_cliques": true,
      "completou": "sim",             // "sim" | "com_dificuldade" | "nao"
      "likert": [5, 5, 5, 5, 5],     // 5 respostas 1–5
      "likert_media": 5.0,
      "comentario": ""
    }
    // ... T2 até T6
  ],
  "sus": {
    "respostas": [5, 1, 5, 1, 4, 1, 3, 1, 4, 1],  // 10 respostas
    "sus_score": 90,
    "classificacao": "Excelente"
  }
}`}</CodeBlock>
      </Section>

      {/* ── 7. manifest.json ── */}
      <Section title="7. Adicionando novos testes">
        <p>
          Para incluir um novo participante:
        </p>
        <ul>
          <li>Salve o arquivo JSON em <InlineCode>public/testes/</InlineCode>.</li>
          <li>Adicione o nome do arquivo em <InlineCode>public/testes/manifest.json</InlineCode>:</li>
        </ul>
        <CodeBlock>{`{
  "files": [
    "teste_amanda_1781014194123.json",
    "teste_gledson_magalhaes_1781009561025.json",
    "teste_kalvin_1781015162664.json",
    "teste_tarcisio_1749482412000.json",
    "teste_tereza_1749469233000.json"
    // adicione aqui
  ]
}`}</CodeBlock>
        <p>
          O dashboard recarrega automaticamente ao clicar em <strong>↺ Recarregar</strong> na sidebar,
          ou ao recarregar a página.
        </p>
      </Section>

      {/* ── 8. Rodando localmente ── */}
      <Section title="8. Rodando localmente">
        <CodeBlock>{'git clone <repo>\ncd webapp\nnpm install\nnpm run dev'}</CodeBlock>
        <p>
          Acesse <InlineCode>http://localhost:5173</InlineCode>. O Vite serve os arquivos de
          {' '}<InlineCode>public/</InlineCode> diretamente — nenhum servidor adicional é necessário.
        </p>
        <p>
          Para build de produção: <InlineCode>npm run build</InlineCode>. O diretório
          {' '}<InlineCode>dist/</InlineCode> pode ser publicado em qualquer host estático
          (Vercel, Netlify, GitHub Pages). O arquivo <InlineCode>vercel.json</InlineCode> já
          inclui as rewrites necessárias para o roteamento SPA funcionar corretamente.
        </p>
      </Section>

      <div style={{ marginBottom: '2rem' }} />
    </div>
  )
}
