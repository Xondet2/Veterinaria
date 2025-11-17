# Glosario

- JWT: Token firmado con `sub` y `rol`.
- RBAC: Control de acceso por roles.
- SecurityFilterChain: Cadena de filtros de Spring Security.
- JwtAuthenticationFilter: Valida JWT y aplica `ROLE_<rol>`.
- App Router: Enrutamiento de Next.js 15.
- `lib/api.ts`: cliente HTTP que adjunta JWT y maneja 401/403.