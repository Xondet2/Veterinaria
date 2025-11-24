'use client'

import { useEffect, useState } from 'react'
import RoleGuard from '@/components/layout/role-guard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

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
      const res = await apiFetch('/api/admin/usuarios', { method: 'GET' })
      setUsuarios(res?.data ?? [])
    } catch (e: any) {
      setError(e?.message || 'Error al cargar usuarios')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function crearUsuario() {
    await apiFetch('/api/admin/usuarios', { method: 'POST', body: JSON.stringify(form) })
    setForm({ email: '', nombre: '', apellido: '', contraseña: '', telefono: '', rol: 'dueño' })
    await load()
  }

  async function cambiarRol(id: string, rol: string) {
    await apiFetch(`/api/admin/usuarios/${id}/rol`, { method: 'PATCH', body: JSON.stringify({ rol }) })
    await load()
  }

  return (
    <RoleGuard roles={["admin"]}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Usuarios</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-medium">Crear usuario</h3>
            <div className="grid gap-2">
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              <Input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
              <Input placeholder="Contraseña" type="password" value={form.contraseña} onChange={(e) => setForm({ ...form, contraseña: e.target.value })} />
              <Input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              <select className="border rounded-md p-2" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                {roles.map(r => (<option key={r} value={r}>{r}</option>))}
              </select>
              <Button onClick={crearUsuario}>Crear</Button>
            </div>
          </div>

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