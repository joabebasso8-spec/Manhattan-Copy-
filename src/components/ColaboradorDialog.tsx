// Modal simples para adicionar ou editar um colaborador.
import { useState } from 'react'
import {
  ESCALAS,
  HORARIOS,
  SETOR_PADRAO,
  TURNOS,
  type Colaborador,
  type Escala,
} from '../data/domain'

interface Props {
  colaborador: Colaborador | null // null = novo
  onSalvar: (c: Colaborador | Omit<Colaborador, 'id'>) => void
  onCancelar: () => void
}

export function ColaboradorDialog({ colaborador, onSalvar, onCancelar }: Props) {
  const [matricula, setMatricula] = useState(colaborador?.matricula ?? '')
  const [nome, setNome] = useState(colaborador?.nome ?? '')
  const [turno, setTurno] = useState(colaborador?.turno ?? TURNOS[0])
  const [horario, setHorario] = useState(colaborador?.horario ?? HORARIOS[0])
  const [escala, setEscala] = useState<Escala | ''>(colaborador?.escala ?? '')

  function submeter(e: React.FormEvent) {
    e.preventDefault()
    if (!matricula.trim() || !nome.trim()) return
    const base = {
      matricula: matricula.trim(),
      nome: nome.trim(),
      // Setor sempre "Fundição Manual Garol".
      setorId: SETOR_PADRAO.id,
      turno,
      horario,
      // Status nao e mais editado no formulario; novos colaboradores nascem ativos.
      status: colaborador?.status ?? ('ativo' as const),
      escala: escala || undefined,
    }
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
            <select value={SETOR_PADRAO.id} disabled>
              <option value={SETOR_PADRAO.id}>{SETOR_PADRAO.nome}</option>
            </select>
          </label>
          <label>
            Turno
            <select value={turno} onChange={(e) => setTurno(e.target.value)}>
              {TURNOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Horário
            <select value={horario} onChange={(e) => setHorario(e.target.value)}>
              {HORARIOS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
          <label>
            Escala
            <select value={escala} onChange={(e) => setEscala(e.target.value as Escala | '')}>
              <option value="">— selecione —</option>
              {ESCALAS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="modal__dica">
          Ao definir uma <strong>Escala</strong>, as folgas do colaborador são preenchidas
          automaticamente na semana (regime 6×2).
        </p>
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
