// Función para capturar el evento en los botones "Más información"
function capturarEvento() {
    document.querySelectorAll(".mas-info").forEach(button => {
        button.addEventListener("click", () => {
            const salonId = button.getAttribute("data-id"); // Obtiene el ID del salón
            localStorage.setItem("salonSeleccionado", salonId); // Guarda el ID en localStorage
            window.location.href = "plantilla_salones.html"; // Redirige a la plantilla
        });
    });
}

//Funcion para crear el catalogo de forma dinamica
function crearCatalogo() {
    fetch("base_de_datos.json")
        .then(response => response.json())
        .then(data => {
            const catalogoContainer = document.getElementById("tarjetas_desktop");
            if (!catalogoContainer) {
                console.error("No se encontró el contenedor del catálogo.");
                return;
            }
            catalogoContainer.innerHTML = ''; // Limpia el contenedor antes de añadir

            let allSalones = data.salones; // Salones desde el JSON
            const salonesLocalStorage = JSON.parse(localStorage.getItem("salones")) || []; // Salones desde localStorage

            // Combina los salones del JSON y localStorage
            let combinedSalones = allSalones.concat(salonesLocalStorage);

            //evitar repeticiones
            const uniqueSalones = [];
            const seenIds = new Set();

            combinedSalones.forEach(salon => {
                if (salon.id_salon && !seenIds.has(salon.id_salon)) {
                    uniqueSalones.push(salon);
                    seenIds.add(salon.id_salon);
                } else if (!salon.id_salon) {
                    console.warn("Salón sin 'id_salon' encontrado, no será renderizado:", salon);
                }
            });

            uniqueSalones.forEach(salon => {
                const card = document.createElement("div");
                card.classList.add("card", "desktop", "d-flex", "flex-column", "color_card");

                const img = document.createElement("img");
                img.src = salon.portada || "imagen_default.jpg";
                img.classList.add("card-img-top", "img_card");
                img.alt = salon.nombre || "Imagen de salón";

                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                const title = document.createElement("h5");
                title.classList.add("card-title");
                title.textContent = salon.nombre || "Nombre Desconocido";

                const description = document.createElement("p");
                description.classList.add("card-text");
                description.textContent = salon.descripcion || "Descripción no disponible.";

                const button = document.createElement("button");
                button.classList.add("btn", "btn-primary", "mas-info", "boton_card");
                button.setAttribute("data-id", salon.id_salon);
                button.textContent = "Más información";

                cardBody.appendChild(title);
                cardBody.appendChild(description);
                // Solo añadir el botón si el id_salon existe para evitar errores
                if (salon.id_salon) {
                    cardBody.appendChild(button);
                }

                card.appendChild(img);
                card.appendChild(cardBody);

                catalogoContainer.appendChild(card);
            });

            // Llama a capturarEvento() UNA SOLA VEZ, DESPUÉS de que todas las tarjetas se han añadido al DOM
            capturarEvento();
        })
        .catch(error => console.error("Error cargando JSON o salones de localStorage:", error));
}


// Función para cargar los datos del salón en la plantilla
function cargarSalon() {
    const salonId = localStorage.getItem("salonSeleccionado");

    if (!salonId) {
        console.error("No se encontró el ID del salón en localStorage.");
        return;
    }

    fetch("base_de_datos.json")
        .then(response => response.json())
        .then(data => {
            const salon = data.salones.find(s => s.id_salon === salonId);

            if (!salon) {
                //console.error("No se encontró un salón con el ID:", salonId);
                const salonesLocal = JSON.parse(localStorage.getItem("salones") || "[]");
                const salonLocal = salonesLocal.find(s => s.id_salon === salonId);
                console.log("Salón encontrado:", salonLocal);
                let nombreSalon = document.getElementById("nombre_salon");
                nombreSalon.textContent = `Bienvenidos a ${salonLocal.nombre}`;
                let imgPrincipal = document.getElementById("imagen_salon");
                imgPrincipal.src = salonLocal.portada || "imagen_default.jpg";
                let resumenTarjeta = document.getElementById("salon_resumen");
                resumenTarjeta.classList.add("fs-5")
                resumenTarjeta.textContent = `${salonLocal.descripcion}`;
                const carouselInner = document.querySelector(".carousel-inner");
                const carouselIndicators = document.querySelector(".carousel-indicators");
                const carouselElement = document.getElementById("carouselExampleIndicators");
                const lista_imglocales = ["https://res.cloudinary.com/dmroa1p5p/image/upload/v1748733717/4-escape-room_wxchy4.webp","https://res.cloudinary.com/dmroa1p5p/image/upload/v1748733718/7-escape-room_njk4d5.webp","https://res.cloudinary.com/dmroa1p5p/image/upload/v1748733717/3-escape-room_hh8vcf.webp","https://res.cloudinary.com/dmroa1p5p/image/upload/v1748733717/2-escape-room_ybjq8t.webp", "https://res.cloudinary.com/dmroa1p5p/image/upload/v1748733717/6-escape-room_d5ihuu.webp", "https://res.cloudinary.com/dmroa1p5p/image/upload/v1748733717/1-escape-room_dinjsa.webp", "https://res.cloudinary.com/dmroa1p5p/image/upload/v1748733717/4-escape-room_wxchy4.webp"];

                if (carouselInner && carouselIndicators && carouselElement) {
                    // Limpiar contenido previo
                    carouselInner.innerHTML = "";
                    carouselIndicators.innerHTML = "";

                    // Crear dinámicamente los ítems
                    lista_imglocales.forEach((media, index) => {
                        // Miniatura
                        const imgIndicator = document.createElement("img");
                        imgIndicator.classList.add("preview-img");
                        imgIndicator.setAttribute("data-bs-target", "#carouselExampleIndicators");
                        imgIndicator.setAttribute("data-bs-slide-to", index);
                        imgIndicator.src = media;
                        if (index === 0) imgIndicator.classList.add("active");
                        carouselIndicators.appendChild(imgIndicator);

                        // Imagen del carrusel
                        const divItem = document.createElement("div");
                        divItem.classList.add("carousel-item");
                        if (index === 0) divItem.classList.add("active");

                        const imgItem = document.createElement("img");
                        imgItem.src = media;
                        imgItem.classList.add("d-block", "w-100");
                        imgItem.alt = media.descripcion || `Imagen ${index + 1}`;

                        divItem.appendChild(imgItem);
                        carouselInner.appendChild(divItem);
                    });

                    // Inicializar carrusel
                    const carouselInstance = new bootstrap.Carousel(carouselElement, {
                        interval: 5000,
                        wrap: true
                    });

                    // Miniaturas
                    document.querySelectorAll(".preview-img").forEach((thumbnail) => {
                        thumbnail.addEventListener("click", (event) => {
                            const slideIndex = event.target.getAttribute("data-bs-slide-to");
                            carouselInstance.to(parseInt(slideIndex));
                        });
                    });

                    // Botones de navegación
                    document.querySelector(".carousel-control-prev")?.addEventListener("click", () => {
                        carouselInstance.prev();
                    });

                    document.querySelector(".carousel-control-next")?.addEventListener("click", () => {
                        carouselInstance.next();
                    });
                    document.getElementById("footer_tarjeta").textContent = salonLocal.footer_tarjeta || "¡Reserva ahora!";
                } else {
                    console.error("Estructura del carrusel no encontrada o datos incompletos.");
                }
                return;
            }

            // Actualizar título
            const nombreSalon = document.getElementById("nombre_salon");
            if (nombreSalon) {
                nombreSalon.textContent = `Bienvenidos a ${salon.nombre}`;
            }

            // Imagen principal
            const imgPrincipal = document.getElementById("imagen_salon");
            if (imgPrincipal) {
                imgPrincipal.src = salon.portada || "imagen_default.jpg";
            }

            // Descripción completa
            const resumenDiv = document.getElementById("salon_resumen");
            if (resumenDiv && Array.isArray(salon.resumen)) {
                resumenDiv.innerHTML = "";
                salon.resumen.forEach(parrafo => {
                    const pElement = document.createElement("p");
                    pElement.classList.add("fs-5");
                    pElement.textContent = parrafo;
                    resumenDiv.appendChild(pElement);
                });
            }
            // Descripción de la tarjeta
            const resumenTarjeta = document.getElementById("descripcion");
            if (resumenTarjeta) {
                resumenTarjeta.textContent = `${salon.descripcion}`;
            }

            // Carrusel
            const carouselInner = document.querySelector(".carousel-inner");
            const carouselIndicators = document.querySelector(".carousel-indicators");
            const carouselElement = document.getElementById("carouselExampleIndicators");

            if (carouselInner && carouselIndicators && carouselElement && Array.isArray(salon.multimedia)) {
                // Limpiar contenido previo
                carouselInner.innerHTML = "";
                carouselIndicators.innerHTML = "";

                // Crear dinámicamente los ítems
                salon.multimedia.forEach((media, index) => {
                    // Miniatura
                    const imgIndicator = document.createElement("img");
                    imgIndicator.classList.add("preview-img");
                    imgIndicator.setAttribute("data-bs-target", "#carouselExampleIndicators");
                    imgIndicator.setAttribute("data-bs-slide-to", index);
                    imgIndicator.src = media.url;
                    if (index === 0) imgIndicator.classList.add("active");
                    carouselIndicators.appendChild(imgIndicator);

                    // Imagen del carrusel
                    const divItem = document.createElement("div");
                    divItem.classList.add("carousel-item");
                    if (index === 0) divItem.classList.add("active");

                    const imgItem = document.createElement("img");
                    imgItem.src = media.url;
                    imgItem.classList.add("d-block", "w-100");
                    imgItem.alt = media.descripcion || `Imagen ${index + 1}`;

                    divItem.appendChild(imgItem);
                    carouselInner.appendChild(divItem);
                });

                // Inicializar carrusel
                const carouselInstance = new bootstrap.Carousel(carouselElement, {
                    interval: 5000,
                    wrap: true
                });

                // Miniaturas
                document.querySelectorAll(".preview-img").forEach((thumbnail) => {
                    thumbnail.addEventListener("click", (event) => {
                        const slideIndex = event.target.getAttribute("data-bs-slide-to");
                        carouselInstance.to(parseInt(slideIndex));
                    });
                });

                // Botones de navegación
                document.querySelector(".carousel-control-prev")?.addEventListener("click", () => {
                    carouselInstance.prev();
                });

                document.querySelector(".carousel-control-next")?.addEventListener("click", () => {
                    carouselInstance.next();
                });
            } else {
                console.error("Estructura del carrusel no encontrada o datos incompletos.");
            }
            const footerTarjeta = document.getElementById("footer_tarjeta");
            if (footerTarjeta && salon.footer_tarjeta) {
                footerTarjeta.textContent = salon.footer_tarjeta;
            }
        })

        .catch(error => console.error("Error cargando JSON:", error));
}
//  función para redirigir a reserva heredando ID, nashe
function redirigirAReserva() {
    console.log("Función redirigirAReserva() ejecutada.");
    const salonId = localStorage.getItem("salonSeleccionado");
    console.log(`ID del salón obtenida para la reserva: ${salonId}`);
    if (salonId) {
        console.log(`Redirigiendo a reserva.html?salon=${salonId}`);
        window.location.href = `reserva.html?salon=${salonId}`;
    } else {
        console.error("No se encontró el ID del salón para la reserva.");
        alert("Error: No se pudo identificar el salón para la reserva.");
    }
}

// Ejecutar funciones cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    capturarEvento();
    crearCatalogo();
    cargarSalon();
});
