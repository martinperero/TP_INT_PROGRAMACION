document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                expiresInMins: 30
            })
        });

        if (!response.ok) throw new Error('Credenciales inválidas');

        const data = await response.json();
        console.log('Respuesta de login:', data);
        const accessToken = data.accessToken;

        if (accessToken) {
            
            const usersResponse = await fetch('https://dummyjson.com/users');
            if (!usersResponse.ok) throw new Error('Error al cargar la lista de usuarios');
            const usersData = await usersResponse.json();
            const user = usersData.users.find(u => u.username === username);
            const role = user ? user.role || 'user' : 'user'; // Obtener rol

            console.log('Usuario encontrado:', user); 
            console.log('Rol asignado:', role);

            // Guardar el accessToken y el rol en sessionStorage
            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('userRole', role);
            alert('¡Inicio de sesión exitoso! Bienvenido, ' + username + ' (' + role + ')');
            // Redirigir según el rol
            window.location.href = (role === 'user') ? 'catalogo.html' : 'tabla.html';
        } else {
            alert('Error: Credenciales incorrectas.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo.');
    }
});

window.addEventListener('load', checkLogin);

function checkLogin() {
    const token = sessionStorage.getItem('accessToken');
    if (!token && !window.location.pathname.endsWith('login.html')) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'login.html';
    }
}
