// middlewares/verificarRol.js
function verificarRol() {
    return (req, res, next) => {
        if (req.session && req.session.usuario) {
            return next(); // Usuario autenticado, se permite el acceso
        } else {
            return res.status(403).send('Acceso no autorizado.'); // No hay sesión
        }
    };
}

module.exports = verificarRol;