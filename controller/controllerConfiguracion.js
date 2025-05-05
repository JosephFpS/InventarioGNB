const getConnection = require('../conexion/conexion');
const sql = require('mssql'); // Necesario para los tipos
const bcrypt = require('bcryptjs'); // Necesario para hashear la contraseña
const controllerConfiguracion = {};

/* ---------- CONFIGURAICON PARA DATOS DEL USUARIO ---------- */

// Obtener los datos del usuario logueado para la configuración
controllerConfiguracion.obtenerDatosPerfilUsuario = async (req, res) => {
    try {
        console.log("ID de usuario en sesión (Perfil):", req.session.userId);
        const pool = await getConnection();

        const result = await pool.request()
            .input('IdUsuario', sql.Int, req.session.userId)
            .query(`
                SELECT
                    U.[Nombres_Usuario] AS nombre,
                    U.[Correo] AS emailusu,
                    U.[Usuario_De_Red] AS usu,
                    R.[Tipo_De_Rol] AS rol
                FROM Usuarios U
                JOIN Roles R ON U.ID_Rol = R.ID_Rol
                WHERE U.Id_Usuario = @IdUsuario
            `);

        if (result.recordset.length > 0) {
            console.log("Datos del usuario obtenidos:", result.recordset[0]); // <--- AGREGAR ESTO
            res.render('vistaConfiguracionPerfil', { usuario: result.recordset[0] });
        } else {
            res.redirect('/vistaPrincipal');
        }
    } catch (err) {
        console.error('Error al obtener datos del perfil:', err);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar los datos del perfil del usuario
controllerConfiguracion.actualizarDatosPerfilUsuario = async (req, res) => {
    const { emailusu, nomusu, password } = req.body;
    const userId = req.session.userId; // Obtener el ID del usuario de la sesión

    try {
        const pool = await getConnection();
        const request = pool.request()
            .input('IdUsuario', sql.Int, userId)
            .input('emailusu', sql.VarChar, emailusu)
            .input('nomusu', sql.VarChar, nomusu);

        let query = 'UPDATE Usuarios SET Correo = @emailusu, Nombres_Usuario = @nomusu';

        if (password) {
            // Aquí deberías hashear la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(password, 10);
            request.input('password', sql.VarChar, hashedPassword);
            query += ', Contraseña = @password';
        }

        query += ' WHERE Id_Usuario = @IdUsuario';

        await request.query(query);

        res.redirect('/vistaConfiguracionPerfil'); // Redirigir de nuevo a la página de configuración con un mensaje de éxito
    } catch (err) {
        console.error('Error al actualizar datos del perfil:', err);
        res.status(500).json({ error: err.message });
    }
};

/* ---------- CONFIGURAICON PARA LOS EQUIPOS ASOCIADOS A EL PERFIL ---------- */


// Obtener los equipos asignados al usuario logueado
controllerConfiguracion.obtenerEquiposAdministrados = async (req, res, next) => {
    try {
        console.log("ID de usuario en sesión (Equipos Asignados):", req.session.userId);

        const usuarioId = req.session.userId; // Usamos un nombre más descriptivo

        console.log("ID de usuario para la consulta (Equipos Asignados):", usuarioId);

        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }

        const pool = await getConnection();
        try {
            const result = await pool.request()
                .input('usuarioId', sql.Int, usuarioId) // Usamos el mismo nombre en el input
                .query(`
                    SELECT
                        e.Id_Tipo_Equipo,
                        e.Activo,
                        te.Nombre_Equipo AS Tipo_Equipo,
                        e.Marca,
                        e.Modelo,
                        e.Id_Serie,
                        e.Descripcion,
                        e.Fecha_Asignacion,
                        e.Tipo_Almacenamiento,
                        e.Espacio_Almacenamiento,
                        e.Direccion_Ip,
                        ee.Nombre_Estado AS Estado_Equipo,
                        o.Nombre_Oficina AS Oficina,
                        u_asignado.Nombres_Usuario AS Usuario_Asignado,
                        e.Id_Tipo_Equipos,
                        e.Id_Estado_Equipo,
                        e.Id_Oficina,
                        e.Id_Usuario
                    FROM Equipos e
                    LEFT JOIN Tipo_Equipos te ON e.Id_Tipo_Equipos = te.Id_Tipo_Equipos
                    LEFT JOIN Estado_Equipo ee ON e.Id_Estado_Equipo = ee.Id_Estado_Equipo
                    LEFT JOIN Ubicaciones o ON e.Id_Oficina = o.ID_Oficina
                    LEFT JOIN Usuarios u_asignado ON e.Id_Usuario = u_asignado.ID_Usuario
                    WHERE e.Id_Usuario = @usuarioId; -- Filtramos por el Id_Usuario del equipo
                `);

            console.log('Resultados de la consulta de equipos asignados:', result.recordset);
            res.json(result.recordset);

        } catch (queryError) {
            console.error('Error en la consulta SQL:', queryError);
            return res.status(500).json({ error: 'Error al ejecutar la consulta en la base de datos.', details: queryError.message });
        } finally {
            if (pool) {
                pool.close();
            }
        }

    } catch (err) {
        console.error('Error al obtener equipos asignados:', err);
        next(err);
    }
};

module.exports = controllerConfiguracion;