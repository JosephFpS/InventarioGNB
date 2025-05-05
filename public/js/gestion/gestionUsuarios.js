document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('user-form');
    const userTableBody = document.getElementById('userTableBody');
    const toggleFormBtn = document.getElementById('btn-toggle-form');
    const closeFormBtn = document.getElementById('btn-close-form');
    const formulario = document.querySelector('.formulario');
    const selectRol = document.getElementById('ID_Rol');
    const searchInput = document.getElementById('searchInput');
    const overlay = document.getElementById('overlay');
    const passwordGroup = document.getElementById('password-group');
    const inputContrasena = document.getElementById('Contraseña');

    // Elementos para el Toast de error
    const toastErrorEl = document.getElementById('toastError');
    const toastErrorBody = document.getElementById('toastErrorBody');
    const toastError = bootstrap.Toast.getOrCreateInstance(toastErrorEl);

    let modoEdicion = false;
    let usuarioEditando = null;

    const cargarRoles = async (idRol = '') => {
        try {
            const res = await fetch('/api/roles');
            console.log('Respuesta al cargar roles:', res);
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error al cargar roles:', res.status, errorText);
                alert(`Error al cargar roles: ${res.status} - ${errorText}`);
                return;
            }
            const roles = await res.json();
            console.log('Roles cargados:', roles);
            selectRol.innerHTML = '<option value="" disabled selected>Seleccione un rol</option>';
            roles.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.ID_Rol;
                option.textContent = rol.Tipo_De_Rol;
                if (rol.ID_Rol == idRol) option.selected = true;
                selectRol.appendChild(option);
                console.log('Opción agregada:', option);
            });
        } catch (err) {
            console.error('Error general al cargar roles:', err);
            alert('No se pudieron cargar los roles. Verifica la conexión.');
        }
    };

    const cargarUsuarios = () => {
        fetch('/api/usuarios/data', { cache: "no-store" })
            .then(res => {
                if (!res.ok) {
                    console.error('Error al cargar usuarios:', res.status);
                    alert('Error al cargar usuarios. Por favor, revisa la consola.');
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Usuarios cargados:', data);
                if (!Array.isArray(data)) {
                    console.error('Respuesta inesperada de /gestionUsuarios:', data);
                    alert('Error cargando usuarios. Revisa la consola.');
                    return;
                }

                userTableBody.innerHTML = '';
                data.forEach(usuario => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${usuario.Nombres_Usuario}</td>
                        <td>${usuario.Usuario_De_Red}</td>
                        <td>${usuario.Correo}</td>
                        <td>${usuario.Nombre_Rol}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-btn" data-id="${usuario.ID_Usuario}"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${usuario.ID_Usuario}"><i class="fa fa-trash"></i></button>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error('Error general al cargar usuarios:', err);
            });
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const idUsuario = document.getElementById('ID_Usuario').value;
        const url = modoEdicion ? `/gestionUsuarios/${idUsuario}` : '/gestionUsuarios';
        const method = modoEdicion ? 'PUT' : 'POST';

        delete data.Cédula;

        if (!modoEdicion && !data.Contraseña) {
            alert('La contraseña es requerida para crear un nuevo usuario.');
            return;
        }

        if (modoEdicion && !data.Contraseña) {
            delete data.Contraseña;
        }

        console.log('Enviando petición:', method, url);
        console.log('Datos a enviar:', data);

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            console.log('Respuesta recibida:', res);

            if (res.ok) {
                const responseData = await res.json();
                console.log('Datos de la respuesta:', responseData);
                alert(responseData.mensaje);
                form.reset();
                formulario.style.display = 'none';
                overlay.style.display = 'none';
                document.body.classList.remove("form-open");
                cargarUsuarios();
                modoEdicion = false;
                usuarioEditando = null;
            } else {
                const errorData = await res.json();
                console.error('Error en la solicitud:', res.status, errorData);
                if (res.status === 409) {
                    toastErrorBody.textContent = errorData.error;
                    toastError.show();
                } else {
                    alert(`Error en la solicitud: ${res.status} - ${errorData.error || 'Error desconocido'}`);
                }
            }

        } catch (err) {
            console.error('Error general al enviar formulario:', err);
            alert('Hubo un problema al registrar o actualizar el usuario.');
        }
    });


    toggleFormBtn.addEventListener('click', () => {
        cargarRoles();
        formulario.style.display = 'block';
        overlay.style.display = 'block';
        form.reset();
        modoEdicion = false;
        usuarioEditando = null;
        document.body.classList.add("form-open");
        passwordGroup.style.display = 'block';
        inputContrasena.value = '';
        document.getElementById('ID_Usuario').value = '';
    });

    closeFormBtn.addEventListener('click', () => {
        formulario.style.display = 'none';
        overlay.style.display = 'none';
        document.body.classList.remove("form-open");
        passwordGroup.style.display = 'block';
    });

    userTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            try {
                const res = await fetch(`/usuarios/${id}`);
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Error al obtener usuario para editar:', res.status, errorText);
                    alert(`Error al obtener usuario para editar: ${res.status} - ${errorText}`);
                    return;
                }
                const usuario = await res.json();
                document.getElementById('ID_Usuario').value = usuario.ID_Usuario;
                document.getElementById('Nombres_Usuario').value = usuario.Nombres_Usuario;
                document.getElementById('Usuario_De_Red').value = usuario.Usuario_De_Red;
                document.getElementById('Correo').value = usuario.Correo;
                document.getElementById('Contraseña').value = '';
                await cargarRoles(usuario.ID_Rol);
                formulario.style.display = 'block';
                overlay.style.display = 'block';
                modoEdicion = true;
                usuarioEditando = usuario.ID_Usuario;
                document.body.classList.add("form-open");
                passwordGroup.style.display = 'none';
            } catch (err) {
                console.error('Error general al obtener usuario para editar:', err);
                alert('Hubo un problema al cargar los datos del usuario para editar.');
            }
        }

        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                try {
                    const res = await fetch(`/gestionUsuarios/${id}`, {
                        method: 'DELETE'
                    });

                    console.log('Respuesta al eliminar usuario:', res);

                    if (!res.ok) {
                        const errorText = await res.text();
                        console.error('Error al eliminar usuario:', res.status, errorText);
                        alert(`Error al eliminar usuario: ${res.status} - ${errorText}`);
                        return;
                    }

                    const responseData = await res.json();
                    console.log('Datos de la respuesta de eliminación:', responseData);
                    alert(responseData.mensaje || 'Usuario eliminado correctamente.');
                    cargarUsuarios();
                } catch (err) {
                    console.error('Error general al eliminar usuario:', err);
                    alert('Hubo un problema al eliminar el usuario.');
                }
            }
        }
    });

    searchInput.addEventListener('input', () => {
        const filtro = searchInput.value.toLowerCase();
        const filas = userTableBody.getElementsByTagName('tr');
        Array.from(filas).forEach(fila => {
            const texto = fila.innerText.toLowerCase();
            fila.style.display = texto.includes(filtro) ? '' : 'none';
        });
    });

    cargarUsuarios();
    cargarRoles();
});