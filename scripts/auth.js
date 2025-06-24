// verifica login basico
function checkAuthentication() {
    const token = sessionStorage.getItem('accessToken');
    if (!token && window.location.pathname !== '/login.html') {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'login.html';
    }
}

// Verificación de admin o mod
function checkAdminAccess() {
    const token = sessionStorage.getItem('accessToken');
    const role = sessionStorage.getItem('userRole');

    if (!token) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'login.html';
        return false;
    }
    if (role !== 'admin' && role !== 'moderator') {
        alert('No tienes permisos de administrador o moderador para acceder a esta página.');
        window.location.href = 'catalogo.html';
        return false;
    }
    return true;
}

// Ejecutar verificación al cargar la pag
window.addEventListener('load', checkAuthentication);