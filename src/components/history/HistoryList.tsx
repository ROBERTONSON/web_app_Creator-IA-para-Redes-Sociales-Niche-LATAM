import Link from 'next/link'
import HistoryItem from './HistoryItem'
import type { Generacion } from '@/types'
import { Sparkles, History } from 'lucide-react'

interface HistoryListProps {
  generaciones: Generacion[]
}

export default function HistoryList({ generaciones }: HistoryListProps) {
  if (generaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <History size={24} className="text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">Aún no tienes generaciones</p>
          <p className="text-sm text-muted-foreground">
            Genera tu primer contenido para verlo aquí.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Sparkles size={14} />
          Ir al generador
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {generaciones.map((g) => (
        <HistoryItem key={g.id} generacion={g} />
      ))}
    </div>
  )
}
