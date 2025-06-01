document.addEventListener('DOMContentLoaded', () => {
    fetch('base_de_datos.json')
        .then(response => {
            if (!response.ok) {
            throw new Error('Error al cargar el json');
            }
            return response.json();
        })
        .then(data => {
            const salones = data.salones;
            const tbody = document.querySelector('#tabla tbody');

        salones.forEach(salon => {
            const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${salon.ID}</td>
                    <td>${salon.nombre}</td>
                    <td>${salon.descripcion}</td>
                    <td>${salon.direccion}</td>
                    <td>${salon.estado}</td>
                    <td>${salon.precio}</td>
                `;
                tbody.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});