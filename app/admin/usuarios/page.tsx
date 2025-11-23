'use client'

import { useEffect, useState } from 'react'
import RoleGuard from '@/components/layout/role-guard'
import { apiFetch } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Usuario = { id: string; email: string; nombre: string; apellido: string; rol: string }
type Pendiente = { id: string; email: string; username: string; rolActual: string; rolSolicitado: string }

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendientes, setPendientes] = useState<Pendiente[]>([])
  const [q, setQ] = useState('')
  const roles = ['admin','veterinario','recepcionista','dueño']

  async function load() {
    setLoading(true)
    try {
      const res = await apiFetch('/api/admin/usuarios', { method: 'GET' })
      setUsuarios(res?.data ?? [])
      const rp = await apiFetch('/api/admin/roles/pendientes', { method: 'GET' })
      setPendientes(rp?.data ?? [])
    } catch (e: any) {
      setError(e?.message || 'Error al cargar usuarios')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function cambiarRol(id: string, rol: string) {
    await apiFetch(`/api/admin/usuarios/${id}/rol`, { method: 'PATCH', body: JSON.stringify({ rol }) })
    await load()
  }

  async function aprobar(id: string) {
    await apiFetch(`/api/admin/roles/${id}/aprobar`, { method: 'POST' })
    await load()
  }

  async function rechazar(id: string) {
    await apiFetch(`/api/admin/roles/${id}/rechazar`, { method: 'POST' })
    await load()
  }

  async function buscar(){
    try {
      setLoading(true)
      if (q.trim().length===0){
        const res = await apiFetch('/api/admin/usuarios', { method: 'GET' })
        setUsuarios(res?.data ?? [])
      } else {
        const res = await apiFetch(`/api/search/usuarios?q=${encodeURIComponent(q)}`, { method: 'GET' })
        setUsuarios(res?.data ?? [])
      }
    } catch (err:any){ setError(err?.message || 'Error al buscar usuarios') } finally { setLoading(false) }
  }

  async function eliminar(id: string){
    if (typeof window !== 'undefined' && !window.confirm('¿Seguro que deseas eliminar este usuario?')) return
    await apiFetch(`/api/admin/usuarios/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <RoleGuard roles={["admin"]}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Usuarios</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Solicitudes de rol</h3>
            {loading && (<p>Cargando...</p>)}
            {error && (<p className="text-destructive">{error}</p>)}
            <div className="space-y-2">
              {pendientes.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-2 border rounded-md p-2">
                  <div>
                    <p className="font-medium">{p.username}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                    <p className="text-xs">Actual: {p.rolActual} → Solicita: {p.rolSolicitado}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="border rounded px-2 py-1" onClick={() => aprobar(p.id)}>Aprobar</button>
                    <button className="border rounded px-2 py-1" onClick={() => rechazar(p.id)}>Rechazar</button>
                  </div>
                </div>
              ))}
              {pendientes.length === 0 && !loading && (<p className="text-sm text-muted-foreground">No hay solicitudes</p>)}
            </div>
          </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Listado</h3>
          <div className="flex items-center gap-2 max-w-md mb-2">
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar" />
            <Button onClick={buscar}>Buscar</Button>
          </div>
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
                  <Button variant="outline" onClick={()=>eliminar(u.id)}>Eliminar</Button>
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