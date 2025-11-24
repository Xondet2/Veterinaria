# Despliegue

- Diagrama: ![Despliegue](diagrams/despliegue.svg)

## Entornos
- Desarrollo: Frontend `http://localhost:3000`, Backend `http://localhost:8080`, DB H2.
- Producción: Frontend (Vercel u otro), Backend (Spring Boot), DB PostgreSQL.

## Consideraciones
- HTTPS entre Frontend y Backend.
- JWT para autenticación.
- Logs y auditoría en backend.