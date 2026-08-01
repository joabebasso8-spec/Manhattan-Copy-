import { useNavigate } from 'react-router-dom'

interface Props {
  titulo: string
  icone: string
  descricao: string
  campos: string[]
}

// Stub coerente com o padrao visual das demais telas, para os modulos que
// nao puderam ser documentados em detalhe (acesso restrito no teste original).
// Devem ser revisados com o dono do processo antes de finalizar.
export function Placeholder({ titulo, icone, descricao, campos }: Props) {
  const navigate = useNavigate()
  return (
    <div className="placeholder-page">
      <div className="lista-page__barra">
        <button className="btn btn--ghost" onClick={() => navigate('/')}>
          ↩ Menu
        </button>
      </div>

      <div className="placeholder-card">
        <span className="placeholder-card__icone" aria-hidden>
          {icone}
        </span>
        <h1 className="placeholder-card__titulo">{titulo}</h1>
        <span className="placeholder-card__tag">Módulo em definição</span>
        <p className="placeholder-card__desc">{descricao}</p>

        <div className="placeholder-card__campos">
          <h2>Campos e regras previstos (a validar com o dono do processo)</h2>
          <ul>
            {campos.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <p className="placeholder-card__nota">
          Esta tela é um <strong>stub</strong>: no ambiente original ela ficou com acesso
          restrito e não pôde ser documentada em detalhe. A estrutura acima é uma proposta
          coerente com o padrão visual do módulo e deve ser revisada antes da implementação
          final.
        </p>
      </div>
    </div>
  )
}
