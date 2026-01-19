// Global state
let currentUser = null;
let mascotas = [];
let adoptantes = [];
let seguimientos = [];
let intervenciones = [];
let reportes = [];

// API Base URL
const API_URL = window.location.origin;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const module = e.target.dataset.module;
            switchModule(module);
        });
    });
    
    // Forms
    document.getElementById('mascotaForm').addEventListener('submit', handleMascotaSubmit);
    document.getElementById('adoptanteForm').addEventListener('submit', handleAdoptanteSubmit);
    document.getElementById('seguimientoForm').addEventListener('submit', handleSeguimientoSubmit);
    document.getElementById('intervencionForm').addEventListener('submit', handleIntervencionSubmit);
    document.getElementById('evaluarReporteForm').addEventListener('submit', handleEvaluarReporte);
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.usuario;
            document.getElementById('userName').textContent = currentUser.nombre;
            showScreen('appScreen');
            loadDashboard();
        } else {
            alert('Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error en login:', error);
        alert('Error al iniciar sesión');
    }
}

function handleLogout() {
    currentUser = null;
    showScreen('loginScreen');
    document.getElementById('loginForm').reset();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Module Navigation
function switchModule(moduleName) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-module="${moduleName}"]`).classList.add('active');
    
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.getElementById(`${moduleName}Module`).classList.add('active');
    
    // Load module data
    switch(moduleName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'mascotas':
            loadMascotas();
            break;
        case 'adoptantes':
            loadAdoptantes();
            break;
        case 'seguimientos':
            loadSeguimientos();
            break;
        case 'intervenciones':
            loadIntervenciones();
            break;
        case 'reportes':
            loadReportes();
            break;
    }
}

// Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/estadisticas`);
        const stats = await response.json();
        
        document.getElementById('statTotalMascotas').textContent = stats.totalMascotas;
        document.getElementById('statMascotasAdoptadas').textContent = stats.mascotasAdoptadas;
        document.getElementById('statSeguimientosActivos').textContent = stats.seguimientosActivos;
        document.getElementById('statAlertasActivas').textContent = stats.alertasActivas;
        document.getElementById('statTotalAdoptantes').textContent = stats.totalAdoptantes;
        document.getElementById('statAdopcionesExitosas').textContent = stats.adopcionesExitosas;
        
        // Load alerts
        await loadReportes();
        displayAlertas();
        
        // Load seguimientos
        await loadSeguimientos();
        displayProximosSeguimientos();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayAlertas() {
    const alertasList = document.getElementById('alertasList');
    const alertas = reportes.filter(r => r.riesgo === true);
    
    if (alertas.length === 0) {
        alertasList.innerHTML = '<p class="no-data">No hay alertas activas</p>';
        return;
    }
    
    alertasList.innerHTML = alertas.slice(0, 5).map(alerta => `
        <div class="alert-item">
            <strong>⚠️ Alerta de Riesgo</strong><br>
            Seguimiento #${alerta.seguimientoId}<br>
            <small>${new Date(alerta.fechaEnvio).toLocaleDateString()}</small>
        </div>
    `).join('');
}

function displayProximosSeguimientos() {
    const proximosList = document.getElementById('proximosSeguimientos');
    const proximos = [];
    
    seguimientos.forEach(seg => {
        seg.cronograma.forEach(item => {
            if (!item.completado) {
                proximos.push({
                    seguimientoId: seg.id,
                    mascotaId: seg.mascotaId,
                    fecha: item.fecha,
                    descripcion: item.descripcion
                });
            }
        });
    });
    
    proximos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    if (proximos.length === 0) {
        proximosList.innerHTML = '<p class="no-data">No hay seguimientos próximos</p>';
        return;
    }
    
    proximosList.innerHTML = proximos.slice(0, 5).map(prox => `
        <div class="upcoming-item">
            <strong>📅 ${prox.descripcion}</strong><br>
            Seguimiento #${prox.seguimientoId}<br>
            <small>${new Date(prox.fecha).toLocaleDateString()}</small>
        </div>
    `).join('');
}

// Mascotas
async function loadMascotas() {
    try {
        const response = await fetch(`${API_URL}/api/mascotas`);
        mascotas = await response.json();
        displayMascotas();
    } catch (error) {
        console.error('Error loading mascotas:', error);
    }
}

function displayMascotas() {
    const tbody = document.getElementById('mascotasTableBody');
    
    if (mascotas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No hay mascotas registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = mascotas.map(m => `
        <tr>
            <td>${m.id}</td>
            <td>${m.nombre}</td>
            <td>${m.especie}</td>
            <td>${m.raza || 'N/A'}</td>
            <td>${m.edad || 'N/A'}</td>
            <td><span class="badge badge-${m.estado.toLowerCase().replace(' ', '-')}">${m.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editMascota(${m.id})">Editar</button>
            </td>
        </tr>
    `).join('');
}

function showMascotaForm() {
    document.getElementById('mascotaFormContainer').classList.remove('hidden');
    document.getElementById('mascotaForm').reset();
}

function hideMascotaForm() {
    document.getElementById('mascotaFormContainer').classList.add('hidden');
}

async function handleMascotaSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch(`${API_URL}/api/mascotas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Mascota registrada exitosamente');
            hideMascotaForm();
            loadMascotas();
        }
    } catch (error) {
        console.error('Error creating mascota:', error);
        alert('Error al registrar mascota');
    }
}

// Adoptantes
async function loadAdoptantes() {
    try {
        const response = await fetch(`${API_URL}/api/adoptantes`);
        adoptantes = await response.json();
        displayAdoptantes();
    } catch (error) {
        console.error('Error loading adoptantes:', error);
    }
}

function displayAdoptantes() {
    const tbody = document.getElementById('adoptantesTableBody');
    
    if (adoptantes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay adoptantes registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = adoptantes.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${a.nombre}</td>
            <td>${a.documento}</td>
            <td>${a.telefono}</td>
            <td><span class="badge badge-${a.categoria.toLowerCase().replace(' ', '-')}">${a.categoria}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editAdoptante(${a.id})">Ver</button>
            </td>
        </tr>
    `).join('');
}

function showAdoptanteForm() {
    document.getElementById('adoptanteFormContainer').classList.remove('hidden');
    document.getElementById('adoptanteForm').reset();
}

function hideAdoptanteForm() {
    document.getElementById('adoptanteFormContainer').classList.add('hidden');
}

async function handleAdoptanteSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch(`${API_URL}/api/adoptantes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Adoptante registrado exitosamente');
            hideAdoptanteForm();
            loadAdoptantes();
        }
    } catch (error) {
        console.error('Error creating adoptante:', error);
        alert('Error al registrar adoptante');
    }
}

// Seguimientos
async function loadSeguimientos() {
    try {
        const response = await fetch(`${API_URL}/api/seguimientos`);
        seguimientos = await response.json();
        displaySeguimientos();
        updateSeguimientoSelects();
    } catch (error) {
        console.error('Error loading seguimientos:', error);
    }
}

function displaySeguimientos() {
    const container = document.getElementById('seguimientosList');
    
    if (seguimientos.length === 0) {
        container.innerHTML = '<p class="no-data">No hay seguimientos activos</p>';
        return;
    }
    
    container.innerHTML = seguimientos.map(seg => {
        const mascota = mascotas.find(m => m.id === seg.mascotaId);
        const adoptante = adoptantes.find(a => a.id === seg.adoptanteId);
        
        return `
            <div class="seguimiento-card ${seg.evaluacion === 'Riesgo' ? 'riesgo' : ''}">
                <div class="seguimiento-header">
                    <h4>Seguimiento #${seg.id}</h4>
                    <p><strong>Mascota:</strong> ${mascota ? mascota.nombre : 'N/A'}</p>
                    <p><strong>Adoptante:</strong> ${adoptante ? adoptante.nombre : 'N/A'}</p>
                    <p><strong>Estado:</strong> <span class="badge badge-${seg.estado.toLowerCase()}">${seg.estado}</span></p>
                </div>
                <div class="seguimiento-cronograma">
                    <strong>Cronograma:</strong>
                    ${seg.cronograma.map(item => `
                        <div class="cronograma-item ${item.completado ? 'completado' : 'pendiente'}">
                            <span>${item.descripcion}</span>
                            <span>${new Date(item.fecha).toLocaleDateString()}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="form-actions mt-2">
                    <button class="btn btn-sm btn-primary" onclick="viewSeguimiento(${seg.id})">Ver Detalles</button>
                    ${seg.estado === 'Activo' ? `
                        <button class="btn btn-sm btn-success" onclick="cerrarSeguimiento(${seg.id})">Cerrar como Exitoso</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function showSeguimientoForm() {
    document.getElementById('seguimientoFormContainer').classList.remove('hidden');
    document.getElementById('seguimientoForm').reset();
    updateMascotaSelect();
    updateAdoptanteSelect();
}

function hideSeguimientoForm() {
    document.getElementById('seguimientoFormContainer').classList.add('hidden');
}

async function updateMascotaSelect() {
    await loadMascotas();
    const select = document.getElementById('mascotaSelect');
    const disponibles = mascotas.filter(m => m.estado === 'Disponible');
    
    select.innerHTML = '<option value="">Seleccione una mascota</option>' +
        disponibles.map(m => `<option value="${m.id}">${m.nombre} (${m.especie})</option>`).join('');
}

async function updateAdoptanteSelect() {
    await loadAdoptantes();
    const select = document.getElementById('adoptanteSelect');
    
    select.innerHTML = '<option value="">Seleccione un adoptante</option>' +
        adoptantes.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
}

function updateSeguimientoSelects() {
    const select = document.getElementById('seguimientoIntervencionSelect');
    const activos = seguimientos.filter(s => s.estado === 'Activo');
    
    select.innerHTML = '<option value="">Seleccione un seguimiento</option>' +
        activos.map(s => `<option value="${s.id}">Seguimiento #${s.id}</option>`).join('');
}

async function handleSeguimientoSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        mascotaId: parseInt(formData.get('mascotaId')),
        adoptanteId: parseInt(formData.get('adoptanteId'))
    };
    
    try {
        const response = await fetch(`${API_URL}/api/seguimientos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Seguimiento iniciado exitosamente');
            hideSeguimientoForm();
            loadSeguimientos();
            loadMascotas();
        }
    } catch (error) {
        console.error('Error creating seguimiento:', error);
        alert('Error al iniciar seguimiento');
    }
}

async function cerrarSeguimiento(id) {
    if (!confirm('¿Está seguro de cerrar este seguimiento como Adopción Exitosa?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/seguimientos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                estado: 'Cerrado',
                evaluacion: 'Exitosa'
            })
        });
        
        if (response.ok) {
            alert('Seguimiento cerrado exitosamente');
            loadSeguimientos();
        }
    } catch (error) {
        console.error('Error closing seguimiento:', error);
    }
}

function viewSeguimiento(id) {
    const seg = seguimientos.find(s => s.id === id);
    if (seg) {
        const mascota = mascotas.find(m => m.id === seg.mascotaId);
        const adoptante = adoptantes.find(a => a.id === seg.adoptanteId);
        alert(`Seguimiento #${id}\nMascota: ${mascota?.nombre}\nAdoptante: ${adoptante?.nombre}\nEstado: ${seg.estado}`);
    }
}

// Intervenciones
async function loadIntervenciones() {
    try {
        const response = await fetch(`${API_URL}/api/intervenciones`);
        intervenciones = await response.json();
        displayIntervenciones();
    } catch (error) {
        console.error('Error loading intervenciones:', error);
    }
}

function displayIntervenciones() {
    const tbody = document.getElementById('intervencionesTableBody');
    
    if (intervenciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay intervenciones registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = intervenciones.map(i => `
        <tr>
            <td>${i.id}</td>
            <td>${new Date(i.fechaRegistro).toLocaleDateString()}</td>
            <td>${i.tipo}</td>
            <td>Seguimiento #${i.seguimientoId}</td>
            <td><span class="badge badge-${i.estado.toLowerCase().replace(' ', '-')}">${i.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewIntervencion(${i.id})">Ver</button>
            </td>
        </tr>
    `).join('');
}

function showIntervencionForm() {
    document.getElementById('intervencionFormContainer').classList.remove('hidden');
    document.getElementById('intervencionForm').reset();
}

function hideIntervencionForm() {
    document.getElementById('intervencionFormContainer').classList.add('hidden');
}

async function handleIntervencionSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        seguimientoId: parseInt(formData.get('seguimientoId')),
        tipo: formData.get('tipo'),
        motivo: formData.get('motivo'),
        observaciones: formData.get('observaciones')
    };
    
    try {
        const response = await fetch(`${API_URL}/api/intervenciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Intervención registrada exitosamente');
            hideIntervencionForm();
            loadIntervenciones();
        }
    } catch (error) {
        console.error('Error creating intervencion:', error);
        alert('Error al registrar intervención');
    }
}

function viewIntervencion(id) {
    const interv = intervenciones.find(i => i.id === id);
    if (interv) {
        alert(`Intervención #${id}\nTipo: ${interv.tipo}\nMotivo: ${interv.motivo}\nObservaciones: ${interv.observaciones || 'N/A'}`);
    }
}

// Reportes
async function loadReportes() {
    try {
        const response = await fetch(`${API_URL}/api/reportes`);
        reportes = await response.json();
        displayReportes();
    } catch (error) {
        console.error('Error loading reportes:', error);
    }
}

function displayReportes() {
    const container = document.getElementById('reportesList');
    
    if (reportes.length === 0) {
        container.innerHTML = '<p class="no-data">No hay reportes para evaluar</p>';
        return;
    }
    
    const filter = document.getElementById('reporteFilter').value;
    let filteredReportes = reportes;
    
    if (filter === 'Pendiente' || filter === 'Evaluado') {
        filteredReportes = reportes.filter(r => r.estado === filter);
    } else if (filter === 'riesgo') {
        filteredReportes = reportes.filter(r => r.riesgo === true);
    }
    
    if (filteredReportes.length === 0) {
        container.innerHTML = '<p class="no-data">No hay reportes con este filtro</p>';
        return;
    }
    
    container.innerHTML = filteredReportes.map(r => `
        <div class="reporte-card ${r.riesgo ? 'riesgo' : ''}">
            <div class="reporte-header">
                <h4>Reporte #${r.id}</h4>
                <p><strong>Seguimiento:</strong> #${r.seguimientoId}</p>
                <p><strong>Estado:</strong> <span class="badge badge-${r.estado.toLowerCase()}">${r.estado}</span></p>
                ${r.riesgo ? '<p class="badge badge-riesgo">⚠️ ALERTA DE RIESGO</p>' : ''}
            </div>
            <div class="reporte-content">
                <p><strong>Fecha:</strong> ${new Date(r.fechaEnvio).toLocaleDateString()}</p>
                ${r.estado === 'Evaluado' ? `
                    <p><strong>Calificación:</strong> ${r.calificacion}</p>
                    <p><strong>Observaciones:</strong> ${r.observaciones}</p>
                ` : ''}
            </div>
            ${r.estado === 'Pendiente' ? `
                <div class="form-actions">
                    <button class="btn btn-sm btn-primary" onclick="evaluarReporte(${r.id})">Evaluar</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function filterReportes() {
    displayReportes();
}

function evaluarReporte(id) {
    document.getElementById('reporteIdEvaluar').value = id;
    document.getElementById('evaluarReporteModal').classList.add('active');
}

function closeEvaluarModal() {
    document.getElementById('evaluarReporteModal').classList.remove('active');
    document.getElementById('evaluarReporteForm').reset();
}

async function handleEvaluarReporte(e) {
    e.preventDefault();
    const id = document.getElementById('reporteIdEvaluar').value;
    const calificacion = document.getElementById('calificacionReporte').value;
    const observaciones = document.getElementById('observacionesReporte').value;
    const riesgo = document.getElementById('reporteRiesgo').checked;
    
    try {
        const response = await fetch(`${API_URL}/api/reportes/${id}/evaluar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calificacion, observaciones, riesgo })
        });
        
        if (response.ok) {
            alert('Reporte evaluado exitosamente');
            closeEvaluarModal();
            loadReportes();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error evaluating reporte:', error);
        alert('Error al evaluar reporte');
    }
}

// Make functions available globally
window.showMascotaForm = showMascotaForm;
window.hideMascotaForm = hideMascotaForm;
window.showAdoptanteForm = showAdoptanteForm;
window.hideAdoptanteForm = hideAdoptanteForm;
window.showSeguimientoForm = showSeguimientoForm;
window.hideSeguimientoForm = hideSeguimientoForm;
window.showIntervencionForm = showIntervencionForm;
window.hideIntervencionForm = hideIntervencionForm;
window.editMascota = (id) => alert('Función de edición en desarrollo');
window.editAdoptante = (id) => alert('Función de visualización en desarrollo');
window.viewSeguimiento = viewSeguimiento;
window.cerrarSeguimiento = cerrarSeguimiento;
window.viewIntervencion = viewIntervencion;
window.filterReportes = filterReportes;
window.evaluarReporte = evaluarReporte;
window.closeEvaluarModal = closeEvaluarModal;
