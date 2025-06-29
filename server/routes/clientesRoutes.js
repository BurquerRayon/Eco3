const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Obtener datos personales
router.get('/datos/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('id_usuario', id_usuario)
      .query(`
        SELECT P.id_persona, P.nombre, P.apellido, P.cedula, P.fecha_nacimiento, P.edad, P.telefono,
               P.id_nacionalidad, P.id_sexo, N.nombre as nacionalidad, S.nombre as sexo
        FROM Usuario U
        JOIN Persona P ON U.id_persona = P.id_persona
        LEFT JOIN Nacionalidad N ON P.id_nacionalidad = N.id_nacionalidad
        LEFT JOIN Sexo S ON P.id_sexo = S.id_sexo
        WHERE U.id_usuario = @id_usuario
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener datos personales:', err);
    res.status(500).json({ message: 'Error al obtener datos personales' });
  }
});

// Actualizar datos personales
router.put('/datos/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  const {
    nombre, apellido, cedula, fecha_nacimiento, edad,
    telefono, id_nacionalidad, id_sexo
  } = req.body;

  try {
    await poolConnect;
    const result = await pool.request()
      .input('id_usuario', id_usuario)
      .query(`SELECT id_persona FROM Usuario WHERE id_usuario = @id_usuario`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id_persona = result.recordset[0].id_persona;

    await pool.request()
      .input('id_persona', id_persona)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('cedula', cedula)
      .input('fecha_nacimiento', fecha_nacimiento)
      .input('edad', edad)
      .input('telefono', telefono)
      .input('id_nacionalidad', id_nacionalidad)
      .input('id_sexo', id_sexo)
      .query(`
        UPDATE Persona SET
          nombre = @nombre,
          apellido = @apellido,
          cedula = @cedula,
          fecha_nacimiento = @fecha_nacimiento,
          edad = @edad,
          telefono = @telefono,
          id_nacionalidad = @id_nacionalidad,
          id_sexo = @id_sexo
        WHERE id_persona = @id_persona
      `);

    res.json({ message: '✅ Datos actualizados correctamente' });
  } catch (err) {
    console.error('Error al actualizar datos personales:', err);
    res.status(500).json({ message: 'Error al actualizar los datos personales' });
  }
});

// En tu archivo de rutas (clientesRoutes.js), modifica temporalmente para debuggear:

router.get('/nacionalidades', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT id_nacionalidad, nombre, codigo_iso 
      FROM Nacionalidad 
      ORDER BY nombre
    `);
    console.log('Nacionalidades desde DB:', result.recordset); // Debug
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener nacionalidades:', err);
    res.status(500).json({ 
      message: 'Error al obtener nacionalidades',
      error: err.message // Envía el mensaje de error
    });
  }
});

router.get('/sexos', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT id_sexo, nombre 
      FROM Sexo
      ORDER BY nombre
    `);
    console.log('Sexos desde DB:', result.recordset); // Debug
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener sexos:', err);
    res.status(500).json({ 
      message: 'Error al obtener sexos',
      error: err.message // Envía el mensaje de error
    });
  }
});

module.exports = router;