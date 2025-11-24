// c:\Users\Asus\OneDrive\Documentos\Sophie\Veterinaria\app\layout.tsx
import type { Metadata } from 'next'
import Providers from '@/app/providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Veterinaria',
  description: 'Sistema de gestión veterinaria',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}