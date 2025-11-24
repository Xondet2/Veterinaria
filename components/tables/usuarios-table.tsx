'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  estado: string;
  telefono?: string;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEdit?: (usuario: Usuario) => void;
  onDelete?: (id: string) => void;
}

export function UsuariosTable({ usuarios, onEdit, onDelete }: UsuariosTableProps) {
  const getRolColor = (rol: string) => {
    const colores: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      veterinario: 'bg-blue-100 text-blue-800',
      recepcionista: 'bg-green-100 text-green-800',
      dueño: 'bg-purple-100 text-purple-800',
    };
    return colores[rol] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-yellow-100 text-yellow-800',
      suspendido: 'bg-red-100 text-red-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Usuario</th>
            <th className="px-4 py-3 text-left font-semibold">Email</th>
            <th className="px-4 py-3 text-left font-semibold">Rol</th>
            <th className="px-4 py-3 text-left font-semibold">Estado</th>
            <th className="px-4 py-3 text-left font-semibold">Teléfono</th>
            <th className="px-4 py-3 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
              </td>
              <td className="px-4 py-3 text-gray-600">{usuario.email}</td>
              <td className="px-4 py-3">
                <Badge className={`${getRolColor(usuario.rol)} capitalize`}>
                  {usuario.rol}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge className={`${getEstadoColor(usuario.estado)} capitalize`}>
                  {usuario.estado}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-600">{usuario.telefono || '-'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(usuario)}
                      className="gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(usuario.id)}
                      className="gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
