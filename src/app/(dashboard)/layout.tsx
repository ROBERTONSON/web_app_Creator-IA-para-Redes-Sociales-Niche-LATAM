import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import type { UserPlan } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user plan — default to free if not found
  const { data: planData } = await supabase
    .from('user_plans')
    .select('plan, generations_used, images_used, period_start')
    .eq('user_id', user.id)
    .single()

  const userPlan: UserPlan = planData
    ? {
        plan: planData.plan,
        generationsUsed: planData.generations_used,
        imagesUsed: planData.images_used,
        periodStart: planData.period_start,
      }
    : { plan: 'free', generationsUsed: 0, imagesUsed: 0, periodStart: new Date().toISOString() }

  return (
    <div className="flex min-h-screen">
      <Sidebar userPlan={userPlan} />
      <main className="flex-1 md:ml-64 min-w-0">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
