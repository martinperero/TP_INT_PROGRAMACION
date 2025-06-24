function buscarEnTablaUsers() {

    let input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("buscar_usuarios");
    if (!input) {
        console.error("No se encontró el elemento de entrada de búsqueda.");
        return;
    }
    filter = input.value.toLowerCase();
    table = document.getElementById("tabla_datos_usuario");
    if (!table) {
        console.error("No se encontró la tabla con el ID 'tabla_datos_usuario'.");
        return;
    }
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].classList.remove("hidden");

        let rowFound = false;
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().includes(filter)) {
                    rowFound = true;
                    break;
                }
            }
        }

        if (!rowFound) {
            tr[i].classList.add("hidden");
        }
    }
}