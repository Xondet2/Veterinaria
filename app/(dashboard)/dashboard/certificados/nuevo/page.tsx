'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RoleGuard from '@/components/layout/role-guard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'

type Mascota = { id: string; nombre: string }

export default function NuevoCertificadoPage() {
  const router = useRouter()
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [form, setForm] = useState({ mascotaId: '', tipo: 'salud', descripcion: '', fechaEmision: '' })
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
        type: form.tipo,
        description: form.descripcion,
        issuedDate: form.fechaEmision,
      }
      let vetId: string | undefined
      try { const u = localStorage.getItem('usuario'); const parsed = u ? JSON.parse(u) : null; vetId = parsed?.id } catch {}
      await apiFetch('/api/certificados', { method: 'POST', body: JSON.stringify({ ...payload, vetId }) })
      router.push('/dashboard/certificados')
    } catch (e: any) {
      setError(e?.message || 'No se pudo crear el certificado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard roles={["admin","veterinario"]}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nuevo certificado</h2>
        {error && (<p className="text-destructive">{error}</p>)}
        <div className="grid gap-2 max-w-md">
          <label className="text-sm" htmlFor="cert-mascota">Mascota</label>
          <select id="cert-mascota" name="mascotaId" className="border rounded-md p-2" value={form.mascotaId} onChange={(e)=>setForm({...form, mascotaId: e.target.value})}>
            <option value="">Seleccione</option>
            {mascotas.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
          </select>
          <label className="text-sm" htmlFor="cert-tipo">Tipo</label>
          <Input id="cert-tipo" name="tipo" value={form.tipo} onChange={(e)=>setForm({...form, tipo: e.target.value})} />
          <label className="text-sm" htmlFor="cert-descripcion">Descripción</label>
          <Input id="cert-descripcion" name="descripcion" value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} />
          <label className="text-sm" htmlFor="cert-fecha">Fecha de emisión</label>
          <Input id="cert-fecha" name="fechaEmision" type="date" value={form.fechaEmision} onChange={(e)=>setForm({...form, fechaEmision: e.target.value})} />
          <Button disabled={loading || !form.mascotaId || !form.descripcion} onClick={crear}>{loading ? 'Creando...' : 'Crear'}</Button>
        </div>
      </div>
    </RoleGuard>
  )
}