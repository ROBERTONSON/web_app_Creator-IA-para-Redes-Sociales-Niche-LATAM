'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import NichoSelector from '@/components/dashboard/NichoSelector'
import GeneratorForm from '@/components/dashboard/GeneratorForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import GenerationResult from '@/components/generation/GenerationResult'
import LoadingState from '@/components/generation/LoadingState'
import type { Nicho, GeneracionContenido, UserPlan } from '@/types'
import type { GeneratorFormValues } from '@/lib/validations/generator'
import { NICHOS_CONFIG } from '@/types'
import { canGenerate, getRemainingGenerations, PLAN_LIMITS } from '@/lib/plans'
import { CheckCircle, XCircle, Clock, Zap, Plus } from 'lucide-react'
// ─── Payment banner ───────────────────────────────────────────────────────────

function PaymentBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const payment = searchParams.get('payment')

  useEffect(() => {
    if (!payment) return
    const t = setTimeout(() => router.replace('/dashboard'), 5000)
    return () => clearTimeout(t)
  }, [payment, router])

  if (!payment) return null

  if (payment === 'success') return (
    <div className="flex items-center gap-3 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-500">
      <CheckCircle size={16} className="shrink-0" />
      ¡Pago exitoso! Tu cuenta ha sido actualizada a Premium. Recarga la página si el sidebar no se actualiza.
    </div>
  )
  if (payment === 'failure') return (
    <div className="flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
      <XCircle size={16} className="shrink-0" />
      El pago no pudo procesarse. Puedes intentarlo de nuevo desde el panel lateral.
    </div>
  )
  if (payment === 'pending') return (
    <div className="flex items-center gap-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 text-sm text-yellow-500">
      <Clock size={16} className="shrink-0" />
      Tu pago está pendiente de confirmación. Te avisaremos cuando se acredite.
    </div>
  )
  return null
}

// ─── Upgrade button ───────────────────────────────────────────────────────────

function UpgradeButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        setError(data.error ?? 'No se pudo iniciar el pago.')
        setLoading(false)
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button className="w-full gap-2" onClick={handleUpgrade} disabled={loading}>
        <Zap size={15} />
        {loading ? 'Redirigiendo a MercadoPago...' : 'Actualizar a Premium'}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// ─── Usage counter bar ────────────────────────────────────────────────────────

function UsageBar({ plan }: { plan: UserPlan }) {
  if (plan.plan === 'premium') return null
  const remaining = getRemainingGenerations(plan)
  const used = PLAN_LIMITS.free.generationsPerMonth - remaining
  const pct = (used / PLAN_LIMITS.free.generationsPerMonth) * 100

  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex-1 space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Generaciones este mes</span>
          <span className="font-medium text-foreground">{used}/{PLAN_LIMITS.free.generationsPerMonth}</span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DashboardClientProps {
  userPlan: UserPlan
}

export default function DashboardClient({ userPlan: initialPlan }: DashboardClientProps) {
  // Track plan locally so usage bar and limit update without page reload
  const [plan, setPlan] = useState<UserPlan>(initialPlan)
  const [nicho, setNicho] = useState<Nicho | null>(null)
  const [nichoPersonalizado, setNichoPersonalizado] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeneracionContenido | null>(null)
  const [lastFormData, setLastFormData] = useState<{
    nicho: Nicho
    formulario: GeneratorFormValues
    nichoPersonalizado?: string
  } | null>(null)

  const limitReached = !canGenerate(plan)

  function handleNichoChange(newNicho: Nicho) {
    setNicho(newNicho)
    setNichoPersonalizado('')
    setResult(null)
    setError(null)
  }

  function handleNewGeneration() {
    setResult(null)
    setError(null)
    setNicho(null)
    setNichoPersonalizado('')
    setLastFormData(null)
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(data: GeneratorFormValues) {
    if (!nicho || limitReached) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nicho,
          formulario: data,
          ...(nichoPersonalizado ? { nichoPersonalizado } : {}),
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setError(json.error ?? 'Error al generar contenido. Intenta de nuevo.')
        // If server says limit reached, reflect that immediately
        if (json.limitReached) {
          setPlan(prev => ({
            ...prev,
            generationsUsed: PLAN_LIMITS.free.generationsPerMonth,
          }))
        }
        return
      }

      setResult(json.generation.contenido)
      setLastFormData({ nicho, formulario: data, nichoPersonalizado: nichoPersonalizado || undefined })

      // Increment local counter so UI updates instantly
      if (plan.plan === 'free') {
        setPlan(prev => ({
          ...prev,
          generationsUsed: prev.generationsUsed + 1,
        }))
      }
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Generador de Contenido</h1>
          <p className="text-muted-foreground mt-1">
            Selecciona tu nicho, completa los datos y genera contenido listo para publicar.
          </p>
        </div>
        {result && !isLoading && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewGeneration}
            className="gap-2 shrink-0"
          >
            <Plus size={15} />
            Nueva generación
          </Button>
        )}
      </div>

      {/* Payment feedback banner */}
      <Suspense>
        <PaymentBanner />
      </Suspense>

      {/* Usage bar — always visible for free plan */}
      {plan.plan === 'free' && <UsageBar plan={plan} />}

      {/* Nicho selector + Form — always rendered but overlaid when limit reached */}
      <div className="relative">
        {/* Upgrade overlay — shown when limit reached */}
        {limitReached && (
          <div className="absolute inset-0 z-10 rounded-xl overflow-hidden">
            {/* Blurred backdrop */}
            <div className="absolute inset-0 backdrop-blur-sm bg-background/60 rounded-xl" />
            {/* Upgrade card centered */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-sm rounded-2xl border border-primary/40 bg-card shadow-xl shadow-primary/10 overflow-hidden">
                {/* Header strip */}
                <div className="bg-primary/10 border-b border-primary/20 px-5 py-3 flex items-center gap-2">
                  <Zap size={15} className="text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Plan gratuito agotado</span>
                </div>
                {/* Body */}
                <div className="px-5 py-5 space-y-4">
                  <div className="space-y-1.5">
                    <p className="font-semibold text-base">Actualiza a Premium</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Usaste tus {PLAN_LIMITS.free.generationsPerMonth} generaciones gratuitas de este mes.
                      Con Premium tenés generaciones ilimitadas, imágenes ilimitadas y acceso completo.
                    </p>
                  </div>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {['Generaciones ilimitadas', 'Imágenes con IA ilimitadas', 'Todos los nichos disponibles'].map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle size={13} className="text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <UpgradeButton />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nicho selector */}
        <div className={`space-y-6 ${limitReached ? 'pointer-events-none select-none' : ''}`}>
          <Card>
            <CardContent className="pt-6">
              <NichoSelector
                value={nicho}
                onChange={handleNichoChange}
                nichoPersonalizado={nichoPersonalizado}
                onNichoPersonalizadoChange={setNichoPersonalizado}
              />
            </CardContent>
          </Card>

          {/* Form */}
          {nicho && (nicho !== 'otro' || nichoPersonalizado.trim().length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Datos del negocio</CardTitle>
                <CardDescription>
                  Completa la información para personalizar el contenido generado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeneratorForm
                  nicho={nicho}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && <LoadingState />}

      {/* Results */}
      {result && !isLoading && (
        <GenerationResult
          contenido={result}
          imagePromptData={lastFormData ? {
            nombreNegocio: lastFormData.formulario.nombreNegocio,
            tipoNegocio: lastFormData.nicho === 'otro'
              ? (lastFormData.nichoPersonalizado ?? 'Negocio local')
              : NICHOS_CONFIG[lastFormData.nicho].label,
            ciudad: lastFormData.formulario.ciudad,
            pais: lastFormData.formulario.pais,
            promocion: lastFormData.formulario.promocion,
            tono: lastFormData.formulario.tono,
          } : undefined}
        />
      )}
    </div>
  )
}
