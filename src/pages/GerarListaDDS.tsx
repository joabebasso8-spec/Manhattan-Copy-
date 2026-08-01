import { useMemo, useState } from 'react'
import { ActionBar } from '../components/ActionBar'
import { ColaboradorDialog } from '../components/ColaboradorDialog'
import { DocumentHeader } from '../components/DocumentHeader'
import { LegendaPanel } from '../components/LegendaPanel'
import { PresenceGrid, type ColunaDia } from '../components/PresenceGrid'
import { PrintSheet, type ColunaImpressao } from '../components/PrintSheet'
import {
  chaveData,
  dataDeChave,
  ehFolgaDaEscala,
  StatusPresenca,
  TURNOS,
  turnoOrdinal,
  type Colaborador,
} from '../data/domain'
import { HOJE } from '../data/seed'
import { useStore } from '../data/store'

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const POR_PAGINA = 10
const TODOS = 'Todos os turnos'

const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const ddMM = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

/** Domingo (início) da semana que contém a data informada. */
function domingoDaSemana(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() - x.getDay())
  return x
}

/** Lista de semanas (domingo a sábado) para o seletor. */
const SEMANAS: { iso: string; label: string }[] = (() => {
  const res: { iso: string; label: string }[] = []
  const d = domingoDaSemana(new Date(2026, 0, 1))
  for (let i = 0; i < 60; i++) {
    const fim = new Date(d)
    fim.setDate(d.getDate() + 6)
    res.push({ iso: isoLocal(d), label: `${ddMM(d)} a ${ddMM(fim)}` })
    d.setDate(d.getDate() + 7)
  }
  return res
})()

export function GerarListaDDS() {
  const store = useStore()
  const { listaDDS: lista, setores, temas, usuario } = store

  const semanaPadrao = isoLocal(domingoDaSemana(new Date(lista.periodoInicio + 'T00:00:00')))

  const [pagina, setPagina] = useState(0)
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [turnoFiltro, setTurnoFiltro] = useState<string>(TODOS)
  const [semanaIso, setSemanaIso] = useState<string>(semanaPadrao)
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [dialog, setDialog] = useState<{ aberto: boolean; alvo: Colaborador | null }>({
    aberto: false,
    alvo: null,
  })

  const setorNome = setores.find((s) => s.id === lista.setorId)?.nome ?? '—'

  // Datas dos sete dias da semana selecionada (domingo a sábado).
  const diasDaSemana = useMemo(() => {
    const domingo = new Date(semanaIso + 'T00:00:00')
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(domingo)
      d.setDate(domingo.getDate() + i)
      return d
    })
  }, [semanaIso])

  const semanaFim = diasDaSemana[6]
  const semanaLabel = `${ddMM(diasDaSemana[0])} a ${ddMM(semanaFim)}`

  // Colunas da tela: dia = chave AAAAMMDD da data real.
  const colunas: ColunaDia[] = diasDaSemana.map((data, i) => ({
    dia: chaveData(data),
    label: DIAS_SEMANA_ABREV[i],
    sub: ddMM(data),
  }))

  // Colunas da impressão: nome completo do dia da semana.
  const colunasImpressao: ColunaImpressao[] = diasDaSemana.map((data, i) => ({
    key: chaveData(data),
    label: DIAS_SEMANA[i],
  }))

  // Temas da semana casados por data.
  const temasDaSemana = useMemo(
    () =>
      diasDaSemana.map((data, i) => ({
        dia: DIAS_SEMANA[i],
        data,
        tema: temas.find((t) => t.dataDDS === isoLocal(data)),
      })),
    [diasDaSemana, temas],
  )

  const colaboradores = store.colaboradores.filter(
    (c) => turnoFiltro === TODOS || c.turno === turnoFiltro,
  )
  const totalPaginas = Math.max(1, Math.ceil(colaboradores.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const fatia = colaboradores.slice(paginaAtual * POR_PAGINA, paginaAtual * POR_PAGINA + POR_PAGINA)

  // Status: registro manual > desligado > folga da escala (por data) > branco.
  const getStatus = (cid: string, diaKey: number): StatusPresenca | '' => {
    const reg = store.registros.find(
      (r) => r.listaId === lista.id && r.colaboradorId === cid && r.dia === diaKey,
    )
    if (reg) return reg.status
    const c = store.colaboradores.find((x) => x.id === cid)
    if (c?.status === 'desligado') return StatusPresenca.Desligado
    if (c?.escala && ehFolgaDaEscala(c.escala, dataDeChave(diaKey))) return StatusPresenca.Folga
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
            Semana
            <select
              value={semanaIso}
              onChange={(e) => {
                setSemanaIso(e.target.value)
                setPagina(0)
              }}
            >
              {SEMANAS.map((s) => (
                <option key={s.iso} value={s.iso}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
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
            <div><dt>Semana</dt><dd>{semanaLabel}</dd></div>
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
                  <span className="temas-panel__data">{ddMM(t.data)}</span>
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
        mes={diasDaSemana[0].toLocaleDateString('pt-BR', { month: 'long' })}
        periodoRotulo="Semana"
        periodoValor={`de ${diasDaSemana[0].toLocaleDateString('pt-BR')} a ${semanaFim.toLocaleDateString('pt-BR')}`}
        supervisor={lista.supervisor}
        pausas="09:20 às 09:35 · 12:00 às 13:00"
        meio={
          <>
            <h3>Temas da Semana</h3>
            <table className="ps-temas">
              <tbody>
                {temasDaSemana.map((t) => (
                  <tr key={t.dia}>
                    <td className="ps-temas__data">{t.data.toLocaleDateString('pt-BR')}</td>
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
