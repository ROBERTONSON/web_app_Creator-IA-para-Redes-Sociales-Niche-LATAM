import { groq } from './client'
import type { GeneracionContenido } from '@/types'

interface GroqResponseSchema {
  post_instagram: string
  caption: string
  hashtags: string[]
  historia: string
  cta: string
  reel: string
  estrategia: unknown
  sugerencia_fotos: unknown
}

/** Recursively converts any value to a readable string */
function stringifyValue(val: unknown): string {
  if (typeof val === 'string') return val
  if (Array.isArray(val)) return val.map(stringifyValue).join('\n')
  if (typeof val === 'object' && val !== null) {
    return Object.entries(val as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${stringifyValue(v)}`)
      .join('\n')
  }
  return String(val ?? '')
}

function isValidResponse(data: unknown): data is GroqResponseSchema {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return (
    typeof d.post_instagram === 'string' && d.post_instagram.length > 0 &&
    typeof d.caption === 'string' && d.caption.length > 0 &&
    Array.isArray(d.hashtags) && d.hashtags.length > 0 &&
    typeof d.historia === 'string' && d.historia.length > 0 &&
    typeof d.cta === 'string' && d.cta.length > 0 &&
    typeof d.reel === 'string' && d.reel.length > 0
  )
}

export async function generateContent(prompt: string): Promise<GeneracionContenido> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)

  try {
    const completion = await groq.chat.completions.create(
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 1024,
      },
      { signal: controller.signal }
    )

    clearTimeout(timeoutId)

    const text = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(text) as unknown

    if (!isValidResponse(parsed)) {
      throw new Error('La respuesta de la IA no contiene todos los campos requeridos')
    }

    return {
      postInstagram: parsed.post_instagram,
      caption: parsed.caption,
      hashtags: parsed.hashtags,
      historia: parsed.historia,
      cta: parsed.cta,
      reel: parsed.reel,
      estrategia: stringifyValue(parsed.estrategia ?? ''),
      sugerenciaFotos: stringifyValue(parsed.sugerencia_fotos ?? ''),
    }
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La generación tardó demasiado. Intenta de nuevo.')
    }
    throw error
  }
}
