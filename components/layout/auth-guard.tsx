'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => { const u = localStorage.getItem('usuario'); if (!u) { router.replace('/login') } }, [router])
  return children
}