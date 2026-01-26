# Esquema de Base de Datos - HuellasResponsables

## Estructura de Datos

### 1. Usuario (usuarios)
```javascript
{
  id: Integer (Primary Key),
  nombre: String,
  email: String (Unique),
  password: String (Hash),
  rol: String ['admin', 'gestor', 'voluntario', 'adoptante'],
  fechaRegistro: DateTime,
  activo: Boolean
}
```

### 2. Mascota (mascotas)
```javascript
{
  id: Integer (Primary Key),
  nombre: String,
  especie: String ['Perro', 'Gato', 'Otro'],
  raza: String,
  edad: Float,
  sexo: String ['Macho', 'Hembra'],
  color: String,
  senasParticulares: Text,
  fotoUrl: String,
  estado: String ['Disponible', 'En proceso', 'Adoptado', 'Recuperado'],
  adoptanteId: Integer (Foreign Key -> adoptantes.id),
  fechaRegistro: DateTime,
  fechaAdopcion: DateTime
}
```

### 3. Adoptante (adoptantes)
```javascript
{
  id: Integer (Primary Key),
  nombre: String,
  documento: String (Unique),
  telefono: String,
  email: String,
  direccion: String,
  referencias: Text,
  categoria: String ['Responsable', 'En observación', 'No apto'],
  historialAdopciones: Array[Integer],
  puntajeConfianza: Integer (0-100),
  fechaRegistro: DateTime,
  activo: Boolean
}
```

### 4. Seguimiento (seguimientos)
```javascript
{
  id: Integer (Primary Key),
  mascotaId: Integer (Foreign Key -> mascotas.id),
  adoptanteId: Integer (Foreign Key -> adoptantes.id),
  fechaInicio: DateTime,
  fechaCierre: DateTime,
  cronograma: Array[{
    fecha: DateTime,
    descripcion: String,
    completado: Boolean,
    evidencias: Array[String]
  }],
  estado: String ['Activo', 'Cerrado', 'Suspendido'],
  evaluacion: String ['Pendiente', 'Exitosa', 'Riesgo', 'Recuperado']
}
```

### 5. Reporte (reportes)
```javascript
{
  id: Integer (Primary Key),
  seguimientoId: Integer (Foreign Key -> seguimientos.id),
  adoptanteId: Integer (Foreign Key -> adoptantes.id),
  fechaEnvio: DateTime,
  tipo: String ['Semanal', 'Mensual', 'Trimestral', 'Semestral'],
  evidenciasFotos: Array[String],
  evidenciasVideos: Array[String],
  formularioRespuestas: Object {
    alimentacion: String,
    vacunas: Boolean,
    comportamiento: String,
    ejercicio: String,
    salud: String
  },
  estado: String ['Pendiente', 'Evaluado', 'Resuelto'],
  calificacion: String ['Excelente', 'Bueno', 'Regular', 'Deficiente'],
  observaciones: Text,
  riesgo: Boolean,
  fechaEvaluacion: DateTime,
  evaluadorId: Integer (Foreign Key -> usuarios.id)
}
```

### 6. Intervención (intervenciones)
```javascript
{
  id: Integer (Primary Key),
  seguimientoId: Integer (Foreign Key -> seguimientos.id),
  tipo: String ['Visita Domiciliaria', 'Llamada de Atención', 'Asesoría de Comportamiento', 'Rescate'],
  motivo: Text,
  fechaRegistro: DateTime,
  fechaEjecucion: DateTime,
  responsableId: Integer (Foreign Key -> usuarios.id),
  observaciones: Text,
  resultado: Text,
  estado: String ['En proceso', 'Completada', 'Cancelada'],
  accionesTomadas: Array[String]
}
```

## Relaciones

### Relaciones Principales
- **Mascota** → **Adoptante**: Una mascota puede tener un adoptante (1:1 actual)
- **Seguimiento** → **Mascota**: Un seguimiento pertenece a una mascota (N:1)
- **Seguimiento** → **Adoptante**: Un seguimiento pertenece a un adoptante (N:1)
- **Reporte** → **Seguimiento**: Un reporte pertenece a un seguimiento (N:1)
- **Intervención** → **Seguimiento**: Una intervención pertenece a un seguimiento (N:1)
- **Usuario** → **Reporte**: Un usuario evalúa reportes (1:N)
- **Usuario** → **Intervención**: Un usuario gestiona intervenciones (1:N)

### Diagrama de Relaciones
```
Usuario (admin/gestor)
    |
    ├── evalúa → Reporte
    └── gestiona → Intervención
    
Mascota ←→ Adoptante
    ↓           ↓
    Seguimiento
         ↓
    ┌────┴────┐
Reporte   Intervención
```

## Índices Recomendados

### Para Optimización de Consultas
- `mascotas.estado` - Búsqueda de mascotas disponibles
- `mascotas.adoptanteId` - Relación mascota-adoptante
- `adoptantes.categoria` - Filtrado por categoría
- `adoptantes.documento` - Búsqueda única
- `seguimientos.estado` - Seguimientos activos
- `seguimientos.mascotaId` - Seguimientos por mascota
- `seguimientos.adoptanteId` - Seguimientos por adoptante
- `reportes.estado` - Reportes pendientes
- `reportes.riesgo` - Alertas de riesgo
- `reportes.seguimientoId` - Reportes por seguimiento
- `intervenciones.estado` - Intervenciones activas
- `intervenciones.seguimientoId` - Intervenciones por seguimiento

## Validaciones de Negocio

### Mascotas
- Una mascota solo puede estar adoptada por un adoptante a la vez
- El estado debe cambiar a "Adoptado" cuando se crea un seguimiento
- Solo mascotas con estado "Disponible" pueden ser adoptadas

### Adoptantes
- El documento debe ser único en el sistema
- La categoría se actualiza automáticamente según el cumplimiento
- No pueden adoptar si están en categoría "No apto"

### Seguimientos
- Solo puede haber un seguimiento activo por mascota
- El cronograma se genera automáticamente al crear
- Fechas del cronograma: 7 días, 30 días, 90 días, 180 días

### Reportes
- Deben enviarse en las fechas del cronograma (±3 días de tolerancia)
- Un reporte marcado con riesgo debe generar una alerta
- Solo pueden ser evaluados por personal del centro

### Intervenciones
- Solo se crean cuando hay reportes con riesgo o mora
- Deben estar asociadas a un seguimiento activo
- El tipo "Rescate" debe cerrar el seguimiento

## Migración a Base de Datos Persistente

### PostgreSQL (Recomendado)
```sql
-- Ejemplo de tabla mascotas
CREATE TABLE mascotas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raza VARCHAR(100),
  edad DECIMAL(3,1),
  sexo VARCHAR(10),
  color VARCHAR(50),
  senas_particulares TEXT,
  foto_url VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'Disponible',
  adoptante_id INTEGER REFERENCES adoptantes(id),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_adopcion TIMESTAMP
);

CREATE INDEX idx_mascotas_estado ON mascotas(estado);
CREATE INDEX idx_mascotas_adoptante ON mascotas(adoptante_id);
```

### MongoDB (Alternativa)
```javascript
// Esquema con Mongoose
const mascotaSchema = new Schema({
  nombre: { type: String, required: true },
  especie: { type: String, enum: ['Perro', 'Gato', 'Otro'], required: true },
  raza: String,
  edad: Number,
  sexo: { type: String, enum: ['Macho', 'Hembra'] },
  color: String,
  senasParticulares: String,
  fotoUrl: String,
  estado: { type: String, default: 'Disponible', enum: ['Disponible', 'En proceso', 'Adoptado', 'Recuperado'] },
  adoptanteId: { type: Schema.Types.ObjectId, ref: 'Adoptante' },
  fechaRegistro: { type: Date, default: Date.now },
  fechaAdopcion: Date
});

mascotaSchema.index({ estado: 1 });
mascotaSchema.index({ adoptanteId: 1 });
```

## Consideraciones de Escalabilidad

### Volumen Estimado (Centro Pequeño)
- **Mascotas**: ~100-500 registros/año
- **Adoptantes**: ~50-300 registros/año
- **Seguimientos**: ~50-300 activos simultáneos
- **Reportes**: ~200-1200/año (4 por seguimiento)
- **Intervenciones**: ~20-100/año

### Volumen Estimado (Centro Grande)
- **Mascotas**: ~1000-5000 registros/año
- **Adoptantes**: ~500-3000 registros/año
- **Seguimientos**: ~500-3000 activos simultáneos
- **Reportes**: ~2000-12000/año
- **Intervenciones**: ~200-1000/año

### Recomendaciones
- Implementar paginación en todas las listas (30-50 items por página)
- Archivado automático de seguimientos cerrados mayores a 1 año
- Compresión de imágenes al 70% de calidad
- Límite de 5MB por foto, 20MB por video
- Backup diario automático
- Logs de auditoría para acciones críticas
