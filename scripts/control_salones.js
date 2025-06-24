document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAccess()) return; // Verifica si el usuario es admin o moderator para acceder a la página

    const tbody = document.querySelector('#tabla tbody');

    let salones = JSON.parse(localStorage.getItem('salones'));
    if (!salones) {
        fetch('base_de_datos.json')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar el json');
                return response.json();
            })
            .then(data => {
                salones = data.salones;
                localStorage.setItem('salones', JSON.stringify(salones));
                mostrarSalones(salones);
            })
            .catch(error => console.error('Error:', error));
    } else {
        mostrarSalones(salones);
    }

    function mostrarSalones(salones) {
        tbody.innerHTML = '';
        salones.forEach(salon => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${salon.id_salon}</td>
                <td>${salon.nombre}</td>
                <td>
                    <div class="media-item">
                        <img src="${salon.portada}" width="100">
                    </div>
                </td>
                <td>${salon.descripcion}</td>
                <td>${salon.direccion}</td>
                <td>${salon.estado}</td>
                <td>${salon.precio}</td>
                <td>
                    <button class="rounded btn btn-outline-success my-2" onclick="editarSalon('${salon.id_salon}')">Editar</button>
                    <button class="rounded btn btn-outline-danger my-2" onclick="eliminarSalon('${salon.id_salon}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    window.editarSalon = function(id) {
        const userRole = sessionStorage.getItem('userRole');
        if (userRole === 'admin') {
            window.location.href = `editar.html?id=${id}`;
        } else {
            alert('No tienes permisos para editar salones.');
        }
    };

    window.eliminarSalon = function(id) {
        const userRole = sessionStorage.getItem('userRole');
        if (userRole === 'admin') {
            if (confirm('¿Seguro que querés eliminar el salón?')) {
                salones = salones.filter(salon => salon.id_salon !== id);
                localStorage.setItem('salones', JSON.stringify(salones));
                mostrarSalones(salones);
            }
        } else {
            alert('No tienes permisos para eliminar salones.');
        }
    };

    document.getElementById('reiniciar').addEventListener('click', () => {
        const userRole = sessionStorage.getItem('userRole');
        if (userRole === 'admin') {
            if (confirm('¿Estás seguro que quieres reiniciar la base de datos? Se perderán los cambios.')) {
                localStorage.removeItem('salones');
                location.reload();
            }
        } else {
            alert('No tienes permisos para reiniciar la base de datos.');
        }
    });
});