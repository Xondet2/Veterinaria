# Ejemplos de Uso

## Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'
```

## Crear Mascota (admin/veterinario)
```bash
curl -X POST http://localhost:8080/api/mascotas \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{
    "nombre":"Luna","especie":"canino","raza":"mestizo",
    "edadAños":2,"pesoKg":8.5,"sexo":"hembra",
    "fechaNacimiento":"2023-06-01","dueñoId":"<UUID-DUEÑO>"
  }'
```

## Crear Cita (dueño)
```bash
curl -X POST http://localhost:8080/api/citas \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{
    "mascotaId":"<UUID-MASCOTA>","veterinarioId":"<UUID-VET>",
    "fechaHora":"2025-01-10T10:30:00Z","duracionMinutos":30,
    "motivo":"Consulta general"
  }'
```

## Confirmar Cita (admin/veterinario)
```bash
curl -X PATCH http://localhost:8080/api/citas/<UUID-CITA>/estado \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"estado":"confirmada"}'
```