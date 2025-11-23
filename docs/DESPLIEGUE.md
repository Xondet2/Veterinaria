# DESPLIEGUE - SISTEMA DE GESTIÓN VETERINARIA

- Diagrama: ![Despliegue](diagrams/despliegue.svg)

## Entornos
- Desarrollo: Frontend `http://localhost:3000`, Backend `http://localhost:8080`, DB H2.
- Producción: Frontend (Vercel u otro), Backend (Spring Boot), DB PostgreSQL.

## Consideraciones
- HTTPS entre Frontend y Backend.
- JWT para autenticación.
- Logs y auditoría en backend.

## Ejecución Local

### Backend
```
cd springboot
mvn -q -DskipTests spring-boot:run
```
- Puerto: `8080`
- Configuración: `springboot/src/main/resources/application.yml`

### Frontend
```
npm run dev -- -p 3000
```
- Puerto: `3000`
- Configuración: `.env.local` → `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`

## Despliegue Recomendado
- Backend: empaquetar `jar` con `mvn -DskipTests package`, provisionar PostgreSQL, configurar `JWT_SECRET` y tiempo de expiración.
- Frontend: Vercel / Node 18+, configurar `NEXT_PUBLIC_API_BASE_URL` apuntando al backend.