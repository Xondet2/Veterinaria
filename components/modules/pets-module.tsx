"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit2, Trash2 } from "lucide-react"

const initialPets = [
  { id: 1, name: "Max", species: "Perro", breed: "Labrador", age: 3, owner: "Juan García", weight: 32 },
  { id: 2, name: "Misi", species: "Gato", breed: "Siamés", age: 2, owner: "Juan García", weight: 4 },
  { id: 3, name: "Rocky", species: "Perro", breed: "German Shepherd", age: 5, owner: "María López", weight: 35 },
]

export default function PetsModule({ user }) {
  const [pets, setPets] = useState(initialPets)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", species: "", breed: "", age: "", weight: "" })
  const [editingId, setEditingId] = useState(null)

  const handleAddPet = (e) => {
    e.preventDefault()
    if (editingId) {
      setPets(pets.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p)))
      setEditingId(null)
    } else {
      setPets([
        ...pets,
        {
          ...formData,
          id: Date.now(),
          owner: user.name,
          age: Number.parseInt(formData.age),
          weight: Number.parseFloat(formData.weight),
        },
      ])
    }
    setFormData({ name: "", species: "", breed: "", age: "", weight: "" })
    setShowForm(false)
  }

  const handleEditPet = (pet) => {
    setFormData(pet)
    setEditingId(pet.id)
    setShowForm(true)
  }

  const handleDeletePet = (id) => {
    setPets(pets.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Mascotas</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ name: "", species: "", breed: "", age: "", weight: "" })
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Mascota
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Mascota" : "Nueva Mascota"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPet} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3 py-2 border rounded-lg border-input bg-background"
                  required
                />
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="px-3 py-2 border rounded-lg border-input bg-background"
                  required
                >
                  <option value="">Selecciona especie</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Conejo">Conejo</option>
                  <option value="Otro">Otro</option>
                </select>
                <input
                  type="text"
                  placeholder="Raza"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="px-3 py-2 border rounded-lg border-input bg-background"
                  required
                />
                <input
                  type="number"
                  placeholder="Edad"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="px-3 py-2 border rounded-lg border-input bg-background"
                  required
                />
              </div>
              <input
                type="number"
                step="0.1"
                placeholder="Peso (kg)"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Actualizar" : "Guardar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pets.map((pet) => (
          <Card key={pet.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{pet.name}</span>
                <span className="text-sm font-normal text-muted-foreground">{pet.species}</span>
              </CardTitle>
              <CardDescription>{pet.breed}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Edad:</strong> {pet.age} años
              </p>
              <p>
                <strong>Peso:</strong> {pet.weight} kg
              </p>
              <p>
                <strong>Dueño:</strong> {pet.owner}
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditPet(pet)}
                  className="flex items-center gap-2 flex-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePet(pet.id)}
                  className="flex items-center gap-2 flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
