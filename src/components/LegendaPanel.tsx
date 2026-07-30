// Painel fixo "Legenda de Preenchimento" exibido no menu e nas telas de lista.
import { COR_STATUS, LEGENDA_STATUS, SIGLAS_AUSENCIA, StatusPresenca } from '../data/domain'

export function LegendaPanel() {
  return (
    <aside className="legenda">
      <h2 className="legenda__titulo">Legenda de Preenchimento</h2>
      <p className="legenda__intro">
        A presença é sinalizada pela <strong>assinatura física</strong> do colaborador
        na lista impressa. As ausências seguem o padrão de siglas abaixo:
      </p>
      <ul className="legenda__lista">
        <li className="legenda__item">
          <span
            className="legenda__sigla"
            style={{ backgroundColor: COR_STATUS[StatusPresenca.Presente] }}
          >
            {StatusPresenca.Presente}
          </span>
          <span>{LEGENDA_STATUS[StatusPresenca.Presente]}</span>
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
