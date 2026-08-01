// =====================================================================
// Dominio central da aplicacao — Projeto Manhattan / Modulo DDS e GL
// =====================================================================
//
// O enum de siglas de status (a "Legenda de Preenchimento") e o coracao
// do dominio. Ele e reutilizado nas grades de presenca das telas de
// Ginastica Laboral (mensal) e de DDS (semanal), no painel de legenda do
// menu e em qualquer componente que exiba ou edite presenca.

/** Siglas de status de presenca/ausencia usadas em toda a aplicacao. */
export enum StatusPresenca {
  /** Presenca confirmada por assinatura fisica na lista impressa. */
  Presente = 'X',
  Folga = 'FO',
  Falta = 'F',
  Ferias = 'FE',
  Atestado = 'AT',
  Afastado = 'AF',
  Desligado = 'D',
}

/** Descricao humana de cada sigla, para tooltips e legenda. */
export const LEGENDA_STATUS: Record<StatusPresenca, string> = {
  [StatusPresenca.Presente]: 'Presença assinada',
  [StatusPresenca.Folga]: 'Folga',
  [StatusPresenca.Falta]: 'Falta',
  [StatusPresenca.Ferias]: 'Férias',
  [StatusPresenca.Atestado]: 'Atestado',
  [StatusPresenca.Afastado]: 'Afastado',
  [StatusPresenca.Desligado]: 'Desligado',
}

/** Cor associada a cada sigla, para leitura rapida na grade. */
export const COR_STATUS: Record<StatusPresenca, string> = {
  [StatusPresenca.Presente]: '#1b7f4b',
  [StatusPresenca.Folga]: '#6b7280',
  [StatusPresenca.Falta]: '#c2410c',
  [StatusPresenca.Ferias]: '#2563eb',
  [StatusPresenca.Atestado]: '#7c3aed',
  [StatusPresenca.Afastado]: '#b45309',
  [StatusPresenca.Desligado]: '#991b1b',
}

/** Lista ordenada das siglas de AUSENCIA (exclui a presenca "X"). */
export const SIGLAS_AUSENCIA: StatusPresenca[] = [
  StatusPresenca.Folga,
  StatusPresenca.Falta,
  StatusPresenca.Ferias,
  StatusPresenca.Atestado,
  StatusPresenca.Afastado,
  StatusPresenca.Desligado,
]

/**
 * Opcoes selecionaveis em uma celula da grade: apenas as siglas de AUSENCIA.
 * A presenca nao e marcada digitalmente (o normal e o espaco em branco, que
 * sera assinado fisicamente na lista impressa), por isso "X" nao aparece como
 * opcao.
 */
export const OPCOES_CELULA: StatusPresenca[] = [...SIGLAS_AUSENCIA]

// ---------------------------------------------------------------------
// Modelo de dados
// ---------------------------------------------------------------------

export type StatusColaborador = 'ativo' | 'desligado'

/** Escalas de trabalho (regime 6x2 — trabalha 6 dias, folga 2). */
export type Escala = 'F' | 'H' | 'B' | 'D'

export const ESCALAS: Escala[] = ['F', 'H', 'B', 'D']

/** Setor fixo dos colaboradores cadastrados pelo formulario. */
export const SETOR_PADRAO = { id: 'st-fundicao-garol', nome: 'Fundição Manual Garol' }

/** Opcoes fixas de turno no cadastro de colaborador. */
export const TURNOS: string[] = ['Manhã', 'Tarde', 'Noite']

/** Rotulo ordinal do turno usado na impressao (1º/2º/3º Turno). */
export function turnoOrdinal(turno: string): string {
  const idx = TURNOS.indexOf(turno)
  return idx >= 0 ? `${idx + 1}º Turno` : turno
}

/** Opcoes fixas de horario no cadastro de colaborador. */
export const HORARIOS: string[] = ['06:00 às 14:20', '14:20 às 22:40', '22:40 às 06:00']

// Dias da semana como indices: 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab.
/**
 * Retorna os dias de folga (indices de dia da semana, 0=Dom..6=Sab) de uma
 * escala, tomando a semana atual como base. Regime 6x2 (folga 2 dias):
 *  - F: quarta e quinta
 *  - H: hoje e amanha (relativo ao dia atual)
 *  - B: domingo e segunda
 *  - D: terca e quarta
 */
export function folgasDaEscala(escala: Escala, hojeWeekday: number): number[] {
  switch (escala) {
    case 'F':
      return [3, 4]
    case 'H':
      return [hojeWeekday % 7, (hojeWeekday + 1) % 7]
    case 'B':
      return [0, 1]
    case 'D':
      return [2, 3]
  }
}

export interface Colaborador {
  id: string
  matricula: string
  nome: string
  setorId: string
  turno: string
  /** Codigo de turno/horario exibido na segunda linha da coluna. */
  horario: string
  status: StatusColaborador
  /** Escala de trabalho (opcional) usada para auto-preencher folgas. */
  escala?: Escala
}

export interface Setor {
  id: string
  nome: string
}

export interface TemaDDS {
  id: string
  ordem: number
  tema: string
  /** Mes de referencia (1-12). */
  mes: number
  /** Data prevista para o DDS (ISO yyyy-mm-dd). */
  dataDDS: string
}

export type TipoLista = 'DDS' | 'GL'

export interface ListaPresenca {
  id: string
  tipo: TipoLista
  setorId: string
  turno: string
  /** Referencia textual do periodo (ex.: "Julho/2026" ou "Semana 27"). */
  referencia: string
  periodoInicio: string
  periodoFim: string
  supervisor: string
}

export interface RegistroPresenca {
  colaboradorId: string
  listaId: string
  /** Chave do dia: numero do dia (GL) ou weekday index 0-6 (DDS). */
  dia: number
  status: StatusPresenca | ''
}

// ---------------------------------------------------------------------
// Papeis de usuario e permissoes (role-based access)
// ---------------------------------------------------------------------

export type PapelUsuario = 'supervisor' | 'admin' | 'consulta'

export interface Usuario {
  nome: string
  papel: PapelUsuario
  empresa: string
  unidade: string
}
