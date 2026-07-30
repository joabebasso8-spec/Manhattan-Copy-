import { useMemo, useState } from 'react'
import { ActionBar } from '../components/ActionBar'
import { ColaboradorDialog } from '../components/ColaboradorDialog'
import { DocumentHeader } from '../components/DocumentHeader'
import { LegendaPanel } from '../components/LegendaPanel'
import { PresenceGrid, type ColunaDia } from '../components/PresenceGrid'
import type { Colaborador, StatusPresenca } from '../data/domain'
import { useStore } from '../data/store'

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const POR_PAGINA = 10

export function GerarListaDDS() {
  const store = useStore()
  const { listaDDS: lista, setores, temas } = store

  const [pagina, setPagina] = useState(0)
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md')
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
    destaque: i === 0 || i === 6,
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

  const colaboradores = store.colaboradores
  const totalPaginas = Math.max(1, Math.ceil(colaboradores.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const fatia = colaboradores.slice(paginaAtual * POR_PAGINA, paginaAtual * POR_PAGINA + POR_PAGINA)

  const getStatus = (cid: string, dia: number): StatusPresenca | '' =>
    store.registros.find(
      (r) => r.listaId === lista.id && r.colaboradorId === cid && r.dia === dia,
    )?.status ?? ''

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
        />
      </div>

      <div className="lista-page__paineis">
        <section className="ctx-panel">
          <h2 className="ctx-panel__titulo">Contexto</h2>
          <dl className="ctx-panel__dl">
            <div><dt>Setor</dt><dd>{setorNome}</dd></div>
            <div><dt>Turno</dt><dd>{lista.turno}</dd></div>
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
          setores={setores}
          setorPadrao={lista.setorId}
          turnoPadrao={lista.turno}
          onSalvar={(c) => {
            if ('id' in c) store.updateColaborador(c)
            else store.addColaborador(c)
            setDialog({ aberto: false, alvo: null })
          }}
          onCancelar={() => setDialog({ aberto: false, alvo: null })}
        />
      )}
    </div>
  )
}
