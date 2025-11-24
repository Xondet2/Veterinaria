'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface MascotaFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  initialData?: any;
}

export function MascotaForm({ onSubmit, loading = false, initialData }: MascotaFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(initialData || {
    nombre: '',
    especie: '',
    raza: '',
    edad_años: '',
    peso_kg: '',
    sexo: '',
    fecha_nacimiento: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      await onSubmit(formData);
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: error.message || 'Error al guardar mascota' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            placeholder="Ej: Max"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className={errors.nombre ? 'border-red-500' : ''}
          />
          {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="especie">Especie *</Label>
          <Select value={formData.especie} onValueChange={(val) => setFormData({ ...formData, especie: val })}>
            <SelectTrigger className={errors.especie ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perro">Perro</SelectItem>
              <SelectItem value="gato">Gato</SelectItem>
              <SelectItem value="conejo">Conejo</SelectItem>
              <SelectItem value="pajaro">Pájaro</SelectItem>
              <SelectItem value="roedor">Roedor</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
          {errors.especie && <p className="text-red-600 text-sm">{errors.especie}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="raza">Raza *</Label>
          <Input
            id="raza"
            placeholder="Ej: Labrador"
            value={formData.raza}
            onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
            className={errors.raza ? 'border-red-500' : ''}
          />
          {errors.raza && <p className="text-red-600 text-sm">{errors.raza}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo *</Label>
          <Select value={formData.sexo} onValueChange={(val) => setFormData({ ...formData, sexo: val })}>
            <SelectTrigger className={errors.sexo ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="macho">Macho</SelectItem>
              <SelectItem value="hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
          {errors.sexo && <p className="text-red-600 text-sm">{errors.sexo}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edad">Edad (años) *</Label>
          <Input
            id="edad"
            type="number"
            placeholder="5"
            value={formData.edad_años}
            onChange={(e) => setFormData({ ...formData, edad_años: e.target.value })}
            min="0"
            max="50"
            className={errors.edad_años ? 'border-red-500' : ''}
          />
          {errors.edad_años && <p className="text-red-600 text-sm">{errors.edad_años}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg) *</Label>
          <Input
            id="peso"
            type="number"
            placeholder="32.5"
            value={formData.peso_kg}
            onChange={(e) => setFormData({ ...formData, peso_kg: e.target.value })}
            step="0.1"
            min="0.1"
            max="150"
            className={errors.peso_kg ? 'border-red-500' : ''}
          />
          {errors.peso_kg && <p className="text-red-600 text-sm">{errors.peso_kg}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha Nacimiento *</Label>
          <Input
            id="fecha"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
            className={errors.fecha_nacimiento ? 'border-red-500' : ''}
          />
          {errors.fecha_nacimiento && <p className="text-red-600 text-sm">{errors.fecha_nacimiento}</p>}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Guardando...' : 'Guardar Mascota'}
      </Button>
    </form>
  );
}
