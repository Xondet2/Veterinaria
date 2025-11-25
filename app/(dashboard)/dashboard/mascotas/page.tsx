'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'
import { useI18n } from '@/lib/i18n'

type Mascota = { id: string; nombre: string; especie: string; raza: string; edadAños: number; pesoKg: number; sexo: string; microchip?: string }

export default function MascotasPage() {
  const [data, setData] = useState<Mascota[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')
  const [banner, setBanner] = useState<string>('')
  const [q, setQ] = useState('')
  const { t, lang } = useI18n()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await apiFetch('/api/mascotas', { method: 'GET' })
        if (mounted) setData(res?.data ?? [])
      } catch (err: any) {
        setError(err?.message || 'Error al cargar mascotas')
      } finally {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try {
      const u = localStorage.getItem('usuario')
      const user = u ? JSON.parse(u) : null
      setRol(user?.rol ?? 'dueño')
    } catch { setRol('dueño') }
  }, [])

  useEffect(() => {
    try {
      const images = [
        '/administracion-clinica-veterinaria-1.jpg',
        '/ragdoll-kitten-at-veterinerian-clinic-2023-02-02-03-50-48-utc.jpg',
        '/mejorar-comunicacion-duenos-mascotas-veterinaria.jpg',
        '/2022_10_06_11_59_27_000000_169-Medicina-Veterin--ria---1920-x-1080.jpg',
        '/Cardiopatia-en-Perros-y-Gatos.webp',
      ]
      const key = '/dashboard/mascotas'
      const usedRaw = sessionStorage.getItem('usedImages')
      const mapRaw = sessionStorage.getItem('imageMap')
      const used: string[] = usedRaw ? JSON.parse(usedRaw) : []
      const map: Record<string, string> = mapRaw ? JSON.parse(mapRaw) : {}
      if (!map[key]) {
        let choices = images.filter((src) => !used.includes(src))
        if (choices.length === 0) { choices = images; used.length = 0 }
        const selected = choices[Math.floor(Math.random() * choices.length)]
        map[key] = selected
        used.push(selected)
        sessionStorage.setItem('usedImages', JSON.stringify(used))
        sessionStorage.setItem('imageMap', JSON.stringify(map))
      }
      setBanner(map[key])
    } catch { setBanner('/ragdoll-kitten-at-veterinerian-clinic-2023-02-02-03-50-48-utc.jpg') }
  }, [])

  if (loading) return <p>{t('mascotas.loading')}</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('mascotas.title')}</h2>
        {(rol === 'admin' || rol === 'veterinario') && (
          <a href="/dashboard/mascotas/nueva" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">{t('mascotas.new')}</a>
        )}
      </div>
      <div className="rounded-lg border p-4">
        <img src={banner || '/ragdoll-kitten-at-veterinerian-clinic-2023-02-02-03-50-48-utc.jpg'} alt="Mascotas en clínica" className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="mascotas-buscar">{t('mascotas.search.placeholder')}</label>
        <Input id="mascotas-buscar" name="buscar" placeholder={t('mascotas.search.placeholder')} value={q} onChange={(e)=>setQ(e.target.value)} className="max-w-xs" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.filter(m=> m.nombre.toLowerCase().includes(q.toLowerCase())).map((m) => (
          <div key={m.id} className="rounded-lg border p-4 space-y-1">
            <p className="font-medium">{m.nombre}</p>
            <p className="text-sm text-muted-foreground">{m.especie} • {m.raza} • {m.sexo}</p>
            <p className="text-xs text-muted-foreground">{t('mascotas.age')}: {m.edadAños} {t('mascotas.years')} • {t('mascotas.weight')}: {m.pesoKg} {t('mascotas.kg')}</p>
            {m.microchip && (<p className="text-xs text-muted-foreground">{t('mascotas.microchip')}: {m.microchip}</p>)}
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{t('mascotas.none')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
