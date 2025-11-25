'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RoleGuard from '@/components/layout/role-guard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

type Mascota = { id: string; nombre: string }
type Vet = { id: string; nombre: string; apellido: string }

export default function NuevaCitaPage() {
  const router = useRouter()
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [vets, setVets] = useState<Vet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ mascotaId: '', veterinarioId: '', fechaHora: '', duracionMinutos: 30, motivo: '' })

  useEffect(() => {
    ;(async () => {
      try {
        const [mascotasRes, vetsRes] = await Promise.all([
          apiFetch('/api/mascotas', { method: 'GET' }),
          apiFetch('/api/admin/usuarios/veterinarios', { method: 'GET' }),
        ])
        setMascotas(mascotasRes?.data ?? [])
        setVets(vetsRes?.data ?? [])
      } catch (e: any) {
        setError(e?.message || 'Error cargando datos')
      }
    })()
  }, [])

  function toIsoOffsetLocal(local: string) {
    try {
      const d = new Date(local)
      return d.toISOString() // OffsetDateTime parse compatible
    } catch { return local }
  }

  async function crear() {
    setLoading(true)
    try {
      const payload = {
        petId: form.mascotaId,
        veterinarianId: form.veterinarioId,
        startDateTime: toIsoOffsetLocal(form.fechaHora),
        durationMinutes: form.duracionMinutos,
        reason: form.motivo,
      }
      let actorId: string | undefined
      try { const u = localStorage.getItem('usuario'); const parsed = u ? JSON.parse(u) : null; actorId = parsed?.id } catch {}
      await apiFetch('/api/citas', { method: 'POST', body: JSON.stringify({ ...payload, actorId }) })
      router.push('/dashboard/citas')
    } catch (e: any) {
      setError(e?.message || 'No se pudo agendar la cita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard roles={["admin","veterinario","dueño"]}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Agendar cita</h2>
        {error && (<p className="text-destructive">{error}</p>)}
        <div className="grid gap-2 max-w-md">
          <label className="text-sm">Mascota</label>
          <select className="border rounded-md p-2" value={form.mascotaId} onChange={(e)=>setForm({...form, mascotaId: e.target.value})}>
            <option value="">Seleccione</option>
            {mascotas.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
          </select>
          <label className="text-sm">Veterinario</label>
          <select className="border rounded-md p-2" value={form.veterinarioId} onChange={(e)=>setForm({...form, veterinarioId: e.target.value})}>
            <option value="">Seleccione</option>
            {vets.map(v => (<option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>))}
          </select>
          <label className="text-sm">Fecha y hora</label>
          <Input type="datetime-local" value={form.fechaHora} onChange={(e)=>setForm({...form, fechaHora: e.target.value})} />
          <label className="text-sm">Duración (min)</label>
          <Input type="number" min={15} max={120} value={form.duracionMinutos} onChange={(e)=>setForm({...form, duracionMinutos: Number(e.target.value)})} />
          <label className="text-sm">Motivo</label>
          <Input value={form.motivo} onChange={(e)=>setForm({...form, motivo: e.target.value})} />
          <Button disabled={loading || !form.mascotaId || !form.veterinarioId || !form.fechaHora || !form.motivo} onClick={crear}>{loading ? 'Agendando...' : 'Agendar'}</Button>
        </div>
      </div>
    </RoleGuard>
  )
}