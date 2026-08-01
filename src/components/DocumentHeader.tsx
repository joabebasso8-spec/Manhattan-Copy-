// Cabecalho com metadados do documento, presente no topo das telas de lista.
import { HOJE } from '../data/seed'
import { useStore } from '../data/store'

interface Props {
  codigoDocumento: string
}

export function DocumentHeader({ codigoDocumento }: Props) {
  const { usuario } = useStore()
  const dataEmissao = new Date(HOJE + 'T00:00:00').toLocaleDateString('pt-BR')

  return (
    <header className="doc-header">
      <div className="doc-header__left">
        <span className="doc-header__codigo">{codigoDocumento}</span>
        <span className="doc-header__meta">Emissão: {dataEmissao}</span>
        <span className="doc-header__meta">Usuário: {usuario.nome}</span>
      </div>
      <div className="doc-header__right">
        <span className="doc-header__empresa">{usuario.empresa}</span>
        <span className="doc-header__meta">Unidade {usuario.unidade}</span>
      </div>
    </header>
  )
}
