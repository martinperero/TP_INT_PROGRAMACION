document.addEventListener('DOMContentLoaded', () => {
    // Verifica si el usuario es admin
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'admin') {
        alert('No tienes permisos para agregar salones.');
        window.location.href = 'tabla.html'; 
        return;
    }

    
    document.getElementById("form_agregar_salon").addEventListener("submit", function (e) {
        e.preventDefault();

        const salones = JSON.parse(localStorage.getItem("salones")) || [];

        const nuevoSalon = {
            id_salon: document.getElementById("id_salon").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            portada: document.getElementById("portada").value.trim(),
            resumen: document.getElementById("resumen").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            direccion: document.getElementById("direccion").value.trim(),
            estado: "Disponible",
            precio: document.getElementById("precio").value.trim(),
            footer_tarjeta: document.getElementById("footer_tarjeta").value.trim(),
            multimedia: []
        };

        if (nuevoSalon.id_salon && nuevoSalon.nombre && nuevoSalon.descripcion && nuevoSalon.direccion) {
            salones.push(nuevoSalon);
            localStorage.setItem("salones", JSON.stringify(salones));
            alert("Salón agregado correctamente.");
            window.location.href = 'tabla.html';
        } else {
            alert("Los campos ID, Nombre, Descripción y Dirección son obligatorios.");
        }
    });
});