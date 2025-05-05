document.addEventListener('DOMContentLoaded', () => {
    const historialMovimientosTableBody = document.getElementById('historialMovimientosTableBody');
    const searchInput = document.getElementById('searchInput');

    // Función para cargar el historial de movimientos desde el backend
    const cargarHistorialMovimientos = async () => {
        try {
            const response = await fetch('/api/reportes/historial-movimientos'); // <-- CAMBIA LA RUTA AQUÍ
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            mostrarHistorialMovimientos(data);
        } catch (error) {
            console.error('Error al cargar el historial de movimientos:', error);
            historialMovimientosTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Error al cargar el historial.</td></tr>`;
        }
    };

    // Función para mostrar el historial de movimientos en la tabla
    const mostrarHistorialMovimientos = (historial) => {
        historialMovimientosTableBody.innerHTML = '';
    
        if (historial.length === 0) {
            historialMovimientosTableBody.innerHTML = `<tr><td colspan="8" class="text-center">No se encontraron movimientos.</td></tr>`;
            return;
        }
    
        historial.forEach(movimiento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(movimiento.Fecha_Movimiento).toLocaleDateString()}</td>
                <td>${movimiento.Tipo_Movimiento}</td>
                <td>${movimiento.ActivoEquipo || 'N/A'}</td>
                <td>${movimiento.TipoEquipo || 'N/A'}</td> 
                <td>${movimiento.UsuarioInvolucrado || 'N/A'}</td>
                <td>${movimiento.UbicacionAnterior || 'N/A'}</td>
                <td>${movimiento.NuevaUbicacion || 'N/A'}</td>
                <td>${movimiento.Descripcion || 'N/A'}</td>
            `;
            historialMovimientosTableBody.appendChild(row);
        });
    };

    // Evento para la búsqueda en tiempo real
    searchInput.addEventListener('input', () => {
        const filtro = searchInput.value.toLowerCase();
        const filas = historialMovimientosTableBody.getElementsByTagName('tr');

        Array.from(filas).forEach(fila => {
            const textoFila = fila.textContent.toLowerCase();
            fila.style.display = textoFila.includes(filtro) ? '' : 'none';
        });
    });

    // Cargar el historial de movimientos al cargar la página
    cargarHistorialMovimientos();
});