"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

export default function DashboardPage() {
  const [lang, setLang] = useState<'es'|'en'>('es')
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    try {
      const l = localStorage.getItem('lang') as 'es'|'en'|null; setLang(l==='en'?'en':'es')
      const onStorage = (e: StorageEvent) => { if (e.key === 'lang') setLang((e.newValue as 'es'|'en')==='en'?'en':'es') }
      const onLangChanged = (e: Event) => { const v = (e as CustomEvent).detail as 'es'|'en'; if (v) setLang(v==='en'?'en':'es') }
      window.addEventListener('storage', onStorage)
      window.addEventListener('lang-changed', onLangChanged as EventListener)
      const u = localStorage.getItem('usuario'); setUser(u ? JSON.parse(u) : null)
      return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('lang-changed', onLangChanged as EventListener) }
    } catch {}
  }, [])
  const t = useMemo(() => ({
    es: {
      titulo:'Panel principal', desc:'Accede rápidamente a los módulos del sistema.',
      mascotas:'Mascotas', mascotasDesc:'Consulta y registra las mascotas de los dueños.',
      citas:'Citas', citasDesc:'Agenda y revisa citas con veterinarios.',
      historial:'Historial médico', historialDesc:'Registra y consulta historiales clínicos.',
      certificados:'Certificados', certificadosDesc:'Emite y consulta certificados clínicos.',
      vacunas:'Vacunas', vacunasDesc:'Registra y revisa vacunas aplicadas.',
      configuracion:'Configuración', configuracionDesc:'Preferencias de tema e idioma.'
    },
    en: {
      titulo:'Main panel', desc:'Quick access to system modules.',
      mascotas:'Pets', mascotasDesc:'View and register owners’ pets.',
      citas:'Appointments', citasDesc:'Schedule and review appointments with veterinarians.',
      historial:'Medical history', historialDesc:'Record and review clinical histories.',
      certificados:'Certificates', certificadosDesc:'Issue and view clinical certificates.',
      vacunas:'Vaccines', vacunasDesc:'Record and review applied vaccines.',
      configuracion:'Settings', configuracionDesc:'Theme and language preferences.'
    }
  })[lang], [lang])
  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">{t.titulo}</h2>
          <p className="text-muted-foreground">{t.desc}</p>
        </div>
        <div className="flex justify-center">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-orange-200 dark:bg-slate-700 overflow-hidden shadow ring-4 ring-primary/20">
            <Image src="/vet-dashboard.jpg" alt="Panel de clínica veterinaria" width={600} height={600} className="w-full h-full object-cover" priority />
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/mascotas" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t.mascotas}</h3>
          <p className="text-sm text-muted-foreground">{t.mascotasDesc}</p>
        </Link>
        <Link href="/dashboard/citas" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t.citas}</h3>
          <p className="text-sm text-muted-foreground">{t.citasDesc}</p>
        </Link>
        {user?.rol === 'veterinario' && (
          <Link href="/dashboard/historial" className="block rounded-lg border p-4 hover:bg-muted/30">
            <h3 className="font-medium">{t.historial}</h3>
            <p className="text-sm text-muted-foreground">{t.historialDesc}</p>
          </Link>
        )}
        <Link href="/dashboard/certificados" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t.certificados}</h3>
          <p className="text-sm text-muted-foreground">{t.certificadosDesc}</p>
        </Link>
        <Link href="/dashboard/vacunas" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t.vacunas}</h3>
          <p className="text-sm text-muted-foreground">{t.vacunasDesc}</p>
        </Link>
        <Link href="/dashboard/configuracion" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">{t.configuracion}</h3>
          <p className="text-sm text-muted-foreground">{t.configuracionDesc}</p>
        </Link>
      </div>
    </div>
  )
}