document.getElementById("agregar").addEventListener("click", function () {
    const salones = JSON.parse(localStorage.getItem("salones")) || [];

    const nuevoSalon = {
        id_salon: prompt("ID del salón:"),
        nombre: prompt("Nombre:"),
        portada: prompt("URL portada:"),
        resumen: prompt("Resumen:"),
        descripcion: prompt("Descripción:"),
        direccion: prompt("Dirección:"),
        estado: "Disponible",
        precio: prompt("Precio:"),
        footer_tarjeta: prompt("Footer tarjeta:"),
        multimedia: []
    };

    if (nuevoSalon.id_salon && nuevoSalon.nombre && nuevoSalon.descripcion && nuevoSalon.direccion) {
        salones.push(nuevoSalon);
        localStorage.setItem("salones", JSON.stringify(salones));
        alert("Salón agregado correctamente.");
        location.reload();
    } else {
        alert("Los campos ID, Nombre, Descripción y Dirección son obligatorios.");
    }
});