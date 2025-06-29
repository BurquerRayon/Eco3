// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Envía un correo de verificación al usuario
 * @param {string} to - Correo del destinatario
 * @param {string} token - Token único (15 caracteres)
 * @param {string} nombre - Nombre del usuario
 */
const sendVerificationEmail = async (to, token, nombre) => {
  const verificationLink = `http://localhost:3000/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"EcoMaravillas" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verifica tu cuenta en EcoMaravillas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2e7d32;">Hola ${nombre},</h2>
        <p>Gracias por registrarte en EcoMaravillas.</p>
        <p>Para activar tu cuenta, utiliza uno de estos métodos:</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
          <h3 style="margin-top: 0;">Método 1: Haz clic en el enlace</h3>
          <a href="${verificationLink}" 
             style="display: inline-block; padding: 10px 15px; background-color: #2e7d32; color: white; text-decoration: none; border-radius: 4px;"
             target="_blank">
            Verificar mi cuenta
          </a>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
          <h3 style="margin-top: 0;">Método 2: Usa el código manual</h3>
          <p>Si el enlace no funciona, puedes copiar y pegar este código en la página de verificación:</p>
          <div style="padding: 10px; background-color: white; border: 1px dashed #2e7d32; border-radius: 4px; font-family: monospace; font-size: 18px; letter-spacing: 2px; text-align: center;">
            ${token}
          </div>
          <p style="font-size: 14px; color: #666;">Este código expirará después de su uso.</p>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Si no creaste esta cuenta, puedes ignorar este mensaje.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
          <img src="https://ejemplo.com/logo-eco-maravillas.png" alt="EcoMaravillas" style="max-width: 150px;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} EcoMaravillas. Todos los derechos reservados.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de verificación enviado a ${to}`);
  } catch (error) {
    console.error('Error al enviar correo de verificación:', error);
    throw new Error('Error al enviar el correo de verificación');
  }
};

/**
 * Envía un correo de recuperación de contraseña
 * @param {string} to - Correo del destinatario
 * @param {string} resetLink - Enlace para restablecer contraseña
 */
const sendPasswordResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"EcoMaravillas" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Recuperación de contraseña - EcoMaravillas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2e7d32;">Recuperación de contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en EcoMaravillas.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
          <h3 style="margin-top: 0;">Haz clic en el siguiente enlace:</h3>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 10px 15px; background-color: #2e7d32; color: white; text-decoration: none; border-radius: 4px;"
             target="_blank">
            Restablecer mi contraseña
          </a>
          <p style="font-size: 14px; color: #666; margin-top: 10px;">Este enlace expirará en 1 hora.</p>
        </div>
        
        <p style="font-size: 14px; color: #666;">
          Si no solicitaste este cambio, por favor ignora este mensaje o contacta con nuestro equipo de soporte.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
          <img src="https://ejemplo.com/logo-eco-maravillas.png" alt="EcoMaravillas" style="max-width: 150px;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} EcoMaravillas. Todos los derechos reservados.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de recuperación enviado a ${to}`);
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    throw new Error('Error al enviar el correo de recuperación');
  }
};

module.exports = { 
  sendVerificationEmail,
  sendPasswordResetEmail 
};