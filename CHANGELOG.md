# Changelog

## 2025-11-16
- Documentación consolidada en README y `/docs/`.
- Diagramas PlantUML añadidos y exportados a SVG en `/docs/diagrams/`.
- Diagramas nuevos: Arquitectura, Componentes, Clases, ER, Permisos, Ciclo de Vida, Secuencia Login, Flujo Cita, Despliegue.
- Glosario (`/docs/GLOSARIO.md`) y ejemplos de uso (`/examples/README.md`).
- Ajustes funcionales: asignación de `dueñoId` en creación de mascotas; inferencia de `dueñoId` en creación de citas por admin/vet.

## 2025-11-17
- Wiki: páginas actualizadas para claridad y organización (Arquitectura, Componentes, ER, Clases, RBAC, Login JWT, Flujo Cita, Despliegue).
- Workflow: sincronización automática de wiki y copia de imágenes SVG desde `docs/diagrams/`.
- PR Template: verificación de publicación en Wiki y accesibilidad de páginas.
- Backend: corrección de BOM y formateo en clases (`Mascota`, `Usuario`, `Cita`, `VeterinariaApplication`, repositorios, `DataLoader`, `JwtTokenProvider`).
- Maven: configuración de `UTF-8` y `source/target 17` en `pom.xml`.
- Validación: `mvn test` OK; endpoint `GET /api/health` responde `200` en local.

## 2025-11-24
- Autenticación: se movió la validación de complejidad de contraseña al registro.
- Login: se permite ingresar con contraseñas existentes (incluida la corta de admin).
- Registro: se exige contraseña fuerte (8+, mayúscula, minúscula, número y símbolo).
- Configuración: se añadió selector de idioma (es/en) y toggle de tema (claro/oscuro) con persistencia.
- I18n: textos de interfaz, componentes UI y mensajes del sistema traducidos (login, toasts, sidebar).
- Frontend: no se cierra sesión en errores 403; solo en 401.
- Tests: se agregaron pruebas unitarias de autenticación (registro y login).