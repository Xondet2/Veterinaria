"use client"

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useI18n } from '@/lib/i18n'

type Vacuna = { id: string; nombre: string; fechaAplicacion: string; dosis?: string; lote?: string; proximaFecha?: string; mascota: { id: string; nombre: string } }

export default function VacunasPage() {
  const [data, setData] = useState<Vacuna[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')
  const [banner, setBanner] = useState<string>('')
  const { t, lang } = useI18n()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try { const res = await apiFetch('/api/vacunas', { method: 'GET' }); if (mounted) setData(res?.data ?? []) }
      catch (err: any) { setError(err?.message || 'Error al cargar vacunas') }
      finally { setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try { const u = localStorage.getItem('usuario'); const user = u ? JSON.parse(u) : null; setRol(user?.rol ?? 'dueño') } catch { setRol('dueño') }
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
      const key = '/dashboard/vacunas'
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
    } catch { setBanner('/Cardiopatia-en-Perros-y-Gatos.webp') }
  }, [])

  if (loading) return <p>{t('vac.loading')}</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('vac.title')}</h2>
        {(rol === 'admin' || rol === 'veterinario') && (
          <a href="/dashboard/vacunas/nueva" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">{t('vac.new')}</a>
        )}
      </div>
      <div className="rounded-lg border p-4">
        <img src={banner || '/Cardiopatia-en-Perros-y-Gatos.webp'} alt="Salud cardiovascular" className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-md" />
      </div>
      <div className="grid gap-4">
        {data.map(v => (
          <div key={v.id} className="rounded-lg border p-4">
            <p className="font-medium">{v.mascota?.nombre ?? 'Mascota'}</p>
            <p className="text-sm">{v.nombre}</p>
            <p className="text-sm text-muted-foreground">{t('vac.applied')}: {new Date(v.fechaAplicacion).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES')}</p>
            {v.proximaFecha && (<p className="text-xs text-muted-foreground">{t('vac.next')}: {new Date(v.proximaFecha).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES')}</p>)}
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4"><p className="text-sm text-muted-foreground">{t('vac.none')}</p></div>
        )}
      </div>
    </div>
  )
}