"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Navigation({ user, onLogout, onModuleChange }) {
  const modules = [
    { id: "dashboard", label: "Dashboard" },
    { id: "pets", label: "Mascotas" },
    { id: "appointments", label: "Citas" },
    { id: "medical-history", label: "Historial Médico" },
    { id: "certificates", label: "Certificados" },
  ]

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">VetClinic</h1>

          <div className="flex items-center gap-6">
            <div className="flex gap-2 flex-wrap">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => onModuleChange(mod.id)}
                  className="px-3 py-2 rounded-lg hover:bg-secondary transition text-sm font-medium"
                >
                  {mod.label}
                </button>
              ))}
              {user.role === "admin" && (
                <button
                  onClick={() => onModuleChange("admin")}
                  className="px-3 py-2 rounded-lg hover:bg-secondary transition text-sm font-medium"
                >
                  Admin
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
