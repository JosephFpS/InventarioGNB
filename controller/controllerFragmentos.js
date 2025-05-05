    const connection = require('../conexion/conexion');
    const cnn = connection();
    const bcryptjs = require('bcryptjs');
    const controllerFragmentos = {};


    // Entrar a la vista principal
    controllerFragmentos.vistaPrincipal = (req, res) => {
        res.render('vistaPrincipal');
    };


    /* ------- RUTAS PARA LAS VISTAS DE GESTION ------- */

    // Vista de gestión de Equipos
    controllerFragmentos.gestionEquipos = (req, res) => {
        res.render('gestionEquipos');
    };

    // Vista de gestión de Usuarios
    controllerFragmentos.gestionUsuarios = (req, res) => {
        res.render('gestionUsuarios');
    };

    // Vista de gestión de Tipos de Equipos
    controllerFragmentos.gestionTiposEquipos = (req, res) => {
        res.render('gestionTiposEquipos');
    };

    // Vista de gestión de locaciones
    controllerFragmentos.gestionLocaciones = (req, res) => {
        res.render('gestionLocaciones');
    };


    /* ------- RUTAS PARA LAS VISTAS DE CONFIGURACION ------- */

    // Vista de gestión de locaciones
    controllerFragmentos.vistaConfiguracionEquiposAsignoUsuario = (req, res) => {
        res.render('vistaConfiguracionEquiposAsignoUsuario');
    };


    /* ------- RUTAS PARA LAS VISTAS DE REPOTES ------- */

    // Vista de gestión de locaciones
    controllerFragmentos.reporteHistorialMovimientosEquipos = (req, res) => {
        res.render('reporteHistorialMovimientosEquipos');
    };


    /* ------- RUTAS PARA LAS VISTAS DE OBSERVADOR ------- */

    controllerFragmentos.vistaObservadorPrincipal = (req, res) => {
        res.render('vistaObservadorPrincipal');
    };

    // Cerrar sesión
    controllerFragmentos.cerrarSesion = (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).send('Error al cerrar sesión');
            }
            res.redirect('/login');
        });
    };

    module.exports = controllerFragmentos;