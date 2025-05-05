document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('userTableBody');
    const form = document.getElementById('equipo-form');
    const btnToggleForm = document.getElementById('btn-toggle-form');
    const overlay = document.getElementById('overlay');
    const formulario = document.querySelector('.formulario');
    const closeFormBtns = [document.getElementById('btn-close-form'), document.getElementById('close-form')];

    let editando = false;
    let idEditando = null;

    const cargarTiposEquipos = async () => {
        try {
            const res = await fetch('/api/tipos-equipos', { cache: 'no-store' }); // Evitar caché para siempre obtener la última información
            if (!res.ok) {
                console.error('Error al cargar tipos de equipos:', res.status);
                return;
            }
            const tipos = await res.json();
            tableBody.innerHTML = '';
            tipos.forEach(tipo => {
                const row = `
                    <tr>
                        <td>${tipo.Id_Tipo_Equipos}</td>
                        <td>${tipo.Nombre_Equipo}</td>
                        <td>
                            <button class="btn btn-sm btn-primary editar" data-id="${tipo.Id_Tipo_Equipos}"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger eliminar" data-id="${tipo.Id_Tipo_Equipos}"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } catch (error) {
            console.error('Error general al cargar tipos de equipos:', error);
        }
    };

    tableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('editar')) {
            const id = e.target.dataset.id;
            try {
                const res = await fetch(`/api/tipos-equipos/${id}`);
                if (!res.ok) {
                    console.error('Error al obtener tipo de equipo para editar:', res.status);
                    return;
                }
                const tipo = await res.json();
                document.getElementById('Id_Tipos_Equipos').value = tipo.Id_Tipo_Equipos;
                document.getElementById('Nombre_Equipo').value = tipo.Nombre_Equipo;
                editando = true;
                idEditando = id;
                formulario.style.display = 'block'; // Usar estilo directo para consistencia
                overlay.style.display = 'block';   // Usar estilo directo para consistencia
                document.body.classList.add("form-open"); // Mantener la clase para el overlay
            } catch (error) {
                console.error('Error al obtener datos para editar:', error);
            }
        }

        if (e.target.classList.contains('eliminar')) {
            const id = e.target.dataset.id;
            if (confirm('¿Desea eliminar este tipo de equipo?')) {
                try {
                    const res = await fetch(`/api/tipos-equipos/${id}`, { method: 'DELETE' });
                    if (!res.ok) {
                        console.error('Error al eliminar tipo de equipo:', res.status);
                        return;
                    }
                    cargarTiposEquipos();
                } catch (error) {
                    console.error('Error al eliminar tipo de equipo:', error);
                }
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('Nombre_Equipo').value;
        const idTipoEquipoInput = document.getElementById('Id_Tipos_Equipos');
        const idTipoEquipo = idTipoEquipoInput.value;

        try {
            let res;
            if (editando) {
                res = await fetch(`/api/tipos-equipos/${idEditando}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Nombre_Equipo: nombre })
                });
            } else {
                res = await fetch('/api/tipos-equipos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Nombre_Equipo: nombre })
                });
            }

            if (!res.ok) {
                const errorMessage = await res.text();
                console.error('Error al guardar tipo de equipo:', res.status, errorMessage);
                alert(`Error al guardar: ${errorMessage}`);
                return;
            }

            form.reset();
            editando = false;
            idEditando = null;
            formulario.style.display = 'none';
            overlay.style.display = 'none';
            document.body.classList.remove("form-open");
            cargarTiposEquipos();
        } catch (error) {
            console.error('Error general al enviar el formulario:', error);
            alert('Ocurrió un error al guardar el tipo de equipo.');
        }
    });

    btnToggleForm.addEventListener('click', () => {
        formulario.style.display = 'block';
        overlay.style.display = 'block';
        document.body.classList.add("form-open");
        form.reset();
        editando = false;
        document.getElementById('Id_Tipos_Equipos').value = ''; // Limpiar el ID al crear nuevo
        // Si el ID debe ser auto-incrementado por el backend, asegúrate de que el campo esté readonly al crear.
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

    cargarTiposEquipos();
});