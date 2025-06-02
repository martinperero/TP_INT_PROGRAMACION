document.addEventListener('DOMContentLoaded', () => {
    const salonesContainer = document.getElementById('salones-container');

    fetch('base_de_datos.json')
        .then(res => res.json())
        .then(data => {
            data.salones.forEach(salon => {
                const card = document.createElement('div');
                card.className = 'col-lg-4 col-md-6 mb-4';
                card.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${salon.portada || (salon.multimedia && salon.multimedia[0]?.url) || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${salon.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${salon.nombre}</h5>
                            <p class="card-text">${salon.descripción}</p>
                            <p class="card-text">${salon.resumen ? salon.resumen.join(' ') : ''}</p>
                            <p class="card-text">Dirección: ${salon.direccion}</p>
                            <p class="card-text">Precio: $${salon.precio}</p>
                            <p class="card-text">${salon.footer_tarjeta || ''}</p>
                            <a href="reserva.html?salon=${salon.ID || salon.id_salon}" class="btn btn-primary">Reservar</a>
                        </div>
                    </div>
                `;
                salonesContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error al cargar los salones:', error));
});