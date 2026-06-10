import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateContent } from '@/lib/groq/generate'
import { buildPrompt } from '@/lib/prompts'
import { generateRequestSchema } from '@/lib/validations/generator'
import { sanitizeInput } from '@/lib/utils'
import { canGenerate, PLAN_LIMITS } from '@/lib/plans'
import type { Generacion, Nicho, UserPlan } from '@/types'

export async function POST(request: NextRequest) {
  // 1. Validate real session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
  }

  const userId = user.id

  // 2. Check plan limits
  let userPlanRow = await supabase
    .from('user_plans')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Auto-create free plan if not exists
  if (userPlanRow.error || !userPlanRow.data) {
    await supabase.from('user_plans').insert({ user_id: userId })
    userPlanRow = await supabase.from('user_plans').select('*').eq('user_id', userId).single()
  }

  if (userPlanRow.data) {
    const planData = userPlanRow.data
    const userPlan: UserPlan = {
      plan: planData.plan,
      generationsUsed: planData.generations_used,
      imagesUsed: planData.images_used,
      periodStart: planData.period_start,
    }

    if (!canGenerate(userPlan)) {
      const limit = PLAN_LIMITS.free.generationsPerMonth
      return NextResponse.json(
        {
          success: false,
          error: `Has alcanzado el límite de ${limit} generaciones gratuitas este mes. Actualiza a Premium para generar contenido ilimitado.`,
          limitReached: true,
          plan: 'free',
        },
        { status: 403 }
      )
    }
  }

  // 2. Parse and validate body
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

  // 4. Persist to Supabase
  const { data: inserted, error: dbError } = await supabase
    .from('generations')
    .insert({
      user_id: userId,
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

  // 5. Increment generation counter for free plan users
  await supabase.rpc('increment_generations', { p_user_id: userId })

  const generation: Generacion = {
    id: inserted?.id ?? crypto.randomUUID(),
    userId: userId,
    nicho,
    formulario: sanitizedForm,
    contenido,
    createdAt: inserted?.created_at ?? new Date().toISOString(),
  }

  return NextResponse.json({ success: true, generation })
}
