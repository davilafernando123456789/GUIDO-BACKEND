const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.tsn-cloud.com',
  port: 587,
  secure: false, // true para el puerto 465, falso para otros puertos
  auth: {
    user: 'tsnegoc9',
    pass: '#TSnegocios2024'
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: '"GUIDO" <reportes@guido.com>',
    to,
    subject,
    html // Cambiamos de text a html para asegurar que se envía como HTML
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
};

module.exports = sendEmail;
