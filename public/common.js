// Common functionality across all pages
const API_URL = window.location.origin;

// Check authentication
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser ? JSON.parse(currentUser) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Display user name
    const userNameEl = document.getElementById('userName');
    if (userNameEl && user) {
        userNameEl.textContent = user.nombre;
    }
});

// Utility functions
function showNotification(message, type = 'success') {
    // Simple notification (can be enhanced with a toast library)
    alert(message);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}
