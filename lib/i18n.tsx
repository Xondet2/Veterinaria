'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Lang = 'es' | 'en'
type Dict = Record<string, Record<Lang, string>>

const dict: Dict = {
  'login.title': { es: 'Iniciar sesión', en: 'Sign in' },
  'login.email': { es: 'Correo', en: 'Email' },
  'login.password': { es: 'Contraseña', en: 'Password' },
  'login.submit': { es: 'Entrar', en: 'Sign in' },
  'login.demoHint': { es: 'admin@clinic.com / vet@clinic.com / owner@example.com', en: 'admin@clinic.com / vet@clinic.com / owner@example.com' },
  'login.createAccount': { es: 'Crear cuenta', en: 'Create account' },
  'auth.success.title': { es: 'Ingreso exitoso', en: 'Login successful' },
  'auth.success.desc': { es: 'Bienvenido a la clínica', en: 'Welcome to the clinic' },
  'auth.error.title': { es: 'Error de autenticación', en: 'Authentication error' },
  'auth.error.desc': { es: 'Correo o contraseña inválidos', en: 'Invalid email or password' },

  'register.title': { es: 'Crear cuenta', en: 'Create account' },
  'register.submit.loading': { es: 'Registrando...', en: 'Registering...' },
  'register.submit': { es: 'Registrarme', en: 'Register' },
  'register.backToLogin': { es: 'Volver a iniciar sesión', en: 'Back to login' },
  'register.success.title': { es: 'Registro exitoso', en: 'Registration successful' },
  'register.success.desc': { es: 'Puedes iniciar sesión con tu correo y contraseña', en: 'You can now sign in with your email and password' },
  'register.error.title': { es: 'Error de registro', en: 'Registration error' },

  'settings.title': { es: 'Configuración', en: 'Settings' },
  'settings.desc': { es: 'Preferencias de usuario y ajustes del sistema.', en: 'User preferences and system settings.' },
  'settings.language': { es: 'Idioma', en: 'Language' },
  'settings.theme': { es: 'Tema', en: 'Theme' },
  'settings.theme.light': { es: 'Claro', en: 'Light' },
  'settings.theme.dark': { es: 'Oscuro', en: 'Dark' },
  'settings.language.es': { es: 'Español', en: 'Spanish' },
  'settings.language.en': { es: 'Inglés', en: 'English' },

  'nav.dashboard': { es: 'Dashboard', en: 'Dashboard' },
  'nav.mascotas': { es: 'Mascotas', en: 'Pets' },
  'nav.citas': { es: 'Citas', en: 'Appointments' },
  'nav.historial': { es: 'Historial Médico', en: 'Medical History' },
  'nav.certificados': { es: 'Certificados', en: 'Certificates' },
  'nav.vacunas': { es: 'Vacunas', en: 'Vaccines' },
  'nav.usuarios': { es: 'Usuarios', en: 'Users' },
  'action.logout': { es: 'Cerrar Sesión', en: 'Log out' },

  'dashboard.title': { es: 'Panel principal', en: 'Main panel' },
  'dashboard.cards.pets.title': { es: 'Mascotas', en: 'Pets' },
  'dashboard.cards.pets.desc': { es: 'Consulta y registra las mascotas de los dueños.', en: "Browse and register owners' pets." },
  'dashboard.cards.appointments.title': { es: 'Citas', en: 'Appointments' },
  'dashboard.cards.appointments.desc': { es: 'Agenda y revisa citas con veterinarios.', en: 'Schedule and review appointments with veterinarians.' },
  'dashboard.cards.certificates.title': { es: 'Certificados', en: 'Certificates' },
  'dashboard.cards.certificates.desc': { es: 'Genera y consulta certificados clínicos.', en: 'Generate and view clinical certificates.' },
  'dashboard.cards.vaccines.title': { es: 'Vacunas', en: 'Vaccines' },
  'dashboard.cards.vaccines.desc': { es: 'Registra y revisa el esquema de vacunación.', en: 'Record and review vaccination schedules.' },

  'mascotas.loading': { es: 'Cargando mascotas...', en: 'Loading pets...' },
  'mascotas.title': { es: 'Mascotas', en: 'Pets' },
  'mascotas.new': { es: 'Nueva mascota', en: 'New pet' },
  'mascotas.search.placeholder': { es: 'Buscar por nombre', en: 'Search by name' },
  'mascotas.none': { es: 'No hay mascotas registradas', en: 'No pets registered' },
  'mascotas.age': { es: 'Edad', en: 'Age' },
  'mascotas.years': { es: 'años', en: 'years' },
  'mascotas.weight': { es: 'Peso', en: 'Weight' },
  'mascotas.kg': { es: 'kg', en: 'kg' },
  'mascotas.microchip': { es: 'Microchip', en: 'Microchip' },

  'citas.loading': { es: 'Cargando citas...', en: 'Loading appointments...' },
  'citas.title': { es: 'Citas', en: 'Appointments' },
  'citas.new': { es: 'Agendar cita', en: 'Schedule appointment' },
  'citas.vet': { es: 'Vet', en: 'Vet' },
  'citas.start': { es: 'Inicio', en: 'Start' },
  'citas.duration': { es: 'Duración', en: 'Duration' },
  'citas.minutes': { es: 'min', en: 'min' },
  'citas.reason': { es: 'Motivo', en: 'Reason' },
  'citas.none': { es: 'No hay citas registradas', en: 'No appointments registered' },

  'cert.loading': { es: 'Cargando certificados...', en: 'Loading certificates...' },
  'cert.title': { es: 'Certificados', en: 'Certificates' },
  'cert.new': { es: 'Nuevo certificado', en: 'New certificate' },
  'cert.type': { es: 'Tipo', en: 'Type' },
  'cert.issued': { es: 'Emitido', en: 'Issued' },
  'cert.none': { es: 'No hay certificados', en: 'No certificates' },

  'vac.loading': { es: 'Cargando vacunas...', en: 'Loading vaccines...' },
  'vac.title': { es: 'Vacunas', en: 'Vaccines' },
  'vac.new': { es: 'Registrar vacuna', en: 'Register vaccine' },
  'vac.applied': { es: 'Aplicada', en: 'Applied' },
  'vac.next': { es: 'Próxima', en: 'Next' },
  'vac.none': { es: 'No hay vacunas registradas', en: 'No vaccines registered' },

  'sse.pet.created.title': { es: 'Nueva mascota', en: 'New pet' },
  'sse.pet.created.desc': { es: 'Mascota registrada', en: 'Pet registered' },
  'sse.cert.created.title': { es: 'Nuevo certificado', en: 'New certificate' },
  'sse.cert.created.desc': { es: 'Se emitió un certificado', en: 'A certificate was issued' },
  'sse.pet.deleted.title': { es: 'Mascota eliminada', en: 'Pet deleted' },
  'sse.pet.deleted.desc': { es: 'Registro eliminado', en: 'Record deleted' },
  'sse.user.created.title': { es: 'Nuevo usuario', en: 'New user' },
}

type I18nCtx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }
const Ctx = createContext<I18nCtx | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lang') as Lang | null
      if (stored === 'es' || stored === 'en') setLangState(stored)
    } catch {}
  }, [])
  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch {}
  }
  const t = useMemo(() => (k: string) => {
    const entry = dict[k]
    if (!entry) return k
    return entry[lang] ?? entry['es'] ?? k
  }, [lang])
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
