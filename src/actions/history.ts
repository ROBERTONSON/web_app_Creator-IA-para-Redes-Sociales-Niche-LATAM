'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Generacion, Nicho } from '@/types'

function mapRow(row: Record<string, unknown>): Generacion {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    nicho: row.nicho as Nicho,
    formulario: {
      nombreNegocio: row.nombre_negocio as string,
      pais: row.pais as string,
      ciudad: row.ciudad as string,
      promocion: row.promocion as string,
      tono: row.tono as string,
      objetivo: row.objetivo as string,
    },
    contenido: {
      postInstagram: row.post_instagram as string,
      caption: row.caption as string,
      hashtags: row.hashtags as string[],
      historia: row.historia as string,
      cta: row.cta as string,
      reel: row.reel as string,
      estrategia: (row.estrategia as string) ?? '',
      sugerenciaFotos: (row.sugerencia_fotos as string) ?? '',
    },
    createdAt: row.created_at as string,
  }
}

export async function getHistory(): Promise<Generacion[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(mapRow)
}

export async function getGeneration(id: string): Promise<Generacion | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null
  return mapRow(data)
}

export async function deleteGeneration(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'No se pudo eliminar la generación.' }

  revalidatePath('/history')
  return {}
}
