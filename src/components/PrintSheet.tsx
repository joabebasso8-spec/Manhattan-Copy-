// =====================================================================
// Folha de impressao — replica o layout oficial das listas de presenca
// (formularios GL: Ginastica Laboral e DDS: Dialogo Diario de Seguranca).
// Visivel apenas na impressao (@media print); oculta na tela.
// Cada folha impressa contém no máximo 10 colaboradores.
// =====================================================================

import type { ReactNode } from 'react'
import type { Colaborador } from '../data/domain'

export interface ColunaImpressao {
  key: string | number
  label: string
}

const POR_FOLHA = 10

interface Props {
  codigo: string // LPGL | LPDDS
  subtitulo: string // "GL: Ginástica Laboral" | "DDS: Diálogo Diário de Segurança"
  emissao: string
  usuario: string
  empresa: string
  unidade: string
  refCabecalho: string // ex.: "7/2026"
  setorNome: string
  turnoLabel: string
  mes: string
  periodoRotulo: string // "Período" | "Semana"
  periodoValor: string
  supervisor: string
  pausas?: string
  meio: ReactNode // descrição (GL) ou temas (DDS)
  colunas: ColunaImpressao[]
  colaboradores: Colaborador[]
  linhaHorario: (c: Colaborador) => string
  /** Valor a exibir em cada célula (ex.: "X", "FO"); vazio = em branco. */
  valorCelula?: (c: Colaborador, colKey: string | number) => string
  /** Linhas mais altas, com espaço em branco para assinatura (usado na Ginástica). */
  assinatura?: boolean
}

export function PrintSheet(props: Props) {
  const { colaboradores } = props

  // Divide os colaboradores em folhas de no máximo 10.
  const folhas: Colaborador[][] = []
  for (let i = 0; i < colaboradores.length; i += POR_FOLHA) {
    folhas.push(colaboradores.slice(i, i + POR_FOLHA))
  }
  if (folhas.length === 0) folhas.push([])

  return (
    <div className="print-sheet">
      {folhas.map((grupo, idx) => (
        <FolhaImpressao
          key={idx}
          {...props}
          colaboradores={grupo}
          ultima={idx === folhas.length - 1}
        />
      ))}
    </div>
  )
}

function FolhaImpressao({
  codigo,
  subtitulo,
  emissao,
  usuario,
  empresa,
  unidade,
  refCabecalho,
  setorNome,
  turnoLabel,
  mes,
  periodoRotulo,
  periodoValor,
  supervisor,
  pausas,
  meio,
  colunas,
  colaboradores,
  linhaHorario,
  valorCelula,
  assinatura,
  ultima,
}: Props & { ultima: boolean }) {
  return (
    <section className={`ps-folha${ultima ? '' : ' ps-folha--quebra'}`}>
      {/* Barra fina superior */}
      <div className="ps-top">
        <span>
          <strong>Código:</strong> {codigo}&nbsp;&nbsp;&nbsp;
          <strong>Emissão:</strong> {emissao}&nbsp;&nbsp;&nbsp;
          <strong>Usuário:</strong> {usuario}
        </span>
        <span>
          {empresa} - Unidade {unidade} - {refCabecalho}
        </span>
      </div>

      {/* Título */}
      <div className="ps-titulo">
        <strong>Roca Brasil</strong> &nbsp;&nbsp; Lista de Presença - {subtitulo}
      </div>

      {/* Região de informações em três colunas */}
      <div className="ps-info">
        <div className="ps-info__col ps-info__dados">
          <div><span className="ps-lbl">Setor:</span> {setorNome}</div>
          <div><span className="ps-lbl">Turno:</span> {turnoLabel}</div>
          <div><span className="ps-lbl">Mês:</span> {mes}</div>
          <div><span className="ps-lbl">{periodoRotulo}:</span> {periodoValor}</div>
          <div><span className="ps-lbl">Supervisor:</span> {supervisor}</div>
          {pausas && (
            <div className="ps-pausas">
              <div className="ps-pausas__t">Intervalos de Descanso / Pausas Laborais</div>
              <div className="ps-pausas__v">{pausas}</div>
            </div>
          )}
        </div>

        <div className="ps-info__col ps-info__meio">{meio}</div>

        <div className="ps-info__col ps-info__valid">
          <h3>Validação de Entrega e Recebimento</h3>
          <div className="ps-valid__linha">Entregue em: ______ / ______ / ____________</div>
          <div className="ps-valid__linha">Entregue por: _______________________________</div>
          <div className="ps-valid__linha">Recebido por: _______________________________</div>
          <div className="ps-valid__linha">Assinatura: _________________________________</div>
        </div>
      </div>

      {/* Tabela de presença (células em branco para assinatura) */}
      <table className="ps-tabela">
        <thead>
          <tr>
            <th className="ps-colab">COLABORADOR / HORÁRIO</th>
            {colunas.map((col) => (
              <th key={col.key} className="ps-dia">
                {col.label}
              </th>
            ))}
            {/* Coluna extra (mais larga) de assinatura — só na Ginástica. */}
            {assinatura && <th className="ps-assinatura" />}
          </tr>
        </thead>
        <tbody>
          {colaboradores.map((c) => (
            <tr key={c.id}>
              <td className="ps-colab">
                <div className="ps-colab__nome">
                  <strong>{c.matricula}</strong> {c.nome.toUpperCase()}
                </div>
                <div className="ps-colab__hor">{linhaHorario(c)}</div>
              </td>
              {colunas.map((col) => (
                <td key={col.key} className="ps-celula">
                  {valorCelula ? valorCelula(c, col.key) : ''}
                </td>
              ))}
              {assinatura && <td className="ps-assinatura ps-celula" />}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
