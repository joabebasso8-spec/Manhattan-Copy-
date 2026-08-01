import { useNavigate } from 'react-router-dom'
import { ITENS_MENU, podeAcessar } from '../auth/permissions'
import { LegendaPanel } from '../components/LegendaPanel'
import { useStore } from '../data/store'
import type { PapelUsuario } from '../data/domain'

const PAPEIS: { valor: PapelUsuario; rotulo: string }[] = [
  { valor: 'supervisor', rotulo: 'Supervisor' },
  { valor: 'admin', rotulo: 'Administrador' },
  { valor: 'consulta', rotulo: 'Consulta' },
]

export function MenuPrincipal() {
  const navigate = useNavigate()
  const { usuario, definirPapel } = useStore()

  return (
    <div className="menu-page">
      <div className="menu-page__topo">
        <div>
          <h1 className="menu-page__titulo">Emissão e Controle de Listas de DDS e GL</h1>
          <p className="menu-page__sub">
            {usuario.empresa} — Unidade {usuario.unidade} · Projeto Manhattan
          </p>
        </div>
        <label className="menu-page__papel">
          Perfil de acesso (demonstração):
          <select
            value={usuario.papel}
            onChange={(e) => definirPapel(e.target.value as PapelUsuario)}
          >
            {PAPEIS.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="menu-page__corpo">
        <section className="menu-grid" aria-label="Módulos disponíveis">
          {ITENS_MENU.map((item) => {
            const habilitado = podeAcessar(usuario.papel, item.chave)
            return (
              <button
                key={item.chave}
                className={`menu-card${habilitado ? '' : ' menu-card--off'}`}
                disabled={!habilitado}
                aria-disabled={!habilitado}
                onClick={() => habilitado && navigate(item.rota)}
                title={habilitado ? item.descricao : 'Sem permissão de acesso'}
              >
                <span className="menu-card__icone" aria-hidden>
                  {item.icone}
                </span>
                <span className="menu-card__titulo">{item.titulo}</span>
                {!habilitado && <span className="menu-card__cadeado">🔒</span>}
              </button>
            )
          })}
        </section>

        <LegendaPanel />
      </div>
    </div>
  )
}
