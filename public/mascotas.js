// Mascotas functionality
let mascotas = [];
let editingId = null;

// Default pet images by species
const defaultImages = {
    'Perro': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    'Gato': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    'Otro': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop'
};

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
    const grid = document.getElementById('mascotasGrid');
    
    if (mascotas.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <span class="material-symbols-outlined">pets</span>
                <p>No hay mascotas registradas</p>
                <button class="btn btn-primary" onclick="showMascotaModal()">
                    <span class="material-symbols-outlined">add</span>
                    Registrar Primera Mascota
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = mascotas.map(m => `
        <div class="mascota-card">
            <div class="mascota-image">
                ${m.fotoUrl ? 
                    `<img src="${m.fotoUrl}" alt="${m.nombre}">` :
                    `<img src="${defaultImages[m.especie] || defaultImages['Otro']}" alt="${m.nombre}">`
                }
            </div>
            <div class="mascota-content">
                <div class="mascota-header">
                    <div>
                        <h3 class="mascota-name">${m.nombre}</h3>
                        <p class="mascota-species">${m.especie}</p>
                    </div>
                    <span class="mascota-status status-${m.estado.toLowerCase().replace(' ', '-')}">
                        ${m.estado}
                    </span>
                </div>
                
                <div class="mascota-details">
                    ${m.raza ? `
                        <div class="detail-item">
                            <span class="material-symbols-outlined">pets</span>
                            <span>${m.raza}</span>
                        </div>
                    ` : ''}
                    ${m.edad ? `
                        <div class="detail-item">
                            <span class="material-symbols-outlined">cake</span>
                            <span>${m.edad} años</span>
                        </div>
                    ` : ''}
                    ${m.sexo ? `
                        <div class="detail-item">
                            <span class="material-symbols-outlined">wc</span>
                            <span>${m.sexo}</span>
                        </div>
                    ` : ''}
                    ${m.color ? `
                        <div class="detail-item">
                            <span class="material-symbols-outlined">palette</span>
                            <span>${m.color}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${m.senasParticulares ? `
                    <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.75rem;">
                        ${m.senasParticulares}
                    </p>
                ` : ''}
                
                <div class="mascota-actions" style="margin-top: 1rem;">
                    <button class="btn-icon btn-icon-primary" onclick="editMascota(${m.id})" title="Editar">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-icon-primary" onclick="viewMascota(${m.id})" title="Ver detalles">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showMascotaModal() {
    editingId = null;
    document.getElementById('mascotaForm').reset();
    document.getElementById('photoPreview').innerHTML = `
        <span class="material-symbols-outlined">add_photo_alternate</span>
        <p>Click para subir foto</p>
    `;
    document.getElementById('mascotaModal').classList.add('active');
}

function closeMascotaModal() {
    document.getElementById('mascotaModal').classList.remove('active');
}

function editMascota(id) {
    const mascota = mascotas.find(m => m.id === id);
    if (!mascota) return;
    
    editingId = id;
    
    // Fill form
    const form = document.getElementById('mascotaForm');
    form.nombre.value = mascota.nombre;
    form.especie.value = mascota.especie;
    form.raza.value = mascota.raza || '';
    form.edad.value = mascota.edad || '';
    form.sexo.value = mascota.sexo || '';
    form.color.value = mascota.color || '';
    form.senasParticulares.value = mascota.senasParticulares || '';
    
    // Show photo if exists
    if (mascota.fotoUrl) {
        document.getElementById('photoPreview').innerHTML = `<img src="${mascota.fotoUrl}" alt="${mascota.nombre}">`;
        document.getElementById('fotoUrl').value = mascota.fotoUrl;
    }
    
    document.getElementById('mascotaModal').classList.add('active');
}

function viewMascota(id) {
    const mascota = mascotas.find(m => m.id === id);
    if (!mascota) return;
    
    alert(`Mascota: ${mascota.nombre}\nEspecie: ${mascota.especie}\nEstado: ${mascota.estado}\nRaza: ${mascota.raza || 'N/A'}\nEdad: ${mascota.edad || 'N/A'} años`);
}

// Photo upload
document.addEventListener('DOMContentLoaded', () => {
    const photoPreview = document.getElementById('photoPreview');
    const photoInput = document.getElementById('mascotaPhoto');
    
    photoPreview.addEventListener('click', () => {
        photoInput.click();
    });
    
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                document.getElementById('fotoUrl').value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Form submission
    document.getElementById('mascotaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            let response;
            if (editingId) {
                response = await fetch(`${API_URL}/api/mascotas/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch(`${API_URL}/api/mascotas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            if (response.ok) {
                showNotification(`Mascota ${editingId ? 'actualizada' : 'registrada'} exitosamente`);
                closeMascotaModal();
                loadMascotas();
            }
        } catch (error) {
            console.error('Error saving mascota:', error);
            showNotification('Error al guardar la mascota', 'error');
        }
    });
    
    // Search and filters
    document.getElementById('searchMascotas')?.addEventListener('input', filterMascotas);
    document.getElementById('filterEstado')?.addEventListener('change', filterMascotas);
    document.getElementById('filterEspecie')?.addEventListener('change', filterMascotas);
    
    loadMascotas();
});

function filterMascotas() {
    const search = document.getElementById('searchMascotas')?.value.toLowerCase() || '';
    const estado = document.getElementById('filterEstado')?.value || '';
    const especie = document.getElementById('filterEspecie')?.value || '';
    
    const filtered = mascotas.filter(m => {
        const matchSearch = !search || 
            m.nombre.toLowerCase().includes(search) ||
            (m.raza && m.raza.toLowerCase().includes(search)) ||
            m.especie.toLowerCase().includes(search);
        
        const matchEstado = !estado || m.estado === estado;
        const matchEspecie = !especie || m.especie === especie;
        
        return matchSearch && matchEstado && matchEspecie;
    });
    
    // Temporarily replace mascotas for display
    const original = mascotas;
    mascotas = filtered;
    displayMascotas();
    mascotas = original;
}
