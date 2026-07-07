import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'

export default function DashboardPage() {
  return (
    <>
      <Sidebar />
      <Header />
      <main className="p-4 md:p-8">
        <h1 className="text-2xl font-bold">Welcome back! 👋</h1>
        <p className="text-muted-foreground mt-2">Your financial overview will appear here.</p>
      </main>
    </>
  )
}