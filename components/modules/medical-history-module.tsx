"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Heart } from "lucide-react"

const initialHistory = [
  {
    id: 1,
    petName: "Max",
    date: "2025-01-10",
    diagnosis: "Chequeo general satisfactorio",
    treatment: "Vitaminas",
    veterinarian: "Dra. María López",
  },
  {
    id: 2,
    petName: "Misi",
    date: "2025-01-08",
    diagnosis: "Gingivitis leve",
    treatment: "Antibióticos",
    veterinarian: "Dr. Carlos Pérez",
  },
  {
    id: 3,
    petName: "Max",
    date: "2025-01-05",
    diagnosis: "Parásitos",
    treatment: "Desparasitante",
    veterinarian: "Dra. María López",
  },
]

export default function MedicalHistoryModule({ user }) {
  const [history, setHistory] = useState(initialHistory)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ petName: "", diagnosis: "", treatment: "", veterinarian: "" })

  const handleAddRecord = (e) => {
    e.preventDefault()
    setHistory([
      ...history,
      {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
      },
    ])
    setFormData({ petName: "", diagnosis: "", treatment: "", veterinarian: "" })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Historial Médico</h2>
        {user.role === "veterinarian" && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Registro
          </Button>
        )}
      </div>

      {showForm && user.role === "veterinarian" && (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Registro Médico</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la mascota"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <input
                type="text"
                placeholder="Diagnóstico"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <input
                type="text"
                placeholder="Tratamiento"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <input
                type="text"
                placeholder="Tu nombre (Veterinario)"
                value={formData.veterinarian}
                onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Guardar Registro
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {history.map((record) => (
          <Card key={record.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Heart className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{record.petName}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{record.date}</p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Diagnóstico:</strong> {record.diagnosis}
                    </p>
                    <p>
                      <strong>Tratamiento:</strong> {record.treatment}
                    </p>
                    <p>
                      <strong>Veterinario:</strong> {record.veterinarian}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
