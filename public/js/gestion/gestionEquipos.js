document.addEventListener('DOMContentLoaded', () => {
    const btnToggleForm = document.getElementById('btn-toggle-form');
    const formulario = document.querySelector('.formulario');
    const overlay = document.getElementById('overlay');
    const closeFormButton = document.getElementById('close-form');
    const btnCloseForm = document.getElementById('btn-close-form');
    const equipoForm = document.getElementById('equipo-form');
    const equipoTableBody = document.getElementById('equipoTableBody');
    const searchInput = document.getElementById('searchInput');

    // Cargar datos para los selectores
    const cargarSelectores = async () => {
        await cargarOpciones('/api/tipos-equipo/select', 'Id_Tipo_Equipos');
        await cargarOpciones('/api/estados-equipo/select', 'Id_Estado_Equipo');
        await cargarOpciones('/api/oficinas/select', 'Id_Oficina');
        await cargarOpciones('/api/usuarios/select', 'Id_Usuario');
    };

    const cargarOpciones = async (url, selectId) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const selectElement = document.getElementById(selectId);
            selectElement.innerHTML = '<option value="" disabled selected>Seleccionar</option>';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[Object.keys(item)[0]]; // Suponiendo que el ID es la primera propiedad
                option.textContent = item[Object.keys(item)[1]]; // Suponiendo que el nombre es la segunda propiedad
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error(`Error al cargar opciones para ${selectId}:`, error);
        }
    };

    // Cargar la lista de equipos
    const cargarEquipos = async () => {
        try {
            const response = await fetch('/api/equipos/data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Respuesta del servidor (/api/equipos/data):', data); // Log para ver la respuesta de la tabla
            mostrarEquipos(data);
        } catch (error) {
            console.error('Error al cargar la lista de equipos:', error);
        }
    };

    const mostrarEquipos = (equipos) => {
        equipoTableBody.innerHTML = '';
        equipos.forEach(equipo => {
            const row = equipoTableBody.insertRow();
            row.insertCell().textContent = equipo.Tipo_Equipo;
            row.insertCell().textContent = equipo.Activo;
            row.insertCell().textContent = equipo.Marca;
            row.insertCell().textContent = equipo.Modelo;
            row.insertCell().textContent = equipo.Id_Serie;
            row.insertCell().textContent = equipo.Descripcion;
            row.insertCell().textContent = equipo.Fecha_Asignacion ? new Date(equipo.Fecha_Asignacion).toLocaleDateString() : '';
            row.insertCell().textContent = equipo.Tipo_Almacenamiento;
            row.insertCell().textContent = equipo.Espacio_Almacenamiento;
            row.insertCell().textContent = equipo.Direccion_Ip;
            row.insertCell().textContent = equipo.Estado_Equipo;
            row.insertCell().textContent = equipo.Oficina;
            row.insertCell().textContent = equipo.Usuario_Asignado || 'Sin asignar';
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn btn-sm btn-primary btn-editar" data-id="${equipo.Id_Tipo_Equipo}"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${equipo.Id_Tipo_Equipo}"><i class="fa fa-trash"></i></button>
            `;
        });
        agregarEventListenersTabla();
    };

    const agregarEventListenersTabla = () => {
        document.querySelectorAll('.btn-editar').forEach(button => {
            button.addEventListener('click', editarEquipo);
        });
        document.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', eliminarEquipo);
        });
    };

    const mostrarFormulario = () => {
        formulario.style.display = 'block';
        overlay.style.display = 'block';
    };

    const ocultarFormulario = () => {
        formulario.style.display = 'none';
        overlay.style.display = 'none';
        equipoForm.reset();
        document.getElementById('Id_Tipo_Equipo').value = ''; // Limpiar el ID oculto
    };

    btnToggleForm.addEventListener('click', () => {
        mostrarFormulario();
        document.querySelector('.form_title').textContent = 'Registro de Equipo';
    });

    closeFormButton.addEventListener('click', ocultarFormulario);
    btnCloseForm.addEventListener('click', ocultarFormulario);
    overlay.addEventListener('click', ocultarFormulario);

    equipoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(equipoForm);
        const equipoData = Object.fromEntries(formData.entries());
        const idEquipo = document.getElementById('Id_Tipo_Equipo').value;
        const method = idEquipo ? 'PUT' : 'POST';
        const url = idEquipo ? `/gestionEquipos/${idEquipo}` : '/gestionEquipos';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(equipoData)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error al guardar equipo:', error);
                alert(`Error al guardar equipo: ${error.mensaje || 'Error desconocido'}`);
                return;
            }

            const result = await response.json();
            console.log('Respuesta del servidor (creación/edición):', result); // <-- LOG PARA VER LA RESPUESTA
            alert(result.mensaje);
            ocultarFormulario();
            cargarEquipos();
        } catch (error) {
            console.error('Error de red al guardar equipo:', error);
            alert('Error de red al guardar equipo.');
        }
    });

    const editarEquipo = async (event) => {
        const id = event.target.closest('.btn-editar').dataset.id;
        mostrarFormulario();
        document.querySelector('.form_title').textContent = 'Editar Equipo';
        try {
            const response = await fetch(`/api/equipos/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const equipo = await response.json();
            document.getElementById('Id_Tipo_Equipo').value = equipo.Id_Tipo_Equipo;
            document.getElementById('Activo').value = equipo.Activo;
            document.getElementById('Id_Tipo_Equipos').value = equipo.Id_Tipo_Equipos;
            document.getElementById('Marca').value = equipo.Marca;
            document.getElementById('Modelo').value = equipo.Modelo;
            document.getElementById('Id_Serie').value = equipo.Id_Serie;
            document.getElementById('Descripcion').value = equipo.Descripcion;
            document.getElementById('Fecha_Asignacion').value = equipo.Fecha_Asignacion ? equipo.Fecha_Asignacion.split('T')[0] : '';
            document.getElementById('Tipo_Almacenamiento').value = equipo.Tipo_Almacenamiento;
            document.getElementById('Espacio_Almacenamiento').value = equipo.Espacio_Almacenamiento;
            document.getElementById('Direccion_Ip').value = equipo.Direccion_Ip;
            document.getElementById('Id_Estado_Equipo').value = equipo.Id_Estado_Equipo;
            document.getElementById('Id_Oficina').value = equipo.Id_Oficina;
            document.getElementById('Id_Usuario').value = equipo.Id_Usuario || '';
        } catch (error) {
            console.error('Error al obtener datos del equipo para editar:', error);
            alert('Error al obtener datos del equipo para editar.');
            ocultarFormulario();
        }
    };

    const eliminarEquipo = async (event) => {
        const id = event.target.closest('.btn-eliminar').dataset.id;
        if (confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
            try {
                const response = await fetch(`/gestionEquipos/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    const error = await response.json();
                    console.error('Error al eliminar equipo:', error);
                    alert(`Error al eliminar equipo: ${error.mensaje || 'Error desconocido'}`);
                    return;
                }
                const result = await response.json();
                alert(result.mensaje);
                cargarEquipos();
            } catch (error) {
                console.error('Error de red al eliminar equipo:', error);
                alert('Error de red al eliminar equipo.');
            }
        }
    };

    searchInput.addEventListener('input', (event) => {
        const textoBusqueda = event.target.value.toLowerCase();
        const filas = equipoTableBody.querySelectorAll('tr');
        filas.forEach(fila => {
            let encontrado = false;
            fila.querySelectorAll('td').forEach(celda => {
                if (celda.textContent.toLowerCase().includes(textoBusqueda)) {
                    encontrado = true;
                }
            });
            fila.style.display = encontrado ? '' : 'none';
        });
    });

    // Cargar selectores y la tabla al cargar la página
    cargarSelectores();
    cargarEquipos();
});