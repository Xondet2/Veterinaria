'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { apiFetch, parseJwt } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      const token: string = res?.token
      if (!token) throw new Error('Token no recibido')
      localStorage.setItem('token', token)
      const claims = parseJwt(token)
      const usuario = { email: claims?.email ?? email, rol: claims?.role ?? 'dueño', nombre: res?.usuario?.nombre ?? email, apellido: res?.usuario?.apellido ?? '' }
      localStorage.setItem('usuario', JSON.stringify(usuario))
      toast({ title: 'Ingreso exitoso', description: 'Bienvenido a la clínica' })
      router.replace('/dashboard')
    } catch (err: any) {
      toast({ title: 'Error de autenticación', description: err?.message || 'Correo o contraseña inválidos' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-card border rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <div className="space-y-2">
          <label className="text-sm">Correo</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@clinic.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Contraseña</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="demo123" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</Button>
        <p className="text-xs text-muted-foreground">Usa admin@clinic.com, vet@clinic.com, owner@example.com con contraseña demo123.</p>
      </form>
    </main>
  )
}