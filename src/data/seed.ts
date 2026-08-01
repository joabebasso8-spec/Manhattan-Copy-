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
  { id: 'st-fundicao-garol', nome: 'Fundição Manual Garol' },
  { id: 'st-esmaltacao', nome: 'Esmaltação' },
  { id: 'st-fornos', nome: 'Fornos' },
  { id: 'st-prensas', nome: 'Prensas' },
  { id: 'st-expedicao', nome: 'Expedição' },
  { id: 'st-manutencao', nome: 'Manutenção' },
]

// Colaboradores ficticios distribuidos nos tres turnos (Manha, Tarde, Noite),
// todos do setor Fundicao Manual Garol. Servem para demonstrar o filtro por
// turno e a paginacao.
const MANHA = '06:00 às 14:20'
const TARDE = '14:20 às 22:40'
const NOITE = '22:40 às 06:00'
const SETOR = 'st-fundicao-garol'

export const COLABORADORES: Colaborador[] = [
  // Turno da Manhã
  { id: 'c01', matricula: '10234', nome: 'Ana Beatriz Ferreira', setorId: SETOR, turno: 'Manhã', horario: MANHA, status: 'ativo', escala: 'F' },
  { id: 'c02', matricula: '10245', nome: 'Bruno Carvalho Lima', setorId: SETOR, turno: 'Manhã', horario: MANHA, status: 'ativo', escala: 'H' },
  { id: 'c03', matricula: '10251', nome: 'Camila Souza Rocha', setorId: SETOR, turno: 'Manhã', horario: MANHA, status: 'ativo', escala: 'B' },
  { id: 'c04', matricula: '10260', nome: 'Diego Nascimento Alves', setorId: SETOR, turno: 'Manhã', horario: MANHA, status: 'ativo', escala: 'D' },
  { id: 'c05', matricula: '10277', nome: 'Eduarda Martins Pinto', setorId: SETOR, turno: 'Manhã', horario: MANHA, status: 'ativo', escala: 'F' },
  // Turno da Tarde
  { id: 'c06', matricula: '10281', nome: 'Fábio Oliveira Ramos', setorId: SETOR, turno: 'Tarde', horario: TARDE, status: 'ativo', escala: 'H' },
  { id: 'c07', matricula: '10298', nome: 'Gabriela Dias Moreira', setorId: SETOR, turno: 'Tarde', horario: TARDE, status: 'ativo', escala: 'B' },
  { id: 'c08', matricula: '10305', nome: 'Henrique Barbosa Cruz', setorId: SETOR, turno: 'Tarde', horario: TARDE, status: 'ativo', escala: 'D' },
  { id: 'c09', matricula: '10312', nome: 'Isabela Cardoso Nunes', setorId: SETOR, turno: 'Tarde', horario: TARDE, status: 'ativo', escala: 'F' },
  { id: 'c10', matricula: '10327', nome: 'João Pedro Teixeira', setorId: SETOR, turno: 'Tarde', horario: TARDE, status: 'ativo', escala: 'H' },
  // Turno da Noite
  { id: 'c11', matricula: '10334', nome: 'Karina Lopes Almeida', setorId: SETOR, turno: 'Noite', horario: NOITE, status: 'ativo', escala: 'B' },
  { id: 'c12', matricula: '10349', nome: 'Lucas Gomes Ribeiro', setorId: SETOR, turno: 'Noite', horario: NOITE, status: 'ativo', escala: 'D' },
  { id: 'c13', matricula: '10356', nome: 'Mariana Freitas Costa', setorId: SETOR, turno: 'Noite', horario: NOITE, status: 'ativo', escala: 'F' },
  { id: 'c14', matricula: '10361', nome: 'Nathan Vieira Santos', setorId: SETOR, turno: 'Noite', horario: NOITE, status: 'desligado', escala: 'H' },
]

export const TEMAS_DDS: TemaDDS[] = [
  { id: 't01', ordem: 1, tema: 'Uso correto de EPI', mes: 7, dataDDS: '2026-07-06' },
  { id: 't02', ordem: 2, tema: 'Prevenção de quedas e escorregões', mes: 7, dataDDS: '2026-07-07' },
  { id: 't03', ordem: 3, tema: 'Ergonomia no posto de trabalho', mes: 7, dataDDS: '2026-07-08' },
  { id: 't04', ordem: 4, tema: 'Segurança com produtos químicos', mes: 7, dataDDS: '2026-07-09' },
  { id: 't05', ordem: 5, tema: 'Trabalho em altura', mes: 7, dataDDS: '2026-07-10' },
  // Temas da Semana 31 (27/07 a 02/08) — alimentam o painel da lista de DDS.
  { id: 't06', ordem: 6, tema: 'Atenção a pisos molhados na esmaltação', mes: 7, dataDDS: '2026-07-27' },
  { id: 't07', ordem: 7, tema: 'Postura correta ao levantar peças', mes: 7, dataDDS: '2026-07-28' },
  { id: 't08', ordem: 8, tema: 'Uso de protetor auricular nos fornos', mes: 7, dataDDS: '2026-07-29' },
  { id: 't09', ordem: 9, tema: 'Descarte seguro de resíduos', mes: 7, dataDDS: '2026-07-30' },
  { id: 't10', ordem: 10, tema: 'Comunicação de quase-acidentes', mes: 7, dataDDS: '2026-07-31' },
  { id: 't11', ordem: 11, tema: 'Combate a incêndio e rotas de fuga', mes: 8, dataDDS: '2026-08-03' },
  { id: 't12', ordem: 12, tema: 'Bloqueio e etiquetagem (LOTO)', mes: 8, dataDDS: '2026-08-04' },
  { id: 't13', ordem: 13, tema: 'Movimentação manual de cargas', mes: 8, dataDDS: '2026-08-05' },
]

const HOJE = '2026-07-30'

export const LISTA_GINASTICA: ListaPresenca = {
  id: 'lst-gl-2026-07',
  tipo: 'GL',
  setorId: 'st-fundicao-garol',
  turno: 'Manhã',
  referencia: 'Julho / 2026',
  periodoInicio: '2026-07-01',
  periodoFim: '2026-07-31',
  supervisor: 'Carlos Andrade',
}

export const LISTA_DDS: ListaPresenca = {
  id: 'lst-dds-2026-w31',
  tipo: 'DDS',
  setorId: 'st-fundicao-garol',
  turno: 'Manhã',
  referencia: 'Semana 31 — 27/07 a 02/08',
  periodoInicio: '2026-07-27',
  periodoFim: '2026-08-02',
  supervisor: 'Carlos Andrade',
}

// Gera registros ficticios apenas para AUSENCIAS; dias trabalhados ficam em
// branco (o estado normal, assinado fisicamente na lista impressa).
function gerarRegistrosGinastica(): RegistroPresenca[] {
  const registros: RegistroPresenca[] = []
  const diasNoMes = 31
  COLABORADORES.forEach((c, ci) => {
    for (let dia = 1; dia <= diasNoMes; dia++) {
      let status: StatusPresenca | '' = ''
      if (c.status === 'desligado' && dia > 10) status = StatusPresenca.Desligado
      else if (ci === 4 && dia >= 14 && dia <= 20) status = StatusPresenca.Ferias
      else if (ci === 7 && (dia === 9 || dia === 10)) status = StatusPresenca.Atestado
      // demais dias (inclusive fins de semana): em branco (presenca por assinatura)
      if (status !== '') registros.push({ colaboradorId: c.id, listaId: LISTA_GINASTICA.id, dia, status })
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
      if (c.status === 'desligado') status = StatusPresenca.Desligado
      else if (ci === 2 && d === 3) status = StatusPresenca.Falta
      // demais dias (inclusive fins de semana): em branco (presenca por assinatura)
      if (status !== '') registros.push({ colaboradorId: c.id, listaId: LISTA_DDS.id, dia: d, status })
    }
  })
  return registros
}

export const REGISTROS_INICIAIS: RegistroPresenca[] = [
  ...gerarRegistrosGinastica(),
  ...gerarRegistrosDDS(),
]

export { HOJE }
