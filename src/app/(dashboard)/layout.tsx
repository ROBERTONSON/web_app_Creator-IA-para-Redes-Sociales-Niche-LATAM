import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'

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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Main content — offset by sidebar width on md+ */}
      <main className="flex-1 md:ml-64 min-w-0">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
