# Projeto Manhattan — Módulo de Emissão e Controle de Listas de DDS e GL

Réplica web do módulo de **Emissão e Controle de Listas de DDS e GL**, parte de um
portal interno de fábrica (Roca Sanitários Brasil, unidade Serra/ES), originalmente
construído em Power Apps. O objetivo é **fidelidade visual e funcional**, não a
tecnologia original.

- **DDS** = Diálogo Diário de Segurança (lista **semanal**)
- **GL** = Ginástica Laboral (lista **mensal**)

O módulo permite que supervisores gerem, preencham e controlem listas de presença
de colaboradores em atividades obrigatórias de segurança e saúde ocupacional, com
posterior impressão física para coleta de assinatura.

## Stack

- **React 18 + TypeScript + Vite**
- Roteamento com `react-router-dom` (HashRouter — funciona em hospedagem estática)
- Estado global via Context API com persistência em `localStorage`
- Sem back-end: usa **dados fictícios** de colaboradores e temas para demonstração
  (nenhum dado real de funcionários é utilizado)

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # gera a versão de produção em dist/
npm run preview  # serve o build de produção localmente
```

## Telas implementadas

| Tela | Estado | Observações |
|------|--------|-------------|
| Menu Principal | ✅ | Grade 3×3, painel de legenda, controle de permissão por papel |
| Gerar Lista de Ginástica (mensal) | ✅ | Matriz colaborador × dia, auto-preenchimento de folgas, paginação |
| Gerar Lista de DDS (semanal) | ✅ | Colunas por dia da semana, células dropdown, painel Temas da Semana |
| Cadastrar Temas de DDS | ✅ | CRUD completo com filtro por mês |
| Protocolar, Relatório, Pendências, Horário Contratados, Novo Colaborador, Lista de Colaboradores | 🟡 | Stubs coerentes com o padrão visual — a validar com o dono do processo |

## Controle de permissão (role-based access)

Como no ambiente original, apenas parte dos nove cartões do menu fica ativa para o
usuário logado; os demais aparecem esmaecidos e não navegam. O perfil de acesso pode
ser trocado no canto superior direito do menu (**Supervisor**, **Administrador**,
**Consulta**) para demonstrar o comportamento. A restrição é reforçada também na
navegação direta por URL.

## Legenda de Preenchimento (enum central)

O conjunto de siglas de status é um domínio central (`src/data/domain.ts`), reutilizado
em toda a aplicação:

| Sigla | Significado |
|-------|-------------|
| `X` | Presença assinada |
| `FO` | Folga |
| `F` | Falta |
| `FE` | Férias |
| `AT` | Atestado |
| `AF` | Afastado |
| `D` | Desligado |

## Modelo de dados

Definido em `src/data/domain.ts`:

- **Colaborador**: matrícula, nome, setor, turno, horário, status (ativo/desligado)
- **Setor**
- **TemaDDS**: ordem, tema, mês, data
- **ListaPresenca**: tipo (DDS/GL), setor, turno, referência, período, supervisor
- **RegistroPresenca**: colaborador, lista, dia, sigla de status

## Estrutura

```
src/
  auth/permissions.ts     # papéis, itens do menu e regras de acesso
  data/
    domain.ts             # enum de siglas + tipos do modelo
    seed.ts               # dados fictícios
    store.tsx             # estado global + persistência
  components/             # DocumentHeader, ActionBar, PresenceGrid, Legenda, dialogs
  pages/                  # Menu, Ginástica, DDS, Temas, Placeholder
```

> **Nota:** todos os dados de colaboradores e temas são fictícios, criados apenas para
> desenvolvimento e demonstração. Nenhuma informação pessoal real de funcionários é
> utilizada.
