"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Download, Award } from "lucide-react"

const initialCertificates = [
  {
    id: 1,
    petName: "Max",
    type: "Vacunación Rabia",
    date: "2025-01-10",
    expiryDate: "2026-01-10",
    code: "VAC-2025-001",
  },
  {
    id: 2,
    petName: "Misi",
    type: "Desparasitación",
    date: "2025-01-05",
    expiryDate: "2025-04-05",
    code: "DES-2025-002",
  },
  {
    id: 3,
    petName: "Rocky",
    type: "Certificado de Salud",
    date: "2025-01-01",
    expiryDate: "2025-01-01",
    code: "SAL-2025-003",
  },
]

export default function CertificatesModule({ user }) {
  const [certificates, setCertificates] = useState(initialCertificates)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ petName: "", type: "", expiryDate: "" })

  const handleGenerateCertificate = (e) => {
    e.preventDefault()
    const newCode = `CERT-${new Date().getFullYear()}-${certificates.length + 1}`
    setCertificates([
      ...certificates,
      {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        code: newCode,
      },
    ])
    setFormData({ petName: "", type: "", expiryDate: "" })
    setShowForm(false)
  }

  const handleDownloadCertificate = (cert) => {
    alert(`Descargando certificado:\n${cert.type}\nPara: ${cert.petName}\nCódigo: ${cert.code}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Certificados</h2>
        {user.role === "veterinarian" && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Generar Certificado
          </Button>
        )}
      </div>

      {showForm && user.role === "veterinarian" && (
        <Card>
          <CardHeader>
            <CardTitle>Generar Nuevo Certificado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateCertificate} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la mascota"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                required
              >
                <option value="">Tipo de certificado</option>
                <option value="Vacunación Rabia">Vacunación Rabia</option>
                <option value="Desparasitación">Desparasitación</option>
                <option value="Certificado de Salud">Certificado de Salud</option>
                <option value="Viaje Internacional">Viaje Internacional</option>
              </select>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg border-input bg-background"
                placeholder="Fecha de expiración"
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Generar
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
        {certificates.map((cert) => (
          <Card key={cert.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <Award className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">{cert.type}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{cert.petName}</p>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Código:</strong> {cert.code}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {cert.date}
                      </p>
                      <p>
                        <strong>Vence:</strong> {cert.expiryDate}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadCertificate(cert)}
                  className="flex items-center gap-2 ml-4"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
