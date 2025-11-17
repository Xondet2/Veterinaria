"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, CalendarDays } from "lucide-react"

const initialAppointments = [
  {
    id: 1,
    petName: "Max",
    owner: "Juan García",
    date: "2025-01-15",
    time: "10:00",
    veterinarian: "Dra. María López",
    reason: "Chequeo general",
  },
  {
    id: 2,
    petName: "Misi",
    owner: "Juan García",
    date: "2025-01-16",
    time: "14:30",
    veterinarian: "Dra. María López",
    reason: "Vacunación",
  },
  {
    id: 3,
    petName: "Rocky",
    owner: "María López",
    date: "2025-01-17",
    time: "11:00",
    veterinarian: "Dr. Carlos Pérez",
    reason: "Limpieza dental",
  },
]

const veterinarians = [
  { id: 1, name: "Dra. María López", available: ["10:00", "11:00", "14:00", "15:00"] },
  { id: 2, name: "Dr. Carlos Pérez", available: ["09:00", "10:00", "14:30", "16:00"] },
  { id: 3, name: "Dra. Laura González", available: ["13:00", "14:00", "15:00", "16:30"] },
]

export default function AppointmentsModule({ user }) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ petName: "", date: "", time: "", veterinarian: "", reason: "" })

  const handleAddAppointment = (e) => {
    e.preventDefault()
    setAppointments([...appointments, { ...formData, id: Date.now(), owner: user.name }])
    setFormData({ petName: "", date: "", time: "", veterinarian: "", reason: "" })
    setShowForm(false)
  }

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.filter((a) => a.id !== id))
  }

  const currentVet = formData.veterinarian ? veterinarians.find((v) => v.name === formData.veterinarian) : null
  const availableTimes = currentVet?.available || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Citas Veterinarias</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setFormData({ petName: "", date: "", time: "", veterinarian: "", reason: "" })
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agendar Cita
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agendar Nueva Cita</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la mascota"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <select
                value={formData.veterinarian}
                onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value, time: "" })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              >
                <option value="">Selecciona veterinario</option>
                {veterinarians.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
              {availableTimes.length > 0 && (
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                  required
                >
                  <option value="">Selecciona hora</option>
                  {availableTimes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
              <input
                type="text"
                placeholder="Motivo de la cita"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Agendar
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
        {appointments.map((apt) => (
          <Card key={apt.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{apt.petName}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {apt.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {apt.time}
                    </div>
                  </div>
                  <p>
                    <strong>Veterinario:</strong> {apt.veterinarian}
                  </p>
                  <p>
                    <strong>Motivo:</strong> {apt.reason}
                  </p>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleCancelAppointment(apt.id)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
