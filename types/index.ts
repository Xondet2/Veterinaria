export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'dueño' | 'veterinario' | 'recepcionista' | 'admin';
  telefono?: string;
  cedula?: string;
  especialidad?: string;
  estado: 'activo' | 'inactivo';
}

export interface MascotaData {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad_años: number;
  peso_kg: number;
  sexo: string;
  propietario_id: string;
}

export interface CitaData {
  id: string;
  mascota_id: string;
  veterinario_id: string;
  propietario_id: string;
  fecha_hora: Date;
  motivo: string;
  estado: string;
}

export interface HistorialMedicoData {
  id: string;
  diagnostico: string;
  tratamiento: string;
  fecha_registro: Date;
}

export interface CertificadoData {
  id: string;
  tipo: string;
  numero_certificado: string;
  fecha_emision: Date;
  estado: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
