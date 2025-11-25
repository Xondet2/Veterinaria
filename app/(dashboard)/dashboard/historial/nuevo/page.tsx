'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RoleGuard from '@/components/layout/role-guard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

type Mascota = { id: string; nombre: string }

export default function NuevoHistorialPage() {
  const router = useRouter()
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [form, setForm] = useState({ mascotaId: '', fecha: '', descripcion: '', diagnostico: '', tratamiento: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiFetch('/api/mascotas', { method: 'GET' })
        setMascotas(res?.data ?? [])
      } catch (e: any) {
        setError(e?.message || 'Error al cargar mascotas')
      }
    })()
  }, [])

  async function crear() {
    setLoading(true)
    try {
      let vetId: string | undefined
      try { const u = localStorage.getItem('usuario'); const parsed = u ? JSON.parse(u) : null; vetId = parsed?.id } catch {}
      await apiFetch('/api/historial', { method: 'POST', body: JSON.stringify({ ...form, vetId }) })
      router.push('/dashboard/historial')
    } catch (e: any) {
      setError(e?.message || 'No se pudo crear el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard roles={["admin","veterinario"]}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nuevo registro médico</h2>
        {error && (<p className="text-destructive">{error}</p>)}
        <div className="grid gap-2 max-w-md">
          <label className="text-sm">Mascota</label>
          <select className="border rounded-md p-2" value={form.mascotaId} onChange={(e)=>setForm({...form, mascotaId: e.target.value})}>
            <option value="">Seleccione</option>
            {mascotas.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
          </select>
          <label className="text-sm">Fecha</label>
          <Input type="date" value={form.fecha} onChange={(e)=>setForm({...form, fecha: e.target.value})} />
          <label className="text-sm">Descripción</label>
          <Input value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} />
          <label className="text-sm">Diagnóstico</label>
          <Input value={form.diagnostico} onChange={(e)=>setForm({...form, diagnostico: e.target.value})} />
          <label className="text-sm">Tratamiento</label>
          <Input value={form.tratamiento} onChange={(e)=>setForm({...form, tratamiento: e.target.value})} />
          <Button disabled={loading || !form.mascotaId || !form.fecha || !form.descripcion} onClick={crear}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        </div>
      </div>
    </RoleGuard>
  )
}