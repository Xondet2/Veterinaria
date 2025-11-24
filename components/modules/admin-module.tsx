"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const statsData = [
  { month: "Enero", mascotas: 45, citas: 120, certificados: 28 },
  { month: "Febrero", mascotas: 52, citas: 135, certificados: 32 },
  { month: "Marzo", mascotas: 58, citas: 145, certificados: 38 },
]

const veterinarians = [
  { id: 1, name: "Dra. María López", specialization: "General", patients: 150, appointmentsMonth: 38 },
  { id: 2, name: "Dr. Carlos Pérez", specialization: "Cirugía", patients: 95, appointmentsMonth: 28 },
  { id: 3, name: "Dra. Laura González", specialization: "Dermatología", patients: 78, appointmentsMonth: 22 },
]

export default function AdminModule({ user }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Panel Administrativo</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Mascotas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">245</p>
            <p className="text-xs text-muted-foreground mt-1">+12 este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Citas Este Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">342</p>
            <p className="text-xs text-muted-foreground mt-1">+45 vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">89</p>
            <p className="text-xs text-muted-foreground mt-1">Emitidos este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Veterinarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-muted-foreground mt-1">Activos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Mensuales</CardTitle>
          <CardDescription>Evolución de mascotas, citas y certificados</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="mascotas" fill="hsl(var(--chart-1))" />
              <Bar dataKey="citas" fill="hsl(var(--chart-2))" />
              <Bar dataKey="certificados" fill="hsl(var(--chart-3))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veterinarios</CardTitle>
          <CardDescription>Información y estadísticas del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {veterinarians.map((vet) => (
              <div key={vet.id} className="flex justify-between items-center p-4 border rounded-lg border-border">
                <div>
                  <h4 className="font-semibold">{vet.name}</h4>
                  <p className="text-sm text-muted-foreground">{vet.specialization}</p>
                </div>
                <div className="text-right text-sm">
                  <p>
                    <strong>{vet.patients}</strong> pacientes
                  </p>
                  <p className="text-muted-foreground">{vet.appointmentsMonth} citas/mes</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
