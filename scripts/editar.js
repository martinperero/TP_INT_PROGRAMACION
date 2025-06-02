document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    function cargarDatos(callback) {
        let salones = JSON.parse(localStorage.getItem('salones'));

        if (salones && salones.length > 0) {
            callback(salones);
        } else {
            fetch('base_de_datos.json')
                .then(response => {
                    if (!response.ok) throw new Error('No se pudo cargar el JSON');
                    return response.json();
                })
                .then(data => {
                    salones = data.salones;
                    localStorage.setItem('salones', JSON.stringify(salones));
                    callback(salones);
                })
                .catch(error_json => {
                    console.error('Error cargando JSON:', error_json);
                    alert('No se pudo cargar la base de datos');
                });
        }
    }

    cargarDatos(salones => {
        const salon = salones.find(s => s.id_salon === id);

        if (!salon) {
            alert('Salón no encontrado');
            window.location.href = 'tabla.html';
            return;
        }

        document.getElementById('id').value = salon.id_salon;
        document.getElementById('nombre').value = salon.nombre;
        document.getElementById('portada').value = salon.portada || '';
        document.getElementById('descripcion').value = salon.descripcion;
        document.getElementById('direccion').value = salon.direccion;
        document.getElementById('estado').value = salon.estado;
        document.getElementById('precio').value = salon.precio;


        document.getElementById('formEditar').addEventListener('submit', e => {
            e.preventDefault();
        
            const tabla = salones.findIndex(s => s.id_salon === id);
            if (tabla !== -1) {
                salones[tabla].nombre = document.getElementById('nombre').value;
                salones[tabla].portada = document.getElementById('portada').value.trim();
                salones[tabla].descripcion = document.getElementById('descripcion').value;
                salones[tabla].direccion = document.getElementById('direccion').value;
                salones[tabla].estado = document.getElementById('estado').value;
                salones[tabla].precio = parseFloat(document.getElementById('precio').value);
                localStorage.setItem('salones', JSON.stringify(salones));
                alert('Salón editado');
                window.location.href = 'tabla.html';
            }
        });
    });
});