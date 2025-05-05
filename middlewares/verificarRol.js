// middlewares/verificarRol.js
function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        if (req.session.usuario && rolesPermitidos.includes(req.session.usuario.rol)) {
            return next();
        } else {
            return res.status(403).send('Acceso no autorizado.'); // O redirige a una página de error
        }
    };
}

module.exports = verificarRol;