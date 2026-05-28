import { getHistory } from '@/actions/history'
import HistoryList from '@/components/history/HistoryList'

export const metadata = {
  title: 'Historial — Creator IA LATAM',
}

export default async function HistoryPage() {
  const generaciones = await getHistory()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial</h1>
        <p className="text-muted-foreground mt-1">
          Todas tus generaciones anteriores, ordenadas por fecha.
        </p>
      </div>
      <HistoryList generaciones={generaciones} />
    </div>
  )
}
