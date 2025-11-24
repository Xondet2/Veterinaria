# CONTEXTO DEL SISTEMA - GESTIÓN VETERINARIA

## 1. PROPÓSITO GENERAL

El **Sistema de Gestión Veterinaria (SGV)** es una aplicación web integral diseñada para automatizar y optimizar los procesos administrativos, médicos y operacionales de clínicas veterinarias de cualquier tamaño.

### Objetivos Principales

1. **Centralizar información** de mascotas, dueños y personal veterinario
2. **Automatizar agendamiento** de citas con disponibilidad en tiempo real
3. **Mantener histórico médico** completo y auditable de cada mascota
4. **Facilitar cumplimiento** de requisitos sanitarios y de vacunación
5. **Mejorar eficiencia operacional** reduciendo tiempos administrativos
6. **Garantizar seguridad** de datos con controles de acceso
7. **Generar reportes** para análisis y toma de decisiones

## 2. USUARIOS DEL SISTEMA

### 2.1 Administrador
- **Rol**: Gestor del sistema
- **Responsabilidades**:
  - Gestión de usuarios (veterinarios y dueños)
  - Asignación de roles y estados
  - Acceso a reportes y estadísticas globales
  - Configuración del sistema
  - Auditoría de operaciones
- **Permisos**: Acceso total a todas las funcionalidades

### 2.2 Veterinario
- **Rol**: Profesional de salud animal
- **Responsabilidades**:
  - Atender citas agendadas
  - Registrar diagnósticos y tratamientos
  - Elaborar historiales médicos
  - Generar certificados sanitarios
  - Prescribir medicinas y vacunas
  - Consultar disponibilidad de citas
- **Permisos**: Acceso a historiales, citas asignadas, certificados, reportes del veterinario

<!-- Rol de recepcionista eliminado en esta versión. Las funciones administrativas recaen en Admin. -->

### 2.4 Dueño de Mascota
- **Rol**: Cliente final
- **Responsabilidades**:
  - Gestionar información de sus mascotas
  - Agendar citas
  - Consultar historial médico de sus mascotas
  - Descargar certificados sanitarios
  - Pagar servicios
- **Permisos**: Acceso solo a sus mascotas, citas personales, certificados propios

## 3. PROCESOS CLAVE DEL NEGOCIO

### 3.1 Proceso de Registro y Onboarding

\`\`\`
1. Admin crea cuenta y asigna rol → 2. Dueño recibe acceso →
3. Acceso a dashboard → 4. Registro de mascota por admin/veterinario
\`\`\`

### 3.2 Proceso de Agendamiento de Cita

\`\`\`
1. Dueño solicita cita (app) →
2. Sistema valida disponibilidad veterinario →
3. Sistema verifica disponibilidad mascota →
4. Confirmación por admin/veterinario →
5. Recordatorio 24h antes →
6. Recordatorio 1h antes →
7. Ejecución de cita
\`\`\`

### 3.3 Proceso de Atención Médica

\`\`\`
1. Veterinario revisa cita →
2. Ingresa signos vitales →
3. Registra diagnóstico →
4. Prescribe tratamiento/medicinas →
5. Registra vacunas (si aplica) →
6. Elabora certificado (si aplica) →
7. Confirma cita completada
\`\`\`

### 3.4 Proceso de Generación de Certificados

\`\`\`
1. Veterinario evalúa criterios para certificado →
2. Sistema genera documento con QR único →
3. Certificado se asigna a mascota →
4. Dueño descarga PDF desde app →
5. Certificado se valida mediante QR (online check)
\`\`\`

## 4. FLUJO DE INFORMACIÓN

### 4.1 Datos de Entrada

- **Creación de usuario (admin)**: Nombre, email, teléfono, contraseña, rol
- **Registro de mascota (admin/veterinario)**: Nombre, especie, raza, edad, peso, sexo, microchip
- **Solicitud de cita**: Fecha, hora, motivo, veterinario preferido
- **Historial médico**: Signos vitales, diagnóstico, tratamiento, medicinas
- **Certificados**: Tipo, contenido, fecha de vencimiento

### 4.2 Datos de Salida

- **Confirmaciones de cita**: Email, SMS
- **Reminders**: Notificaciones de citas próximas
- **Certificados**: PDF con QR verificable
- **Reportes**: Estadísticas, ocupación, ingresos
- **Históricos**: Auditoría de cambios

## 5. RESTRICCIONES Y SUPUESTOS

### Restricciones
- Máximo 5 citas simultáneas por veterinario
- Duración mínima de cita: 15 minutos
- Duración máxima de cita: 2 horas
- Mascotas no pueden tener más de 2 citas el mismo día
- Certificados válidos por máximo 2 años

### Supuestos
- Los veterinarios tienen horario de 8:00 AM a 6:00 PM
- Lunch break: 12:00 PM a 1:00 PM
- Fin de semana: cerrado
- Todos los usuarios tienen acceso a internet
- Email es el medio de comunicación principal

## 6. MÉTRICAS DE ÉXITO

1. **Eficiencia**: Reducción del 40% en tiempo de agendamiento
2. **Satisfacción**: Puntuación NPS > 60
3. **Adopción**: 80% de dueños registrados en primer mes
4. **Precisión**: 99.5% de datos médicos correctos
5. **Disponibilidad**: 99.9% uptime del sistema
6. **Seguridad**: 0 brechas de datos en el año

## 7. BENEFICIOS ESPERADOS

### Para la Clínica
- Automatización de procesos administrativos
- Reducción de costos operacionales
- Mejor seguimiento de mascotas
- Cumplimiento de normativas sanitarias
- Generación de reportes automáticos
- Mejora en relación con clientes

### Para los Veterinarios
- Acceso rápido al historial médico
- Automatización de tareas rutinarias
- Mejor organización de agenda
- Menos errores administrativos
- Mejor documentación legal

### Para los Dueños
- Acceso 24/7 a información de mascotas
- Agendamiento online simplificado
- Certificados digitales inmediatos
- Recordatorios automáticos de vacunas
- Mejor comunicación con clínica

## 8. PERÍODOS DE VALIDEZ Y CICLOS

- **Tokens JWT**: 24 horas
- **Certificados de salud**: 1 año
- **Certificados de vacunación**: Según esquema (anual típicamente)
- **Desparasitación**: 6 meses
- **Recordatorios de vacuna**: Según fecha de próxima dosis
- **Logs de auditoría**: Retención indefinida
\`\`\`

</markdown>
