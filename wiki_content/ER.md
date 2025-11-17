# Entidad-Relación

- Diagrama: ![ER](images/er.svg)
- Relaciones clave: Usuario↔Mascota, Mascota↔Cita, Mascota↔Historial, Mascota↔Certificado, Mascota↔Vacuna.

## Relaciones
- Usuario 1..* Mascota (dueño)
- Mascota 1..* Cita; Usuario (vet) y Usuario (dueño) vinculados a Cita
- Cita 0..1 HistorialMedico; Mascota 1..* HistorialMedico
- Mascota 1..* Certificado; Usuario (vet) emisor
- Mascota 1..* Vacuna; Usuario (vet) registrador

## Campos destacados
- Mascota: `id`, `nombre`, `especie`, `raza`, `estado`
- Cita: `id`, `fecha_hora`, `duracion`, `motivo`, `estado`
- Certificado: `id`, `tipo`, `numero_certificado`, `codigo_qr`, `estado`