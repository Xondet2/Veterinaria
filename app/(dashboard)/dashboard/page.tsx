import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Panel principal</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/mascotas" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">Mascotas</h3>
          <p className="text-sm text-muted-foreground">Consulta y registra las mascotas de los dueños.</p>
        </Link>
        <Link href="/dashboard/citas" className="block rounded-lg border p-4 hover:bg-muted/30">
          <h3 className="font-medium">Citas</h3>
          <p className="text-sm text-muted-foreground">Agenda y revisa citas con veterinarios.</p>
        </Link>
      </div>
    </div>
  )
}