// Painel fixo "Legenda de Preenchimento" exibido no menu e nas telas de lista.
import { COR_STATUS, LEGENDA_STATUS, SIGLAS_AUSENCIA } from '../data/domain'

export function LegendaPanel() {
  return (
    <aside className="legenda">
      <h2 className="legenda__titulo">Legenda de Preenchimento</h2>
      <p className="legenda__intro">
        O <strong>espaço em branco</strong> é o estado normal: a presença é confirmada
        pela <strong>assinatura física</strong> do colaborador na lista impressa. Apenas
        as ausências são marcadas, seguindo o padrão de siglas abaixo:
      </p>
      <ul className="legenda__lista">
        <li className="legenda__item">
          <span className="legenda__sigla legenda__sigla--vazio">&nbsp;</span>
          <span>Presente (assinatura física)</span>
        </li>
        {SIGLAS_AUSENCIA.map((s) => (
          <li className="legenda__item" key={s}>
            <span className="legenda__sigla" style={{ backgroundColor: COR_STATUS[s] }}>
              {s}
            </span>
            <span>{LEGENDA_STATUS[s]}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
