# SISTEMA DE GESTIÓN VETERINARIA (SGV)

Aplicación profesional full-stack para gestión integral de clínicas veterinarias.

## Características Principales

- ✅ **Autenticación segura** con JWT
- ✅ **Gestión de mascotas** con CRUD completo
- ✅ **Agendamiento de citas** con disponibilidad en tiempo real
- ✅ **Historial médico** con signos vitales y diagnósticos
- ✅ **Generación de certificados** sanitarios con QR
- ✅ **Control de vacunación** con recordatorios
- ✅ **Panel administrativo** con estadísticas
- ✅ **Validaciones robustas** en todos los formularios
- ✅ **Auditoría completa** de operaciones

## Requisitos

- Node.js 18+
- npm/yarn
- PostgreSQL 12+ (para producción)

## Instalación Rápida

\`\`\`bash
# 1. Clonar repositorio
git clone https://github.com/Xondet2/Veterinaria.git
cd Veterinaria

# 2. Instalar dependencias del frontend
npm install

# 3. Crear archivo .env.local (frontend)
cp .env.example .env.local

# 4. Levantar backend (Spring Boot)
cd springboot
mvn -q -DskipTests spring-boot:run
# API disponible en http://localhost:8080

# 5. Levantar frontend (Next.js)
cd ..
npm run dev -- -p 3000
# App disponible en http://localhost:3000
\`\`\`

## Acceso Demo

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@clinic.com | demo123 |
| Veterinario | vet@clinic.com | demo123 |
| Dueño | owner@example.com | demo123 |

## Estructura del Proyecto

Ver documentación en `/docs/ARQUITECTURA.md`

## Módulos Disponibles

### 1. Autenticación
- Registro y login con validación
- JWT de 24 horas
- Recuperación de contraseña
- Control de roles

### 2. Gestión de Mascotas
- CRUD completo
- Búsqueda y filtros
- Importación/exportación CSV
- Historial de cambios

### 3. Agendamiento de Citas
- Disponibilidad en tiempo real
- Confirmación automática
- Recordatorios 24h y 1h antes
- Reportes

### 4. Historiales Médicos
- Registro de signos vitales
- Diagnósticos y tratamientos
- Prescripciones
- Exportación a PDF

### 5. Certificados Sanitarios
- Generación con QR
- 4 tipos (salud, vacunación, desparasitación, viaje)
- Verificación online
- Historial

### 6. Control de Vacunas
- Esquema de vacunación
- Alerta de próximas dosis
- Recordatorios automáticos
- Cumplimiento

### 7. Panel Administrativo
- Estadísticas en tiempo real
- Gestión de usuarios
- Reportes
- Configuración

### 8. Auditoría
- Log inmutable
- Trazabilidad completa
- Reportes de seguridad

## Validaciones Implementadas

### Usuarios
- Email: formato válido, máximo 255 caracteres
- Nombre/Apellido: 2-100 caracteres, solo letras
- Contraseña: 8+ caracteres, mayúscula, minúscula, número
- Teléfono: 7-20 dígitos

### Mascotas
- Nombre: 2-100 caracteres
- Raza: 2-100 caracteres  
- Peso: 0.1-150 kg
- Edad: 0-50 años
- Microchip: 15 caracteres hexadecimales (opcional)

### Citas
- Motivo: 10-500 caracteres
- Duración: 15-120 minutos
- Fecha: debe ser futura
- Sin sobreposición por veterinario

### Historiales
- Diagnóstico: 20-1000 caracteres
- Tratamiento: 20-1000 caracteres
- Signos vitales: rangos validados
- Peso: 0.1-150 kg

### Certificados
- Contenido: máximo 2000 caracteres
- Vencimiento: debe ser futuro
- Número: único e inmutable

## API Reference

Base URL del backend: `http://localhost:8080`

### Autenticación
\`\`\`
POST   /api/auth/login                         - Iniciar sesión
GET    /api/health                            - Verificar salud del backend (público)
\`\`\`
Registro y gestión de usuarios están restringidos al rol `admin`.

### Mascotas
\`\`\`
GET    /api/mascotas                         - Listar mascotas (dueño ve solo las suyas)
POST   /api/mascotas                         - Crear mascota (admin/veterinario)
GET    /api/mascotas/:id                     - Obtener detalle
PUT    /api/mascotas/:id                     - Actualizar (admin/veterinario)
DELETE /api/mascotas/:id                     - Eliminar (admin)
\`\`\`
Notas:
- `POST /api/mascotas` acepta `dueñoId` (UUID) opcional en el cuerpo para asignar la mascota a un dueño específico. Si no se envía, se asigna al usuario autenticado.

### Citas
\`\`\`
GET    /api/citas                                - Listar citas
POST   /api/citas                                - Crear cita (admin/veterinario/dueño)
PATCH  /api/citas/{id}/estado                    - Actualizar estado (admin/veterinario)
\`\`\`
Notas:
- Conflictos de horario del veterinario retornan `409`.
- El dueño puede crear la cita; el estado puede ser confirmado por admin/veterinario.
- Si la cita es creada por admin/veterinario y no se envía `dueñoId`, el sistema lo infiere desde la mascota seleccionada.

### Historiales
\`\`\`
GET    /api/historial/:mascota_id               - Listar historial
POST   /api/historial                            - Crear registro (admin/veterinario)
\`\`\`

### Certificados
\`\`\`
GET    /api/certificados/:mascota_id            - Listar certificados
POST   /api/certificados                         - Generar certificado (admin/veterinario)
GET    /api/certificados/:id/pdf                 - Descargar PDF
\`\`\`

### Vacunas
\`\`\`
GET    /api/vacunas/:mascota_id                   - Listar vacunas
POST   /api/vacunas                                - Registrar vacuna (admin/veterinario)
\`\`\`

### Administración (solo admin)
\`\`\`
GET    /api/admin/usuarios                        - Listar usuarios
POST   /api/admin/usuarios                        - Crear usuario
PATCH  /api/admin/usuarios/{id}/rol               - Asignar rol
\`\`\`

## Configuración

### Variables de Entorno (.env.local)

\`\`\`env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/veterinary_db

# JWT
JWT_SECRET=your-secret-key-here-change-in-production

# Email (opcional)
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@clinic.com

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
\`\`\`

## Seguridad

- Contraseñas hasheadas con BCrypt (backend Spring Boot)
- JWT firmado (stateless) con rol embebido
- Validación en cliente y servidor
- Protección contra inyección
- Logs y auditoría
- Control de acceso por rol (RBAC)

### Roles
- Admin: acceso total, creación de cuentas y asignación de roles
- Veterinario: gestión completa de datos clínicos, sin asignación de roles
- Dueño: lectura de su información y agendamiento de citas

## Deployment

## Diagramas

- Arquitectura: ![Arquitectura](docs/diagrams/arquitectura.svg)
- Componentes: ![Componentes](docs/diagrams/componentes.svg)
- Entidad-Relación: ![ER](docs/diagrams/er.svg)
- Clases: ![Clases](docs/diagrams/clases.svg)
- Permisos por Rol: ![Permisos](docs/diagrams/permisos.svg)
- Ciclo de Vida de Mascota: ![Ciclo de Vida](docs/diagrams/ciclo_mascota.svg)
- Secuencia Login/JWT: ![Login](docs/diagrams/sec_login.svg)
- Flujo Cita (crear/confirmar): ![Flujo Cita](docs/diagrams/flow_cita.svg)

## Cómo generar las imágenes (PlantUML)

```bash
# Opción A: PlantUML CLI con Java
# 1) Descarga plantuml.jar desde https://plantuml.com/download
# 2) Ubícate en la raíz del repositorio
java -jar plantuml.jar -tsvg -o docs/img docs/DIAGRAMAS.md docs/ARQUITECTURA.md

# Opción B: Docker
docker run --rm -v %cd%:/data ghcr.io/plantuml/plantuml -tsvg -o docs/img docs/DIAGRAMAS.md docs/ARQUITECTURA.md

# Opción C: VS Code
# Instala la extensión "PlantUML" y usa el comando "PlantUML: Export Current Diagram"
```

Notas:
- Los archivos fuente `.puml` se encuentran en `docs/diagrams/puml/`.
- Genera imágenes con: `java -jar tools/plantuml.jar -tsvg docs/diagrams/puml/*.puml` y ubícalas en `docs/diagrams/`.

### Vercel (Recomendado)

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Docker

\`\`\`bash
docker build -t vetclinic .
docker run -p 3000:3000 vetclinic
\`\`\`

### Producción

1. Configurar variables de entorno en hosting
2. Usar base de datos PostgreSQL real
3. Habilitar HTTPS
4. Configurar backup automático
5. Configurar monitoreo

## Documentación Completa

- `/docs/CONTEXTO.md` - Propósito y usuarios
- `/docs/MODELO_DATOS.md` - Estructura de datos
- `/docs/FUNCIONALIDADES.md` - Características del sistema
- `/docs/ARQUITECTURA.md` - Arquitectura técnica
- `/docs/DIAGRAMAS.md` - Diagramas ER, flujos, casos de uso

### Wiki de GitHub
- La wiki se publica automáticamente desde `wiki_content/` cuando está habilitada.
- Enlace: `https://github.com/Xondet2/Veterinaria/wiki`
- Si la wiki no está habilitada, activa en Settings → Wikis. El workflow `Publicar Wiki` sincroniza las páginas e imágenes.

