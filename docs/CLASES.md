# CLASES - DOMINIOS PRINCIPALES

## Navegación
- Arquitectura: `docs/ARQUITECTURA.md`
- Modelo de datos (ER): `docs/MODELO_DATOS.md`
- Diagramas: `docs/DIAGRAMAS.md`
- Glosario: `docs/GLOSARIO.md`

- Diagrama: ![Clases](diagrams/clases.svg)

## Entidades
- Usuario: `id`, `email`, `nombre`, `apellido`, `rol`.
- Mascota: `id`, `nombre`, `especie`, `raza`, `estado`.
- Cita: `id`, `fechaHora`, `motivo`, `estado`.
- HistorialMedico: `temperatura`, `frecuenciaCardiaca`, `diagnostico`, `tratamiento`.
- Certificado: `tipo`, `numero`, `codigoQR`, `estado`.
- Vacuna: `nombre`, `fechaAplicacion`, `fechaProximaDosis`.

## Relaciones
- Usuario ↔ Mascota (1..*): dueño.
- Usuario ↔ Cita (1..*): dueño/veterinario.
- Mascota ↔ Cita (1..*).
- Mascota ↔ HistorialMedico (1..*).
- Mascota ↔ Certificado (1..*).
- Mascota ↔ Vacuna (1..*).