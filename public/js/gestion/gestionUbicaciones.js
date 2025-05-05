document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('userTableBody');
    const form = document.getElementById('ubicacion-form');
    const btnToggleForm = document.getElementById('btn-toggle-form');
    const overlay = document.getElementById('overlay');
    const formulario = document.querySelector('.formulario');
    const closeFormBtns = [document.getElementById('btn-close-form'), document.getElementById('close-form')];
    const codigoOficinaInput = document.getElementById('Codigo_Oficina'); // Nuevo input

    let editando = false;
    let idEditando = null;

    const cargarUbicaciones = async () => {
        try {
            const res = await fetch('/api/ubicaciones', { cache: 'no-store' });
            if (!res.ok) {
                console.error('Error al cargar ubicaciones:', res.status);
                return;
            }
            const ubicaciones = await res.json();
            tableBody.innerHTML = '';
            ubicaciones.forEach(ubicacion => {
                const row = `
                    <tr>
                        <td>${ubicacion.ID_Oficina}</td>
                        <td>${ubicacion.Codigo_Oficina}</td>
                        <td>${ubicacion.Nombre_Oficina}</td>
                        <td>${ubicacion.Direccion}</td>
                        <td>${ubicacion.Ciudad}</td>
                        <td>
                            <button class="btn btn-sm btn-primary editar" data-id="${ubicacion.ID_Oficina}"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger eliminar" data-id="${ubicacion.ID_Oficina}"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } catch (error) {
            console.error('Error general al cargar ubicaciones:', error);
        }
    };

    tableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('editar')) {
            const id = e.target.dataset.id;
            try {
                const res = await fetch(`/api/ubicaciones/${id}`);
                if (!res.ok) {
                    console.error('Error al obtener ubicación para editar:', res.status);
                    return;
                }
                const ubicacion = await res.json();
                document.getElementById('ID_Oficina').value = ubicacion.ID_Oficina;
                codigoOficinaInput.value = ubicacion.Codigo_Oficina; // Llenar el nuevo campo
                document.getElementById('Nombre_Oficina').value = ubicacion.Nombre_Oficina;
                document.getElementById('Direccion').value = ubicacion.Direccion;
                document.getElementById('Ciudad').value = ubicacion.Ciudad;
                editando = true;
                idEditando = id;
                formulario.style.display = 'block';
                overlay.style.display = 'block';
                document.body.classList.add("form-open");
            } catch (error) {
                console.error('Error al obtener datos para editar:', error);
            }
        }

        if (e.target.classList.contains('eliminar')) {
            const id = e.target.dataset.id;
            if (confirm('¿Desea eliminar esta ubicación?')) {
                try {
                    const res = await fetch(`/api/ubicaciones/${id}`, { method: 'DELETE' });
                    if (!res.ok) {
                        console.error('Error al eliminar ubicación:', res.status);
                        return;
                    }
                    cargarUbicaciones();
                } catch (error) {
                    console.error('Error al eliminar ubicación:', error);
                }
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const codigoOficina = codigoOficinaInput.value; // Obtener el valor del nuevo campo
        const nombreOficina = document.getElementById('Nombre_Oficina').value;
        const direccion = document.getElementById('Direccion').value;
        const ciudad = document.getElementById('Ciudad').value;

        try {
            let res;
            const data = { Codigo_Oficina: codigoOficina, Nombre_Oficina: nombreOficina, Direccion: direccion, Ciudad: ciudad };
            if (editando) {
                res = await fetch(`/api/ubicaciones/${idEditando}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                res = await fetch('/api/ubicaciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (!res.ok) {
                const errorMessage = await res.text();
                console.error('Error al guardar ubicación:', res.status, errorMessage);
                alert(`Error al guardar: ${errorMessage}`);
                return;
            }

            form.reset();
            editando = false;
            idEditando = null;
            formulario.style.display = 'none';
            overlay.style.display = 'none';
            document.body.classList.remove("form-open");
            cargarUbicaciones();
        } catch (error) {
            console.error('Error general al enviar el formulario:', error);
            alert('Ocurrió un error al guardar la ubicación.');
        }
    });

    btnToggleForm.addEventListener('click', () => {
        formulario.style.display = 'block';
        overlay.style.display = 'block';
        document.body.classList.add("form-open");
        form.reset();
        editando = false;
        document.getElementById('ID_Oficina').value = '';
        codigoOficinaInput.value = ''; // Limpiar el nuevo campo al crear nuevo
    });

    closeFormBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formulario.style.display = 'none';
            overlay.style.display = 'none';
            document.body.classList.remove("form-open");
            editando = false;
            idEditando = null;
            form.reset();
        });
    });

    cargarUbicaciones();
});