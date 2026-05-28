'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NICHOS_CONFIG } from '@/types'
import GenerationResult from '@/components/generation/GenerationResult'
import type { Generacion } from '@/types'
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react'

interface HistoryItemProps {
  generacion: Generacion
}

export default function HistoryItem({ generacion }: HistoryItemProps) {
  const [expanded, setExpanded] = useState(false)
  const { label, emoji } = NICHOS_CONFIG[generacion.nicho]

  const formattedDate = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(generacion.createdAt))

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
          <div className="shrink-0 text-muted-foreground mt-0.5">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
