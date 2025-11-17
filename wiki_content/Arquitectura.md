# Arquitectura

- Diagrama: ![Arquitectura](images/arquitectura.svg)
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui, RoleGuard.
- Backend: Spring Boot 3.3, SecurityFilterChain, JwtAuthenticationFilter, @PreAuthorize.
- DB: H2 (dev) / PostgreSQL (prod).
- `GET /api/health` público.

## Capas
- Presentación: componentes React y páginas en `app/`.
- Lógica de negocio: hooks y utilidades (validaciones, flujos).
- API: controladores REST en Spring Boot (`/api/*`).
- Servicios: reglas de negocio por módulo.
- Persistencia: JPA/Hibernate con H2/PostgreSQL.

## Seguridad
- Autenticación por JWT firmado; rol embebido en el token.
- Filtros: `JwtAuthenticationFilter` y `SecurityFilterChain`.
- Autorización con `@PreAuthorize` siguiendo RBAC.

## Integración
- Cliente HTTP en `lib/api.ts` que adjunta JWT y maneja 401/403.
- CORS configurado globalmente en backend.

## Endpoints clave
- `POST /api/auth/login` (login)
- `GET /api/health` (público)
- `GET/POST /api/mascotas`, `GET/PUT/DELETE /api/mascotas/:id`
- `GET/POST /api/citas`, `PATCH /api/citas/{id}/estado`