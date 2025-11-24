import AuthGuard from '@/components/layout/auth-guard'
import RoleGuard from '@/components/layout/role-guard'
import { Sidebar } from '@/components/layout/sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 p-6">
        <AuthGuard>
          <RoleGuard roles={["admin"]}>{children}</RoleGuard>
        </AuthGuard>
      </div>
    </div>
  )
}