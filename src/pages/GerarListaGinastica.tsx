import { useMemo, useState } from 'react'
import { ActionBar } from '../components/ActionBar'
import { ColaboradorDialog } from '../components/ColaboradorDialog'
import { DocumentHeader } from '../components/DocumentHeader'
import { LegendaPanel } from '../components/LegendaPanel'
import { PresenceGrid, type ColunaDia } from '../components/PresenceGrid'
import { PrintSheet, type ColunaImpressao } from '../components/PrintSheet'
import { folgasDaEscala, TURNOS, turnoOrdinal, type Colaborador, type StatusPresenca } from '../data/domain'
import { HOJE } from '../data/seed'
import { useStore } from '../data/store'

const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const POR_PAGINA = 10
const TODOS = 'Todos os turnos'

export function GerarListaGinastica() {
  const store = useStore()
  const { listaGinastica: lista, setores, usuario } = store

  const [pagina, setPagina] = useState(0)
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [autoFolgas, setAutoFolgas] = useState(false)
  const [turnoFiltro, setTurnoFiltro] = useState<string>(TODOS)
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [dialog, setDialog] = useState<{ aberto: boolean; alvo: Colaborador | null }>({
    aberto: false,
    alvo: null,
  })

  const setorNome = setores.find((s) => s.id === lista.setorId)?.nome ?? '—'

  // Colunas: dias do mes de julho/2026 (31 dias), destacando domingos.
  const colunas: ColunaDia[] = useMemo(() => {
    const inicio = new Date(lista.periodoInicio + 'T00:00:00')
    const fim = new Date(lista.periodoFim + 'T00:00:00')
    const cols: ColunaDia[] = []
    for (let dia = inicio.getDate(); dia <= fim.getDate(); dia++) {
      const data = new Date(inicio.getFullYear(), inicio.getMonth(), dia)
      const dow = data.getDay()
      cols.push({
        dia,
        label: String(dia),
        sub: DIAS_SEMANA_ABREV[dow],
      })
    }
    return cols
  }, [lista.periodoInicio, lista.periodoFim])

  // Colunas da IMPRESSÃO: apenas dias úteis (seg–sex), como no formulário oficial.
  const colunasImpressao: ColunaImpressao[] = useMemo(() => {
    const inicio = new Date(lista.periodoInicio + 'T00:00:00')
    const fim = new Date(lista.periodoFim + 'T00:00:00')
    const cols: ColunaImpressao[] = []
    for (let dia = inicio.getDate(); dia <= fim.getDate(); dia++) {
      const dow = new Date(inicio.getFullYear(), inicio.getMonth(), dia).getDay()
      if (dow === 0 || dow === 6) continue
      cols.push({ key: dia, label: String(dia) })
    }
    return cols
  }, [lista.periodoInicio, lista.periodoFim])

  const colaboradores = store.colaboradores
  const colaboradoresFiltrados = colaboradores.filter(
    (c) => turnoFiltro === TODOS || c.turno === turnoFiltro,
  )
  const totalPaginas = Math.max(1, Math.ceil(colaboradoresFiltrados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const fatia = colaboradoresFiltrados.slice(
    paginaAtual * POR_PAGINA,
    paginaAtual * POR_PAGINA + POR_PAGINA,
  )

  const getStatus = (cid: string, dia: number): StatusPresenca | '' =>
    store.registros.find(
      (r) => r.listaId === lista.id && r.colaboradorId === cid && r.dia === dia,
    )?.status ?? ''

  function aplicarAutoFolgas(ativar: boolean) {
    setAutoFolgas(ativar)
    if (ativar) {
      const domingos = diasDoMesPorWeekday([0]) // domingos do mês
      store.autoPreencherFolgas(
        lista.id,
        domingos,
        colaboradores.map((c) => c.id),
      )
    }
  }

  // Converte dias da semana (0=Dom..6=Sáb) nos números de dia do mês correspondentes.
  function diasDoMesPorWeekday(weekdays: number[]): number[] {
    const inicio = new Date(lista.periodoInicio + 'T00:00:00')
    const fim = new Date(lista.periodoFim + 'T00:00:00')
    const dias: number[] = []
    for (let d = inicio.getDate(); d <= fim.getDate(); d++) {
      const data = new Date(inicio.getFullYear(), inicio.getMonth(), d)
      if (weekdays.includes(data.getDay())) dias.push(d)
    }
    return dias
  }

  return (
    <div className="lista-page">
      <DocumentHeader codigoDocumento="PSST-FOR-042 · Lista de Ginástica Laboral" />

      <div className="lista-page__barra">
        <h1 className="lista-page__titulo">Gerar Lista de Ginástica (mensal)</h1>
        <ActionBar
          onAtualizar={() => setPagina(0)}
          onAlternarTexto={() =>
            setTextSize((t) => (t === 'sm' ? 'md' : t === 'md' ? 'lg' : 'sm'))
          }
          onFiltrar={() => setMostrarFiltro((v) => !v)}
        />
      </div>

      {mostrarFiltro && (
        <div className="filtro-bar">
          <label className="filtro-bar__campo">
            Turno para impressão
            <select
              value={turnoFiltro}
              onChange={(e) => {
                setTurnoFiltro(e.target.value)
                setPagina(0)
              }}
            >
              <option value={TODOS}>{TODOS}</option>
              {TURNOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn--secondary" onClick={() => window.print()}>
            🖨 Imprimir {turnoFiltro === TODOS ? 'todos' : turnoFiltro}
          </button>
        </div>
      )}

      <div className="lista-page__paineis">
        <section className="ctx-panel">
          <h2 className="ctx-panel__titulo">Contexto</h2>
          <dl className="ctx-panel__dl">
            <div><dt>Setor</dt><dd>{setorNome}</dd></div>
            <div><dt>Turno</dt><dd>{turnoFiltro}</dd></div>
            <div><dt>Mês</dt><dd>{lista.referencia}</dd></div>
            <div>
              <dt>Período</dt>
              <dd>
                {new Date(lista.periodoInicio + 'T00:00:00').toLocaleDateString('pt-BR')} a{' '}
                {new Date(lista.periodoFim + 'T00:00:00').toLocaleDateString('pt-BR')}
              </dd>
            </div>
            <div><dt>Supervisor</dt><dd>{lista.supervisor}</dd></div>
          </dl>
        </section>

        <section className="info-panel">
          <h2 className="info-panel__titulo">Sobre a Ginástica Laboral</h2>
          <p>
            A Ginástica Laboral consiste em exercícios de curta duração realizados no
            próprio ambiente de trabalho, com o objetivo de prevenir lesões por esforço
            repetitivo (LER/DORT), reduzir a fadiga muscular e promover mais disposição e
            integração entre a equipe. A participação é registrada mensalmente por
            assinatura na lista impressa.
          </p>
        </section>
      </div>

      <div className="lista-page__controles">
        <label className="toggle">
          <input
            type="checkbox"
            checked={autoFolgas}
            onChange={(e) => aplicarAutoFolgas(e.target.checked)}
          />
          <span>Preenchimento automático de folgas</span>
        </label>

        <div className="paginacao">
          <button
            className="paginacao__btn"
            title="Primeira página"
            disabled={paginaAtual === 0}
            onClick={() => setPagina(0)}
          >
            «
          </button>
          <button
            className="paginacao__btn"
            title="Página anterior"
            disabled={paginaAtual === 0}
            onClick={() => setPagina((p) => Math.max(0, p - 1))}
          >
            ‹
          </button>
          <span className="paginacao__label">
            Página {paginaAtual + 1} de {totalPaginas}
          </span>
          <button
            className="paginacao__btn"
            title="Próxima página"
            disabled={paginaAtual >= totalPaginas - 1}
            onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
          >
            ›
          </button>
          <button
            className="paginacao__btn"
            title="Última página"
            disabled={paginaAtual >= totalPaginas - 1}
            onClick={() => setPagina(totalPaginas - 1)}
          >
            »
          </button>
        </div>
      </div>

      <PresenceGrid
        colaboradores={fatia}
        colunas={colunas}
        getStatus={getStatus}
        onChangeStatus={(cid, dia, status) => store.setStatus(lista.id, cid, dia, status)}
        cellMode="text"
        textSize={textSize}
        onAdd={() => setDialog({ aberto: true, alvo: null })}
        onEdit={(c) => setDialog({ aberto: true, alvo: c })}
        onRemove={(c) => {
          if (confirm(`Excluir ${c.nome}?`)) store.removeColaborador(c.id)
        }}
      />

      <LegendaPanel />

      {dialog.aberto && (
        <ColaboradorDialog
          colaborador={dialog.alvo}
          onSalvar={(c) => {
            let id: string
            if ('id' in c) {
              store.updateColaborador(c)
              id = c.id
            } else {
              id = store.addColaborador(c)
            }
            // Expande as folgas da escala (dias da semana) para os dias do mês.
            if (c.escala) {
              const weekdays = folgasDaEscala(c.escala, new Date().getDay())
              store.aplicarFolgas(lista.id, id, diasDoMesPorWeekday(weekdays))
            }
            setDialog({ aberto: false, alvo: null })
          }}
          onCancelar={() => setDialog({ aberto: false, alvo: null })}
        />
      )}

      <PrintSheet
        codigo="LPGL"
        subtitulo="GL: Ginástica Laboral"
        emissao={new Date(HOJE + 'T00:00:00').toLocaleDateString('pt-BR')}
        usuario={usuario.nome}
        empresa={usuario.empresa}
        unidade={usuario.unidade}
        refCabecalho="7/2026"
        setorNome={setorNome}
        turnoLabel={turnoFiltro === TODOS ? 'Todos os turnos' : turnoOrdinal(turnoFiltro)}
        mes="julho"
        periodoRotulo="Período"
        periodoValor={`de ${new Date(lista.periodoInicio + 'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(lista.periodoFim + 'T00:00:00').toLocaleDateString('pt-BR')}`}
        supervisor={lista.supervisor}
        meio={
          <>
            <h3>Ginástica Laboral</h3>
            <p className="ps-meio-desc">
              A ginástica laboral é uma prática que tem como principal objetivo prevenir
              patologias relacionadas às atividades laborais e incentivar os colaboradores à
              prática de atividades físicas, enfatizando a importância para a melhora na
              qualidade de vida e manutenção da saúde. Apresenta baixa intensidade e melhora o
              sistema cardíaco, respiratório e esquelético; reduz a fadiga; combate doenças
              ocupacionais (LER/DORT, estresse, ansiedade); aumenta a atenção e a concentração;
              e melhora a disposição.
            </p>
          </>
        }
        colunas={colunasImpressao}
        colaboradores={colaboradoresFiltrados}
        linhaHorario={(c) => `${c.horario}${c.escala ? ' - ' + c.escala : ''}`}
      />
    </div>
  )
}
