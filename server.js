const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory database (para prototipo)
const db = {
  mascotas: [],
  adoptantes: [],
  seguimientos: [],
  intervenciones: [],
  reportes: [],
  usuarios: [
    {
      id: 1,
      nombre: 'Admin Centro',
      email: 'admin@huellitas.com',
      rol: 'admin',
      password: 'admin123'
    }
  ]
};

// Rutas de autenticación
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const usuario = db.usuarios.find(u => u.email === email && u.password === password);
  
  if (usuario) {
    res.json({
      success: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
});

// Rutas de mascotas
app.get('/api/mascotas', (req, res) => {
  res.json(db.mascotas);
});

app.get('/api/mascotas/:id', (req, res) => {
  const mascota = db.mascotas.find(m => m.id === parseInt(req.params.id));
  if (mascota) {
    res.json(mascota);
  } else {
    res.status(404).json({ message: 'Mascota no encontrada' });
  }
});

app.post('/api/mascotas', (req, res) => {
  const nuevaMascota = {
    id: db.mascotas.length + 1,
    ...req.body,
    fechaRegistro: new Date().toISOString(),
    estado: 'Disponible'
  };
  db.mascotas.push(nuevaMascota);
  res.status(201).json(nuevaMascota);
});

app.put('/api/mascotas/:id', (req, res) => {
  const index = db.mascotas.findIndex(m => m.id === parseInt(req.params.id));
  if (index !== -1) {
    db.mascotas[index] = { ...db.mascotas[index], ...req.body };
    res.json(db.mascotas[index]);
  } else {
    res.status(404).json({ message: 'Mascota no encontrada' });
  }
});

// Rutas de adoptantes
app.get('/api/adoptantes', (req, res) => {
  res.json(db.adoptantes);
});

app.get('/api/adoptantes/:id', (req, res) => {
  const adoptante = db.adoptantes.find(a => a.id === parseInt(req.params.id));
  if (adoptante) {
    res.json(adoptante);
  } else {
    res.status(404).json({ message: 'Adoptante no encontrado' });
  }
});

app.post('/api/adoptantes', (req, res) => {
  const nuevoAdoptante = {
    id: db.adoptantes.length + 1,
    ...req.body,
    fechaRegistro: new Date().toISOString(),
    categoria: 'En observación',
    historialAdopciones: []
  };
  db.adoptantes.push(nuevoAdoptante);
  res.status(201).json(nuevoAdoptante);
});

app.put('/api/adoptantes/:id', (req, res) => {
  const index = db.adoptantes.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    db.adoptantes[index] = { ...db.adoptantes[index], ...req.body };
    res.json(db.adoptantes[index]);
  } else {
    res.status(404).json({ message: 'Adoptante no encontrado' });
  }
});

// Rutas de seguimientos
app.get('/api/seguimientos', (req, res) => {
  res.json(db.seguimientos);
});

app.get('/api/seguimientos/:id', (req, res) => {
  const seguimiento = db.seguimientos.find(s => s.id === parseInt(req.params.id));
  if (seguimiento) {
    res.json(seguimiento);
  } else {
    res.status(404).json({ message: 'Seguimiento no encontrado' });
  }
});

app.post('/api/seguimientos', (req, res) => {
  const { mascotaId, adoptanteId } = req.body;
  
  // Crear cronograma automático
  const fechaAdopcion = new Date();
  const cronograma = [
    { dias: 7, descripcion: 'Primera semana' },
    { dias: 30, descripcion: 'Primer mes' },
    { dias: 90, descripcion: 'Tres meses' },
    { dias: 180, descripcion: 'Seis meses' }
  ].map(item => {
    const fecha = new Date(fechaAdopcion);
    fecha.setDate(fecha.getDate() + item.dias);
    return {
      fecha: fecha.toISOString(),
      descripcion: item.descripcion,
      completado: false,
      evidencias: []
    };
  });
  
  const nuevoSeguimiento = {
    id: db.seguimientos.length + 1,
    mascotaId,
    adoptanteId,
    fechaInicio: fechaAdopcion.toISOString(),
    cronograma,
    estado: 'Activo',
    evaluacion: 'Pendiente'
  };
  
  db.seguimientos.push(nuevoSeguimiento);
  
  // Actualizar estado de mascota
  const mascota = db.mascotas.find(m => m.id === mascotaId);
  if (mascota) {
    mascota.estado = 'Adoptado';
    mascota.adoptanteId = adoptanteId;
  }
  
  res.status(201).json(nuevoSeguimiento);
});

app.put('/api/seguimientos/:id', (req, res) => {
  const index = db.seguimientos.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    db.seguimientos[index] = { ...db.seguimientos[index], ...req.body };
    res.json(db.seguimientos[index]);
  } else {
    res.status(404).json({ message: 'Seguimiento no encontrado' });
  }
});

// Rutas de reportes
app.get('/api/reportes', (req, res) => {
  res.json(db.reportes);
});

app.post('/api/reportes', (req, res) => {
  const nuevoReporte = {
    id: db.reportes.length + 1,
    ...req.body,
    fechaEnvio: new Date().toISOString(),
    estado: 'Pendiente',
    calificacion: null
  };
  db.reportes.push(nuevoReporte);
  res.status(201).json(nuevoReporte);
});

app.put('/api/reportes/:id/evaluar', (req, res) => {
  const index = db.reportes.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    db.reportes[index] = {
      ...db.reportes[index],
      estado: 'Evaluado',
      calificacion: req.body.calificacion,
      observaciones: req.body.observaciones,
      riesgo: req.body.riesgo || false,
      fechaEvaluacion: new Date().toISOString()
    };
    res.json(db.reportes[index]);
  } else {
    res.status(404).json({ message: 'Reporte no encontrado' });
  }
});

// Rutas de intervenciones
app.get('/api/intervenciones', (req, res) => {
  res.json(db.intervenciones);
});

app.post('/api/intervenciones', (req, res) => {
  const nuevaIntervencion = {
    id: db.intervenciones.length + 1,
    ...req.body,
    fechaRegistro: new Date().toISOString(),
    estado: 'En proceso'
  };
  db.intervenciones.push(nuevaIntervencion);
  res.status(201).json(nuevaIntervencion);
});

app.put('/api/intervenciones/:id', (req, res) => {
  const index = db.intervenciones.findIndex(i => i.id === parseInt(req.params.id));
  if (index !== -1) {
    db.intervenciones[index] = { ...db.intervenciones[index], ...req.body };
    res.json(db.intervenciones[index]);
  } else {
    res.status(404).json({ message: 'Intervención no encontrada' });
  }
});

// Rutas de estadísticas
app.get('/api/estadisticas', (req, res) => {
  const stats = {
    totalMascotas: db.mascotas.length,
    mascotasDisponibles: db.mascotas.filter(m => m.estado === 'Disponible').length,
    mascotasAdoptadas: db.mascotas.filter(m => m.estado === 'Adoptado').length,
    seguimientosActivos: db.seguimientos.filter(s => s.estado === 'Activo').length,
    adopcionesExitosas: db.seguimientos.filter(s => s.evaluacion === 'Exitosa').length,
    alertasActivas: db.reportes.filter(r => r.riesgo === true && r.estado !== 'Resuelto').length,
    totalAdoptantes: db.adoptantes.length,
    adoptantesResponsables: db.adoptantes.filter(a => a.categoria === 'Responsable').length
  };
  res.json(stats);
});

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Ruta para servir el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.path));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor HuellasResponsables ejecutándose en http://localhost:${PORT}`);
});
