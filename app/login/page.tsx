'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/lib/i18n'
import { apiFetch } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{email?: string; password?: string}>({})
  const strength = (() => {
    const len = password.length
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNum = /[0-9]/.test(password)
    const hasSym = /[^A-Za-z0-9]/.test(password)
    let score = 0
    if (len >= 8) score++
    if (len >= 12) score++
    if (hasUpper && hasLower) score++
    if (hasNum) score++
    if (hasSym) score++
    return Math.min(score, 5)
  })()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: any = {}
    if (!email) errs.email = 'Correo es obligatorio'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Formato de correo inválido'
    if (!password) errs.password = 'Contraseña es obligatoria'
    else if (password.length > 64) errs.password = 'Máximo 64 caracteres'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      const res = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      const usuario = { id: res?.usuario?.id, email: res?.usuario?.email ?? email, rol: res?.usuario?.rol ?? 'dueño', nombre: res?.usuario?.nombre ?? email, apellido: res?.usuario?.apellido ?? '' }
      localStorage.setItem('usuario', JSON.stringify(usuario))
      toast({ title: t('auth.success.title'), description: t('auth.success.desc') })
      router.replace('/dashboard')
    } catch (err: any) {
      const isCredError = err?.status === 401 || /invalid|incorrect|contraseñ|correo/i.test(err?.message || '')
      const message = isCredError ? t('auth.error.desc') : (err?.message || t('auth.error.desc'))
      toast({ title: t('auth.error.title'), description: message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    try {
      const u = localStorage.getItem('usuario')
      if (u) router.replace('/dashboard')
    } catch {}
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-card border rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{t('login.title')}</h1>
        <div className="space-y-2">
          <label className="text-sm" htmlFor="login-email">{t('login.email')}</label>
          <Input id="login-email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value.replace(/["'\\;]/g,''))} required placeholder="admin@clinic.com" />
          {errors.email && (<p className="text-xs text-destructive">{errors.email}</p>)}
        </div>
        <div className="space-y-2">
          <label className="text-sm" htmlFor="login-password">{t('login.password')}</label>
          <Input id="login-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="demo123" />
          <div className="h-2 w-full bg-muted rounded">
            <div className={`h-2 rounded ${strength>=4? 'bg-green-500': strength>=2? 'bg-yellow-500':'bg-red-500'}`} style={{ width: `${(strength/5)*100}%` }} />
          </div>
          {errors.password && (<p className="text-xs text-destructive">{errors.password}</p>)}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Ingresando...' : t('login.submit')}</Button>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{t('login.demoHint')}</p>
          <a href="/register" className="text-xs underline">{t('login.createAccount')}</a>
        </div>
      </form>
    </main>
  )
}