'use client'

import { NICHOS_CONFIG, type Nicho } from '@/types'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface NichoSelectorProps {
  value: Nicho | null
  onChange: (nicho: Nicho) => void
  nichoPersonalizado: string
  onNichoPersonalizadoChange: (value: string) => void
}

export default function NichoSelector({
  value,
  onChange,
  nichoPersonalizado,
  onNichoPersonalizadoChange,
}: NichoSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">Selecciona tu nicho</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {(Object.entries(NICHOS_CONFIG) as [Nicho, { label: string; emoji: string }][]).map(
          ([nicho, { label, emoji }]) => {
            const isSelected = value === nicho
            return (
              <button
                key={nicho}
                type="button"
                onClick={() => onChange(nicho)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium',
                  'transition-all duration-150 cursor-pointer select-none',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <span className="text-2xl" role="img" aria-label={label}>
                  {emoji}
                </span>
                <span className="text-center leading-tight">{label}</span>
              </button>
            )
          }
        )}
      </div>

      {/* Campo de texto para nicho personalizado */}
      {value === 'otro' && (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">¿Cuál es tu tipo de negocio?</p>
          <Input
            placeholder="Ej: Veterinaria, Farmacia, Estudio de tatuajes..."
            value={nichoPersonalizado}
            onChange={(e) => onNichoPersonalizadoChange(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </div>
  )
}
