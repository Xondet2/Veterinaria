'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RoleGuard({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    try {
      const usuarioJSON = localStorage.getItem('usuario')
      const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null
      if (!usuario) { router.replace('/login'); return }
      const rol: string = usuario?.rol ?? 'dueño'
      if (!roles.includes(rol)) { router.replace('/dashboard'); return }
    } catch {
      router.replace('/login')
    }
  }, [router, roles])
  return children
}