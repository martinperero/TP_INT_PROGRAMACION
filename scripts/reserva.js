document.addEventListener('DOMContentLoaded', () => {
    const salonSelect = document.getElementById('salon');
    const fechaReserva = document.getElementById('fecha-reserva');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const telefonoInput = document.getElementById('telefono');
    const serviciosContainer = document.getElementById('servicios-container');
    const totalEl = document.getElementById('total');
    const mensajeReserva = document.getElementById('mensaje-reserva');
    const formReserva = document.getElementById('form-reserva');
    const salonImage = document.getElementById('salon-image');
    const salonNombre = document.getElementById('salon-nombre');
    const salonDescripcion = document.getElementById('salon-descripcion');
    const salonDireccion = document.getElementById('salon-direccion');
    const salonPrecio = document.getElementById('salon-precio');
    const salonResumen = document.getElementById('salon-resumen');
    const salonFooter = document.getElementById('salon-footer');
    const carouselIndicators = document.getElementById('carousel-indicators');
    const carouselInner = document.getElementById('carousel-inner');
    const toggleDetails = document.getElementById('toggle-details');
    const salonDetails = document.getElementById('salon-details');

    let salones = [];
    let servicios = [];
    let precioBase = 0;
    const personasPorDefecto = 20;
    const fechaActual = new Date('2025-06-01');

    const params = new URLSearchParams(window.location.search);
    const salonPreSeleccionado = params.get('salon');
//Esta parte se modificó para que los datos se carguen desde el localStorage
    const salonesLocal = JSON.parse(localStorage.getItem("salones") || "[]");
    const serviciosLocal = JSON.parse(localStorage.getItem("servicios") || "[]");
    salones = salonesLocal;
    servicios = serviciosLocal;
    salones.forEach(salon => {
                const option = document.createElement('option');
                option.value = salon.ID || salon.id_salon;
                option.textContent = `${salon.nombre} - $${salon.precio}`;
                if ((salonesLocal.ID || salon.id_salon) === salonPreSeleccionado) {
                    option.selected = true;
                    precioBase = parseInt(salon.precio);
                    actualizarDetallesSalon(salon);
                }
                salonSelect.appendChild(option);
            });
            mostrarServicios(servicios);
            actualizarTotal();


        fetch('base_de_datos.json')
        .then(res => res.json())
        .then(data => {
            salones = data.salones;
            servicios = data.servicios;

            salones.forEach(salon => {
                const option = document.createElement('option');
                option.value = salon.ID || salon.id_salon;
                option.textContent = `${salon.nombre} - $${salon.precio}`;
                if ((salon.ID || salon.id_salon) === salonPreSeleccionado) {
                    option.selected = true;
                    precioBase = parseInt(salon.precio);
                    actualizarDetallesSalon(salon);
                }
                salonSelect.appendChild(option);
            });

            mostrarServicios(servicios);
            actualizarTotal();
        })
        .catch(error => console.error('Error al cargar los datos:', error)); 

    fechaReserva.min = '2025-06-01';

    salonDetails.addEventListener('shown.bs.collapse', () => {
        toggleDetails.innerHTML = 'Ver menos <i class="bi bi-chevron-up ms-1"></i>';
    });

    salonDetails.addEventListener('hidden.bs.collapse', () => {
        toggleDetails.innerHTML = 'Ver más <i class="bi bi-chevron-down ms-1"></i>';
    });

    formReserva.addEventListener('submit', (e) => {
        e.preventDefault();

        const fechaSeleccionada = new Date(fechaReserva.value);
        if (fechaSeleccionada < fechaActual) {
            mostrarMensaje('Por favor, selecciona una fecha a partir de hoy.', 'danger');
            return;
        }

        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const telefono = telefonoInput.value.trim();

        if (!nombre || !apellido || !telefono) {
            mostrarMensaje('Por favor, completa todos los campos de datos personales.', 'danger');
            return;
        }

        
        const digitosTelefono = telefono.replace(/[^0-9]/g, '');
        if (digitosTelefono.length < 10) {
            mostrarMensaje('El número de teléfono debe contener al menos 10 dígitos.', 'danger');
            return;
        }

        const salonSeleccionado = salones.find(s => (s.ID || s.id_salon) === salonSelect.value);
        const serviciosSeleccionados = [];
        let personasExtra = 0;

        document.querySelectorAll('#servicios-container input[type="checkbox"]').forEach(cb => {
            if (cb.checked) {
                const descripcion = cb.nextElementSibling.textContent.split(' - ')[0];
                const cantidad = parseInt(cb.dataset.cantidad || '1');
                serviciosSeleccionados.push({ descripcion, cantidad });

                if (cb.id.includes('servicio-0F123A')) {
                    personasExtra = cantidad;
                }
            }
        });

        const total = parseInt(totalEl.textContent.replace(/\./g, ''));

        const reserva = {
            salon: salonSeleccionado.nombre,
            fecha: fechaReserva.value,
            servicios: serviciosSeleccionados,
            total: total,
            nombre: nombre,
            apellido: apellido,
            telefono: telefono,
            fechaCreacion: new Date().toISOString()
        };

        guardarReserva(reserva);

        mostrarMensaje(`¡Reserva confirmada! ${nombre} ${apellido}, tu reserva para ${salonSeleccionado.nombre} el ${fechaReserva.value} ha sido registrada. Total: $${total.toLocaleString('es-AR')}.`, 'success');

        formReserva.reset();
        mostrarServicios(servicios);
        actualizarTotal();
    });

    function guardarReserva(reserva) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
    }

    function mostrarMensaje(mensaje, tipo) {
        mensajeReserva.className = `alert alert-${tipo}`;
        mensajeReserva.textContent = mensaje;
        mensajeReserva.style.display = 'block';
        setTimeout(() => {
            mensajeReserva.style.display = 'none';
        }, 5000);
    }

    function actualizarDetallesSalon(salon) {
        salonNombre.textContent = salon.nombre;
        salonDescripcion.textContent = salon.descripción;
        salonDireccion.textContent = `Dirección: ${salon.direccion}`;
        salonPrecio.textContent = `Precio: $${salon.precio}`;
        
        salonResumen.innerHTML = '';
        if (salon.resumen && Array.isArray(salon.resumen)) {
            salon.resumen.forEach(parrafo => {
                const p = document.createElement('p');
                p.textContent = parrafo;
                salonResumen.appendChild(p);
            });
        } else {
            salonResumen.textContent = 'No hay información adicional disponible.';
        }

        salonFooter.textContent = salon.footer_tarjeta || '';

        const imageUrl = salon.portada || (salon.multimedia && salon.multimedia.length > 0
            ? salon.multimedia[0].url
            : 'https://via.placeholder.com/300');
        salonImage.src = imageUrl;
        salonImage.alt = salon.nombre;

        //CARRUSEL SUSPENDIDO XD

        // carouselIndicators.innerHTML = '';
        // carouselInner.innerHTML = '';
        // if (salon.multimedia && salon.multimedia.length > 0) { 
        //     salon.multimedia.forEach((img, index) => {
        //         const indicator = document.createElement('button');
        //         indicator.type = 'button';
        //         indicator.dataset.bsTarget = '#carouselExampleIndicators';
        //         indicator.dataset.bsSlideTo = index;
        //         if (index === 0) indicator.className = 'active';
        //         indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        //         carouselIndicators.appendChild(indicator);

        //         const carouselItem = document.createElement('div');
        //         carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        //         carouselItem.innerHTML = `<img src="${img.url}" class="d-block w-100" alt="${img.descripcion}">`;
        //         carouselInner.appendChild(carouselItem);
        //     });
        // } else {
        //     carouselInner.innerHTML = '<div class="carousel-item active"><img src="https://via.placeholder.com/300" class="d-block w-100" alt="No hay imágenes disponibles"></div>';
        //     carouselIndicators.innerHTML = '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';
        // }
    }

    function mostrarServicios(servicios) {
        serviciosContainer.innerHTML = '';
        servicios.forEach(serv => {
            const servicioDiv = document.createElement('div');
            servicioDiv.className = 'mb-3';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `servicio-${serv.ID_servicio}`;
            checkbox.className = 'form-check-input';
            checkbox.dataset.precioBase = serv.precio;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.className = 'form-check-label';
            label.textContent = `${serv.descripción} - $${serv.precio}`;

            if (serv.descripción.toLowerCase().includes('personas extra')) {
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.min = '0';
                quantityInput.max = '30';
                quantityInput.value = '0';
                quantityInput.className = 'form-control w-25 d-inline-block ms-2';
                quantityInput.addEventListener('input', () => {
                    checkbox.dataset.cantidad = checkbox.checked ? (parseInt(quantityInput.value) || 0) : 0;
                    actualizarTotal();
                });
                checkbox.addEventListener('change', () => {
                    checkbox.dataset.cantidad = checkbox.checked ? (parseInt(quantityInput.value) || 0) : 0;
                    actualizarTotal();
                });
                label.appendChild(quantityInput);
                label.appendChild(document.createTextNode(' personas'));
                checkbox.dataset.cantidad = 0;
            } else if (serv.descripción.toLowerCase().includes('catering (por persona)')) {
                checkbox.dataset.cantidad = personasPorDefecto;
            } else {
                checkbox.dataset.cantidad = '1';
            }

            checkbox.addEventListener('change', actualizarTotal);

            servicioDiv.appendChild(checkbox);
            servicioDiv.appendChild(label);
            serviciosContainer.appendChild(servicioDiv);
        });
    }

    salonSelect.addEventListener('change', () => {
        const selected = salones.find(s => (s.ID || s.id_salon) === salonSelect.value);
        precioBase = parseInt(selected.precio);
        actualizarDetallesSalon(selected);
        actualizarTotal();
    });

    function actualizarTotal() {
        let total = precioBase;
        let personasExtra = 0;

        document.querySelectorAll('#servicios-container input[type="checkbox"]').forEach(cb => {
            if (cb.checked) {
                const precioBase = parseInt(cb.dataset.precioBase);
                let cantidad = parseInt(cb.dataset.cantidad || '1');
                
                if (cb.id.includes('servicio-0F123A')) {
                    personasExtra = cantidad;
                }
                
                if (cb.id.includes('servicio-0F123B')) {
                    cantidad = personasPorDefecto + personasExtra;
                }
                
                total += precioBase * cantidad;
            }
        });
        
        totalEl.textContent = total.toLocaleString('es-AR');
    }
});