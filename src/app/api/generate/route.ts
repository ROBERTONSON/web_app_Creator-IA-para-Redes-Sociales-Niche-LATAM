import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateContent } from '@/lib/groq/generate'
import { buildPrompt } from '@/lib/prompts'
import { generateRequestSchema } from '@/lib/validations/generator'
import { sanitizeInput } from '@/lib/utils'
import type { Generacion, Nicho } from '@/types'

// Demo mode: use a fixed demo user ID for all generations
const DEMO_USER_ID = process.env.DEMO_USER_ID ?? '625c4a3e-9ef1-4985-b54e-78fdc19c20cc'

export async function POST(request: NextRequest) {
  // 1. Parse and validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  const parsed = generateRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Datos del formulario inválidos', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { nicho: nichoRaw, formulario, nichoPersonalizado } = parsed.data
  const nicho = nichoRaw as Nicho

  // 2. Sanitize inputs
  const sanitizedForm = {
    nombreNegocio: sanitizeInput(formulario.nombreNegocio),
    pais: sanitizeInput(formulario.pais),
    ciudad: sanitizeInput(formulario.ciudad),
    promocion: sanitizeInput(formulario.promocion),
    tono: sanitizeInput(formulario.tono),
    objetivo: sanitizeInput(formulario.objetivo),
    ...(nichoPersonalizado ? { nichoPersonalizado: sanitizeInput(nichoPersonalizado) } : {}),
  }

  // 3. Build prompt and call Groq
  let contenido
  try {
    const prompt = buildPrompt(nicho, sanitizedForm)
    contenido = await generateContent(prompt)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al generar contenido'
    const isTimeout = message.includes('tardó demasiado')
    return NextResponse.json(
      { success: false, error: message },
      { status: isTimeout ? 408 : 500 }
    )
  }

  // 4. Persist to Supabase using demo user
  const supabase = await createClient()
  const { data: inserted, error: dbError } = await supabase
    .from('generations')
    .insert({
      user_id: DEMO_USER_ID,
      nicho,
      nombre_negocio: sanitizedForm.nombreNegocio,
      pais: sanitizedForm.pais,
      ciudad: sanitizedForm.ciudad,
      promocion: sanitizedForm.promocion,
      tono: sanitizedForm.tono,
      objetivo: sanitizedForm.objetivo,
      post_instagram: contenido.postInstagram,
      caption: contenido.caption,
      hashtags: contenido.hashtags,
      historia: contenido.historia,
      cta: contenido.cta,
      reel: contenido.reel,
      estrategia: contenido.estrategia,
      sugerencia_fotos: contenido.sugerenciaFotos,
    })
    .select()
    .single()

  if (dbError) {
    console.error('Error persisting generation:', dbError)
  }

  const generation: Generacion = {
    id: inserted?.id ?? crypto.randomUUID(),
    userId: DEMO_USER_ID,
    nicho,
    formulario: sanitizedForm,
    contenido,
    createdAt: inserted?.created_at ?? new Date().toISOString(),
  }

  return NextResponse.json({ success: true, generation })
}
