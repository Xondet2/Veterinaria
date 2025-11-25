'use client'

import { ThemeProvider } from 'next-themes'
import { I18nProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        {children}
        <Toaster richColors closeButton expand={false} />
      </I18nProvider>
    </ThemeProvider>
  )
}