// =====================================================================
// Controle de acesso por papel (role-based access)
// =====================================================================
//
// No ambiente original apenas parte dos nove cartoes do menu fica ativa
// para o usuario logado; os demais aparecem esmaecidos e nao navegam.
// Aqui centralizamos quais chaves de tela cada papel pode acessar.

import type { PapelUsuario } from '../data/domain'

/** Chaves estaveis de cada uma das nove telas do menu. */
export type ChaveTela =
  | 'gerar-dds'
  | 'gerar-ginastica'
  | 'cadastrar-temas'
  | 'protocolar'
  | 'relatorio'
  | 'pendencias'
  | 'horario-contratados'
  | 'novo-colaborador'
  | 'lista-colaboradores'

export interface ItemMenu {
  chave: ChaveTela
  titulo: string
  icone: string
  rota: string
  descricao: string
}

/** Os nove cartoes do menu principal, na ordem da grade 3x3. */
export const ITENS_MENU: ItemMenu[] = [
  {
    chave: 'gerar-dds',
    titulo: 'Gerar Lista de DDS',
    icone: '🛡️',
    rota: '/dds',
    descricao: 'Emissão da lista semanal de Diálogo Diário de Segurança.',
  },
  {
    chave: 'gerar-ginastica',
    titulo: 'Gerar Lista de Ginástica',
    icone: '🤸',
    rota: '/ginastica',
    descricao: 'Emissão da lista mensal de Ginástica Laboral.',
  },
  {
    chave: 'cadastrar-temas',
    titulo: 'Cadastrar Temas de DDS',
    icone: '📚',
    rota: '/temas',
    descricao: 'Banco de temas de segurança usados no DDS semanal.',
  },
  {
    chave: 'protocolar',
    titulo: 'Protocolar Lista de DDS e GL',
    icone: '📥',
    rota: '/protocolar',
    descricao: 'Registro e protocolo das listas concluídas.',
  },
  {
    chave: 'relatorio',
    titulo: 'Relatório Estatístico',
    icone: '📊',
    rota: '/relatorio',
    descricao: 'Indicadores de adesão e ausências por período.',
  },
  {
    chave: 'pendencias',
    titulo: 'Pendências e Entregas',
    icone: '📋',
    rota: '/pendencias',
    descricao: 'Acompanhamento de listas pendentes e entregues.',
  },
  {
    chave: 'horario-contratados',
    titulo: 'Horário nos Contratados',
    icone: '⏱️',
    rota: '/horario-contratados',
    descricao: 'Controle de horários de empresas contratadas.',
  },
  {
    chave: 'novo-colaborador',
    titulo: 'Novo Colaborador',
    icone: '➕',
    rota: '/novo-colaborador',
    descricao: 'Cadastro de novos colaboradores.',
  },
  {
    chave: 'lista-colaboradores',
    titulo: 'Lista de Colaboradores',
    icone: '👥',
    rota: '/colaboradores',
    descricao: 'Consulta e manutenção do quadro de colaboradores.',
  },
]

/** Telas que cada papel tem permissao de acessar. */
const PERMISSOES: Record<PapelUsuario, ChaveTela[]> = {
  // Papel usado no teste original: apenas as tres primeiras telas ativas.
  supervisor: ['gerar-dds', 'gerar-ginastica', 'cadastrar-temas'],
  // Admin enxerga tudo.
  admin: [
    'gerar-dds',
    'gerar-ginastica',
    'cadastrar-temas',
    'protocolar',
    'relatorio',
    'pendencias',
    'horario-contratados',
    'novo-colaborador',
    'lista-colaboradores',
  ],
  // Consulta ve apenas relatorio e lista de colaboradores.
  consulta: ['relatorio', 'lista-colaboradores'],
}

export function podeAcessar(papel: PapelUsuario, chave: ChaveTela): boolean {
  return PERMISSOES[papel].includes(chave)
}
