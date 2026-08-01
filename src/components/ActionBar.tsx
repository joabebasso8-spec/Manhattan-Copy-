// Barra de icones de acao reutilizada no topo das telas de lista:
// voltar/desfazer, atualizar, alternar tamanho de texto, filtrar e imprimir.
import { useNavigate } from 'react-router-dom'

interface Props {
  onAtualizar?: () => void
  onAlternarTexto?: () => void
  onFiltrar?: () => void
  onImprimir?: () => void
}

export function ActionBar({ onAtualizar, onAlternarTexto, onFiltrar, onImprimir }: Props) {
  const navigate = useNavigate()

  return (
    <div className="action-bar" role="toolbar" aria-label="Ações da lista">
      <button className="action-bar__btn" title="Voltar" onClick={() => navigate('/')}>
        <span aria-hidden>↩</span>
      </button>
      <button
        className="action-bar__btn"
        title="Atualizar dados"
        onClick={onAtualizar}
      >
        <span aria-hidden>⟳</span>
      </button>
      <button
        className="action-bar__btn"
        title="Alternar tamanho do texto"
        onClick={onAlternarTexto}
      >
        <span aria-hidden>A±</span>
      </button>
      <button className="action-bar__btn" title="Filtrar" onClick={onFiltrar}>
        <span aria-hidden>⚲</span>
      </button>
      <button
        className="action-bar__btn"
        title="Imprimir"
        onClick={onImprimir ?? (() => window.print())}
      >
        <span aria-hidden>🖨</span>
      </button>
    </div>
  )
}
