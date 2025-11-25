'use client'

import { useEffect, useState } from 'react'
import RoleGuard from '@/components/layout/role-guard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'
import { connectSync } from '@/lib/sync'

type Usuario = { id: string; email: string; nombre: string; apellido: string; rol: string }

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', nombre: '', apellido: '', contraseña: '', telefono: '', rol: 'dueño' })
  const roles = ['admin','veterinario','dueño']

  async function load() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/admin/usuarios/search?q=', { method: 'GET' })
      setUsuarios(res?.data ?? [])
    } catch (e: any) {
      setError(e?.message || 'Error al cargar usuarios')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    const unsubscribe = connectSync((name) => { if (name === 'usuarios:created') load() })
    return () => { unsubscribe() }
  }, [])

  async function crearUsuario() {
    const username = (form.email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_-]/g, '') || 'user'
    const body = { email: form.email, username, firstName: form.nombre, lastName: form.apellido, password: form.contraseña, phone: form.telefono, role: form.rol }
    await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) })
    setForm({ email: '', nombre: '', apellido: '', contraseña: '', telefono: '', rol: 'dueño' })
    await load()
  }

  async function cambiarRol(id: string, rol: string) {
    let actorId: string | undefined
    try { const u = localStorage.getItem('usuario'); const parsed = u ? JSON.parse(u) : null; actorId = parsed?.id } catch {}
    const headers: Record<string,string> = {}
    if (actorId) headers['X-Actor-Id'] = actorId
    await apiFetch(`/api/admin/usuarios/${id}/rol`, { method: 'PATCH', headers, body: JSON.stringify({ role: rol, actorId }) })
    await load()
  }

  return (
    <RoleGuard roles={["admin"]}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Usuarios</h2>

        <div className="grid gap-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Listado</h3>
            {loading && (<p>Cargando...</p>)}
            {error && (<p className="text-destructive">{error}</p>)}
            <div className="space-y-2">
              {usuarios.map(u => (
                <div key={u.id} className="flex items-center justify-between gap-2 border rounded-md p-2">
                  <div>
                    <p className="font-medium">{u.nombre} {u.apellido}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="border rounded-md p-2" value={u.rol} onChange={(e) => cambiarRol(u.id, e.target.value)}>
                      {roles.map(r => (<option key={r} value={r}>{r}</option>))}
                    </select>
                  </div>
                </div>
              ))}
              {usuarios.length === 0 && !loading && (<p className="text-sm text-muted-foreground">No hay usuarios</p>)}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}