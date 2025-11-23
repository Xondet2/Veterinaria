# GLOSARIO

## Navegación
- Arquitectura: `docs/ARQUITECTURA.md`
- Funcionalidades: `docs/FUNCIONALIDADES.md`
- Modelo de datos: `docs/MODELO_DATOS.md`
- Diagramas: `docs/DIAGRAMAS.md`

- JWT: Token de acceso firmado que incluye identificador de usuario (`sub`) y `rol`.
- RBAC: Control de acceso basado en roles (admin, veterinario, dueño).
- SecurityFilterChain: Cadena de filtros de Spring Security que valida autenticación/autorización.
- JwtAuthenticationFilter: Filtro que valida JWT y propaga `Principal` y `ROLE_<rol>`.
- App Router: Sistema de enrutamiento de Next.js 15.
- `lib/api.ts`: Cliente HTTP del frontend que añade `Authorization` y maneja 401/403.
- H2: Base de datos embebida para desarrollo.
- PostgreSQL: Base de datos relacional usada en producción.
- ER: Diagrama Entidad-Relación.
- CRUD: Crear, Leer, Actualizar, Eliminar.