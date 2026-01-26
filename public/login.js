// Login functionality
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Save user data
            localStorage.setItem('currentUser', JSON.stringify(data.usuario));
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        }
    } catch (error) {
        console.error('Error en login:', error);
        alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
    }
});
