document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.querySelector('#tabla_datos_usuario tbody');
    if (!tbody) {
        console.error('No se encontró el tbody en la tabla de usuarios.');
        return;
    }

    try {
        const response = await fetch('https://dummyjson.com/users');
        const data = await response.json();

        data.users.forEach(user => {
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
    }
});

