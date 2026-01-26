# 🐾 HuellasResponsables

Sistema de Gestión Integral y Monitoreo del Bienestar Animal Post-Adopción

## 📋 Descripción

HuellasResponsables es una plataforma web diseñada para la gestión integral y el monitoreo del bienestar animal en un centro de adopción específico. A diferencia de los catálogos tradicionales, el sistema se enfoca en el ciclo de vida post-adopción, asegurando que el compromiso del adoptante no termine al salir del refugio.

## 🎯 Objetivo Principal

Garantizar la tenencia responsable de mascotas mediante un mecanismo de seguimiento digital que permita al personal del centro evaluar la adaptación y salud del animal en su nuevo hogar, interviniendo de manera oportuna en casos de riesgo.

## ✨ Funcionalidades Principales

### 1. Control de Seguimiento Digital
- Sustituye las llamadas informales por un cronograma de reportes estructurado
- El adoptante debe subir periódicamente evidencias (fotos/videos) y responder formularios
- Sistema de notificaciones automáticas para fechas de seguimiento

### 2. Gestión de "Hoja de Vida" del Adoptante
- Registro histórico completo de cada adoptante
- Sistema de clasificación basado en cumplimiento (Responsable/En Observación/No Apto)
- Validación de referencias personales

### 3. Detección de Alertas y Riesgos
- El personal del centro califica cada reporte enviado
- Identificación automática de signos de maltrato, desnutrición o falta de adaptación
- Generación de Alertas de Riesgo

### 4. Protocolo de Intervención
- Registro y documentación de acciones correctivas
- Seguimiento de visitas domiciliarias
- Proceso de rescate y retorno cuando sea necesario

### 5. Analítica del Refugio
- Estadísticas en tiempo real del centro
- Índice de adopciones exitosas
- Control de adoptantes en mora con reportes

## 🛠️ Módulos del Sistema

### Módulo 1: Seguimiento Post-Adopción
- ✅ Gestión de cronogramas automáticos (7 días, 1 mes, 3 meses, 6 meses)
- ✅ Interfaz para carga de evidencias
- ✅ Formularios de estado
- ✅ Sistema de notificaciones

### Módulo 2: Gestión de Adoptantes
- ✅ Perfiles completos de adoptantes
- ✅ Historial de responsabilidad
- ✅ Sistema de categorización
- ✅ Validación de referencias

### Módulo 3: Control de Bienestar e Intervenciones
- ✅ Panel de evaluación de reportes
- ✅ Sistema de detección de riesgo
- ✅ Registro de intervenciones
- ✅ Cierre de casos exitosos

### Módulo 4: Gestión de Mascotas y Reportes
- ✅ Inventario local de mascotas
- ✅ Generación de reportes y estadísticas
- ✅ Dashboard de alertas
- ✅ Control de usuarios

## 👥 Roles de Usuario

### Personal del Centro (Admin/Gestor)
- Registra mascotas
- Programa seguimientos
- Evalúa reportes
- Gestiona intervenciones
- Acceso completo al sistema

### Adoptante (Prototipo)
- Acceso a perfil personal
- Envío de evidencias
- Consulta de consejos de cuidado
- Historial de adopciones

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Nadabxd/huellitas-responsables.git
cd huellitas-responsables
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

4. Abrir el navegador en:
```
http://localhost:3000
```

### Credenciales de Prueba

**Usuario Administrador:**
- Email: `admin@huellitas.com`
- Password: `admin123`

## 📱 Uso del Sistema

### 1. Iniciar Sesión
- Acceder a la página principal
- Ingresar credenciales
- El sistema mostrará el Dashboard principal

### 2. Registrar una Mascota
- Ir a "Mascotas"
- Clic en "+ Nueva Mascota"
- Completar formulario (nombre, especie, raza, edad, etc.)
- Guardar

### 3. Registrar un Adoptante
- Ir a "Adoptantes"
- Clic en "+ Nuevo Adoptante"
- Completar datos personales y referencias
- Guardar

### 4. Iniciar Seguimiento Post-Adopción
- Ir a "Seguimientos"
- Clic en "+ Nuevo Seguimiento"
- Seleccionar mascota (disponible)
- Seleccionar adoptante
- El sistema genera automáticamente el cronograma de seguimiento

### 5. Evaluar Reportes
- Ir a "Reportes"
- Revisar reportes pendientes
- Clic en "Evaluar"
- Asignar calificación
- Marcar como "Alerta de Riesgo" si es necesario
- Guardar evaluación

### 6. Registrar Intervenciones
- Ir a "Intervenciones"
- Clic en "+ Nueva Intervención"
- Seleccionar seguimiento
- Elegir tipo de intervención
- Describir motivo y observaciones
- Registrar

## 📊 API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión

### Mascotas
- `GET /api/mascotas` - Listar todas las mascotas
- `GET /api/mascotas/:id` - Obtener mascota por ID
- `POST /api/mascotas` - Crear nueva mascota
- `PUT /api/mascotas/:id` - Actualizar mascota

### Adoptantes
- `GET /api/adoptantes` - Listar todos los adoptantes
- `GET /api/adoptantes/:id` - Obtener adoptante por ID
- `POST /api/adoptantes` - Crear nuevo adoptante
- `PUT /api/adoptantes/:id` - Actualizar adoptante

### Seguimientos
- `GET /api/seguimientos` - Listar todos los seguimientos
- `GET /api/seguimientos/:id` - Obtener seguimiento por ID
- `POST /api/seguimientos` - Crear nuevo seguimiento
- `PUT /api/seguimientos/:id` - Actualizar seguimiento

### Reportes
- `GET /api/reportes` - Listar todos los reportes
- `POST /api/reportes` - Crear nuevo reporte
- `PUT /api/reportes/:id/evaluar` - Evaluar reporte

### Intervenciones
- `GET /api/intervenciones` - Listar todas las intervenciones
- `POST /api/intervenciones` - Crear nueva intervención
- `PUT /api/intervenciones/:id` - Actualizar intervención

### Estadísticas
- `GET /api/estadisticas` - Obtener estadísticas del centro

## 🏗️ Estructura del Proyecto

```
huellitas-responsables/
├── server.js              # Servidor Express y API REST
├── package.json           # Configuración y dependencias
├── public/                # Frontend
│   ├── index.html        # Interfaz principal
│   ├── styles.css        # Estilos CSS
│   └── app.js            # Lógica JavaScript del cliente
└── README.md             # Documentación
```

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Body-parser** - Parseo de datos
- **CORS** - Habilitación de CORS

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos y diseño responsivo
- **JavaScript (Vanilla)** - Lógica del cliente
- **Fetch API** - Comunicación con backend

### Base de Datos
- **In-Memory Storage** (Prototipo) - Los datos se almacenan en memoria durante la ejecución

> **Nota para Producción:** Para un entorno de producción, se recomienda integrar una base de datos persistente como PostgreSQL, MongoDB o MySQL.

## 💡 Valor Agregado

El sistema HuellasResponsables va más allá de una simple base de datos:

- **Fiscalización Activa:** Monitoreo continuo del bienestar animal
- **Acompañamiento Digital:** Seguimiento estructurado y documentado
- **Intervención Oportuna:** Detección temprana de situaciones de riesgo
- **Sede Única:** Optimizado para la operación de un centro específico
- **Coordinación Física:** Facilita visitas domiciliarias basadas en datos

## 🔐 Seguridad

**Prototipo Actual:**
- Autenticación básica con credenciales
- Validación de datos en formularios

**Recomendaciones para Producción:**
- Implementar JWT para autenticación
- Encriptar contraseñas con bcrypt
- Usar HTTPS
- Implementar rate limiting
- Validación exhaustiva de datos
- Sanitización de inputs

## 🚧 Desarrollo Futuro

### Funcionalidades Planificadas
- [ ] Portal del adoptante (login independiente)
- [ ] Carga real de fotos/videos
- [ ] Sistema de notificaciones por email/SMS
- [ ] Generación de PDF para reportes
- [ ] Aplicación móvil
- [ ] Integración con base de datos persistente
- [ ] Sistema de roles y permisos granular
- [ ] Firma digital de documentos de adopción
- [ ] Geolocalización para visitas domiciliarias
- [ ] Dashboard de analíticas avanzadas

## 📄 Licencia

MIT License

## 👨‍💻 Autor

Desarrollado para HuellasResponsables - Centro de Adopción Animal

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias y mejoras.

## 📞 Soporte

Para soporte y consultas, contactar al administrador del sistema.
