'use server'

import { createClient } from '@/lib/supabase/server'
import type { UserPlan } from '@/types'

export async function getUserPlan(): Promise<UserPlan> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const defaultPlan: UserPlan = {
    plan: 'free',
    generationsUsed: 0,
    imagesUsed: 0,
    periodStart: new Date().toISOString(),
  }

  if (!user) return defaultPlan

  const { data, error } = await supabase
    .from('user_plans')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    // Auto-create
    await supabase.from('user_plans').insert({ user_id: user.id })
    return defaultPlan
  }

  return {
    plan: data.plan,
    generationsUsed: data.generations_used,
    imagesUsed: data.images_used,
    periodStart: data.period_start,
  }
}
