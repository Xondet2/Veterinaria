'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, PawPrint, Calendar, FileText, Syringe, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<any>(null);
  const { t } = useI18n();
  useEffect(() => {
    try {
      const usuarioJSON = localStorage.getItem('usuario')
      setUsuario(usuarioJSON ? JSON.parse(usuarioJSON) : null)
    } catch {
      setUsuario(null)
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  const items = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: Home, show: true },
    { href: '/dashboard/mascotas', label: t('nav.mascotas'), icon: PawPrint, show: true },
    { href: '/dashboard/citas', label: t('nav.citas'), icon: Calendar, show: true },
    { href: '/dashboard/historial', label: t('nav.historial'), icon: FileText, show: usuario?.rol === 'veterinario' },
    { href: '/dashboard/certificados', label: t('nav.certificados'), icon: FileText, show: true },
    { href: '/dashboard/vacunas', label: t('nav.vacunas'), icon: Syringe, show: true },
    { href: '/admin/usuarios', label: t('nav.usuarios'), icon: Users, show: usuario?.rol === 'admin' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 overflow-y-auto transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } z-50`}
      >
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">VetClinic</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sistema de Gestión</p>
          </div>

          {usuario && (
            <div className="bg-blue-50 p-3 rounded-lg dark:bg-blue-900/30">
              <p className="text-sm font-semibold dark:text-white">{usuario.nombre} {usuario.apellido}</p>
              <p className="text-xs text-gray-600 capitalize dark:text-gray-300">{usuario.rol}</p>
            </div>
          )}

          <nav className="space-y-2">
            {items
              .filter((item) => item.show)
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} prefetch={false}>
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

          <div className="border-t pt-4 space-y-2">
            <Link href="/dashboard/configuracion">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="w-4 h-4" />
                {t('settings.title')}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              {t('action.logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
