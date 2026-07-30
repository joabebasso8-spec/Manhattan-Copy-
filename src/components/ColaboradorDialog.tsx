// Modal simples para adicionar ou editar um colaborador.
import { useState } from 'react'
import type { Colaborador, Setor } from '../data/domain'

interface Props {
  colaborador: Colaborador | null // null = novo
  setores: Setor[]
  setorPadrao: string
  turnoPadrao: string
  onSalvar: (c: Colaborador | Omit<Colaborador, 'id'>) => void
  onCancelar: () => void
}

export function ColaboradorDialog({
  colaborador,
  setores,
  setorPadrao,
  turnoPadrao,
  onSalvar,
  onCancelar,
}: Props) {
  const [matricula, setMatricula] = useState(colaborador?.matricula ?? '')
  const [nome, setNome] = useState(colaborador?.nome ?? '')
  const [setorId, setSetorId] = useState(colaborador?.setorId ?? setorPadrao)
  const [turno, setTurno] = useState(colaborador?.turno ?? turnoPadrao)
  const [horario, setHorario] = useState(colaborador?.horario ?? '06:00–14:20')
  const [status, setStatus] = useState<Colaborador['status']>(colaborador?.status ?? 'ativo')

  function submeter(e: React.FormEvent) {
    e.preventDefault()
    if (!matricula.trim() || !nome.trim()) return
    const base = { matricula: matricula.trim(), nome: nome.trim(), setorId, turno, horario, status }
    onSalvar(colaborador ? { ...base, id: colaborador.id } : base)
  }

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submeter}>
        <h3 className="modal__titulo">
          {colaborador ? 'Editar colaborador' : 'Novo colaborador'}
        </h3>
        <div className="modal__grid">
          <label>
            Matrícula
            <input value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
          </label>
          <label>
            Nome completo
            <input value={nome} onChange={(e) => setNome(e.target.value)} required />
          </label>
          <label>
            Setor
            <select value={setorId} onChange={(e) => setSetorId(e.target.value)}>
              {setores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Turno
            <input value={turno} onChange={(e) => setTurno(e.target.value)} />
          </label>
          <label>
            Horário
            <input value={horario} onChange={(e) => setHorario(e.target.value)} />
          </label>
          <label>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Colaborador['status'])}
            >
              <option value="ativo">Ativo</option>
              <option value="desligado">Desligado</option>
            </select>
          </label>
        </div>
        <div className="modal__acoes">
          <button type="button" className="btn btn--ghost" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  )
}
