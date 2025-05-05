const equiposAdministradosTableBody = document.getElementById('equiposAdministradosTableBody');
const searchInput = document.getElementById('searchInput');

const cargarEquiposAdministrados = async () => {
    try {
        const res = await fetch('/api/vistaConfiguracionEquiposAdministrados', { cache: 'no-store' });
        // if (!res.ok) {
        //     console.error('Error al cargar equipos administrados:', res.status);
        //     return;
        // }
        const equipos = await res.json();
        mostrarEquiposAdministrados(equipos);
    } catch (error) {
        console.error('Error general al cargar equipos administrados:', error);
    }
};

const mostrarEquiposAdministrados = (equipos) => {
    equiposAdministradosTableBody.innerHTML = '';
    equipos.forEach(equipo => {
        const row = equiposAdministradosTableBody.insertRow();
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
        row.insertCell().textContent = equipo.Usuario_Asignado || 'Sin asignar'; // Muestra el usuario al que se asignó
        // Opcional: Mostrar también quién es el administrador
        // row.insertCell().textContent = equipo.Administrador;
    });
};

searchInput.addEventListener('input', function() {
    const textoBusqueda = this.value.toLowerCase();
    const filas = equiposAdministradosTableBody.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        let coincide = false;
        for (let j = 0; j < celdas.length; j++) {
            if (celdas[j].textContent.toLowerCase().includes(textoBusqueda)) {
                coincide = true;
                break;
            }
        }
        filas[i].style.display = coincide ? '' : 'none';
    }
});

document.addEventListener('DOMContentLoaded', cargarEquiposAdministrados);