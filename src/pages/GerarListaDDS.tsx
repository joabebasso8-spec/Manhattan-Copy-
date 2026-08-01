import { useMemo, useState } from 'react'
import { ActionBar } from '../components/ActionBar'
import { ColaboradorDialog } from '../components/ColaboradorDialog'
import { DocumentHeader } from '../components/DocumentHeader'
import { LegendaPanel } from '../components/LegendaPanel'
import { PresenceGrid, type ColunaDia } from '../components/PresenceGrid'
import { PrintSheet, type ColunaImpressao } from '../components/PrintSheet'
import { ehFolgaDaEscala, StatusPresenca, TURNOS, turnoOrdinal, type Colaborador } from '../data/domain'
import { HOJE } from '../data/seed'
import { useStore } from '../data/store'

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const POR_PAGINA = 10
const TODOS = 'Todos os turnos'

export function GerarListaDDS() {
  const store = useStore()
  const { listaDDS: lista, setores, temas, usuario } = store

  const [pagina, setPagina] = useState(0)
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [turnoFiltro, setTurnoFiltro] = useState<string>(TODOS)
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [dialog, setDialog] = useState<{ aberto: boolean; alvo: Colaborador | null }>({
    aberto: false,
    alvo: null,
  })

  const setorNome = setores.find((s) => s.id === lista.setorId)?.nome ?? '—'

  // Datas de cada dia da semana a partir do inicio do periodo.
  const inicio = new Date(lista.periodoInicio + 'T00:00:00')
  const diasDaSemana = useMemo(() => {
    // Alinha o inicio ao domingo da semana.
    const domingo = new Date(inicio)
    domingo.setDate(inicio.getDate() - inicio.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(domingo)
      d.setDate(domingo.getDate() + i)
      return d
    })
  }, [lista.periodoInicio])

  const colunas: ColunaDia[] = DIAS_SEMANA.map((_nome, i) => ({
    dia: i,
    label: DIAS_SEMANA_ABREV[i],
    sub: diasDaSemana[i].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
  }))

  // Colunas da IMPRESSÃO: os sete dias da semana com nome completo (como no PDF).
  const colunasImpressao: ColunaImpressao[] = DIAS_SEMANA.map((nome, i) => ({
    key: i,
    label: nome,
  }))

  // Temas da semana casados com o dia correspondente (por data).
  const temasDaSemana = useMemo(() => {
    const isoLocal = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate(),
      ).padStart(2, '0')}`
    return diasDaSemana.map((data, i) => {
      const iso = isoLocal(data)
      const tema = temas.find((t) => t.dataDDS === iso)
      return { dia: DIAS_SEMANA[i], data, tema }
    })
  }, [diasDaSemana, temas])

  const colaboradores = store.colaboradores.filter(
    (c) => turnoFiltro === TODOS || c.turno === turnoFiltro,
  )
  const totalPaginas = Math.max(1, Math.ceil(colaboradores.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const fatia = colaboradores.slice(paginaAtual * POR_PAGINA, paginaAtual * POR_PAGINA + POR_PAGINA)

  // Status de uma célula: registro manual > folga da escala (por data) > branco.
  // dia = índice do dia da semana (0=Dom..6=Sáb).
  const getStatus = (cid: string, dia: number): StatusPresenca | '' => {
    const reg = store.registros.find(
      (r) => r.listaId === lista.id && r.colaboradorId === cid && r.dia === dia,
    )
    if (reg) return reg.status
    const c = store.colaboradores.find((x) => x.id === cid)
    if (c?.escala && ehFolgaDaEscala(c.escala, diasDaSemana[dia])) return StatusPresenca.Folga
    return ''
  }

  return (
    <div className="lista-page">
      <DocumentHeader codigoDocumento="PSST-FOR-041 · Lista de DDS" />

      <div className="lista-page__barra">
        <h1 className="lista-page__titulo">Gerar Lista de DDS (semanal)</h1>
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
            <div><dt>Semana</dt><dd>{lista.referencia}</dd></div>
            <div><dt>Supervisor</dt><dd>{lista.supervisor}</dd></div>
          </dl>
          <div className="ctx-panel__pausa">
            <span className="ctx-panel__pausa-lbl">Intervalos de Descanso / Pausas Laborais</span>
            <span className="ctx-panel__pausa-val">09:20–09:35 · 12:00–13:00</span>
          </div>
        </section>

        <section className="temas-panel">
          <h2 className="temas-panel__titulo">Temas da Semana</h2>
          <ul className="temas-panel__lista">
            {temasDaSemana.map((t) => (
              <li key={t.dia} className="temas-panel__item">
                <span className="temas-panel__dia">
                  {t.dia}
                  <span className="temas-panel__data">
                    {t.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </span>
                <span className="temas-panel__tema">
                  {t.tema ? t.tema.tema : <em>— sem tema —</em>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="lista-page__controles">
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
        cellMode="dropdown"
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
            if ('id' in c) store.updateColaborador(c)
            else store.addColaborador(c)
            setDialog({ aberto: false, alvo: null })
          }}
          onCancelar={() => setDialog({ aberto: false, alvo: null })}
        />
      )}

      <PrintSheet
        codigo="LPDDS"
        subtitulo="DDS: Diálogo Diário de Segurança"
        emissao={new Date(HOJE + 'T00:00:00').toLocaleDateString('pt-BR')}
        usuario={usuario.nome}
        empresa={usuario.empresa}
        unidade={usuario.unidade}
        refCabecalho="7/2026"
        setorNome={setorNome}
        turnoLabel={turnoFiltro === TODOS ? 'Todos os turnos' : turnoOrdinal(turnoFiltro)}
        mes="julho"
        periodoRotulo="Semana"
        periodoValor={lista.referencia.replace('Semana 31 — ', 'de ').replace(' a ', ' a ')}
        supervisor={lista.supervisor}
        pausas="09:20 às 09:35 · 12:00 às 13:00"
        meio={
          <>
            <h3>Temas da Semana</h3>
            <table className="ps-temas">
              <tbody>
                {temasDaSemana.map((t) => (
                  <tr key={t.dia}>
                    <td className="ps-temas__data">
                      {t.data.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="ps-temas__tema">{t.tema ? t.tema.tema : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        }
        colunas={colunasImpressao}
        colaboradores={colaboradores}
        linhaHorario={(c) => `${c.horario}${c.escala ? ' - ' + c.escala : ''}`}
        valorCelula={(c, key) => getStatus(c.id, Number(key))}
      />
    </div>
  )
}
