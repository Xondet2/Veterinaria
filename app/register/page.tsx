"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/lib/i18n'
import { apiFetch } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useI18n()
  const [form, setForm] = useState({
    email: '',
    username: '',
    nombre: '',
    apellido: '',
    contraseña: '',
    telefono: '',
    rol: 'dueño',
  })
  const roles = ['dueño', 'veterinario', 'recepcionista']
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{email?: string; contraseña?: string}>({})
  const [confirm, setConfirm] = useState('')

  function validatePassword(pw: string) {
    const lenOk = pw.length >= 8 && pw.length <= 64
    const hasUpper = /[A-Z]/.test(pw)
    const hasLower = /[a-z]/.test(pw)
    const hasNum = /\d/.test(pw)
    const hasSym = /[^A-Za-z0-9]/.test(pw)
    return lenOk && hasUpper && hasLower && hasNum && hasSym
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: any = {}
    if (!form.email) errs.email = 'Correo es obligatorio'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Formato de correo inválido'
    if (!form.contraseña) errs.contraseña = 'Contraseña es obligatoria'
    else if (!validatePassword(form.contraseña)) errs.contraseña = 'Contraseña debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo'
    else if (form.contraseña !== confirm) errs.contraseña = 'Las contraseñas no coinciden'
    setErrors(errs)
    if (Object.keys(errs).length) { toast({ title: 'Datos inválidos', description: 'Revisa el correo y la contraseña' }); return }
    setLoading(true)
    try {
      const body = {
        email: form.email,
        username: form.username || (form.email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_-]/g, ''),
        firstName: form.nombre,
        lastName: form.apellido,
        password: form.contraseña,
        phone: form.telefono,
        role: form.rol,
      }
      await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) })
      toast({ title: t('register.success.title'), description: t('register.success.desc') })
      router.replace('/login')
    } catch (err: any) {
      toast({ title: t('register.error.title'), description: err?.message || 'No se pudo registrar' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-card border rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold">{t('register.title')}</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm" htmlFor="reg-email">Correo</label>
            <Input id="reg-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="reg-first">Nombre</label>
            <Input id="reg-first" name="firstName" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="reg-last">Apellido</label>
            <Input id="reg-last" name="lastName" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm" htmlFor="reg-username">Usuario</label>
            <Input id="reg-username" name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="opcional" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm" htmlFor="reg-password">Contraseña</label>
            <Input id="reg-password" name="password" type="password" autoComplete="new-password" value={form.contraseña} onChange={(e) => setForm({ ...form, contraseña: e.target.value })} required />
            {errors.contraseña && (<p className="text-xs text-destructive">{errors.contraseña}</p>)}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm" htmlFor="reg-confirm">Confirmar contraseña</label>
            <Input id="reg-confirm" name="passwordConfirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="reg-phone">Teléfono</label>
            <Input id="reg-phone" name="phone" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="reg-role">Rol solicitado</label>
            <select id="reg-role" name="role" className="border rounded-md p-2 w-full" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              {roles.map(r => (<option key={r} value={r}>{r}</option>))}
            </select>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? t('register.submit.loading') : t('register.submit')}</Button>
        <p className="text-xs text-muted-foreground">El rol será revisado y asignado por administración.</p>
        <a href="/login" className="text-xs underline">{t('register.backToLogin')}</a>
      </form>
    </main>
  )
}