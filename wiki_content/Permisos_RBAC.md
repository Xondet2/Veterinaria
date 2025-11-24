# Permisos (RBAC)

- Diagrama: ![Permisos](images/permisos.svg)
- Roles: Admin (total), Veterinario (clínico), Dueño (lectura + agendar).

## Matriz resumida
| Funcionalidad | Dueño | Veterinario | Admin |
|---|---|---|---|
| Registrar mascota | ✓ | ✓ | ✓ |
| Ver mascotas propias | ✓ | - | - |
| Ver todas | - | ✓ | ✓ |
| Agendar cita | ✓ | ✓ | ✓ |
| Confirmar cita | - | ✓ | ✓ |
| Registrar historial | - | ✓ | ✓ |
| Generar certificado | - | ✓ | ✓ |
| Descargar certificado | ✓ | ✓ | ✓ |
| Registrar vacuna | - | ✓ | ✓ |
| Gestionar usuarios | - | - | ✓ |