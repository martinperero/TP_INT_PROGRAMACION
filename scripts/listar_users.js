
window.addEventListener('load', checkAuthentication);

async function loadUsers() {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
        alert('Debes iniciar sesión para ver esta página.');
        window.location.href = 'login.html';
        return;
    }

    const tbody = document.querySelector('#usersBody');
    if (!tbody) {
        console.error('No se encontró el tbody en la tabla de usuarios.');
        return;
    }

    try {
        const response = await fetch('https://dummyjson.com/users', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar los usuarios');

        const data = await response.json();
        const users = data.users;

        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al obtener usuarios', error);
        alert('Ocurrió un error al cargar la lista de usuarios.');
    }
}


function checkAuthentication() {
    const token = sessionStorage.getItem('accessToken');
    if (!token && window.location.pathname !== '/login.html') {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'login.html';
    } else if (token) {
        loadUsers(); 
    }
}