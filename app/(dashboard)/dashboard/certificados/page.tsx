"use client"

import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

import { apiFetch } from '@/lib/api'

type Certificado = { id: string; tipo: string; descripcion: string; fechaEmision: string; mascota: { id: string; nombre: string } }

export default function CertificadosPage() {
  const [data, setData] = useState<Certificado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rol, setRol] = useState<string>('dueño')
  const [banner, setBanner] = useState<string>('')
  const { t, lang } = useI18n()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try { const res = await apiFetch('/api/certificados', { method: 'GET' }); if (mounted) setData(res?.data ?? []) }
      catch (err: any) { setError(err?.message || 'Error al cargar certificados') }
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
      const key = '/dashboard/certificados'
      const usedRaw = sessionStorage.getItem('usedImages')
      const mapRaw = sessionStorage.getItem('imageMap')
      const used: string[] = usedRaw ? JSON.parse(usedRaw) : []
      const map: Record<string, string> = mapRaw ? JSON.parse(mapRaw) : {}
      if (!map[key]) {
        const assigned = Object.values(map)
        let choices = images.filter((src) => !used.includes(src) && !assigned.includes(src))
        if (choices.length === 0) { choices = images.filter((src) => !assigned.includes(src)) }
        if (choices.length === 0) { choices = images }
        const selected = choices[Math.floor(Math.random() * choices.length)]
        map[key] = selected
        if (!used.includes(selected)) used.push(selected)
        sessionStorage.setItem('usedImages', JSON.stringify(used))
        sessionStorage.setItem('imageMap', JSON.stringify(map))
      }
      setBanner(map[key])
    } catch { setBanner('/administracion-clinica-veterinaria-1.jpg') }
  }, [])

  if (loading) return <p>{t('cert.loading')}</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('cert.title')}</h2>
        {(rol === 'admin' || rol === 'veterinario') && (
          <a href="/dashboard/certificados/nuevo" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/30">{t('cert.new')}</a>
        )}
      </div>
      <div className="rounded-lg border p-4">
        <img src={banner || '/administracion-clinica-veterinaria-1.jpg'} alt="Certificados de clínica" className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-md" />
      </div>
      <div className="grid gap-4">
        {data.map(c => (
          <div key={c.id} className="rounded-lg border p-4">
            <p className="font-medium">{c.mascota?.nombre ?? 'Mascota'}</p>
            <p className="text-sm text-muted-foreground capitalize">{t('cert.type')}: {c.tipo}</p>
            <p className="text-sm">{c.descripcion}</p>
            <p className="text-xs text-muted-foreground">{t('cert.issued')}: {new Date(c.fechaEmision).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES')}</p>
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border p-4"><p className="text-sm text-muted-foreground">{t('cert.none')}</p></div>
        )}
      </div>
    </div>
  )
}
