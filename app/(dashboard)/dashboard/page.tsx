"use client"
import React from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export default function DashboardPage() {
  const [banner, setBanner] = React.useState<string>('')
  React.useEffect(() => {
    try {
      const images = [
        '/administracion-clinica-veterinaria-1.jpg',
        '/ragdoll-kitten-at-veterinerian-clinic-2023-02-02-03-50-48-utc.jpg',
        '/mejorar-comunicacion-duenos-mascotas-veterinaria.jpg',
        '/2022_10_06_11_59_27_000000_169-Medicina-Veterin--ria---1920-x-1080.jpg',
        '/Cardiopatia-en-Perros-y-Gatos.webp',
      ]
      const key = '/dashboard'
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
    } catch { setBanner('/administracion-clinica-veterinaria-1.jpg') }
  }, [])
  const { t, lang } = useI18n()
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('dashboard.title')}</h2>
      <div className="rounded-lg border p-4">
        <img src={banner || '/administracion-clinica-veterinaria-1.jpg'} alt="" className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/mascotas" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t('dashboard.cards.pets.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.cards.pets.desc')}</p>
        </Link>
        <Link href="/dashboard/citas" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t('dashboard.cards.appointments.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.cards.appointments.desc')}</p>
        </Link>
        <Link href="/dashboard/certificados" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t('dashboard.cards.certificates.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.cards.certificates.desc')}</p>
        </Link>
        <Link href="/dashboard/vacunas" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t('dashboard.cards.vaccines.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.cards.vaccines.desc')}</p>
        </Link>
      </div>
    </div>
  )
}
