import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 min-w-0">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
