'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NICHOS_CONFIG } from '@/types'
import GenerationResult from '@/components/generation/GenerationResult'
import { deleteGeneration } from '@/actions/history'
import type { Generacion } from '@/types'
import { ChevronDown, ChevronUp, Calendar, Trash2 } from 'lucide-react'

interface HistoryItemProps {
  generacion: Generacion
  onDeleted: (id: string) => void
}

export default function HistoryItem({ generacion, onDeleted }: HistoryItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { label, emoji } = NICHOS_CONFIG[generacion.nicho]

  const formattedDate = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(generacion.createdAt))

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    startTransition(async () => {
      await deleteGeneration(generacion.id)
      onDeleted(generacion.id)
    })
  }

  return (
    <Card className="transition-all duration-150">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm truncate">
                {generacion.formulario.nombreNegocio}
              </span>
              <Badge variant="secondary" className="text-xs shrink-0">
                {emoji} {label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {generacion.contenido.postInstagram}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={11} />
              {formattedDate}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            {/* Delete button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              disabled={isPending}
              className={
                confirmDelete
                  ? 'h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10'
                  : 'h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10'
              }
            >
              <Trash2 size={13} />
              {confirmDelete ? 'Confirmar' : ''}
            </Button>
            {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="border-t border-border pt-4">
            <GenerationResult contenido={generacion.contenido} />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
