# FUNCIONALIDADES DEL SISTEMA - GESTIÓN VETERINARIA

## 1. MÓDULO DE AUTENTICACIÓN Y GESTIÓN DE USUARIOS

### 1.1 Registro de Usuario
**Descripción**: Permitir que nuevos usuarios se registren en el sistema

**Flujo**:
1. Usuario ingresa email, nombre, apellido, contraseña, teléfono
2. Sistema valida formato de datos
3. Sistema verifica que email no exista
4. Sistema hashea contraseña con bcryptjs
5. Sistema crea usuario con rol "dueño" por defecto
6. Sistema envía email de confirmación
7. Usuario confirma email mediante link

**Validaciones**:
- Email: máximo 255 caracteres, formato válido, único
- Nombre/Apellido: 2-100 caracteres, solo letras y espacios
- Contraseña: mínimo 8 caracteres, máyuscula, minúscula, número, sin espacios
- Teléfono: 7-20 dígitos, opcional

**Actores**: Usuario anónimo
**Resultado**: Nuevo usuario registrado con estado "activo"

---

### 1.2 Login
**Descripción**: Autenticar usuario en el sistema

**Flujo**:
1. Usuario ingresa email y contraseña
2. Sistema valida formato
3. Sistema busca usuario por email
4. Sistema compara contraseña con hash
5. Si válido, genera JWT de 24 horas
6. JWT se almacena en cookie segura y httpOnly
7. Sistema registra login en audit log

**Validaciones**:
- Email debe existir
- Contraseña debe coincidir
- Usuario debe estar "activo"

**Actores**: Usuario anónimo
**Resultado**: Sesión activa con JWT válido

---

### 1.3 Logout
**Descripción**: Cerrar sesión del usuario

**Flujo**:
1. Usuario hace click en "Cerrar sesión"
2. Sistema invalida JWT
3. Cookie se elimina
4. Usuario redirigido a página de login
5. Logout se registra en audit log

**Actores**: Usuario autenticado
**Resultado**: Sesión cerrada

---

### 1.4 Gestión de Perfil de Usuario
**Descripción**: Permitir que usuarios editen su perfil

**Funcionalidades**:
- Cambiar nombre/apellido
- Cambiar teléfono
- Cambiar contraseña
- Cambiar foto de perfil
- Ver historial de logins

**Validaciones**: Mismas del registro

**Actores**: Usuario autenticado
**Resultado**: Perfil actualizado

---

### 1.5 Recuperación de Contraseña
**Descripción**: Permitir reset de contraseña olvidada

**Flujo**:
1. Usuario ingresa email en página "¿Olvidaste contraseña?"
2. Sistema verifica que email exista
3. Sistema genera token temporal (30 minutos)
4. Sistema envía email con link de reset
5. Usuario abre link y ingresa nueva contraseña
6. Sistema valida token y actualiza contraseña
7. Usuario puede loguearse con nueva contraseña

---

## 2. MÓDULO DE GESTIÓN DE MASCOTAS

### 2.1 Crear Mascota
**Descripción**: Registrar una nueva mascota en el sistema

**Flujo**:
1. Dueño o recepcionista accede a "Agregar Mascota"
2. Ingresa: nombre, especie, raza, sexo, edad, peso, microchip, foto
3. Sistema valida datos
4. Sistema crea registro de mascota
5. Mascota queda asignada al dueño
6. Se registra en audit log

**Validaciones**:
- Nombre: 2-100 caracteres
- Raza: 2-100 caracteres
- Peso: 0.1-150 kg
- Edad: 0-50 años
- Microchip: 15 caracteres hexadecimales (opcional, único)
- Especie: uno de los valores enum

**Actores**: Admin, veterinario
**Resultado**: Nueva mascota registrada

Nota: se debe asignar el dueño (`dueñoId`) al crear la mascota para que aparezca en la sesión del dueño correspondiente.

---

### 2.2 Editar Mascota
**Descripción**: Actualizar información de mascota existente

**Funcionalidades**:
- Cambiar nombre, raza, peso, edad
- Cambiar foto
- Cambiar estado (activo, fallecido, desconocido)
- Agregar/editar notas
- Cambiar microchip

**Validaciones**: Mismas del crear
**Actores**: Veterinario, admin
**Resultado**: Mascota actualizada

---

### 2.3 Listar Mascotas
**Descripción**: Ver todas las mascotas registradas

**Filtros**:
- Por dueño (admin/recepcionista)
- Por especie
- Por estado
- Por nombre (búsqueda)

**Paginación**: 10 mascotas por página
**Ordenamiento**: Por nombre, por fecha creación, por especie

**Actores**: Dueño (solo sus mascotas), veterinario, admin
**Resultado**: Lista filtrada y paginada

---

### 2.4 Ver Detalle de Mascota
**Descripción**: Ver información completa de una mascota

**Información mostrada**:
- Datos básicos
- Foto
- Historial de citas
- Historial médico
- Certificados activos
- Esquema de vacunación
- Notas

**Actores**: Dueño (su mascota), veterinario (mascotas en sus citas), admin
**Resultado**: Detalle completo

---

### 2.5 Eliminar Mascota
**Descripción**: Marcar mascota como eliminada (soft delete)

**Flujo**:
1. Admin solicita eliminar mascota
2. Sistema verifica que no haya citas futuras
3. Si hay citas futuras, solicita confirmación
4. Sistema marca mascota como eliminado_logicamente = true
5. Mascota no aparece en listados normales
6. Se puede restaurar solo por admin

**Actores**: Admin
**Resultado**: Mascota eliminada lógicamente

---

### 2.6 Importar/Exportar Mascotas
**Descripción**: Bulk operations para mascotas

**Importar**:
- Formato: CSV con columnas estandarizadas
- Sistema valida cada fila
- Crea mascotas en lote
- Genera reporte de éxitos/errores

**Exportar**:
- Formato: CSV
- Filtros aplicables
- Incluye datos médicos básicos

**Actores**: Admin
**Resultado**: Mascotas importadas o exportadas

---

## 3. MÓDULO DE CITAS

### 3.1 Agendar Cita
**Descripción**: Crear nueva cita médica

**Flujo**:
1. Dueño accede a "Agendar Cita"
2. Selecciona mascota, veterinario, fecha, hora, duración
3. Ingresa motivo de consulta
4. Sistema valida disponibilidad:
   - Veterinario no tenga otra cita en ese horario
   - Mascota no tenga 2+ citas ese día
   - Horario esté dentro de disponibilidad veterinario
5. Sistema crea cita con estado "agendada"
6. Sistema envía confirmación por email
7. Sistema programa recordatorios (24h, 1h antes)

**Validaciones**:
- Motivo: 10-500 caracteres
- Duración: 15-120 minutos
- Fecha: debe ser futura
- Hora: dentro de disponibilidad veterinario

**Actores**: Dueño
**Resultado**: Cita creada en estado "agendada"

Nota: si la cita la crea un admin o veterinario, el sistema asigna automáticamente el dueño a partir de la mascota seleccionada cuando no se proporciona `dueñoId`.

---

### 3.2 Consultar Disponibilidad
**Descripción**: Ver slots disponibles para agendar

**Funcionalidades**:
- Mostrar próximos 30 días
- Filtrar por veterinario
- Mostrar duración disponible
- Mostrar horario laboral

**Lógica**:
1. Sistema obtiene horarios de veterinario
2. Sistema obtiene citas existentes
3. Sistema calcula slots libres
4. Slots con menos de 15 minutos se ocultan

**Actores**: Dueño, sistema
**Resultado**: Disponibilidad en tiempo real

---

### 3.3 Confirmar Cita
**Descripción**: Cambiar estado de cita a "confirmada"

**Flujo**:
1. Admin o veterinario confirma cita
2. Sistema verifica que cita esté en estado "agendada"
3. Sistema cambia a "confirmada"
4. Sistema envía email de confirmación
5. Sistema reprograma recordatorios

**Actores**: Admin, veterinario
**Resultado**: Cita confirmada

---

### 3.4 Editar Cita
**Descripción**: Modificar datos de cita no iniciada

**Cambios permitidos**:
- Fecha/hora (si disponibilidad lo permite)
- Duración
- Motivo
- Veterinario (si disponibilidad lo permite)
- Consultorio

**Restricciones**:
- No se puede editar cita ya completada
- No se puede editar cita en ejecución

**Validaciones**: Mismas del agendar

**Actores**: Admin, veterinario
**Resultado**: Cita actualizada

---

### 3.5 Cancelar Cita
**Descripción**: Marcar cita como cancelada

**Flujo**:
1. Dueño o admin/veterinario solicita cancelación
2. Sistema pide motivo de cancelación
3. Sistema cambia estado a "cancelada"
4. Sistema envía email de cancelación
5. Sistema libera slot (disponibilidad se recalcula)
6. Se registra en audit log

**Actores**: Dueño (sus citas), admin, veterinario
**Resultado**: Cita cancelada

---

### 3.6 Listar Citas
**Descripción**: Ver citas del sistema

**Vistas por rol**:
- **Dueño**: Solo sus citas personales
- **Veterinario**: Sus citas asignadas
- **Admin**: Todas las citas

**Filtros**:
- Por estado (agendada, confirmada, completada, cancelada)
- Por fecha (hoy, próximos 7 días, próximos 30 días, rango custom)
- Por veterinario
- Por dueño
- Por mascota
- Por tipo de consulta

**Ordenamiento**: Por fecha, por veterinario, por estado

**Paginación**: 15 citas por página

**Actores**: Todos
**Resultado**: Lista filtrada

---

## 4. MÓDULO DE HISTORIAL MÉDICO

### 4.1 Crear Registro de Historial
**Descripción**: Veterinario registra consulta

**Flujo**:
1. Veterinario completa cita
2. Ingresa signos vitales: temperatura, frecuencia cardíaca, frecuencia respiratoria, peso
3. Ingresa diagnóstico
4. Ingresa tratamiento prescrito
5. Ingresa medicinas (si aplica)
6. Sistema valida datos
7. Sistema crea registro asociado a cita
8. Se registra en audit log

**Validaciones**:
- Temperatura: 36-40°C
- Frecuencia cardíaca: 40-150 bpm
- Frecuencia respiratoria: 10-40 rpm
- Peso: 0.1-150 kg
- Diagnóstico: 20-1000 caracteres
- Tratamiento: 20-1000 caracteres

**Actores**: Veterinario
**Resultado**: Historial registrado

---

### 4.2 Ver Historial Médico
**Descripción**: Consultar histórico de una mascota

**Información**:
- Lista de todas las consultas
- Signos vitales registrados
- Diagnósticos
- Tratamientos
- Medicinas prescritas
- Fecha de cada registro
- Veterinario que atiendió

**Filtros**:
- Por fecha (últimas 3 meses, 6 meses, 1 año, todo)
- Por tipo de diagnóstico
- Por veterinario

**Paginación**: 10 registros por página

**Actores**: Dueño (su mascota), veterinario, admin
**Resultado**: Historial completo

---

### 4.3 Editar Registro de Historial
**Descripción**: Corregir datos de un registro

**Restricciones**:
- Solo veterinario que creó puede editar
- Solo dentro de 24 horas de creación
- Se registra quién editó en audit log

**Campos editables**:
- Signos vitales
- Diagnóstico
- Tratamiento
- Observaciones

**Actores**: Veterinario que lo creó
**Resultado**: Registro actualizado

---

### 4.4 Exportar Historial
**Descripción**: Descargar historial en PDF

**Contenido**:
- Datos de mascota
- Lista de consultas
- Signos vitales
- Diagnósticos
- Tratamientos
- Vacunas aplicadas
- Certificados

**Formato**: PDF profesional
**Actores**: Dueño (su mascota), veterinario, admin
**Resultado**: PDF descargado

---

## 5. MÓDULO DE CERTIFICADOS SANITARIOS

### 5.1 Generar Certificado
**Descripción**: Crear certificado sanitario

**Flujo**:
1. Veterinario selecciona tipo de certificado
2. Sistema verifica requisitos según tipo:
   - **Salud**: Cita médica completada en últimos 30 días
   - **Vacunación**: Vacuna aplicada en el sistema
   - **Desparasitación**: Registro en historial
   - **Viaje**: Requisitos según destino
3. Veterinario ingresa detalles
4. Sistema genera:
   - Número único de certificado
   - Código QR para verificación
   - PDF con logo y firma digital
5. Certificado se asigna a mascota
6. Se registra en audit log

**Validaciones**:
- Contenido: máximo 2000 caracteres
- Vencimiento: debe ser futuro
- Tipo: debe ser válido

**Actores**: Veterinario
**Resultado**: Certificado generado y firmado

---

### 5.2 Ver Certificados
**Descripción**: Listar certificados de una mascota

**Información**:
- Tipo de certificado
- Número único
- Fecha de emisión
- Fecha de vencimiento
- Estado (vigente, vencido, revocado)
- Veterinario emisor

**Filtros**:
- Por tipo
- Por estado
- Por fecha

**Paginación**: 10 certificados por página

**Actores**: Dueño (su mascota), veterinario, admin
**Resultado**: Lista de certificados

---

### 5.3 Descargar Certificado
**Descripción**: Obtener PDF de certificado

**Flujo**:
1. Dueño o veterinario abre certificado
2. Hace click en "Descargar PDF"
3. Sistema genera/recupera PDF
4. PDF se descarga
5. Sistema registra descarga (fecha y quién)

**Validación**:
- Solo dueño o profesional pueden descargar

**Actores**: Dueño, veterinario, admin
**Resultado**: PDF descargado

---

### 5.4 Verificar Certificado Online
**Descripción**: Validar certificado mediante QR

**Flujo**:
1. Usuario escanea QR del certificado
2. Abre página de verificación
3. Sistema consulta código QR
4. Muestra información del certificado:
   - Mascota
   - Tipo
   - Fecha emisión/vencimiento
   - Veterinario
   - "VIGENTE" o "VENCIDO" en rojo
5. Se registra verificación en audit log

**Actores**: Público anónimo (sin login)
**Resultado**: Certificado verificado

---

### 5.5 Revocar Certificado
**Descripción**: Invalidar un certificado

**Flujo**:
1. Admin o veterinario solicita revocación
2. Ingresa motivo
3. Sistema cambia estado a "revocado"
4. Certificado no aparece como vigente en verificaciones
5. Se registra revocación en audit log

**Actores**: Admin, veterinario (el que lo emitió)
**Resultado**: Certificado revocado

---

## 6. MÓDULO DE VACUNACIÓN

### 6.1 Registrar Vacuna
**Descripción**: Registrar aplicación de vacuna

**Flujo**:
1. Veterinario completa cita
2. Ingresa: nombre vacuna, fecha, próxima dosis, lote, sitio
3. Selecciona mascota
4. Sistema valida datos
5. Sistema crea registro de vacuna
6. Sistema calcula próxima fecha
7. Se programa recordatorio

**Actores**: Veterinario
**Resultado**: Vacuna registrada

---

### 6.2 Ver Esquema de Vacunación
**Descripción**: Consultar esquema de vacunas de mascota

**Información**:
- Todas las vacunas aplicadas
- Fechas de aplicación
- Próximas dosis programadas
- Veterinario que aplicó
- Certificados asociados

**Indicadores**:
- Verde: Vacunas al día
- Amarillo: Próximas a vencer (7-30 días)
- Rojo: Vencidas

**Actores**: Dueño, veterinario, admin
**Resultado**: Esquema completo

---

### 6.3 Alertas de Vacunación
**Descripción**: Recordatorios automáticos

**Tipos**:
- 7 días antes de vencimiento
- 1 día antes de vencimiento
- Día del vencimiento

**Envío**: Por email

**Actores**: Sistema (cron job)
**Resultado**: Recordatorios enviados

---

## 7. MÓDULO ADMINISTRATIVO

### 7.1 Dashboard
**Descripción**: Vista general de estadísticas

**Información**:
- Total de mascotas activas
- Total de citas hoy/semana/mes
- Citas completadas/canceladas
- Ingresos generados
- Usuarios activos
- Certificados emitidos
- Vacunas aplicadas

**Gráficos**:
- Citas por veterinario
- Especies más comunes
- Ingresos mensual
- Ocupación por hora

**Actores**: Admin
**Resultado**: Dashboard interactivo

---

### 7.2 Gestión de Usuarios
**Descripción**: Administrar usuarios del sistema

**Funcionalidades**:
- Crear usuario
- Editar usuario
- Cambiar rol
- Suspender/activar
- Ver logs de acceso
- Reset de contraseña

**Filtros**:
- Por rol
- Por estado
- Por fecha creación

**Actores**: Admin
**Resultado**: Usuarios gestionados

---

### 7.3 Reportes
**Descripción**: Generar reportes

**Tipos**:
- Reportes de citas
- Reportes de ingresos
- Reportes de ocupación
- Reportes de vacunación
- Reportes de auditoría

**Formato**: PDF, CSV, Excel

**Actores**: Admin
**Resultado**: Reportes descargables

---

## 8. MÓDULO DE RECORDATORIOS

### 8.1 Recordatorios de Citas
**Descripción**: Notificaciones automáticas

**Tipos**:
- 24 horas antes de cita
- 1 hora antes de cita

**Envío**: Email a dueño
**Contenido**: Fecha, hora, veterinario, mascota

**Actores**: Sistema (cron job)
**Resultado**: Recordatorios enviados

---

## 9. MÓDULO DE AUDITORÍA

### 9.1 Log de Auditoría
**Descripción**: Registro inmutable de operaciones

**Registra**:
- Quién: Usuario que ejecutó
- Qué: Tipo de acción (CREATE, UPDATE, DELETE, LOGIN)
- Dónde: Tabla afectada
- Cuándo: Timestamp
- De dónde: IP, user agent
- Cambios: Datos anteriores vs nuevos

**No editable**: Log es inmutable

**Actores**: Admin (consulta), Sistema (registro automático)
**Resultado**: Auditoría completa

\`\`\`

</markdown>
