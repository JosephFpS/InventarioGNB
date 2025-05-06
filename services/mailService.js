const nodemailer = require('nodemailer');

// Configuración del transporte (usa Gmail u otro SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ggnbpruebas@gmail.com',
        pass: 'jkuj zglh ybdx mpgb'
    }
});

// Función que envía el correo
const enviarCorreo = async (destinatario, asunto, mensajeHtml) => {
    const info = await transporter.sendMail({
        from: '"Inventario GNB" <josephsolano0720@gmail.com>',
        to: destinatario,
        subject: asunto,
        html: mensajeHtml
    });
    return info;
};

module.exports = enviarCorreo;