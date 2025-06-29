const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Obtener todas las nacionalidades
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM Nacionalidad ORDER BY nombre');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener nacionalidades:', err);
    res.status(500).json({ message: 'Error al obtener nacionalidades' });
  }
});

// Crear nueva nacionalidad
router.post('/', async (req, res) => {
  const { nombre, codigo_iso } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('nombre', nombre)
      .input('codigo_iso', codigo_iso)
      .query('INSERT INTO Nacionalidad (nombre, codigo_iso) VALUES (@nombre, @codigo_iso)');
    res.json({ message: 'Nacionalidad creada' });
  } catch (err) {
    console.error('Error al crear nacionalidad:', err);
    res.status(500).json({ message: 'Error al crear nacionalidad' });
  }
});

// Actualizar nacionalidad
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo_iso } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('codigo_iso', codigo_iso)
      .query('UPDATE Nacionalidad SET nombre = @nombre, codigo_iso = @codigo_iso WHERE id_nacionalidad = @id');
    res.json({ message: 'Nacionalidad actualizada' });
  } catch (err) {
    console.error('Error al actualizar nacionalidad:', err);
    res.status(500).json({ message: 'Error al actualizar nacionalidad' });
  }
});

// Eliminar nacionalidad
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Nacionalidad WHERE id_nacionalidad = @id');
    res.json({ message: 'Nacionalidad eliminada' });
  } catch (err) {
    console.error('Error al eliminar nacionalidad:', err);
    res.status(500).json({ message: 'Error al eliminar nacionalidad' });
  }
});

module.exports = router;
