// =====================================================================
// Store da aplicacao — estado global com persistencia em localStorage.
// =====================================================================

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  type Colaborador,
  type Setor,
  type TemaDDS,
  type RegistroPresenca,
  type Usuario,
  type StatusPresenca,
  type PapelUsuario,
} from './domain'
import {
  COLABORADORES,
  SETORES,
  TEMAS_DDS,
  REGISTROS_INICIAIS,
  USUARIO_LOGADO,
  LISTA_GINASTICA,
  LISTA_DDS,
} from './seed'

const STORAGE_KEY = 'manhattan-dds-gl:v1'

interface EstadoPersistido {
  colaboradores: Colaborador[]
  temas: TemaDDS[]
  registros: RegistroPresenca[]
  papel: PapelUsuario
}

interface StoreContextValue {
  usuario: Usuario
  setores: Setor[]
  colaboradores: Colaborador[]
  temas: TemaDDS[]
  registros: RegistroPresenca[]
  listaGinastica: typeof LISTA_GINASTICA
  listaDDS: typeof LISTA_DDS
  // acoes
  definirPapel: (papel: PapelUsuario) => void
  setStatus: (listaId: string, colaboradorId: string, dia: number, status: StatusPresenca | '') => void
  addColaborador: (c: Omit<Colaborador, 'id'>) => string
  updateColaborador: (c: Colaborador) => void
  removeColaborador: (id: string) => void
  aplicarFolgas: (listaId: string, colaboradorId: string, dias: number[]) => void
  addTema: (t: Omit<TemaDDS, 'id'>) => void
  updateTema: (t: TemaDDS) => void
  removeTema: (id: string) => void
  autoPreencherFolgas: (listaId: string, dias: number[], colaboradorIds: string[]) => void
  resetar: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function carregar(): EstadoPersistido {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as EstadoPersistido
  } catch {
    /* ignora e usa seed */
  }
  return {
    colaboradores: COLABORADORES,
    temas: TEMAS_DDS,
    registros: REGISTROS_INICIAIS,
    papel: USUARIO_LOGADO.papel,
  }
}

let seq = 0
const novoId = (prefixo: string) => `${prefixo}-${Date.now().toString(36)}-${seq++}`

export function StoreProvider({ children }: { children: ReactNode }) {
  const inicial = useMemo(carregar, [])
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(inicial.colaboradores)
  const [temas, setTemas] = useState<TemaDDS[]>(inicial.temas)
  const [registros, setRegistros] = useState<RegistroPresenca[]>(inicial.registros)
  const [papel, setPapel] = useState<PapelUsuario>(inicial.papel)

  useEffect(() => {
    const estado: EstadoPersistido = { colaboradores, temas, registros, papel }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
    } catch {
      /* storage cheio/indisponivel — ignora */
    }
  }, [colaboradores, temas, registros, papel])

  const value: StoreContextValue = {
    usuario: { ...USUARIO_LOGADO, papel },
    setores: SETORES,
    colaboradores,
    temas,
    registros,
    listaGinastica: LISTA_GINASTICA,
    listaDDS: LISTA_DDS,

    definirPapel: (p) => setPapel(p),

    setStatus: (listaId, colaboradorId, dia, status) => {
      setRegistros((prev) => {
        const idx = prev.findIndex(
          (r) => r.listaId === listaId && r.colaboradorId === colaboradorId && r.dia === dia,
        )
        if (idx === -1) {
          return [...prev, { listaId, colaboradorId, dia, status }]
        }
        const copia = prev.slice()
        copia[idx] = { ...copia[idx], status }
        return copia
      })
    },

    addColaborador: (c) => {
      const novo = { ...c, id: novoId('c') }
      setColaboradores((prev) => [...prev, novo])
      return novo.id
    },
    updateColaborador: (c) =>
      setColaboradores((prev) => prev.map((x) => (x.id === c.id ? c : x))),
    removeColaborador: (id) => {
      setColaboradores((prev) => prev.filter((x) => x.id !== id))
      setRegistros((prev) => prev.filter((r) => r.colaboradorId !== id))
    },

    // Marca "FO" (folga) nos dias informados para um colaborador em uma lista.
    aplicarFolgas: (listaId, colaboradorId, dias) => {
      setRegistros((prev) => {
        const copia = prev.slice()
        for (const dia of dias) {
          const idx = copia.findIndex(
            (r) => r.listaId === listaId && r.colaboradorId === colaboradorId && r.dia === dia,
          )
          if (idx === -1) {
            copia.push({ listaId, colaboradorId, dia, status: 'FO' as StatusPresenca })
          } else {
            copia[idx] = { ...copia[idx], status: 'FO' as StatusPresenca }
          }
        }
        return copia
      })
    },

    addTema: (t) => setTemas((prev) => [...prev, { ...t, id: novoId('t') }]),
    updateTema: (t) => setTemas((prev) => prev.map((x) => (x.id === t.id ? t : x))),
    removeTema: (id) => setTemas((prev) => prev.filter((x) => x.id !== id)),

    autoPreencherFolgas: (listaId, dias, colaboradorIds) => {
      setRegistros((prev) => {
        const copia = prev.slice()
        for (const colaboradorId of colaboradorIds) {
          for (const dia of dias) {
            const idx = copia.findIndex(
              (r) => r.listaId === listaId && r.colaboradorId === colaboradorId && r.dia === dia,
            )
            if (idx === -1) {
              copia.push({ listaId, colaboradorId, dia, status: 'FO' as StatusPresenca })
            } else if (copia[idx].status === '') {
              copia[idx] = { ...copia[idx], status: 'FO' as StatusPresenca }
            }
          }
        }
        return copia
      })
    },

    resetar: () => {
      localStorage.removeItem(STORAGE_KEY)
      setColaboradores(COLABORADORES)
      setTemas(TEMAS_DDS)
      setRegistros(REGISTROS_INICIAIS)
      setPapel(USUARIO_LOGADO.papel)
    },
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de <StoreProvider>')
  return ctx
}
