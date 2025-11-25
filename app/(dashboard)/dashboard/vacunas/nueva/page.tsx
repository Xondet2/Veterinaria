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
      const payload = {
        petId: form.mascotaId,
        name: form.nombre,
        appliedDate: form.fechaAplicacion,
        dose: form.dosis,
        lot: form.lote,
        nextDate: form.proximaFecha || undefined,
      }
      let vetId: string | undefined
      try { const u = localStorage.getItem('usuario'); const parsed = u ? JSON.parse(u) : null; vetId = parsed?.id } catch {}
      await apiFetch('/api/vacunas', { method: 'POST', body: JSON.stringify({ ...payload, vetId }) })
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
          <label className="text-sm" htmlFor="vacuna-mascota">Mascota</label>
          <select id="vacuna-mascota" name="mascotaId" className="border rounded-md p-2" value={form.mascotaId} onChange={(e)=>setForm({...form, mascotaId: e.target.value})}>
            <option value="">Seleccione</option>
            {mascotas.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
          </select>
          <label className="text-sm" htmlFor="vacuna-nombre">Nombre</label>
          <Input id="vacuna-nombre" name="nombre" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} />
          <label className="text-sm" htmlFor="vacuna-aplicacion">Fecha de aplicación</label>
          <Input id="vacuna-aplicacion" name="fechaAplicacion" type="date" value={form.fechaAplicacion} onChange={(e)=>setForm({...form, fechaAplicacion: e.target.value})} />
          <label className="text-sm" htmlFor="vacuna-dosis">Dosis</label>
          <Input id="vacuna-dosis" name="dosis" value={form.dosis} onChange={(e)=>setForm({...form, dosis: e.target.value})} />
          <label className="text-sm" htmlFor="vacuna-lote">Lote</label>
          <Input id="vacuna-lote" name="lote" value={form.lote} onChange={(e)=>setForm({...form, lote: e.target.value})} />
          <label className="text-sm" htmlFor="vacuna-proxima">Próxima fecha (opcional)</label>
          <Input id="vacuna-proxima" name="proximaFecha" type="date" value={form.proximaFecha} onChange={(e)=>setForm({...form, proximaFecha: e.target.value})} />
          <Button disabled={loading || !form.mascotaId || !form.nombre || !form.fechaAplicacion} onClick={crear}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        </div>
      </div>
    </RoleGuard>
  )
}