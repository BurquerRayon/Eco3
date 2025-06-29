const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

// ===========================
// Registro de usuario
// ===========================
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    await poolConnect;

    // Verificar si ya existe el usuario
    const existe = await pool.request()
      .input('correo', correo)
      .query('SELECT id_usuario FROM Usuario WHERE correo = @correo');

    if (existe.recordset.length > 0) {
      return res.status(400).json({ message: 'Este correo ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar en Persona (solo con nombre por ahora)
    const personaResult = await pool.request()
      .input('nombre', nombre)
      .query(`
        INSERT INTO Persona (nombre)
        OUTPUT INSERTED.id_persona
        VALUES (@nombre)
      `);

    const id_persona = personaResult.recordset[0].id_persona;

    // Asignar rol 3 (turista) por defecto
    const id_rol = 3;

    // Insertar en Usuario
    const usuarioResult = await pool.request()
      .input('id_rol', id_rol)
      .input('id_persona', id_persona)
      .input('correo', correo)
      .input('contrasena', hashedPassword)
      .input('estado', 'activo')
      .query(`
        INSERT INTO Usuario (id_rol, id_persona, correo, contrasena, estado)
        OUTPUT INSERTED.id_usuario
        VALUES (@id_rol, @id_persona, @correo, @contrasena, @estado)
      `);

    const id_usuario = usuarioResult.recordset[0].id_usuario;

    // Insertar en Turista
    await pool.request()
      .input('id_usuario', id_usuario)
      .input('fecha_creacion', new Date())
      .query(`
        INSERT INTO Turista (id_usuario, fecha_creacion)
        VALUES (@id_usuario, @fecha_creacion)
      `);

    // Crear token de verificación
    const token = crypto.randomBytes(8).toString('hex').slice(0, 15); // Genera un token de 15 caracteres
    await pool.request()
      .input('id_usuario', id_usuario)
      .input('token', token)
      .query(`
        INSERT INTO Verificacion (id_usuario, token)
        VALUES (@id_usuario, @token)
      `);

    // Enviar email
    await sendVerificationEmail(correo, token, nombre);

    res.status(201).json({
      message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
    });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error interno en el servidor' });
  }
});

// ===========================
// Login de usuario
// ===========================
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({
      success: false,
      message: 'Correo y contraseña son requeridos'
    });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('correo', correo)
      .query(`
        SELECT 
          U.id_usuario,
          U.correo,
          U.contrasena,
          U.verificado,
          U.estado,
          R.nombre AS rol,
          P.nombre,
          T.id_turista
        FROM Usuario U
        JOIN Rol R ON U.id_rol = R.id_rol
        JOIN Persona P ON U.id_persona = P.id_persona
        LEFT JOIN Turista T ON T.id_usuario = U.id_usuario
        WHERE U.correo = @correo
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Correo no registrado'
      });
    }

    const user = result.recordset[0];

    if (user.estado !== 'activo') {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta está suspendida o inactiva'
      });
    }

    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    const isVerified = Boolean(user.verificado);
    if (!isVerified) {
  // Obtener el token de verificación no usado
  const tokenResult = await pool.request()
    .input('id_usuario', user.id_usuario)
    .query(`
      SELECT token FROM Verificacion 
      WHERE id_usuario = @id_usuario AND usado = 0
    `);

  const verificationToken = tokenResult.recordset.length > 0 
    ? tokenResult.recordset[0].token 
    : null;

      return res.status(403).json({
      success: false,
      message: 'Debes verificar tu correo antes de iniciar sesión',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

    const token = jwt.sign(
      {
        id: user.id_usuario,
        rol: user.rol,
        email: user.correo
      },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '1d' }
    );

    // En la ruta de login, modifica la respuesta:
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id_usuario, // Asegúrate que esto esté como id_usuario
        id_turista: user.id_turista,
        email: user.correo,
        nombre: user.nombre,
        rol: user.rol,
        verificado: isVerified
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al iniciar sesión'
    });
  }
});

// ===========================
// Verificación de correo
// ===========================
router.get('/verify', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }

  try {
    await poolConnect;

    // Consulta modificada para verificar el tiempo de expiración (90 segundos)
    const result = await pool.request()
      .input('token', token)
      .query(`
        SELECT * FROM Verificacion
        WHERE token = @token 
        AND usado = 0
        AND DATEDIFF(SECOND, fecha_envio, GETDATE()) <= 90
      `);

    if (result.recordset.length === 0) {
      // Verificar si el token existe pero está expirado
      const expiredCheck = await pool.request()
        .input('token', token)
        .query(`
          SELECT * FROM Verificacion
          WHERE token = @token
          AND usado = 0
        `);
      
      if (expiredCheck.recordset.length > 0) {
        return res.status(400).json({ 
          message: 'Token expirado. Por favor solicita un nuevo código de verificación',
          code: 'TOKEN_EXPIRED'
        });
      }
      return res.status(400).json({ message: 'Token inválido o ya usado' });
    }

    const { id_usuario } = result.recordset[0];

    // Marcar como verificado en Usuario
    await pool.request()
      .input('id_usuario', id_usuario)
      .query(`
        UPDATE Usuario SET verificado = 1 WHERE id_usuario = @id_usuario
      `);

    // Marcar token como usado
    await pool.request()
      .input('token', token)
      .query(`
        UPDATE Verificacion SET usado = 1 WHERE token = @token
      `);

    res.json({ message: '✅ Cuenta verificada correctamente' });
  } catch (err) {
    console.error('Error al verificar cuenta:', err);
    res.status(500).json({ message: '❌ Error interno al verificar la cuenta' });
  }
});

// ===========================
// Reenviar token de verificación
// ===========================
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Correo electrónico requerido' });
  }

  try {
    await poolConnect;

    // Buscar usuario no verificado
    const userResult = await pool.request()
      .input('correo', email)
      .query(`
        SELECT id_usuario, verificado 
        FROM Usuario 
        WHERE correo = @correo
      `);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const user = userResult.recordset[0];

    if (user.verificado) {
      return res.status(400).json({ message: 'El correo ya está verificado' });
    }

    // Eliminar tokens antiguos
    await pool.request()
      .input('id_usuario', user.id_usuario)
      .query('DELETE FROM Verificacion WHERE id_usuario = @id_usuario');

    // Crear nuevo token (15 caracteres)
    const token = crypto.randomBytes(8).toString('hex').slice(0, 15);

    // Insertar nuevo token
    await pool.request()
      .input('id_usuario', user.id_usuario)
      .input('token', token)
      .query(`
        INSERT INTO Verificacion (id_usuario, token)
        VALUES (@id_usuario, @token)
      `);

    // Obtener nombre del usuario para el email
    const personaResult = await pool.request()
      .input('id_persona', user.id_persona)
      .query('SELECT nombre FROM Persona WHERE id_persona = @id_persona');

    const nombre = personaResult.recordset[0]?.nombre || 'Usuario';

    // Enviar email
    await sendVerificationEmail(email, token, nombre);

    res.json({ message: '✅ Nuevo código de verificación enviado a tu correo' });
  } catch (err) {
    console.error('Error al reenviar token:', err);
    res.status(500).json({ message: '❌ Error al reenviar el código de verificación' });
  }
});

// ============================
// Obtener usuarios por parte del administrador
// ============================
router.get('/usuarios', async (req, res) => {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT 
        U.id_usuario,
        U.correo,
        U.id_rol,
        P.nombre
      FROM Usuario U
      JOIN Persona P ON U.id_persona = P.id_persona
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// ============================
// Crear usuarios por parte del administrador
// ============================
router.post('/crear-usuario', async (req, res) => {
  const { nombre, correo, contrasena, id_rol } = req.body;
  if (!nombre || !correo || !contrasena || !id_rol) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    await poolConnect;

    const existe = await pool.request()
      .input('correo', correo)
      .query('SELECT * FROM Usuario WHERE correo = @correo');

    if (existe.recordset.length > 0) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const persona = await pool.request()
      .input('nombre', nombre)
      .query(`INSERT INTO Persona (nombre) OUTPUT INSERTED.id_persona AS id_persona VALUES (@nombre)`);

    const id_persona = persona.recordset[0].id_persona;
    const hash = await bcrypt.hash(contrasena, 10);

    await pool.request()
      .input('id_persona', id_persona)
      .input('correo', correo)
      .input('contrasena', hash)
      .input('estado', 'activo')
      .input('id_rol', id_rol)
      .query(`INSERT INTO Usuario (id_persona, correo, contrasena, estado, id_rol) VALUES (@id_persona, @correo, @contrasena, @estado, @id_rol)`);

    res.status(201).json({ message: 'Usuario creado correctamente' });

  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ==========================================================
// Actualizar/Cambiar usuarios por parte del administrador
// ==========================================================
router.put('/usuarios/:id', async (req, res) => {
  const id_usuario = req.params.id;
  const { nombre, correo, id_rol } = req.body;

  try {
    await poolConnect;

    const usuario = await pool.request()
      .input('id_usuario', id_usuario)
      .query(`SELECT id_persona FROM Usuario WHERE id_usuario = @id_usuario`);

    if (usuario.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id_persona = usuario.recordset[0].id_persona;

    await pool.request()
      .input('id_usuario', id_usuario)
      .input('correo', correo)
      .input('id_rol', id_rol)
      .query(`
        UPDATE Usuario 
        SET correo = @correo, id_rol = @id_rol 
        WHERE id_usuario = @id_usuario
      `);

    await pool.request()
      .input('id_persona', id_persona)
      .input('nombre', nombre)
      .query(`
        UPDATE Persona 
        SET nombre = @nombre 
        WHERE id_persona = @id_persona
      `);

    res.status(200).json({ message: 'Usuario actualizado correctamente' });

  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

//=======================
// Eliminar usuario
//=======================
router.delete('/usuarios/:id', async (req, res) => {
  const id_usuario = req.params.id;

  try {
    await poolConnect;

    await pool.request()
      .input('id_usuario', id_usuario)
      .query('DELETE FROM Usuario WHERE id_usuario = @id_usuario');

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});


// ===========================
// Olvidé mi contraseña
// ===========================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Correo electrónico requerido' });
  }

  try {
    await poolConnect;

    // Verificar si el usuario existe
    const userResult = await pool.request()
      .input('correo', email)
      .query('SELECT id_usuario FROM Usuario WHERE correo = @correo');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const id_usuario = userResult.recordset[0].id_usuario;

    // Eliminar tokens antiguos
    await pool.request()
      .input('id_usuario', id_usuario)
      .query('DELETE FROM RecuperacionPassword WHERE id_usuario = @id_usuario');

    // Crear token de recuperación
    const token = crypto.randomBytes(32).toString('hex');

    // Insertar token en la base de datos
    await pool.request()
      .input('id_usuario', id_usuario)
      .input('token', token)
      .query(`
        INSERT INTO RecuperacionPassword (id_usuario, token)
        VALUES (@id_usuario, @token)
      `);

    // Enviar email con el enlace de recuperación
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetLink);

    res.json({ 
      message: 'Se ha enviado un enlace de recuperación a tu correo electrónico',
      token // Solo para desarrollo, quitar en producción
    });

  } catch (err) {
    console.error('Error en forgot-password:', err);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

// ===========================
// Restablecer contraseña
// ===========================
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
  }

  try {
    await poolConnect;

    // Verificar token válido (válido por 1 hora)
    const tokenResult = await pool.request()
      .input('token', token)
      .query(`
        SELECT * FROM RecuperacionPassword
        WHERE token = @token
        AND DATEDIFF(MINUTE, fecha_creacion, GETDATE()) <= 60
      `);

    if (tokenResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const { id_usuario } = tokenResult.recordset[0];

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await pool.request()
      .input('id_usuario', id_usuario)
      .input('contrasena', hashedPassword)
      .query('UPDATE Usuario SET contrasena = @contrasena WHERE id_usuario = @id_usuario');

    // Eliminar token usado
    await pool.request()
      .input('token', token)
      .query('DELETE FROM RecuperacionPassword WHERE token = @token');

    res.json({ message: 'Contraseña actualizada con éxito' });

  } catch (err) {
    console.error('Error en reset-password:', err);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
});

module.exports = router;