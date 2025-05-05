// rutas/rutas.js
const express = require('express');
const controller = require('../controller/controller');
const controllerConfiguracion = require('../controller/controllerConfiguracion');
const controllerLogeo = require('../controller/controllerLogeo');
const controllerFragmentos = require('../controller/controllerFragmentos');
const controllerGestion = require('../controller/controllerGestion');
const controllerReportes = require('../controller/controllerReportes');

const controllerVistaObervador = require('../controller/controllerVistaObservador');

const { body } = require('express-validator'); // Importa body desde express-validator

const verificarSesion = require('../middlewares/auth');
const verificarRol = require('../middlewares/verificarRol');


const rutas = express.Router();

// Rutas públicas (sin sesión)
rutas.get('/', controllerLogeo.vistaLoginPaginaInicial);
rutas.get('/login', controllerLogeo.vistaLoginPaginaInicial);
rutas.post('/login', [
    body('usuario').trim().escape(), // Sanitiza el campo 'usuario'
    body('password'), // Puedes agregar validaciones para la contraseña aquí si lo deseas
], controllerLogeo.logeoVistaPrincipal);
rutas.get('/registrarse', controllerLogeo.vistaRegistro);
rutas.post('/insertarusuario', [
    body('Nombres_Usuario').trim().escape().notEmpty().withMessage('El nombre es obligatorio.'),
    body('Usuario_De_Red').trim().escape().notEmpty().withMessage('El usuario de red es obligatorio.'),
    body('Correo').trim().escape().isEmail().withMessage('El correo no es válido.'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('confirmarPassword').notEmpty().withMessage('Debes confirmar la contraseña.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden.');
            }
            return true;
        })
], controllerLogeo.registrarUsuario);

rutas.get('/cerrar', verificarSesion, controllerFragmentos.cerrarSesion);

// rutas para la vista de observador
rutas.get('/vistaObservadorPrincipal', verificarSesion, controllerFragmentos.vistaObservadorPrincipal);

// 🔐 Rutas que requieren sesión (fragmentos y vistas protegidas)
// Rutas protegidas con sesión y roles
rutas.get('/vistaPrincipal', verificarSesion, controllerFragmentos.vistaPrincipal);
rutas.get('/gestionEquipos', verificarSesion, verificarRol(['Administrador']), controllerFragmentos.gestionEquipos);
rutas.get('/gestionUsuarios', verificarSesion, verificarRol(['Administrador']), controllerFragmentos.gestionUsuarios);
rutas.get('/gestionTiposEquipos', verificarSesion, verificarRol(['Administrador']), controllerFragmentos.gestionTiposEquipos);
rutas.get('/gestionLocaciones', verificarSesion, verificarRol(['Administrador']), controllerFragmentos.gestionLocaciones);
rutas.get('/vistaConfiguracionEquiposAsignoUsuario', verificarSesion, verificarRol(['Administrador']), controllerFragmentos.vistaConfiguracionEquiposAsignoUsuario);
rutas.get('/reporteHistorialMovimientosEquipos', verificarSesion, verificarRol(['Administrador', 'Observador']), controllerFragmentos.reporteHistorialMovimientosEquipos);



/* -------- RUTAS DE GESTION  -------- */

// Gestión de equipos (API)
rutas.get('/api/equipos/data', verificarSesion, controllerGestion.obtenerGestionEquipos);
rutas.post('/gestionEquipos', verificarSesion, controllerGestion.insertarGestionEquipo);
rutas.put('/gestionEquipos/:id', verificarSesion, controllerGestion.actualizarGestionEquipo);
rutas.get('/api/equipos/:id', verificarSesion, controllerGestion.obtenerEquipoPorId);
rutas.delete('/gestionEquipos/:id', verificarSesion, controllerGestion.eliminarEquipo);

// Gestión de usuarios (API)
rutas.get('/api/roles', verificarSesion, controllerGestion.obtenerRoles);
rutas.get('/api/usuarios/data', verificarSesion, controllerGestion.obtenerGestionUsuarios);
rutas.get('/usuarios/:id', verificarSesion, controllerGestion.obtenerUsuarioPorId);
rutas.post('/gestionUsuarios', verificarSesion, controllerGestion.insertarGestionUsuario);
rutas.delete('/gestionUsuarios/:id', verificarSesion, controllerGestion.eliminarUsuario);
rutas.put('/gestionUsuarios/:id', verificarSesion, controllerGestion.actualizarGestionUsuario);

// Gestión de tipos de equipos (API)
rutas.get('/api/tipos-equipos', verificarSesion, controllerGestion.obtenerTiposEquipos);
rutas.get('/api/tipos-equipos/:id', verificarSesion, controllerGestion.obtenerTipoEquipoPorId);
rutas.post('/api/tipos-equipos', verificarSesion, controllerGestion.insertarTipoEquipo);
rutas.put('/api/tipos-equipos/:id', verificarSesion, controllerGestion.actualizarTipoEquipo);
rutas.delete('/api/tipos-equipos/:id', verificarSesion, controllerGestion.eliminarTipoEquipo);

// Configuración de ubicaciones (API)
rutas.get('/api/ubicaciones', verificarSesion, controllerGestion.obtenerUbicaciones);
rutas.get('/api/ubicaciones/:id', verificarSesion, controllerGestion.obtenerUbicacionPorId);
rutas.post('/api/ubicaciones', verificarSesion, controllerGestion.insertarUbicacion);
rutas.put('/api/ubicaciones/:id', verificarSesion, controllerGestion.actualizarUbicacion);
rutas.delete('/api/ubicaciones/:id', verificarSesion, controllerGestion.eliminarUbicacion);

// API para obtener datos para los selects
rutas.get('/api/usuarios/select', verificarSesion, controllerGestion.obtenerUsuariosParaSelect);
rutas.get('/api/oficinas/select', verificarSesion, controllerGestion.obtenerOficinasParaSelect);
rutas.get('/api/tipos-equipo/select', verificarSesion, controllerGestion.obtenerTiposEquipoParaSelect);
rutas.get('/api/estados-equipo/select', verificarSesion, controllerGestion.obtenerEstadosEquipo);


/* -------- RUTAS DE CONFIGURACION  -------- */

// Configuración de datos del usuario (renderiza la vista)
rutas.get('/vistaConfiguracionPerfil', verificarSesion, controllerConfiguracion.obtenerDatosPerfilUsuario);
rutas.post('/actualizar-usuario', verificarSesion, controllerConfiguracion.actualizarDatosPerfilUsuario);

// Conf|iguración de equipos asociados al perfil (API)
rutas.get('/api/vistaConfiguracionEquiposAdministrados', verificarSesion, controllerConfiguracion.obtenerEquiposAdministrados);

/* -------- RUTAS DE REPORTES  -------- */

// Ruta para obtener el historial de movimientos
rutas.get('/api/reportes/historial-movimientos', verificarSesion, controllerReportes.obtenerHistorialMovimientos);

module.exports = rutas;