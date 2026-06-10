import { createClient } from '@/lib/supabase/server'
import type { UserPlan } from '@/types'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userPlan: UserPlan = {
    plan: 'free',
    generationsUsed: 0,
    imagesUsed: 0,
    periodStart: new Date().toISOString(),
  }

  if (user) {
    const { data: planData } = await supabase
      .from('user_plans')
      .select('plan, generations_used, images_used, period_start')
      .eq('user_id', user.id)
      .single()

    if (planData) {
      userPlan = {
        plan: planData.plan,
        generationsUsed: planData.generations_used,
        imagesUsed: planData.images_used,
        periodStart: planData.period_start,
      }
    } else {
      // Row doesn't exist yet — create it, then it starts at 0 which is correct
      await supabase.from('user_plans').insert({ user_id: user.id }).single()
    }
  }

  return <DashboardClient userPlan={userPlan} />
}
