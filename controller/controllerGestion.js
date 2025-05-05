const getConnection = require('../conexion/conexion');
const bcryptjs = require('bcryptjs');
const sql = require('mssql');
const controllerGestion = {};

/* ---------- GESTION DE EQUIPOS ---------- */

// Obtener todos los equipos con sus relaciones
controllerGestion.obtenerGestionEquipos = async (req, res, next) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
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
                u.Nombres_Usuario AS Usuario_Asignado,
                e.Id_Tipo_Equipos,
                e.Id_Estado_Equipo,
                e.Id_Oficina,
                e.Id_Usuario
            FROM Equipos e
            LEFT JOIN Tipo_Equipos te ON e.Id_Tipo_Equipos = te.Id_Tipo_Equipos
            LEFT JOIN Estado_Equipo ee ON e.Id_Estado_Equipo = ee.Id_Estado_Equipo
            LEFT JOIN Ubicaciones o ON e.Id_Oficina = o.ID_Oficina
            LEFT JOIN Usuarios u ON e.Id_Usuario = u.ID_Usuario
        `);
        console.log('Consulta para obtener equipos:', `
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
                u.Nombres_Usuario AS Usuario_Asignado,
                e.Id_Tipo_Equipos,
                e.Id_Estado_Equipo,
                e.Id_Oficina,
                e.Id_Usuario
            FROM Equipos e
            LEFT JOIN Tipo_Equipos te ON e.Id_Tipo_Equipos = te.Id_Tipo_Equipos
            LEFT JOIN Estado_Equipo ee ON e.Id_Estado_Equipo = ee.Id_Estado_Equipo
            LEFT JOIN Ubicaciones o ON e.Id_Oficina = o.ID_Oficina
            LEFT JOIN Usuarios u ON e.Id_Usuario = u.ID_Usuario
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener equipos:', err);
        next(err);
    }
};

// Obtener un equipo por ID (Id_Tipo_Equipo)
controllerGestion.obtenerEquipoPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('Id_Tipo_Equipo', sql.Int, parseInt(id))
            .query(`
                SELECT
                    e.Id_Tipo_Equipo,
                    e.Activo,
                    e.Id_Tipo_Equipos,
                    e.Marca,
                    e.Modelo,
                    e.Id_Serie,
                    e.Descripcion,
                    e.Fecha_Asignacion,
                    e.Tipo_Almacenamiento,
                    e.Espacio_Almacenamiento,
                    e.Direccion_Ip,
                    e.Id_Estado_Equipo,
                    e.Id_Oficina,
                    e.Id_Usuario
                FROM Equipos e
                WHERE e.Id_Tipo_Equipo = @Id_Tipo_Equipo
            `);
        console.log('Consulta para obtener equipo por ID:', `
            SELECT
                e.Id_Tipo_Equipo,
                e.Activo,
                e.Id_Tipo_Equipos,
                e.Marca,
                e.Modelo,
                e.Id_Serie,
                e.Descripcion,
                e.Fecha_Asignacion,
                e.Tipo_Almacenamiento,
                e.Espacio_Almacenamiento,
                e.Direccion_Ip,
                e.Id_Estado_Equipo,
                e.Id_Oficina,
                e.Id_Usuario
            FROM Equipos e
            WHERE e.Id_Tipo_Equipo = @Id_Tipo_Equipo
        `);
        console.log('Parámetro para obtener equipo por ID:', { Id_Tipo_Equipo: parseInt(id) });
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error al obtener equipo por ID:', err);
        next(err);
    }
};

controllerGestion.insertarGestionEquipo = async (req, res, next) => {
    try {
        const { Activo, Id_Tipo_Equipos, Marca, Modelo, Id_Serie, Descripcion, Fecha_Asignacion, Tipo_Almacenamiento, Espacio_Almacenamiento, Direccion_Ip, Id_Estado_Equipo, Id_Oficina, Id_Usuario } = req.body;

        const pool = await getConnection();

        console.log('SQL para insertar en Equipos:', `
                INSERT INTO Equipos (Activo, Id_Tipo_Equipos, Marca, Modelo, Id_Serie, Descripcion, Fecha_Asignacion, Tipo_Almacenamiento, Espacio_Almacenamiento, Direccion_Ip, Id_Estado_Equipo, Id_Oficina, Id_Usuario)
                VALUES (@Activo, @Id_Tipo_Equipos, @Marca, @Modelo, @Id_Serie, @Descripcion, @Fecha_Asignacion, @Tipo_Almacenamiento, @Espacio_Almacenamiento, @Direccion_Ip, @Id_Estado_Equipo, @Id_Oficina, @Id_Usuario);
                SELECT SCOPE_IDENTITY() AS Id_Equipo;
            `);
        console.log('Parámetros para Equipos:', { Activo, Id_Tipo_Equipos, Marca, Modelo, Id_Serie, Descripcion, Fecha_Asignacion, Tipo_Almacenamiento, Espacio_Almacenamiento, Direccion_Ip, Id_Estado_Equipo, Id_Oficina, Id_Usuario });

        const resultEquipo = await pool.request()
            .input('Activo', sql.VarChar, Activo)
            .input('Id_Tipo_Equipos', sql.Int, Id_Tipo_Equipos)
            .input('Marca', sql.VarChar, Marca)
            .input('Modelo', sql.VarChar, Modelo)
            .input('Id_Serie', sql.VarChar, Id_Serie)
            .input('Descripcion', sql.VarChar, Descripcion)
            .input('Fecha_Asignacion', sql.Date, Fecha_Asignacion || null)
            .input('Tipo_Almacenamiento', sql.VarChar, Tipo_Almacenamiento)
            .input('Espacio_Almacenamiento', sql.VarChar, Espacio_Almacenamiento)
            .input('Direccion_Ip', sql.VarChar, Direccion_Ip)
            .input('Id_Estado_Equipo', sql.Int, Id_Estado_Equipo)
            .input('Id_Oficina', sql.Int, Id_Oficina)
            .input('Id_Usuario', sql.Int, Id_Usuario || null)
            .query(`
                    INSERT INTO Equipos (Activo, Id_Tipo_Equipos, Marca, Modelo, Id_Serie, Descripcion, Fecha_Asignacion, Tipo_Almacenamiento, Espacio_Almacenamiento, Direccion_Ip, Id_Estado_Equipo, Id_Oficina, Id_Usuario)
                    VALUES (@Activo, @Id_Tipo_Equipos, @Marca, @Modelo, @Id_Serie, @Descripcion, @Fecha_Asignacion, @Tipo_Almacenamiento, @Espacio_Almacenamiento, @Direccion_Ip, @Id_Estado_Equipo, @Id_Oficina, @Id_Usuario);
                    SELECT SCOPE_IDENTITY() AS Id_Equipo;
                `);

        const nuevoIdEquipo = resultEquipo.recordset[0].Id_Equipo;

        console.log('SQL para insertar en Historial_Movimientos (con Descripción):', `
                INSERT INTO Historial_Movimientos (Fecha_Movimiento, Tipo_Movimiento, ID_Equipo, ID_Usuario, Ubicacion_Anterior, Ubicacion_Nueva, Descripcion)
                VALUES (@Fecha_Movimiento, @Tipo_Movimiento, @ID_Equipo, @ID_Usuario, @Ubicacion_Anterior, @Ubicacion_Nueva, @Descripcion);
            `);
        console.log('Parámetros para Historial_Movimientos (con Descripción):', { Fecha_Movimiento: new Date(), Tipo_Movimiento: 'Creación de Equipo', ID_Equipo: nuevoIdEquipo, ID_Usuario: req.session.userId || null, Ubicacion_Anterior: 1, Ubicacion_Nueva: Id_Oficina, Descripcion });

        await pool.request()
            .input('Fecha_Movimiento', sql.DateTime, new Date())
            .input('Tipo_Movimiento', sql.VarChar, 'Creación de Equipo')
            .input('ID_Equipo', sql.Int, nuevoIdEquipo)
            .input('ID_Usuario', sql.Int, req.session.userId || null)
            .input('Ubicacion_Anterior', sql.Int, 1) // <---- Usando Id_Estado_Equipo = 1 para "Bodega"
            .input('Ubicacion_Nueva', sql.Int, Id_Oficina)
            .input('Descripcion', sql.VarChar, Descripcion)
            .query(`
                    INSERT INTO Historial_Movimientos (Fecha_Movimiento, Tipo_Movimiento, ID_Equipo, ID_Usuario, Ubicacion_Anterior, Ubicacion_Nueva, Descripcion)
                    VALUES (@Fecha_Movimiento, @Tipo_Movimiento, @ID_Equipo, @ID_Usuario, @Ubicacion_Anterior, @Ubicacion_Nueva, @Descripcion);
                `);

        res.status(201).json({ mensaje: 'Equipo registrado correctamente' });

    } catch (err) {
        console.error('Error al insertar equipo:', err);
        next(err);
    }
};

// Actualizar equipo por Id_Tipo_Equipo
controllerGestion.actualizarGestionEquipo = async (req, res, next) => {
    const { id } = req.params;
    const { Activo, Id_Tipo_Equipos, Marca, Modelo, Id_Serie, Descripcion, Fecha_Asignacion, Tipo_Almacenamiento, Espacio_Almacenamiento, Direccion_Ip, Id_Estado_Equipo, Id_Oficina, Id_Usuario } = req.body;

    try {
        const pool = await getConnection();

        console.log('SQL para obtener ubicación anterior:', 'SELECT Id_Oficina, Descripcion FROM Equipos WHERE Id_Tipo_Equipo = @Id_Tipo_Equipo');
        console.log('Parámetro para obtener ubicación anterior:', { Id_Tipo_Equipo: parseInt(id) });

        const equipoAnteriorResult = await pool.request()
            .input('Id_Tipo_Equipo', sql.Int, parseInt(id))
            .query('SELECT Id_Oficina, Descripcion FROM Equipos WHERE Id_Tipo_Equipo = @Id_Tipo_Equipo');

        const ubicacionAnterior = equipoAnteriorResult.recordset[0]?.Id_Oficina;
        const descripcionEquipo = equipoAnteriorResult.recordset[0]?.Descripcion; // <---- Obtener la descripción actual del equipo

        console.log('SQL para actualizar Equipo:', `
            UPDATE Equipos
            SET Activo = @Activo,
                Id_Tipo_Equipos = @Id_Tipo_Equipos,
                Marca = @Marca,
                Modelo = @Modelo,
                Id_Serie = @Id_Serie,
                Descripcion = @Descripcion,
                Fecha_Asignacion = @Fecha_Asignacion,
                Tipo_Almacenamiento = @Tipo_Almacenamiento,
                Espacio_Almacenamiento = @Espacio_Almacenamiento,
                Direccion_Ip = @Direccion_Ip,
                Id_Estado_Equipo = @Id_Estado_Equipo,
                Id_Oficina = @Id_Oficina,
                Id_Usuario = @Id_Usuario
            WHERE Id_Tipo_Equipo = @Id_Tipo_Equipo
        `);
        console.log('Parámetros para actualizar Equipo:', { id, Activo, Id_Tipo_Equipos, Marca, Modelo, Id_Serie, Descripcion, Fecha_Asignacion, Tipo_Almacenamiento, Espacio_Almacenamiento, Direccion_Ip, Id_Estado_Equipo, Id_Oficina, Id_Usuario });

        await pool.request()
            .input('Id_Tipo_Equipo', sql.Int, parseInt(id))
            .input('Activo', sql.VarChar, Activo)
            .input('Id_Tipo_Equipos', sql.Int, Id_Tipo_Equipos)
            .input('Marca', sql.VarChar, Marca)
            .input('Modelo', sql.VarChar, Modelo)
            .input('Id_Serie', sql.VarChar, Id_Serie)
            .input('Descripcion', sql.VarChar, Descripcion)
            .input('Fecha_Asignacion', sql.Date, Fecha_Asignacion || null)
            .input('Tipo_Almacenamiento', sql.VarChar, Tipo_Almacenamiento)
            .input('Espacio_Almacenamiento', sql.VarChar, Espacio_Almacenamiento)
            .input('Direccion_Ip', sql.VarChar, Direccion_Ip)
            .input('Id_Estado_Equipo', sql.Int, Id_Estado_Equipo)
            .input('Id_Oficina', sql.Int, Id_Oficina)
            .input('Id_Usuario', sql.Int, Id_Usuario || null)
            .query(`
                UPDATE Equipos
                SET Activo = @Activo,
                    Id_Tipo_Equipos = @Id_Tipo_Equipos,
                    Marca = @Marca,
                    Modelo = @Modelo,
                    Id_Serie = @Id_Serie,
                    Descripcion = @Descripcion,
                    Fecha_Asignacion = @Fecha_Asignacion,
                    Tipo_Almacenamiento = @Tipo_Almacenamiento,
                    Espacio_Almacenamiento = @Espacio_Almacenamiento,
                    Direccion_Ip = @Direccion_Ip,
                    Id_Estado_Equipo = @Id_Estado_Equipo,
                    Id_Oficina = @Id_Oficina,
                    Id_Usuario = @Id_Usuario
                WHERE Id_Tipo_Equipo = @Id_Tipo_Equipo
            `);

        if (ubicacionAnterior !== Id_Oficina) {
            console.log('SQL para insertar movimiento de ubicación (con Descripción):', `
                INSERT INTO Historial_Movimientos (Fecha_Movimiento, Tipo_Movimiento, ID_Equipo, ID_Usuario, Ubicacion_Anterior, Ubicacion_Nueva, Descripcion)
                VALUES (@Fecha_Movimiento, @Tipo_Movimiento, @ID_Equipo, @ID_Usuario, @Ubicacion_Anterior, @Ubicacion_Nueva, @Descripcion);
                 `);
            console.log('Parámetros para movimiento de ubicación (con Descripción):', { Fecha_Movimiento: new Date(), Tipo_Movimiento: 'Cambio de Ubicación', ID_Equipo: parseInt(id), ID_Usuario: req.session.userId || null, Ubicacion_Anterior: ubicacionAnterior, Ubicacion_Nueva: Id_Oficina, Descripcion }); // <---- Usando la nueva Descripción

            await pool.request()
                .input('Fecha_Movimiento', sql.DateTime, new Date())
                .input('Tipo_Movimiento', sql.VarChar, 'Cambio de Ubicación')
                .input('ID_Equipo', sql.Int, parseInt(id))
                .input('ID_Usuario', sql.Int, req.session.userId || null)
                .input('Ubicacion_Anterior', sql.Int, ubicacionAnterior)
                .input('Ubicacion_Nueva', sql.Int, Id_Oficina)
                .input('Descripcion', sql.VarChar, Descripcion) // <---- Usando la nueva Descripción
                .query(`
                INSERT INTO Historial_Movimientos (Fecha_Movimiento, Tipo_Movimiento, ID_Equipo, ID_Usuario, Ubicacion_Anterior, Ubicacion_Nueva, Descripcion)
                VALUES (@Fecha_Movimiento, @Tipo_Movimiento, @ID_Equipo, @ID_Usuario, @Ubicacion_Anterior, @Ubicacion_Nueva, @Descripcion);
                `);
        }

        res.json({ mensaje: 'Equipo actualizado correctamente' });

    } catch (err) {
        console.error('Error al actualizar equipo:', err);
        next(err);
    }
};

// Eliminar equipo por Id_Tipo_Equipo
controllerGestion.eliminarEquipo = async (req, res, next) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();

        console.log('SQL para eliminar equipo:', 'DELETE FROM Equipos WHERE Id_Tipo_Equipo = @Id_Tipo_Equipo');
        console.log('Parámetro para eliminar equipo:', { Id_Tipo_Equipo: parseInt(id) });

        await pool.request()
            .input('Id_Tipo_Equipo', sql.Int, parseInt(id))
            .query('DELETE FROM Equipos WHERE Id_Tipo_Equipo = @Id_Tipo_Equipo');

        res.json({ mensaje: 'Equipo eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar equipo:', err);
        next(err);
    }
};


/* ---------- GESTION DE ROLES ---------- */

// Obtener roles
controllerGestion.obtenerRoles = async (req, res, next) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT ID_Rol, Tipo_De_Rol FROM Roles');
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
};


/* ---------- GESTION PARA USUARIOS ---------- */

// Obtener todos los usuarios con su rol
controllerGestion.obtenerGestionUsuarios = async (req, res, next) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT u.ID_Usuario, u.Nombres_Usuario, u.Usuario_De_Red, u.Correo,
                   u.ID_Rol, r.Tipo_De_Rol AS Nombre_Rol
            FROM Usuarios u
            JOIN Roles r ON u.ID_Rol = r.ID_Rol
        `);
        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
};

// Obtener usuario por ID (ID_Usuario)
controllerGestion.obtenerUsuarioPorId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('ID_Usuario', sql.Int, parseInt(id))
            .query('SELECT ID_Usuario, Nombres_Usuario, Usuario_De_Red, Correo, ID_Rol FROM Usuarios WHERE ID_Usuario = @ID_Usuario');
        res.json(result.recordset[0]);
    } catch (err) {
        next(err);
    }
};

// Insertar nuevo usuario
controllerGestion.insertarGestionUsuario = async (req, res, next) => {
    try {
        const { Nombres_Usuario, Usuario_De_Red, Correo, Contraseña, ID_Rol } = req.body;

        if (!Nombres_Usuario || !Usuario_De_Red || !Correo || !Contraseña || !ID_Rol) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        const pool = await getConnection();

        // **Validar que el usuario no esté registrado (por Usuario_De_Red)**
        const existeUsuarioRed = await pool.request()
            .input('Usuario_De_Red', sql.VarChar, Usuario_De_Red)
            .query('SELECT COUNT(*) AS count FROM Usuarios WHERE Usuario_De_Red = @Usuario_De_Red');

        if (existeUsuarioRed.recordset[0].count > 0) {
            return res.status(409).json({ error: "El nombre de usuario ya existe." }); // 409 Conflict
        }

        // **Validar correo duplicado**
        const existeCorreo = await pool.request()
            .input('Correo', sql.VarChar, Correo)
            .query('SELECT COUNT(*) AS count FROM Usuarios WHERE Correo = @Correo');

        if (existeCorreo.recordset[0].count > 0) {
            return res.status(409).json({ error: "Ya existe una cuenta con ese correo electrónico." }); // 409 Conflict
        }

        const hash = await bcryptjs.hash(Contraseña, 8);

        await pool.request()
            .input('Nombres_Usuario', sql.NVarChar, Nombres_Usuario)
            .input('Correo', sql.NVarChar, Correo)
            .input('Usuario_De_Red', sql.NVarChar, Usuario_De_Red)
            .input('Contraseña', sql.NVarChar, hash)
            .input('ID_Rol', sql.Int, ID_Rol)
            .query(`
                INSERT INTO Usuarios (Nombres_Usuario, Usuario_De_Red, Correo, Contraseña, ID_Rol)
                VALUES (@Nombres_Usuario, @Usuario_De_Red, @Correo, @Contraseña, @ID_Rol)
            `);
        res.status(201).json({ mensaje: 'Usuario creado correctamente' });
    } catch (err) {
        console.error('Error al insertar usuario:', err);
        next(err);
    }
};

// Actualizar usuario por ID_Usuario
// Actualizar usuario por ID_Usuario
controllerGestion.actualizarGestionUsuario = async (req, res, next) => {
    const { id } = req.params;
    const { Nombres_Usuario, Usuario_De_Red, Correo, ID_Rol, Contraseña } = req.body;

    try {
        const pool = await getConnection();

        // **Validar que el nuevo Usuario_De_Red no exista para OTRO usuario**
        const existeUsuarioRed = await pool.request()
            .input('ID_Usuario', sql.Int, parseInt(id))
            .input('Usuario_De_Red', sql.VarChar, Usuario_De_Red)
            .query('SELECT COUNT(*) AS count FROM Usuarios WHERE Usuario_De_Red = @Usuario_De_Red AND ID_Usuario <> @ID_Usuario');

        if (existeUsuarioRed.recordset[0].count > 0) {
            return res.status(409).json({ error: "El nombre de usuario ya existe." }); // 409 Conflict
        }

        // **Validar que el nuevo Correo no exista para OTRO usuario**
        const existeCorreo = await pool.request()
            .input('ID_Usuario', sql.Int, parseInt(id))
            .input('Correo', sql.VarChar, Correo)
            .query('SELECT COUNT(*) AS count FROM Usuarios WHERE Correo = @Correo AND ID_Usuario <> @ID_Usuario');

        if (existeCorreo.recordset[0].count > 0) {
            return res.status(409).json({ error: "Ya existe una cuenta con ese correo electrónico." }); // 409 Conflict
        }

        const request = pool.request()
            .input('ID_Usuario', sql.Int, parseInt(id))
            .input('Nombres_Usuario', sql.NVarChar, Nombres_Usuario)
            .input('Usuario_De_Red', sql.NVarChar, Usuario_De_Red)
            .input('Correo', sql.NVarChar, Correo)
            .input('ID_Rol', sql.Int, ID_Rol);

        let query = `
            UPDATE Usuarios
            SET Nombres_Usuario = @Nombres_Usuario,
                Usuario_De_Red = @Usuario_De_Red,
                Correo = @Correo,
                ID_Rol = @ID_Rol
            WHERE ID_Usuario = @ID_Usuario
        `;

        if (Contraseña && Contraseña.trim() !== '') {
            const hash = await bcryptjs.hash(Contraseña, 8);
            request.input('Contraseña', sql.NVarChar, hash);
            query = `
                UPDATE Usuarios
                SET Nombres_Usuario = @Nombres_Usuario,
                    Usuario_De_Red = @Usuario_De_Red,
                    Correo = @Correo,
                    Contraseña = @Contraseña,
                    ID_Rol = @ID_Rol
                WHERE ID_Usuario = @ID_Usuario
            `;
            console.log('Se va a actualizar la contraseña.');
        } else {
            console.log('No se va a actualizar la contraseña.');
        }

        console.log('Consulta SQL a ejecutar:', query);
        const result = await request.query(query);
        console.log('Resultado de la consulta:', result);

        if (result.rowsAffected[0] > 0) {
            res.json({ mensaje: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        next(err);
    }
};

// Eliminar usuario por ID_Usuario
controllerGestion.eliminarUsuario = async (req, res, next) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('ID_Usuario', sql.Int, parseInt(id))
            .query('DELETE FROM Usuarios WHERE ID_Usuario = @ID_Usuario');

        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (err) {
        next(err);
    }
};



/* ---------- GESTION PARA TIPOS DE EQUIPOS ---------- */

// Obtener todos los tipos de equipos
controllerGestion.obtenerTiposEquipos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Tipo_Equipos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un tipo de equipo por ID
controllerGestion.obtenerTipoEquipoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT * FROM Tipo_Equipos WHERE Id_Tipo_Equipos = @Id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Insertar nuevo tipo de equipo
controllerGestion.insertarTipoEquipo = async (req, res) => {
    const { Nombre_Equipo } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('Nombre_Equipo', sql.VarChar, Nombre_Equipo)
            .query('INSERT INTO Tipo_Equipos (Nombre_Equipo) VALUES (@Nombre_Equipo)');

        res.json({ mensaje: 'Tipo de equipo registrado correctamente' });
    } catch (err) {
        console.error('Error al insertar tipo equipo:', err);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar tipo de equipo
controllerGestion.actualizarTipoEquipo = async (req, res) => {
    const { id } = req.params;
    const { Nombre_Equipo } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .input('Nombre_Equipo', sql.VarChar, Nombre_Equipo)
            .query('UPDATE Tipo_Equipos SET Nombre_Equipo = @Nombre_Equipo WHERE Id_Tipo_Equipos = @Id');

        res.json({ mensaje: 'Tipo de equipo actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar tipo de equipo
controllerGestion.eliminarTipoEquipo = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Tipo_Equipos WHERE Id_Tipo_Equipos = @Id');

        res.json({ mensaje: 'Tipo de equipo eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* ---------- GESTION PARA UBICACIONES (OFICINAS) ---------- */

// Obtener todas las ubicaciones
controllerGestion.obtenerUbicaciones = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Ubicaciones');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener una ubicación por ID
controllerGestion.obtenerUbicacionPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT * FROM Ubicaciones WHERE ID_Oficina = @Id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Insertar nueva ubicación
controllerGestion.insertarUbicacion = async (req, res) => {
    const { Codigo_Oficina, Nombre_Oficina, Direccion, Ciudad } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('Codigo_Oficina', sql.Int, Codigo_Oficina)
            .input('Nombre_Oficina', sql.VarChar, Nombre_Oficina)
            .input('Direccion', sql.VarChar, Direccion)
            .input('Ciudad', sql.VarChar, Ciudad)
            .query('INSERT INTO Ubicaciones (Codigo_Oficina, Nombre_Oficina, Direccion, Ciudad) VALUES (@Codigo_Oficina, @Nombre_Oficina, @Direccion, @Ciudad)');

        res.json({ mensaje: 'Ubicación registrada correctamente' });
    } catch (err) {
        console.error('Error al insertar ubicación:', err);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar ubicación
controllerGestion.actualizarUbicacion = async (req, res) => {
    const { id } = req.params;
    const { Codigo_Oficina, Nombre_Oficina, Direccion, Ciudad } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .input('Codigo_Oficina', sql.Int, Codigo_Oficina)
            .input('Nombre_Oficina', sql.VarChar, Nombre_Oficina)
            .input('Direccion', sql.VarChar, Direccion)
            .input('Ciudad', sql.VarChar, Ciudad)
            .query('UPDATE Ubicaciones SET Codigo_Oficina = @Codigo_Oficina, Nombre_Oficina = @Nombre_Oficina, Direccion = @Direccion, Ciudad = @Ciudad WHERE ID_Oficina = @Id');

        res.json({ mensaje: 'Ubicación actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar ubicación
controllerGestion.eliminarUbicacion = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Ubicaciones WHERE ID_Oficina = @Id');

        res.json({ mensaje: 'Ubicación eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ------------------------------- GESTIÓN DE USUARIOS -------------------------------

// Obtener todos los usuarios (ID y Nombre para el select)
controllerGestion.obtenerUsuariosParaSelect = async (req, res, next) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT ID_Usuario, Nombres_Usuario FROM Usuarios');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener usuarios para select:', err);
        next(err);
    }
};

// ------------------------------- GESTIÓN DE OFICINAS -------------------------------

// Obtener todas las oficinas (ID y Nombre para el select)
controllerGestion.obtenerOficinasParaSelect = async (req, res, next) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT ID_Oficina, Nombre_Oficina FROM Ubicaciones');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener oficinas para select:', err);
        next(err);
    }
};

// ------------------------------- GESTIÓN DE TIPOS DE EQUIPO -------------------------------

// Obtener todos los tipos de equipo (ID y Nombre para el select)
controllerGestion.obtenerTiposEquipoParaSelect = async (req, res, next) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT Id_Tipo_Equipos, Nombre_Equipo FROM Tipo_Equipos');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener tipos de equipo para select:', err);
        next(err);
    }
};

// ------------------------------- GESTIÓN DE ESTADOS DE EQUIPO -------------------------------

// Obtener todos los estados de equipo
controllerGestion.obtenerEstadosEquipo = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT Id_Estado_Equipo, Nombre_Estado FROM Estado_Equipo');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = controllerGestion;