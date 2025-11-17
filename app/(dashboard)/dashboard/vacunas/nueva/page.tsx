'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RoleGuard from '@/components/layout/role-guard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

type Mascota = { id: string; nombre: string }

export default function NuevaVacunaPage() {
  const router = useRouter()
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [form, setForm] = useState({ mascotaId: '', nombre: '', fechaAplicacion: '', dosis: '', lote: '', proximaFecha: '' })
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
      await apiFetch('/api/vacunas', { method: 'POST', body: JSON.stringify(form) })
      router.push('/dashboard/vacunas')
    } catch (e: any) {
      setError(e?.message || 'No se pudo registrar la vacuna')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard roles={["admin","veterinario"]}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Registrar vacuna</h2>
        {error && (<p className="text-destructive">{error}</p>)}
        <div className="grid gap-2 max-w-md">
          <label className="text-sm">Mascota</label>
          <select className="border rounded-md p-2" value={form.mascotaId} onChange={(e)=>setForm({...form, mascotaId: e.target.value})}>
            <option value="">Seleccione</option>
            {mascotas.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
          </select>
          <label className="text-sm">Nombre</label>
          <Input value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} />
          <label className="text-sm">Fecha de aplicación</label>
          <Input type="date" value={form.fechaAplicacion} onChange={(e)=>setForm({...form, fechaAplicacion: e.target.value})} />
          <label className="text-sm">Dosis</label>
          <Input value={form.dosis} onChange={(e)=>setForm({...form, dosis: e.target.value})} />
          <label className="text-sm">Lote</label>
          <Input value={form.lote} onChange={(e)=>setForm({...form, lote: e.target.value})} />
          <label className="text-sm">Próxima fecha (opcional)</label>
          <Input type="date" value={form.proximaFecha} onChange={(e)=>setForm({...form, proximaFecha: e.target.value})} />
          <Button disabled={loading || !form.mascotaId || !form.nombre || !form.fechaAplicacion} onClick={crear}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        </div>
      </div>
    </RoleGuard>
  )
}