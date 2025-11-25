'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MascotaForm } from '@/components/forms/mascota-form'
import RoleGuard from '@/components/layout/role-guard'
import { apiFetch } from '@/lib/api'

export default function NuevaMascotaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rol, setRol] = useState<string>('dueño')
  const [dueños, setDueños] = useState<{id:string; nombre:string; apellido:string; email:string}[]>([])
  const [dueñoId, setDueñoId] = useState<string>('')

  useEffect(() => {
    try {
      const u = localStorage.getItem('usuario')
      const user = u ? JSON.parse(u) : null
      setRol(user?.rol ?? 'dueño')
    } catch { setRol('dueño') }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (rol === 'admin' || rol === 'veterinario') {
        try {
          const res = await apiFetch('/api/usuarios/dueños', { method: 'GET' })
          if (mounted) setDueños(res?.data ?? [])
        } catch {}
      }
    })()
    return () => { mounted = false }
  }, [rol])

  async function onSubmit(formData: any) {
    setLoading(true)
    const payload = {
      name: formData.nombre,
      species: formData.especie,
      breed: formData.raza,
      ageYears: Number(formData.edad_años),
      weightKg: Number(formData.peso_kg),
      sex: formData.sexo,
      birthDate: formData.fecha_nacimiento,
      microchip: formData.microchip || undefined,
      ownerId: (rol === 'admin' || rol === 'veterinario') && dueñoId ? dueñoId : undefined,
    }
    try {
      let actorId: string | undefined
      try { const u = localStorage.getItem('usuario'); const parsed = u ? JSON.parse(u) : null; actorId = parsed?.id } catch {}
      await apiFetch('/api/mascotas', { method: 'POST', body: JSON.stringify({ ...payload, actorId }) })
      router.push('/dashboard/mascotas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard roles={["admin","veterinario"]}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nueva mascota</h2>
        {(rol === 'admin' || rol === 'veterinario') && (
          <div className="grid gap-2 max-w-md">
            <label className="text-sm">Dueño</label>
            <select className="border rounded-md p-2" value={dueñoId} onChange={(e)=>setDueñoId(e.target.value)}>
              <option value="">Seleccione un dueño</option>
              {dueños.map(d => (<option key={d.id} value={d.id}>{d.nombre} {d.apellido} - {d.email}</option>))}
            </select>
          </div>
        )}
        <MascotaForm onSubmit={onSubmit} loading={loading} />
      </div>
    </RoleGuard>
  )
}