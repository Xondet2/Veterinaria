'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, PawPrint, Calendar, FileText, Syringe, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    try {
      const usuarioJSON = localStorage.getItem('usuario')
      setUser(usuarioJSON ? JSON.parse(usuarioJSON) : null)
    } catch {
      setUser(null)
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<'es'|'en'>('es')
  useEffect(() => {
    try {
      const l = localStorage.getItem('lang') as 'es'|'en'|null; setLang(l === 'en' ? 'en' : 'es')
      const onStorage = (e: StorageEvent) => { if (e.key === 'lang') setLang((e.newValue as 'es'|'en')==='en'?'en':'es') }
      const onLangChanged = (e: Event) => {
        const val = (e as CustomEvent).detail as 'es'|'en'
        if (val) setLang(val==='en'?'en':'es')
      }
      window.addEventListener('storage', onStorage)
      window.addEventListener('lang-changed', onLangChanged as EventListener)
      return () => {
        window.removeEventListener('storage', onStorage)
        window.removeEventListener('lang-changed', onLangChanged as EventListener)
      }
    } catch {}
  }, [])

  const t = useMemo(() => ({
    es: {
      dashboard: 'Panel', mascotas: 'Mascotas', citas: 'Citas', historial: 'Historial Médico', certificados: 'Certificados', vacunas: 'Vacunas', admin: 'Administración', usuarios: 'Usuarios', settings: 'Configuración', logout: 'Cerrar Sesión', system: 'Sistema de Gestión', brand: 'VetClinic', role: 'rol',
    },
    en: {
      dashboard: 'Dashboard', mascotas: 'Pets', citas: 'Appointments', historial: 'Medical History', certificados: 'Certificates', vacunas: 'Vaccines', admin: 'Administration', usuarios: 'Users', settings: 'Settings', logout: 'Sign Out', system: 'Management System', brand: 'VetClinic', role: 'role',
    },
  })[lang], [lang])

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  const items = [
    { href: '/dashboard', label: t.dashboard, icon: Home, show: true },
    { href: '/dashboard/mascotas', label: t.mascotas, icon: PawPrint, show: true },
    { href: '/dashboard/citas', label: t.citas, icon: Calendar, show: true },
    { href: '/dashboard/historial', label: t.historial, icon: FileText, show: user?.rol === 'veterinario' },
    { href: '/dashboard/certificados', label: t.certificados, icon: FileText, show: true },
    { href: '/dashboard/vacunas', label: t.vacunas, icon: Syringe, show: true },
    { href: '/admin/usuarios', label: t.usuarios, icon: Users, show: user?.rol === 'admin' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card text-card-foreground hover:bg-muted"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-6 overflow-y-auto transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } z-40`}
      >
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold">{t.brand}</h1>
            <p className="text-sm text-muted-foreground">{t.system}</p>
          </div>

          {user && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-semibold">{user.nombre} {user.apellido}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.rol}</p>
            </div>
          )}

          <nav className="space-y-2">
            {items
              .filter((item) => item.show)
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
          </nav>

          <div className="border-t border-sidebar-border pt-4 space-y-2">
            <Link href="/dashboard/configuracion">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="w-4 h-4" />
                {t.settings}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              {t.logout}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-background/60 z-30 lg:hidden"
        />
      )}
    </>
  );
}
