const enviarCorreo = require('../Services/mailService');

const enviarCorreoDesdeFormulario = async (req, res) => {
    try {
        const { destinatario, asunto, mensaje } = req.body;
        await enviarCorreo(destinatario, asunto, mensaje);
        res.redirect('back'); // Vuelve a la página anterior
    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
};

module.exports = {
    enviarCorreoDesdeFormulario
};