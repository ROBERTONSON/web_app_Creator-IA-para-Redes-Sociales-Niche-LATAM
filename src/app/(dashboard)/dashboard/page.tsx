'use client'

import { useState } from 'react'
import NichoSelector from '@/components/dashboard/NichoSelector'
import GeneratorForm from '@/components/dashboard/GeneratorForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import GenerationResult from '@/components/generation/GenerationResult'
import LoadingState from '@/components/generation/LoadingState'
import type { Nicho, GeneracionContenido } from '@/types'
import type { GeneratorFormValues } from '@/lib/validations/generator'

export default function DashboardPage() {
  const [nicho, setNicho] = useState<Nicho | null>(null)
  const [nichoPersonalizado, setNichoPersonalizado] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeneracionContenido | null>(null)

  function handleNichoChange(newNicho: Nicho) {
    setNicho(newNicho)
    setNichoPersonalizado('')
    setResult(null)
    setError(null)
  }

  async function handleSubmit(data: GeneratorFormValues) {
    if (!nicho) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicho, formulario: data, ...(nichoPersonalizado ? { nichoPersonalizado } : {}) }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setError(json.error ?? 'Error al generar contenido. Intenta de nuevo.')
        return
      }

      setResult(json.generation.contenido)
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Generador de Contenido</h1>
        <p className="text-muted-foreground mt-1">
          Selecciona tu nicho, completa los datos y genera contenido listo para publicar.
        </p>
      </div>

      {/* Nicho selector */}
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

      {/* Form — only shown after nicho is selected (and nichoPersonalizado filled if 'otro') */}
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

      {/* Error state */}
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && <LoadingState />}

      {/* Results */}
      {result && !isLoading && <GenerationResult contenido={result} />}
    </div>
  )
}
