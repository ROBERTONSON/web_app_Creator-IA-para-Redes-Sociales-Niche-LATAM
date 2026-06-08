'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, ImageIcon, Download, RefreshCw, Loader2, AlertCircle, Upload, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImagePromptData {
  nombreNegocio: string
  tipoNegocio: string
  ciudad: string
  pais: string
  promocion: string
  tono: string
}

interface ImageGeneratorProps {
  sugerenciaFotos: string
  imagePromptData?: ImagePromptData
}

function buildImagePrompt(data?: ImagePromptData, fallback?: string): string {
  if (data) {
    return `Genera una fotografía comercial premium, hiperrealista y de calidad publicitaria para ${data.nombreNegocio}, un ${data.tipoNegocio} ubicado en ${data.ciudad}, ${data.pais}. La imagen debe mostrar de forma visualmente impactante y completamente realista el siguiente servicio o promoción: ${data.promocion}. La escena debe estar directamente relacionada con la actividad del negocio, incluir elementos auténticos del entorno profesional correspondiente y destacar claramente el servicio promocionado como protagonista principal de la composición. Utiliza una estética ${data.tono}, iluminación cinematográfica profesional, encuadre publicitario moderno, profundidad de campo natural, lente de 35mm, apertura f/1.8, texturas ultra detalladas, colores equilibrados, materiales realistas y nivel de detalle extremo. La imagen debe parecer una fotografía tomada por un fotógrafo comercial profesional para una campaña de marketing en redes sociales, transmitiendo confianza, calidad y profesionalismo. Sin texto, sin letras, sin tipografía, sin logotipos, sin marcas de agua, sin gráficos, sin elementos deformados y sin artefactos visuales.`
  }
  return fallback ?? ''
}

export default function ImageGenerator({ sugerenciaFotos, imagePromptData }: ImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [usedModel, setUsedModel] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [brandContext, setBrandContext] = useState<string | null>(null)
  const [referenceImages, setReferenceImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const allowed = files.filter(f => f.type.startsWith('image/'))
    const combined = [...referenceImages, ...allowed].slice(0, 4)
    setReferenceImages(combined)

    const urls = combined.map(f => URL.createObjectURL(f))
    setPreviewUrls(urls)
    setBrandContext(null) // reset analysis on new images
  }

  function removeImage(index: number) {
    const newFiles = referenceImages.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    setReferenceImages(newFiles)
    setPreviewUrls(newUrls)
    setBrandContext(null)
  }

  async function analyzeImages() {
    if (!referenceImages.length) return
    setIsAnalyzing(true)
    setError(null)

    try {
      const form = new FormData()
      referenceImages.forEach(f => form.append('images', f))

      const res = await fetch('/api/analyze-brand', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Error al analizar las imágenes.')
        return
      }

      setBrandContext(data.brandContext)
    } catch {
      setError('Error de conexión al analizar imágenes.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function generateImage() {
    setIsGenerating(true)
    setError(null)

    const prompt = buildImagePrompt(imagePromptData, sugerenciaFotos)

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          ...(brandContext ? { brandContext } : {}),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Error al generar la imagen. Intenta de nuevo.')
        return
      }

      setImageUrl(data.image)
      setUsedModel(data.model)
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  function downloadImage() {
    if (!imageUrl) return
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'imagen-generada.png'
    link.click()
  }

  const isLoading = isGenerating || isAnalyzing

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
          <Camera size={13} />
          Imagen para tu Publicación
        </CardTitle>
        {!imageUrl && !isLoading && (
          <Button
            size="sm"
            onClick={generateImage}
            className="h-7 px-3 gap-1.5 text-xs shrink-0"
          >
            <ImageIcon size={13} />
            Generar Imagen
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Prompt preview */}
        {imagePromptData && (
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            {buildImagePrompt(imagePromptData)}
          </p>
        )}

        {/* Reference image upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Imágenes de apoyo visual
              <span className="ml-1 font-normal normal-case">(opcional · mejora el resultado · máx. 4)</span>
            </p>
            {referenceImages.length > 0 && !brandContext && !isAnalyzing && (
              <Button
                size="sm"
                variant="outline"
                onClick={analyzeImages}
                className="h-6 px-2 gap-1 text-xs"
              >
                <Sparkles size={11} />
                Analizar con IA
              </Button>
            )}
          </div>

          {/* Upload zone */}
          {referenceImages.length < 4 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors px-4 py-4 text-center"
            >
              <Upload size={16} className="mx-auto mb-1.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Sube imágenes del negocio para mejorar el resultado visual
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </button>
          )}

          {/* Preview grid */}
          {previewUrls.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Referencia ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-background/80 flex items-center justify-center"
                  >
                    <X size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Brand context result */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 size={12} className="animate-spin" />
              Analizando identidad de marca con Gemini...
            </div>
          )}
          {brandContext && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2.5 space-y-1">
              <p className="text-xs font-medium text-primary flex items-center gap-1">
                <Sparkles size={11} />
                Contexto visual detectado
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{brandContext}</p>
            </div>
          )}
        </div>

        {/* Loading state */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-xl border border-border bg-muted/30">
            <Loader2 size={28} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generando imagen...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
            <AlertCircle size={16} className="text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Generated image */}
        {imageUrl && !isGenerating && (
          <div className="space-y-3">
            {usedModel && (
              <p className="text-xs text-muted-foreground">
                Generado con <span className="font-medium text-primary">{usedModel}</span>
                {brandContext && <span className="ml-1 text-primary/70">· con contexto de marca</span>}
              </p>
            )}
            <div className="rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Imagen generada por IA" className="w-full h-auto object-cover" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={downloadImage} className="gap-1.5 text-xs">
                <Download size={13} />
                Descargar PNG
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={generateImage}
                className={cn('gap-1.5 text-xs', isLoading && 'opacity-50 pointer-events-none')}
              >
                <RefreshCw size={13} />
                Regenerar
              </Button>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <Button size="sm" onClick={generateImage} variant="outline" className="gap-1.5 text-xs">
            <ImageIcon size={13} />
            Intentar de nuevo
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
