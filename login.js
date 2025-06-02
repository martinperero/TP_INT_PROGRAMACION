/*


document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const clave = document.getElementById('clave').value.trim();

    try {
        const response = await fetch('base_de_datos.json');
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        const data = await response.json();
        const usuario = data.usuarios.find(user =>

            user.nombre.toLowerCase() === nombre.toLowerCase() &&
            user.correo.toLowerCase() === correo.toLowerCase() &&

            user.PIN === clave
        );

        if (usuario) {


            alert('¡Inicio de sesión exitoso! Bienvenido, ' + usuario.nombre);
        } else {

            alert('Error: Nombre, correo o contraseña incorrectos.');
        }
    } catch (error) {

        console.error('Error:',   error) ;
        alert('Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo.');


    }
});*/
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const clave = document.getElementById('clave').value.trim();

    try {
        const response = await fetch('base_de_datos.json');
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        const data = await response.json();
        const usuario = data.usuarios.find(user =>

            user.nombre.toLowerCase() === nombre.toLowerCase() &&
            user.correo.toLowerCase() === correo.toLowerCase() &&

            user.PIN === clave
        );

        if (usuario) {


            alert('¡Inicio de sesión exitoso! Bienvenido, ' + usuario.nombre);
            localStorage.setItem("usuarioActual", JSON.stringify(usuario));
            window.location.href = "tabla.html";
        } else {

            alert('Error: Nombre, correo o contraseña incorrectos.');
        }
    } catch (error) {

        console.error('Error:',   error) ;
        alert('Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo.');


    }
});
