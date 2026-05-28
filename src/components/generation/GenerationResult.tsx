import ContentCard from './ContentCard'
import type { GeneracionContenido } from '@/types'
import { ImagePlay, Hash, BookOpen, MousePointerClick, Video, AlignLeft, CalendarDays, Camera } from 'lucide-react'

interface GenerationResultProps {
  contenido: GeneracionContenido
}

const SECTIONS = [
  {
    key: 'postInstagram' as const,
    title: 'Post de Instagram',
    icon: <ImagePlay size={13} />,
  },
  {
    key: 'caption' as const,
    title: 'Caption',
    icon: <AlignLeft size={13} />,
  },
  {
    key: 'hashtags' as const,
    title: 'Hashtags',
    icon: <Hash size={13} />,
  },
  {
    key: 'historia' as const,
    title: 'Idea de Historia',
    icon: <BookOpen size={13} />,
  },
  {
    key: 'cta' as const,
    title: 'Llamada a la Acción',
    icon: <MousePointerClick size={13} />,
  },
  {
    key: 'reel' as const,
    title: 'Idea de Reel',
    icon: <Video size={13} />,
  },
]

const EXTRA_SECTIONS = [
  {
    key: 'estrategia' as const,
    title: 'Estrategia de Publicación',
    icon: <CalendarDays size={13} />,
  },
  {
    key: 'sugerenciaFotos' as const,
    title: 'Sugerencia de Fotos',
    icon: <Camera size={13} />,
  },
]

export default function GenerationResult({ contenido }: GenerationResultProps) {
  return (
    <div className="space-y-6">
      {/* Contenido principal */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-2">
            Contenido generado
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map(({ key, title, icon }) => (
            <ContentCard
              key={key}
              title={title}
              content={contenido[key]}
              icon={icon}
            />
          ))}
        </div>
      </div>

      {/* Estrategia y fotos */}
      {(contenido.estrategia || contenido.sugerenciaFotos) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-2">
              Cómo usar este contenido
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXTRA_SECTIONS.map(({ key, title, icon }) =>
              contenido[key] ? (
                <ContentCard
                  key={key}
                  title={title}
                  content={contenido[key] as string}
                  icon={icon}
                />
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  )
}
