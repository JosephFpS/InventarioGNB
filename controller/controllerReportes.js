const getConnection = require('../conexion/conexion');
const sql = require('mssql'); // Necesario para los tipos
const controllerReportes = {};

controllerReportes.obtenerHistorialMovimientos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT
                    hm.Fecha_Movimiento,
                    hm.Tipo_Movimiento,
                    e.Activo AS ActivoEquipo,
                    te.Nombre_Equipo AS TipoEquipo, -- Incluyendo el nombre del tipo de equipo
                    u.Nombres_Usuario AS UsuarioInvolucrado,
                    ua.Nombre_Oficina AS UbicacionAnterior,
                    un.Nombre_Oficina AS NuevaUbicacion,
                    hm.Descripcion
                FROM Historial_Movimientos hm
                LEFT JOIN Equipos e ON hm.ID_Equipo = e.Id_Tipo_Equipo
                LEFT JOIN Usuarios u ON hm.ID_Usuario = u.Id_Usuario
                LEFT JOIN Ubicaciones ua ON hm.Ubicacion_Anterior = ua.ID_Oficina
                LEFT JOIN Ubicaciones un ON hm.Ubicacion_Nueva = un.ID_Oficina
                LEFT JOIN Tipo_Equipos te ON e.Id_Tipo_Equipos = te.Id_Tipo_Equipos -- Uniendo con Tipo_Equipos
                ORDER BY hm.Fecha_Movimiento DESC;
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener el historial de movimientos:', err);
        res.status(500).json({ error: 'Error al obtener el historial de movimientos' });
    }
};

module.exports = controllerReportes;