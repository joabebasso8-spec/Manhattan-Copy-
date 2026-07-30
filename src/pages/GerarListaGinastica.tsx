import { useMemo, useState } from 'react'
import { ActionBar } from '../components/ActionBar'
import { ColaboradorDialog } from '../components/ColaboradorDialog'
import { DocumentHeader } from '../components/DocumentHeader'
import { LegendaPanel } from '../components/LegendaPanel'
import { PresenceGrid, type ColunaDia } from '../components/PresenceGrid'
import type { Colaborador, StatusPresenca } from '../data/domain'
import { useStore } from '../data/store'

const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const POR_PAGINA = 10

export function GerarListaGinastica() {
  const store = useStore()
  const { listaGinastica: lista, setores } = store

  const [pagina, setPagina] = useState(0)
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [autoFolgas, setAutoFolgas] = useState(false)
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
        destaque: dow === 0,
      })
    }
    return cols
  }, [lista.periodoInicio, lista.periodoFim])

  const colaboradores = store.colaboradores
  const totalPaginas = Math.max(1, Math.ceil(colaboradores.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas - 1)
  const fatia = colaboradores.slice(paginaAtual * POR_PAGINA, paginaAtual * POR_PAGINA + POR_PAGINA)

  const getStatus = (cid: string, dia: number): StatusPresenca | '' =>
    store.registros.find(
      (r) => r.listaId === lista.id && r.colaboradorId === cid && r.dia === dia,
    )?.status ?? ''

  function aplicarAutoFolgas(ativar: boolean) {
    setAutoFolgas(ativar)
    if (ativar) {
      const domingos = colunas.filter((c) => c.destaque).map((c) => c.dia)
      store.autoPreencherFolgas(
        lista.id,
        domingos,
        colaboradores.map((c) => c.id),
      )
    }
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
        />
      </div>

      <div className="lista-page__paineis">
        <section className="ctx-panel">
          <h2 className="ctx-panel__titulo">Contexto</h2>
          <dl className="ctx-panel__dl">
            <div><dt>Setor</dt><dd>{setorNome}</dd></div>
            <div><dt>Turno</dt><dd>{lista.turno}</dd></div>
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
