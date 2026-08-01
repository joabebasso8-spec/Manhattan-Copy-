// =====================================================================
// Grade matriz colaborador x dia — reutilizada pelas telas de GL (mensal)
// e DDS (semanal). O modo da celula muda a apresentacao:
//   - 'text':     exibe a sigla (clique cicla entre os valores)
//   - 'dropdown': combobox de selecao (usado no DDS semanal)
// =====================================================================

import { COR_STATUS, OPCOES_CELULA, StatusPresenca, type Colaborador } from '../data/domain'

export interface ColunaDia {
  /** Chave numerica do dia (numero do mes ou weekday index). */
  dia: number
  /** Rotulo principal exibido no cabecalho da coluna. */
  label: string
  /** Sub-rotulo opcional (ex.: dia da semana abreviado). */
  sub?: string
  /** Destaca a coluna (ex.: fim de semana). */
  destaque?: boolean
}

interface Props {
  colaboradores: Colaborador[]
  colunas: ColunaDia[]
  getStatus: (colaboradorId: string, dia: number) => StatusPresenca | ''
  onChangeStatus: (colaboradorId: string, dia: number, status: StatusPresenca | '') => void
  cellMode: 'text' | 'dropdown'
  textSize: 'sm' | 'md' | 'lg'
  onAdd: () => void
  onEdit: (c: Colaborador) => void
  onRemove: (c: Colaborador) => void
}

const CICLO: (StatusPresenca | '')[] = ['', ...OPCOES_CELULA]

export function PresenceGrid({
  colaboradores,
  colunas,
  getStatus,
  onChangeStatus,
  cellMode,
  textSize,
  onAdd,
  onEdit,
  onRemove,
}: Props) {
  function ciclar(colaboradorId: string, dia: number) {
    const atual = getStatus(colaboradorId, dia)
    const idx = CICLO.indexOf(atual)
    const prox = CICLO[(idx + 1) % CICLO.length]
    onChangeStatus(colaboradorId, dia, prox)
  }

  return (
    <div className="grid-wrap">
      <table className={`presence-grid presence-grid--${textSize}`}>
        <thead>
          <tr>
            <th className="pg-col-colab">
              <div className="pg-col-colab__head">
                <span>Colaborador</span>
                <button className="pg-add" title="Adicionar colaborador" onClick={onAdd}>
                  +
                </button>
              </div>
            </th>
            {colunas.map((col) => (
              <th
                key={col.dia}
                className={`pg-day${col.destaque ? ' pg-day--destaque' : ''}`}
              >
                <span className="pg-day__label">{col.label}</span>
                {col.sub && <span className="pg-day__sub">{col.sub}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {colaboradores.map((c) => (
            <tr key={c.id}>
              <td className="pg-col-colab">
                <div className="pg-colab">
                  <div className="pg-colab__info">
                    <div className="pg-colab__nome">
                      <span className="pg-colab__mat">{c.matricula}</span>
                      {c.nome}
                    </div>
                    <div className="pg-colab__horario">
                      {c.turno} · {c.horario}
                    </div>
                  </div>
                  <div className="pg-colab__acoes">
                    <button title="Editar" onClick={() => onEdit(c)}>
                      ✎
                    </button>
                    <button title="Excluir" onClick={() => onRemove(c)}>
                      🗑
                    </button>
                  </div>
                </div>
              </td>
              {colunas.map((col) => {
                const status = getStatus(c.id, col.dia)
                return (
                  <td
                    key={col.dia}
                    className={`pg-cell${col.destaque ? ' pg-cell--destaque' : ''}`}
                  >
                    {cellMode === 'dropdown' ? (
                      <select
                        className="pg-cell__select"
                        value={status}
                        style={{ color: status ? COR_STATUS[status] : undefined }}
                        onChange={(e) =>
                          onChangeStatus(
                            c.id,
                            col.dia,
                            e.target.value as StatusPresenca | '',
                          )
                        }
                      >
                        {/* Opcao em branco (estado normal — presenca por assinatura). */}
                        <option value="">{' '}</option>
                        {/* Mostra valores derivados fora da lista padrão (ex.: "X" das sextas). */}
                        {status && !OPCOES_CELULA.includes(status) && (
                          <option value={status}>{status}</option>
                        )}
                        {OPCOES_CELULA.map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        className="pg-cell__text"
                        style={{ color: status ? COR_STATUS[status] : undefined }}
                        onClick={() => ciclar(c.id, col.dia)}
                        title="Clique para alternar o status"
                      >
                        {status || ''}
                      </button>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
