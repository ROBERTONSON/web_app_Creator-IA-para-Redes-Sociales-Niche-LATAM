import Link from 'next/link'
import { Sparkles, Zap, Target, History, ArrowRight, Check } from 'lucide-react'

const NICHOS = [
  { emoji: '🦷', label: 'Odontólogos' },
  { emoji: '✂️', label: 'Peluquerías' },
  { emoji: '🏠', label: 'Inmobiliarias' },
  { emoji: '💪', label: 'Gimnasios' },
  { emoji: '🔧', label: 'Mecánicos' },
  { emoji: '🍽️', label: 'Restaurantes' },
]

const STEPS = [
  { number: '01', title: 'Elige tu nicho', description: 'Selecciona el tipo de negocio y describe tu promoción o servicio del momento.' },
  { number: '02', title: 'La IA genera tu contenido', description: 'En segundos obtienes post, caption, hashtags, story, reel, CTA y estrategia de publicación.' },
  { number: '03', title: 'Genera tu imagen', description: 'Crea una foto comercial profesional generada con IA a partir de los datos de tu negocio.' },
  { number: '04', title: 'Copia y publica', description: 'Todo el contenido es copiable con un click. Tu historial queda guardado para reutilizarlo.' },
]

const FEATURES = [
  'Contenido en español latinoamericano',
  'Localizado por ciudad y país',
  'Estrategia de publicación incluida',
  'Imagen generada con IA',
  'Historial de generaciones',
  '100% gratuito',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        {/* Grid background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/15 blur-[130px] pointer-events-none" />

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-medium mb-8">
          <Sparkles size={12} />
          Contenido IA localizado para LATAM
        </div>

        {/* Headline */}
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-3xl mb-6">
          Tu contenido para redes,{' '}
          <span className="text-primary">generado por IA</span>
        </h1>

        <p className="relative text-muted-foreground text-lg max-w-xl mb-10">
          Selecciona tu nicho, ingresa los datos de tu negocio y obtén post, caption, hashtags, story, reel, estrategia e imagen — todo en segundos.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-150 shadow-lg shadow-primary/30"
        >
          Ir al Generador de Contenido
          <ArrowRight size={18} />
        </Link>
        <p className="relative mt-4 text-xs text-muted-foreground">Gratis · Sin registro · Listo en segundos</p>

        {/* Niche cards */}
        <div className="relative flex flex-wrap justify-center gap-3 mt-14">
          {NICHOS.map(({ emoji, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 w-[110px]"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-muted-foreground font-medium text-center">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">¿Cómo funciona?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">En 4 pasos simples tendrás contenido profesional listo para publicar.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {STEPS.map(({ number, title, description }) => (
            <div key={number} className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors duration-150 group">
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
              <span className="text-5xl font-bold text-primary/15 leading-none">{number}</span>
              <h3 className="text-base font-semibold mt-3 mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-16 border-y border-border bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">¿Qué genera la app?</h2>
            <p className="text-muted-foreground">Todo el contenido que necesitas para una campaña completa.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: <Zap size={18} />, title: 'Post de Instagram', desc: 'Texto optimizado con emojis, gancho emocional y mención de tu ciudad' },
              { icon: <Target size={18} />, title: 'Caption + Hashtags', desc: 'Caption narrativo y 12-15 hashtags estratégicos para tu mercado' },
              { icon: <Sparkles size={18} />, title: 'Story + Reel + CTA', desc: 'Guión completo para story, concepto de reel y llamada a la acción directa' },
              { icon: <Target size={18} />, title: 'Estrategia de publicación', desc: 'Días y horarios recomendados según hábitos de audiencia en LATAM' },
              { icon: <Zap size={18} />, title: 'Imagen con IA', desc: 'Foto comercial profesional generada automáticamente con Cloudflare AI' },
              { icon: <History size={18} />, title: 'Historial', desc: 'Todas tus generaciones guardadas y organizadas para reutilizar' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors duration-150">
                <div className="text-primary mb-3">{icon}</div>
                <h4 className="font-semibold text-sm mb-1">{title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={13} className="text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <h2 className="relative text-3xl font-bold mb-4">Empieza a generar contenido ahora</h2>
        <p className="relative text-muted-foreground mb-8 max-w-md mx-auto">
          Sin registro, sin tarjeta, completamente gratis. Solo ingresa los datos de tu negocio.
        </p>
        <Link
          href="/dashboard"
          className="relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-150 shadow-lg shadow-primary/30"
        >
          Ir al Generador de Contenido
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        Creator IA LATAM — Contenido para redes sociales generado con IA
      </footer>
    </div>
  )
}
