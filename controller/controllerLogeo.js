// controller/controllerLogeo.js
const getConnection = require('../conexion/conexion');
const bcryptjs = require('bcryptjs');
const sql = require('mssql');
const { body, validationResult } = require('express-validator');

const controllerLogeo = {};

// **Vista de Login**
controllerLogeo.vistaLoginPaginaInicial = (req, res) => {
    res.render('login', { error: req.session.loginError });
    delete req.session.loginError;
};

// **Vista de Registro**
controllerLogeo.vistaRegistro = (req, res) => {
    res.render('registrarse', { errors: req.session.regErrors });
    delete req.session.regErrors;
};

// **Login del usuario**
controllerLogeo.logeoVistaPrincipal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.loginError = "Usuario o contraseña incorrectos";
        return res.redirect('/login');
    }

    try {
        const { usuario, password } = req.body;

        const pool = await getConnection();

        const result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .query(`
                SELECT
                    U.*,
                    R.Tipo_De_Rol AS nombreRol
                FROM Usuarios U
                JOIN Roles R ON U.ID_Rol = R.ID_Rol
                WHERE U.Usuario_De_Red = @usuario
            `);

        if (result.recordset.length > 0) {
            const usuarioDB = result.recordset[0];

            const match = await bcryptjs.compare(password, usuarioDB.Contraseña);

            if (match) {
                req.session.Login = true;
                req.session.userId = usuarioDB.Id_Usuario;
                req.session.loginAttempts = 0;
                req.session.usuario = { ...usuarioDB, rol: usuarioDB.nombreRol };
                console.log('Sesión después del login:', req.session);

                switch (usuarioDB.ID_Rol) {
                    case 1: return res.redirect('/vistaPrincipal');
                    case 2: return res.render('/vistaObservadorPrincipal', { error: "Acceso restringido: El perfil Observador no tiene permisos para ingresar." });
                    default: return res.render('login', { error: "Rol de usuario no reconocido. Contacte al administrador." });
                }
            } else {
                req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
                if (req.session.loginAttempts > 5) {
                    req.session.loginError = "Demasiados intentos fallidos. Intente de nuevo más tarde.";
                    console.warn(`Intento de inicio de sesión fallido repetido para el usuario: ${usuario} desde IP: ${req.ip}`);
                } else {
                    req.session.loginError = "Usuario o contraseña incorrectos";
                }
                return res.redirect('/login');
            }
        } else {
            req.session.loginError = "Usuario o contraseña incorrectos";
            return res.redirect('/login');
        }

    } catch (err) {
        console.error("❌ ERROR EN LOGIN:", err);
        req.session.loginError = "Error interno del servidor";
        return res.redirect('/login');
    }
};

// Registrar un nuevo usuario
controllerLogeo.registrarUsuario = async (req, res) => {
    // No necesitas Promise.all aquí. Las validaciones se ejecutan como middleware en la ruta.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.regErrors = errors.array();
        return res.redirect('/registrarse');
    }

    try {
        const { Nombres_Usuario, Usuario_De_Red, Correo, password } = req.body;
        const pool = await getConnection();

        // Validar usuario existente
        const existeUsuario = await pool.request()
            .input('Usuario_De_Red', sql.VarChar, Usuario_De_Red)
            .query('SELECT * FROM Usuarios WHERE Usuario_De_Red = @Usuario_De_Red');

        if (existeUsuario.recordset.length > 0) {
            req.session.regErrors = [{ msg: "El nombre de usuario ya existe. Intenta con otro." }];
            return res.redirect('/registrarse');
        }

        // Validar correo duplicado
        const existeCorreo = await pool.request()
            .input('Correo', sql.VarChar, Correo)
            .query('SELECT * FROM Usuarios WHERE Correo = @Correo');

        if (existeCorreo.recordset.length > 0) {
            req.session.regErrors = [{ msg: "Ya existe una cuenta con ese correo electrónico." }];
            return res.redirect('/registrarse');
        }

        const clave = await bcryptjs.hash(password, 8);
        const ID_ROL_DEFECTO = 2;

        await pool.request()
            .input('Nombres_Usuario', sql.VarChar, Nombres_Usuario)
            .input('Usuario_De_Red', sql.VarChar, Usuario_De_Red)
            .input('Correo', sql.VarChar, Correo)
            .input('password', sql.VarChar, clave)
            .input('ID_Rol', sql.Int, ID_ROL_DEFECTO)
            .query(`INSERT INTO Usuarios
                                    (Nombres_Usuario, Usuario_De_Red, Correo, Contraseña, ID_Rol)
                                    VALUES (@Nombres_Usuario, @Usuario_De_Red, @Correo, @password, @ID_Rol)`);

        return res.redirect('/login');

    } catch (err) {
        console.error("❌ ERROR AL REGISTRAR USUARIO:", err);
        req.session.regErrors = [{ msg: "Error interno del servidor." }];
        return res.redirect('/registrarse');
    }
};

module.exports = controllerLogeo;