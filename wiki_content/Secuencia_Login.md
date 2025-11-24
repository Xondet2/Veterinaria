# Secuencia: Login y JWT

- Diagrama: ![Login](images/sec_login.svg)
- Flujo: credenciales → JWT con rol → llamadas autenticadas → manejo 401/403.

## Pasos
- Usuario envía `POST /api/auth/login` con email y contraseña.
- Backend valida credenciales y responde JWT con `sub` y `rol`.
- Cliente guarda el token y lo adjunta en `Authorization: Bearer <JWT>`.
- Recursos protegidos responden 401/403 si el token es inválido o sin permisos.

## Consideraciones
- Duración del JWT: 24 horas.
- Renovación: re-login cuando expira.