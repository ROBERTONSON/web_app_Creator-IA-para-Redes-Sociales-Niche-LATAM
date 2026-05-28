import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function LoadingState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Sparkles
            size={18}
            className="absolute inset-0 m-auto text-primary animate-pulse"
          />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">Generando contenido...</p>
          <p className="text-xs text-muted-foreground">
            La IA está creando contenido personalizado para tu negocio
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
