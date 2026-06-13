'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, AlertCircle } from 'lucide-react'
import type { UserPlan } from '@/types'
import { getRemainingGenerations, PLAN_LIMITS } from '@/lib/plans'

interface PlanBadgeProps {
  userPlan: UserPlan
}

export default function PlanBadge({ userPlan }: PlanBadgeProps) {
  const [loading, setLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const remaining = getRemainingGenerations(userPlan)
  const isPremium = userPlan.plan === 'premium'

  async function handleUpgrade() {
    setLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        setCheckoutError(data.error ?? 'No se pudo iniciar el pago.')
        setLoading(false)
      }
    } catch {
      setCheckoutError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  if (isPremium) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-medium text-primary">Plan Premium</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Generaciones este mes</span>
          <span className="font-medium text-foreground">
            {remaining}/{PLAN_LIMITS.premium.generationsPerMonth}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((PLAN_LIMITS.premium.generationsPerMonth - remaining) / PLAN_LIMITS.premium.generationsPerMonth) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Generaciones gratuitas</span>
        <span className="font-medium text-foreground">
          {remaining}/{PLAN_LIMITS.free.generationsPerMonth}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((PLAN_LIMITS.free.generationsPerMonth - remaining) / PLAN_LIMITS.free.generationsPerMonth) * 100}%` }}
        />
      </div>
      {remaining === 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">
            Límite alcanzado. Actualiza para seguir generando.
          </p>
          <Button
            size="sm"
            className="w-full gap-1.5 text-xs"
            onClick={handleUpgrade}
            disabled={loading}
          >
            <Zap size={13} />
            {loading ? 'Redirigiendo...' : 'Actualizar a Premium'}
          </Button>
          {checkoutError && (
            <div className="flex items-start gap-1.5 text-xs text-destructive">
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              {checkoutError}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
