"use client"
import AuthGuard from '@/components/layout/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { connectSync } from '@/lib/sync'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/lib/i18n'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const { t } = useI18n()
  const pathname = usePathname()
  useEffect(() => {
    const isPublic = pathname.startsWith('/dashboard/mascotas') || pathname.startsWith('/dashboard/vacunas') || pathname.startsWith('/dashboard/certificados')
    if (isPublic) return
    const disconnect = connectSync((name, data) => {
      if (name === 'mascotas:created') toast({ title: t('sse.pet.created.title'), description: t('sse.pet.created.desc') })
      if (name === 'certificados:created') toast({ title: t('sse.cert.created.title'), description: t('sse.cert.created.desc') })
      if (name === 'mascotas:deleted') toast({ title: t('sse.pet.deleted.title'), description: t('sse.pet.deleted.desc') })
      if (name === 'usuarios:created') toast({ title: t('sse.user.created.title'), description: data?.email || '' })
    })
    return () => disconnect()
  }, [toast, t, pathname])
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 p-4 sm:p-6 relative z-0">
        {pathname.startsWith('/dashboard/mascotas') || pathname.startsWith('/dashboard/vacunas') || pathname.startsWith('/dashboard/certificados') ? children : (<AuthGuard>{children}</AuthGuard>)}
      </div>
    </div>
  )
}