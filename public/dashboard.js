// Dashboard functionality
let stats = {};

async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/estadisticas`);
        stats = await response.json();
        
        // Update stats
        document.getElementById('statTotalMascotas').textContent = stats.totalMascotas;
        document.getElementById('statMascotasAdoptadas').textContent = stats.mascotasAdoptadas;
        document.getElementById('statSeguimientosActivos').textContent = stats.seguimientosActivos;
        document.getElementById('statAlertasActivas').textContent = stats.alertasActivas;
        document.getElementById('statTotalAdoptantes').textContent = stats.totalAdoptantes;
        document.getElementById('statAdopcionesExitosas').textContent = stats.adopcionesExitosas;
        
        // Load alerts and upcoming follow-ups
        await loadAlerts();
        await loadUpcomingSeguimientos();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadAlerts() {
    try {
        const response = await fetch(`${API_URL}/api/reportes`);
        const reportes = await response.json();
        const alertas = reportes.filter(r => r.riesgo === true);
        
        const alertasList = document.getElementById('alertasList');
        
        if (alertas.length === 0) {
            alertasList.innerHTML = `
                <div class="empty-state">
                    <span class="material-symbols-outlined">check_circle</span>
                    <p>No hay alertas activas</p>
                </div>
            `;
            return;
        }
        
        alertasList.innerHTML = alertas.slice(0, 5).map(alerta => `
            <div class="alert-item">
                <span class="material-symbols-outlined">warning</span>
                <div>
                    <strong>Alerta de Riesgo</strong>
                    <p>Seguimiento #${alerta.seguimientoId}</p>
                    <small>${formatDate(alerta.fechaEnvio)}</small>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

async function loadUpcomingSeguimientos() {
    try {
        const response = await fetch(`${API_URL}/api/seguimientos`);
        const seguimientos = await response.json();
        
        const proximos = [];
        seguimientos.forEach(seg => {
            seg.cronograma.forEach(item => {
                if (!item.completado) {
                    proximos.push({
                        seguimientoId: seg.id,
                        fecha: item.fecha,
                        descripcion: item.descripcion
                    });
                }
            });
        });
        
        proximos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        
        const proximosList = document.getElementById('proximosSeguimientos');
        
        if (proximos.length === 0) {
            proximosList.innerHTML = `
                <div class="empty-state">
                    <span class="material-symbols-outlined">calendar_today</span>
                    <p>No hay seguimientos próximos</p>
                </div>
            `;
            return;
        }
        
        proximosList.innerHTML = proximos.slice(0, 5).map(prox => `
            <div class="upcoming-item">
                <span class="material-symbols-outlined">event</span>
                <div>
                    <strong>${prox.descripcion}</strong>
                    <p>Seguimiento #${prox.seguimientoId}</p>
                    <small>${formatDate(prox.fecha)}</small>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading upcoming seguimientos:', error);
    }
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', loadDashboard);
