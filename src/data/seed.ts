// =====================================================================
// Dados ficticios para desenvolvimento e demonstracao.
// NAO usar dados reais de funcionarios (informacoes pessoais sensiveis).
// =====================================================================

import {
  StatusPresenca,
  type Colaborador,
  type Setor,
  type TemaDDS,
  type ListaPresenca,
  type RegistroPresenca,
  type Usuario,
} from './domain'

export const USUARIO_LOGADO: Usuario = {
  nome: 'Carlos Andrade',
  papel: 'supervisor',
  empresa: 'Roca Sanitários Brasil',
  unidade: 'Serra / ES',
}

export const SETORES: Setor[] = [
  { id: 'st-esmaltacao', nome: 'Esmaltação' },
  { id: 'st-fornos', nome: 'Fornos' },
  { id: 'st-prensas', nome: 'Prensas' },
  { id: 'st-expedicao', nome: 'Expedição' },
  { id: 'st-manutencao', nome: 'Manutenção' },
]

// 14 colaboradores ficticios para demonstrar a paginacao (10 por pagina).
export const COLABORADORES: Colaborador[] = [
  { id: 'c01', matricula: '10234', nome: 'Ana Beatriz Ferreira', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c02', matricula: '10245', nome: 'Bruno Carvalho Lima', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c03', matricula: '10251', nome: 'Camila Souza Rocha', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c04', matricula: '10260', nome: 'Diego Nascimento Alves', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c05', matricula: '10277', nome: 'Eduarda Martins Pinto', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c06', matricula: '10281', nome: 'Fábio Oliveira Ramos', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c07', matricula: '10298', nome: 'Gabriela Dias Moreira', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c08', matricula: '10305', nome: 'Henrique Barbosa Cruz', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c09', matricula: '10312', nome: 'Isabela Cardoso Nunes', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c10', matricula: '10327', nome: 'João Pedro Teixeira', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c11', matricula: '10334', nome: 'Karina Lopes Almeida', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c12', matricula: '10349', nome: 'Lucas Gomes Ribeiro', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c13', matricula: '10356', nome: 'Mariana Freitas Costa', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'ativo' },
  { id: 'c14', matricula: '10361', nome: 'Nathan Vieira Santos', setorId: 'st-esmaltacao', turno: 'T1', horario: '06:00–14:20', status: 'desligado' },
]

export const TEMAS_DDS: TemaDDS[] = [
  { id: 't01', ordem: 1, tema: 'Uso correto de EPI', mes: 7, dataDDS: '2026-07-06' },
  { id: 't02', ordem: 2, tema: 'Prevenção de quedas e escorregões', mes: 7, dataDDS: '2026-07-07' },
  { id: 't03', ordem: 3, tema: 'Ergonomia no posto de trabalho', mes: 7, dataDDS: '2026-07-08' },
  { id: 't04', ordem: 4, tema: 'Segurança com produtos químicos', mes: 7, dataDDS: '2026-07-09' },
  { id: 't05', ordem: 5, tema: 'Trabalho em altura', mes: 7, dataDDS: '2026-07-10' },
  { id: 't06', ordem: 6, tema: 'Combate a incêndio e rotas de fuga', mes: 8, dataDDS: '2026-08-03' },
  { id: 't07', ordem: 7, tema: 'Bloqueio e etiquetagem (LOTO)', mes: 8, dataDDS: '2026-08-04' },
  { id: 't08', ordem: 8, tema: 'Movimentação manual de cargas', mes: 8, dataDDS: '2026-08-05' },
]

const HOJE = '2026-07-30'

export const LISTA_GINASTICA: ListaPresenca = {
  id: 'lst-gl-2026-07',
  tipo: 'GL',
  setorId: 'st-esmaltacao',
  turno: 'T1',
  referencia: 'Julho / 2026',
  periodoInicio: '2026-07-01',
  periodoFim: '2026-07-31',
  supervisor: 'Carlos Andrade',
}

export const LISTA_DDS: ListaPresenca = {
  id: 'lst-dds-2026-w31',
  tipo: 'DDS',
  setorId: 'st-esmaltacao',
  turno: 'T1',
  referencia: 'Semana 31 — 27/07 a 02/08',
  periodoInicio: '2026-07-27',
  periodoFim: '2026-08-02',
  supervisor: 'Carlos Andrade',
}

// Gera alguns registros ficticios variados para dar vida as grades.
function gerarRegistrosGinastica(): RegistroPresenca[] {
  const registros: RegistroPresenca[] = []
  const diasNoMes = 31
  COLABORADORES.forEach((c, ci) => {
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataDia = new Date(2026, 6, dia)
      const domingo = dataDia.getDay() === 0
      let status: StatusPresenca | '' = ''
      if (domingo) status = StatusPresenca.Folga
      else if (c.status === 'desligado' && dia > 10) status = StatusPresenca.Desligado
      else if (ci === 4 && dia >= 14 && dia <= 20) status = StatusPresenca.Ferias
      else if (ci === 7 && (dia === 9 || dia === 10)) status = StatusPresenca.Atestado
      else if (dataDia <= new Date(2026, 6, 30)) status = StatusPresenca.Presente
      registros.push({ colaboradorId: c.id, listaId: LISTA_GINASTICA.id, dia, status })
    }
  })
  return registros
}

function gerarRegistrosDDS(): RegistroPresenca[] {
  const registros: RegistroPresenca[] = []
  // dia = weekday index 0 (Dom) a 6 (Sab)
  COLABORADORES.forEach((c, ci) => {
    for (let d = 0; d <= 6; d++) {
      let status: StatusPresenca | '' = ''
      if (d === 0 || d === 6) status = StatusPresenca.Folga
      else if (c.status === 'desligado') status = StatusPresenca.Desligado
      else if (ci === 2 && d === 3) status = StatusPresenca.Falta
      else status = StatusPresenca.Presente
      registros.push({ colaboradorId: c.id, listaId: LISTA_DDS.id, dia: d, status })
    }
  })
  return registros
}

export const REGISTROS_INICIAIS: RegistroPresenca[] = [
  ...gerarRegistrosGinastica(),
  ...gerarRegistrosDDS(),
]

export { HOJE }
