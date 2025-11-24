# MODELO DE DATOS - SISTEMA DE GESTIÓN VETERINARIA

## 1. TABLAS PRINCIPALES

### 1.1 Tabla: USUARIOS

**Propósito**: Almacenar información de todos los usuarios del sistema

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email único, formato validado |
| contraseña_hash | VARCHAR(255) | NOT NULL | Contraseña hasheada bcryptjs |
| nombre | VARCHAR(100) | NOT NULL | 2-100 caracteres, solo letras/espacios |
| apellido | VARCHAR(100) | NOT NULL | 2-100 caracteres, solo letras/espacios |
| teléfono | VARCHAR(20) | UNIQUE | 7-20 dígitos |
| rol | ENUM | NOT NULL | admin, veterinario, recepcionista, dueño |
| estado | ENUM | NOT NULL | activo, inactivo, suspendido |
| especialidad | VARCHAR(100) | - | Solo veterinarios |
| licencia_veterinaria | VARCHAR(50) | - | Número de cédula profesional |
| estado_email_verificado | BOOLEAN | DEFAULT false | Indica si email fue confirmado |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de registro |
| fecha_actualizacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Última actualización |
| eliminado_logicamente | BOOLEAN | DEFAULT false | Soft delete |

**Índices**:
- UNIQUE(email)
- INDEX(rol)
- INDEX(estado)
- INDEX(fecha_creacion)

**Validaciones**:
- Email: Formato válido (regex), máximo 255 caracteres
- Contraseña: Mínimo 8 caracteres, mayúscula, minúscula, número
- Nombre/Apellido: 2-100 caracteres, solo letras y espacios
- Teléfono: 7-20 dígitos, opcional
- Rol: Debe ser uno de los roles definidos

---

### 1.2 Tabla: MASCOTAS

**Propósito**: Registro de todas las mascotas del sistema

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| dueño_id | UUID | FK(usuarios), NOT NULL | Referencia al dueño |
| nombre | VARCHAR(100) | NOT NULL | 2-100 caracteres |
| especie | ENUM | NOT NULL | perro, gato, conejo, ave, otro |
| raza | VARCHAR(100) | NOT NULL | 2-100 caracteres |
| sexo | ENUM | NOT NULL | macho, hembra |
| edad_años | INTEGER | NOT NULL | 0-50 años |
| peso_kg | DECIMAL(5,2) | NOT NULL | 0.1-150 kg |
| color | VARCHAR(100) | - | Color o patrón del pelaje |
| microchip | VARCHAR(15) | UNIQUE | 15 caracteres hexadecimales |
| fecha_nacimiento | DATE | - | Fecha de nacimiento aproximada |
| estado | ENUM | NOT NULL | activo, fallecido, desconocido |
| foto_url | VARCHAR(255) | - | URL de foto de mascota |
| notas | TEXT | - | Notas generales, máximo 500 caracteres |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de registro |
| fecha_actualizacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Última actualización |
| eliminado_logicamente | BOOLEAN | DEFAULT false | Soft delete |

**Índices**:
- INDEX(dueño_id)
- UNIQUE(microchip)
- INDEX(estado)
- INDEX(fecha_creacion)

**Validaciones**:
- Nombre: 2-100 caracteres
- Raza: 2-100 caracteres
- Peso: 0.1 kg mínimo, 150 kg máximo
- Edad: 0-50 años
- Microchip: 15 caracteres hexadecimales (opcional)
- Especie: Uno de los valores enum
- FK dueño_id: Debe existir en USUARIOS

---

### 1.3 Tabla: CITAS

**Propósito**: Gestión de citas médicas veterinarias

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| mascota_id | UUID | FK(mascotas), NOT NULL | Mascota a atender |
| veterinario_id | UUID | FK(usuarios), NOT NULL | Veterinario asignado |
| dueño_id | UUID | FK(usuarios), NOT NULL | Dueño de la mascota |
| fecha_hora_inicio | TIMESTAMP | NOT NULL | Fecha y hora de inicio |
| duracion_minutos | INTEGER | NOT NULL | 15-120 minutos |
| motivo | VARCHAR(500) | NOT NULL | 10-500 caracteres |
| estado | ENUM | NOT NULL | agendada, confirmada, completada, cancelada, no_asistió |
| tipo_consulta | ENUM | NOT NULL | general, preventiva, urgencia, seguimiento |
| consultorio | INTEGER | - | Número de consultorio |
| notas_internas | TEXT | - | Máximo 500 caracteres |
| costo_estimado | DECIMAL(10,2) | - | Costo estimado de la cita |
| costo_final | DECIMAL(10,2) | - | Costo real ejecutado |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Cuándo se agendó |
| fecha_actualizacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Última actualización |
| eliminado_logicamente | BOOLEAN | DEFAULT false | Soft delete |

**Índices**:
- INDEX(mascota_id)
- INDEX(veterinario_id)
- INDEX(dueño_id)
- INDEX(fecha_hora_inicio)
- INDEX(estado)

**Restricciones de Negocio**:
- No pueden existir 2 citas simultáneas del mismo veterinario
- No pueden existir 2+ citas de la misma mascota el mismo día
- Duración: mínimo 15 minutos, máximo 120 minutos
- Fecha debe ser futura
- Motivo: mínimo 10 caracteres, máximo 500

---

### 1.4 Tabla: HISTORIAL_MEDICO

**Propósito**: Registro de consultas y procedimientos médicos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| cita_id | UUID | FK(citas), NOT NULL | Cita relacionada |
| mascota_id | UUID | FK(mascotas), NOT NULL | Mascota atendida |
| veterinario_id | UUID | FK(usuarios), NOT NULL | Veterinario tratante |
| temperatura_c | DECIMAL(4,1) | - | Rango: 36-40°C |
| frecuencia_cardiaca | INTEGER | - | Rango: 40-150 bpm |
| frecuencia_respiratoria | INTEGER | - | Rango: 10-40 rpm |
| peso_kg | DECIMAL(5,2) | - | Peso actual 0.1-150 kg |
| diagnostico | VARCHAR(1000) | NOT NULL | 20-1000 caracteres |
| tratamiento | VARCHAR(1000) | NOT NULL | 20-1000 caracteres |
| medicinas_prescritas | TEXT | - | JSON array de medicinas |
| observaciones | TEXT | - | Máximo 500 caracteres |
| fecha_registro | TIMESTAMP | NOT NULL, DEFAULT NOW() | Cuándo se registró |
| fecha_actualizacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Última actualización |
| eliminado_logicamente | BOOLEAN | DEFAULT false | Soft delete |

**Índices**:
- INDEX(cita_id)
- INDEX(mascota_id)
- INDEX(veterinario_id)
- INDEX(fecha_registro)

**Validaciones**:
- Temperatura: 36-40°C
- Frecuencia cardíaca: 40-150 bpm
- Frecuencia respiratoria: 10-40 rpm
- Peso: 0.1-150 kg
- Diagnóstico: 20-1000 caracteres
- Tratamiento: 20-1000 caracteres

---

### 1.5 Tabla: CERTIFICADOS

**Propósito**: Generación y control de certificados sanitarios

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| mascota_id | UUID | FK(mascotas), NOT NULL | Mascota certificada |
| veterinario_id | UUID | FK(usuarios), NOT NULL | Veterinario emisor |
| tipo | ENUM | NOT NULL | salud, vacunacion, desparasitacion, viaje |
| numero_certificado | VARCHAR(50) | UNIQUE, NOT NULL | Número único e inmutable |
| codigo_qr | VARCHAR(255) | UNIQUE | Código QR para verificación online |
| contenido | VARCHAR(2000) | NOT NULL | Máximo 2000 caracteres |
| fecha_emision | DATE | NOT NULL | Fecha de emisión |
| fecha_vencimiento | DATE | NOT NULL | Debe ser futura al momento de creación |
| estado | ENUM | NOT NULL | vigente, vencido, revocado |
| pdf_url | VARCHAR(255) | - | URL del PDF generado |
| descargado_por_dueño | BOOLEAN | DEFAULT false | Si el dueño descargó |
| fecha_descarga | TIMESTAMP | - | Cuándo fue descargado |
| verificaciones_qr | INTEGER | DEFAULT 0 | Cantidad de verificaciones |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de registro |
| eliminado_logicamente | BOOLEAN | DEFAULT false | Soft delete |

**Índices**:
- UNIQUE(numero_certificado)
- INDEX(mascota_id)
- INDEX(tipo)
- INDEX(estado)
- INDEX(fecha_vencimiento)

**Validaciones**:
- Número de certificado: único, inmutable
- Contenido: máximo 2000 caracteres
- Vencimiento: debe ser posterior a la emisión
- Tipo: uno de los enum definidos

---

### 1.6 Tabla: VACUNAS

**Propósito**: Tracking de esquema de vacunación

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| mascota_id | UUID | FK(mascotas), NOT NULL | Mascota vacunada |
| nombre_vacuna | VARCHAR(100) | NOT NULL | Nombre de la vacuna |
| fecha_aplicacion | DATE | NOT NULL | Fecha de aplicación |
| fecha_proxima_dosis | DATE | - | Fecha de próxima dosis |
| veterinario_id | UUID | FK(usuarios), NOT NULL | Veterinario que aplicó |
| lote | VARCHAR(50) | - | Número de lote |
| sitio_aplicacion | VARCHAR(100) | - | Dónde se inyectó |
| reaccion_adversa | TEXT | - | Máximo 500 caracteres |
| estado | ENUM | NOT NULL | aplicada, pendiente, rechazada |
| certificado_id | UUID | FK(certificados) | Certificado asociado |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de registro |
| eliminado_logicamente | BOOLEAN | DEFAULT false | Soft delete |

**Índices**:
- INDEX(mascota_id)
- INDEX(fecha_proxima_dosis)
- INDEX(estado)

---

### 1.7 Tabla: DISPONIBILIDAD_VETERINARIOS

**Propósito**: Control de disponibilidad y horarios

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| veterinario_id | UUID | FK(usuarios), NOT NULL | Veterinario |
| dia_semana | ENUM | NOT NULL | lunes-domingo |
| hora_inicio | TIME | NOT NULL | Ej: 08:00 |
| hora_fin | TIME | NOT NULL | Ej: 18:00 |
| almuerzo_inicio | TIME | - | Ej: 12:00 |
| almuerzo_fin | TIME | - | Ej: 13:00 |
| activo | BOOLEAN | NOT NULL | Si el horario está activo |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de registro |

**Índices**:
- INDEX(veterinario_id)
- INDEX(dia_semana)

---

### 1.8 Tabla: AUDIT_LOG

**Propósito**: Log inmutable de todas las operaciones

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| usuario_id | UUID | FK(usuarios) | Quién ejecutó la acción |
| tipo_accion | ENUM | NOT NULL | CREATE, UPDATE, DELETE, LOGIN |
| tabla_afectada | VARCHAR(100) | NOT NULL | Nombre de tabla |
| registro_id | UUID | - | ID del registro afectado |
| datos_anteriores | JSON | - | Snapshot anterior |
| datos_nuevos | JSON | - | Snapshot nuevo |
| dirección_ip | VARCHAR(45) | - | IP del cliente |
| user_agent | TEXT | - | User agent del navegador |
| fecha_timestamp | TIMESTAMP | NOT NULL, DEFAULT NOW() | Marca temporal |

**Índices**:
- INDEX(usuario_id)
- INDEX(tabla_afectada)
- INDEX(fecha_timestamp)
- INDEX(tipo_accion)

---

### 1.9 Tabla: RECORDATORIOS

**Propósito**: Gestión de recordatorios automáticos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|----------------|------------|
| id | UUID | PK, Auto | Identificador único |
| cita_id | UUID | FK(citas) | Cita a recordar |
| tipo | ENUM | NOT NULL | cita_24h, cita_1h, vacuna_proxima |
| dueño_id | UUID | FK(usuarios), NOT NULL | Destinatario |
| email_enviado | BOOLEAN | DEFAULT false | Si email fue enviado |
| fecha_envío | TIMESTAMP | - | Cuándo se envió |
| estado | ENUM | NOT NULL | pendiente, enviado, fallido |
| motivo_fallo | TEXT | - | Si falló, por qué |
| fecha_programada | TIMESTAMP | NOT NULL | Cuándo debe enviarse |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de registro |

**Índices**:
- INDEX(cita_id)
- INDEX(dueño_id)
- INDEX(estado)
- INDEX(fecha_programada)

## 2. RELACIONES

\`\`\`
USUARIOS (1) ←→ (N) MASCOTAS
USUARIOS (1) ←→ (N) CITAS (como veterinario)
USUARIOS (1) ←→ (N) CITAS (como dueño)
MASCOTAS (1) ←→ (N) CITAS
MASCOTAS (1) ←→ (N) HISTORIAL_MEDICO
MASCOTAS (1) ←→ (N) CERTIFICADOS
MASCOTAS (1) ←→ (N) VACUNAS
CITAS (1) ←→ (1) HISTORIAL_MEDICO
USUARIOS (1) ←→ (N) CERTIFICADOS (como emisor)
USUARIOS (1) ←→ (N) VACUNAS (como aplicador)
USUARIOS (1) ←→ (N) DISPONIBILIDAD_VETERINARIOS
USUARIOS (1) ←→ (N) AUDIT_LOG (como ejecutor)
USUARIOS (1) ←→ (N) RECORDATORIOS (como destinatario)
\`\`\`

## 3. RESTRICCIONES DE INTEGRIDAD

- Foreign Keys con ON DELETE RESTRICT (salvo soft deletes)
- Unique constraints donde sea aplicable
- Check constraints para valores enum
- Check constraints para rangos de valores numéricos

## 4. CONSIDERACIONES DE ESCALABILIDAD

- Particionamiento posible de AUDIT_LOG por rango de fecha
- Índices en campos frecuentemente consultados
- Campos timestamp para paginación eficiente
- Soft deletes para mantener integridad referencial
\`\`\`

</markdown>
