# COMPONENTES - SISTEMA DE GESTIÓN VETERINARIA

## Navegación
- Arquitectura: `docs/ARQUITECTURA.md`
- Funcionalidades: `docs/FUNCIONALIDADES.md`
- Diagramas: `docs/DIAGRAMAS.md`
- Modelo de datos: `docs/MODELO_DATOS.md`
- Clases: `docs/CLASES.md`
- Glosario: `docs/GLOSARIO.md`

- Vista general de componentes y sus interfaces.
- Diagrama: ![Componentes](diagrams/componentes.svg)

## Frontend
- UI (App Router): navegación y presentación.
- RoleGuard: protege rutas según rol.
- Cliente HTTP (`lib/api.ts`): adjunta JWT y maneja errores.

## Backend
- Controllers: exponen endpoints REST.
- SecurityConfig y JwtAuthenticationFilter: autenticación/autorización.
- Services: lógica de negocio.
- Repositorios JPA y entidades: persistencia.