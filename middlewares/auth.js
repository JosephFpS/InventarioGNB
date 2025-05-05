// middlewares/auth.js
const verificarSesion = (req, res, next) => {
    if (!req.session.Login || !req.session.userId) {
        console.log('Sesión no válida:', req.session);
        return res.redirect('/login');
    }

    // Disponibiliza los datos básicos del usuario en todas las vistas
    res.locals.usuario = req.session.usuario || null;
    next();
}

module.exports = verificarSesion;