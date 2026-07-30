import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TemaDDS } from '../data/domain'
import { useStore } from '../data/store'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const VAZIO: Omit<TemaDDS, 'id'> = { ordem: 1, tema: '', mes: 7, dataDDS: '2026-07-01' }

export function CadastrarTemas() {
  const navigate = useNavigate()
  const store = useStore()
  const { temas } = store

  const [filtroLigado, setFiltroLigado] = useState(false)
  const [mesFiltro, setMesFiltro] = useState(7)
  const [selecionadoId, setSelecionadoId] = useState<string | null>(temas[0]?.id ?? null)
  const [editando, setEditando] = useState<TemaDDS | Omit<TemaDDS, 'id'> | null>(null)

  const listaFiltrada = useMemo(() => {
    const base = filtroLigado ? temas.filter((t) => t.mes === mesFiltro) : temas
    return [...base].sort((a, b) => a.ordem - b.ordem)
  }, [temas, filtroLigado, mesFiltro])

  const selecionado = temas.find((t) => t.id === selecionadoId) ?? null

  function salvarEdicao(e: React.FormEvent) {
    e.preventDefault()
    if (!editando) return
    if ('id' in editando) {
      store.updateTema(editando)
      setSelecionadoId(editando.id)
    } else {
      store.addTema(editando)
    }
    setEditando(null)
  }

  return (
    <div className="temas-page">
      <div className="lista-page__barra">
        <div>
          <button className="btn btn--ghost" onClick={() => navigate('/')}>
            ↩ Menu
          </button>
          <h1 className="lista-page__titulo">Cadastrar Temas de DDS</h1>
        </div>
      </div>

      {/* Registro selecionado no topo */}
      <section className="registro-topo">
        <h2 className="registro-topo__titulo">Registro selecionado</h2>
        {selecionado ? (
          <table className="registro-topo__tabela">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Tema</th>
                <th>Mês</th>
                <th>Data_DDS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selecionado.ordem}</td>
                <td>{selecionado.tema}</td>
                <td>{MESES[selecionado.mes - 1]}</td>
                <td>{new Date(selecionado.dataDDS + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="registro-topo__vazio">Nenhum registro selecionado.</p>
        )}
      </section>

      {/* Barra de controle */}
      <div className="temas-controle">
        <label className="toggle">
          <input
            type="checkbox"
            checked={filtroLigado}
            onChange={(e) => setFiltroLigado(e.target.checked)}
          />
          <span>{filtroLigado ? 'Filtro Ligado' : 'Filtro Desligado'}</span>
        </label>

        <select
          value={mesFiltro}
          disabled={!filtroLigado}
          onChange={(e) => setMesFiltro(Number(e.target.value))}
        >
          {MESES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        <div className="temas-controle__botoes">
          <button
            className="btn btn--danger"
            disabled={!selecionado}
            onClick={() => {
              if (selecionado && confirm(`Apagar o tema "${selecionado.tema}"?`)) {
                store.removeTema(selecionado.id)
                setSelecionadoId(null)
              }
            }}
          >
            Apagar Registro
          </button>
          <button
            className="btn btn--secondary"
            disabled={!selecionado}
            onClick={() => selecionado && setEditando({ ...selecionado })}
          >
            Editar Registro
          </button>
          <button className="btn btn--primary" onClick={() => setEditando({ ...VAZIO })}>
            Novo Cadastro
          </button>
        </div>
      </div>

      {/* Lista rolavel de temas cadastrados */}
      <section className="temas-cadastrados">
        <h2 className="temas-cadastrados__titulo">Temas Cadastrados</h2>
        <div className="temas-cadastrados__lista">
          <table className="temas-cadastrados__tabela">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Data</th>
                <th>Tema</th>
                <th>Mês</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((t) => (
                <tr
                  key={t.id}
                  className={t.id === selecionadoId ? 'sel' : ''}
                  onClick={() => setSelecionadoId(t.id)}
                >
                  <td>{t.ordem}</td>
                  <td>{new Date(t.dataDDS + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  <td>{t.tema}</td>
                  <td>{MESES[t.mes - 1]}</td>
                </tr>
              ))}
              {listaFiltrada.length === 0 && (
                <tr>
                  <td colSpan={4} className="temas-cadastrados__vazio">
                    Nenhum tema para o filtro selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal de edicao / novo */}
      {editando && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={salvarEdicao}>
            <h3 className="modal__titulo">
              {'id' in editando ? 'Editar tema' : 'Novo tema'}
            </h3>
            <div className="modal__grid">
              <label>
                Ordem
                <input
                  type="number"
                  value={editando.ordem}
                  onChange={(e) => setEditando({ ...editando, ordem: Number(e.target.value) })}
                />
              </label>
              <label>
                Mês
                <select
                  value={editando.mes}
                  onChange={(e) => setEditando({ ...editando, mes: Number(e.target.value) })}
                >
                  {MESES.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label className="modal__full">
                Tema
                <input
                  value={editando.tema}
                  onChange={(e) => setEditando({ ...editando, tema: e.target.value })}
                  required
                />
              </label>
              <label>
                Data do DDS
                <input
                  type="date"
                  value={editando.dataDDS}
                  onChange={(e) => setEditando({ ...editando, dataDDS: e.target.value })}
                />
              </label>
            </div>
            <div className="modal__acoes">
              <button type="button" className="btn btn--ghost" onClick={() => setEditando(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
