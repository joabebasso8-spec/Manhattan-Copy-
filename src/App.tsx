import { Navigate, Route, Routes } from 'react-router-dom'
import { podeAcessar, type ChaveTela } from './auth/permissions'
import { useStore } from './data/store'
import { MenuPrincipal } from './pages/MenuPrincipal'
import { GerarListaDDS } from './pages/GerarListaDDS'
import { GerarListaGinastica } from './pages/GerarListaGinastica'
import { CadastrarTemas } from './pages/CadastrarTemas'
import { Placeholder } from './pages/Placeholder'
import type { ReactNode } from 'react'

// Guarda de rota: reforca o controle de permissao tambem na navegacao direta
// por URL, nao apenas na aparencia do cartao do menu.
function Guard({ chave, children }: { chave: ChaveTela; children: ReactNode }) {
  const { usuario } = useStore()
  if (!podeAcessar(usuario.papel, chave)) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPrincipal />} />

      <Route
        path="/dds"
        element={
          <Guard chave="gerar-dds">
            <GerarListaDDS />
          </Guard>
        }
      />
      <Route
        path="/ginastica"
        element={
          <Guard chave="gerar-ginastica">
            <GerarListaGinastica />
          </Guard>
        }
      />
      <Route
        path="/temas"
        element={
          <Guard chave="cadastrar-temas">
            <CadastrarTemas />
          </Guard>
        }
      />

      <Route
        path="/protocolar"
        element={
          <Guard chave="protocolar">
            <Placeholder
              titulo="Protocolar Lista de DDS e GL"
              icone="📥"
              descricao="Registro e protocolo das listas concluídas para arquivamento e rastreabilidade."
              campos={[
                'Seleção da lista (DDS ou GL) a protocolar',
                'Data de protocolo e responsável pela entrega',
                'Anexo do documento assinado (digitalização)',
                'Situação: pendente / protocolada / arquivada',
                'Número de protocolo gerado automaticamente',
              ]}
            />
          </Guard>
        }
      />
      <Route
        path="/relatorio"
        element={
          <Guard chave="relatorio">
            <Placeholder
              titulo="Relatório Estatístico"
              icone="📊"
              descricao="Indicadores de adesão e ausências por período, setor e turno."
              campos={[
                'Filtros por período, setor, turno e tipo de lista',
                'Percentual de presença x ausências',
                'Distribuição por sigla (FO, F, FE, AT, AF, D)',
                'Comparativo mensal / semanal',
                'Exportação para PDF / planilha',
              ]}
            />
          </Guard>
        }
      />
      <Route
        path="/pendencias"
        element={
          <Guard chave="pendencias">
            <Placeholder
              titulo="Pendências e Entregas"
              icone="📋"
              descricao="Acompanhamento de listas pendentes de preenchimento e entrega."
              campos={[
                'Listas em aberto por setor/turno',
                'Prazo de entrega e dias em atraso',
                'Responsável e situação atual',
                'Alertas de vencimento',
              ]}
            />
          </Guard>
        }
      />
      <Route
        path="/horario-contratados"
        element={
          <Guard chave="horario-contratados">
            <Placeholder
              titulo="Horário nos Contratados"
              icone="⏱️"
              descricao="Controle de horários e jornadas de empresas contratadas."
              campos={[
                'Empresa contratada e contrato de referência',
                'Turnos e horários praticados',
                'Vínculo com setores atendidos',
                'Período de vigência',
              ]}
            />
          </Guard>
        }
      />
      <Route
        path="/novo-colaborador"
        element={
          <Guard chave="novo-colaborador">
            <Placeholder
              titulo="Novo Colaborador"
              icone="➕"
              descricao="Cadastro de novos colaboradores no quadro do setor."
              campos={[
                'Matrícula, nome completo e setor',
                'Turno, horário e data de admissão',
                'Status (ativo / desligado)',
                'Vínculo às listas de DDS e GL do setor',
              ]}
            />
          </Guard>
        }
      />
      <Route
        path="/colaboradores"
        element={
          <Guard chave="lista-colaboradores">
            <Placeholder
              titulo="Lista de Colaboradores"
              icone="👥"
              descricao="Consulta e manutenção do quadro de colaboradores."
              campos={[
                'Listagem com matrícula, nome, setor e turno',
                'Filtros por setor, turno e status',
                'Edição e desligamento de colaborador',
                'Exportação da relação',
              ]}
            />
          </Guard>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
