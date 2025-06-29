const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Obtener todos los tipos de reporte
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM Tipo_Reporte');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener tipos de reporte:', err);
    res.status(500).json({ message: 'Error al obtener tipos de reporte' });
  }
});

// Crear nuevo tipo de reporte
router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .query(`
        INSERT INTO Tipo_Reporte (nombre, descripcion)
        VALUES (@nombre, @descripcion)
      `);
    res.json({ message: 'Tipo de reporte creado' });
  } catch (err) {
    console.error('Error al crear tipo de reporte:', err);
    res.status(500).json({ message: 'Error al crear tipo de reporte' });
  }
});

// Actualizar tipo de reporte
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .query(`
        UPDATE Tipo_Reporte
        SET nombre = @nombre, descripcion = @descripcion
        WHERE id_tipo_reporte = @id
      `);
    res.json({ message: 'Tipo de reporte actualizado' });
  } catch (err) {
    console.error('Error al actualizar tipo de reporte:', err);
    res.status(500).json({ message: 'Error al actualizar tipo de reporte' });
  }
});

// Eliminar tipo de reporte
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Tipo_Reporte WHERE id_tipo_reporte = @id');
    res.json({ message: 'Tipo de reporte eliminado' });
  } catch (err) {
    console.error('Error al eliminar tipo de reporte:', err);
    res.status(500).json({ message: 'Error al eliminar tipo de reporte' });
  }
});

module.exports = router;