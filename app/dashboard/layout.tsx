// c:\Users\Asus\OneDrive\Documentos\Sophie\Veterinaria\app\(dashboard)\layout.tsx
import AuthGuard from '@/components/layout/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 p-6">{/* espacio para el sidebar fijo */}
        <AuthGuard>{children}</AuthGuard>
      </div>
    </div>
  )
}