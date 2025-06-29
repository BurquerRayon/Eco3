const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Obtener todas las monedas
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM Moneda');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener monedas:', err);
    res.status(500).json({ message: 'Error al obtener monedas' });
  }
});

// Crear nueva moneda
router.post('/', async (req, res) => {
  const { nombre, simbolo, codigo_iso, tasa_cambio } = req.body;

  try {
    await poolConnect;
    await pool.request()
      .input('nombre', nombre)
      .input('simbolo', simbolo)
      .input('codigo_iso', codigo_iso)
      .input('tasa_cambio', tasa_cambio)
      .query(`
        INSERT INTO Moneda (nombre, simbolo, codigo_iso, tasa_cambio)
        VALUES (@nombre, @simbolo, @codigo_iso, @tasa_cambio)
      `);
    res.json({ message: 'Moneda creada correctamente' });
  } catch (err) {
    console.error('Error al crear moneda:', err);
    res.status(500).json({ message: 'Error al crear moneda' });
  }
});

// Actualizar moneda
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, simbolo, codigo_iso, tasa_cambio } = req.body;

  try {
    await poolConnect;
    await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('simbolo', simbolo)
      .input('codigo_iso', codigo_iso)
      .input('tasa_cambio', tasa_cambio)
      .query(`
        UPDATE Moneda
        SET nombre = @nombre, simbolo = @simbolo, codigo_iso = @codigo_iso, tasa_cambio = @tasa_cambio
        WHERE id_moneda = @id
      `);
    res.json({ message: 'Moneda actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar moneda:', err);
    res.status(500).json({ message: 'Error al actualizar moneda' });
  }
});

// Eliminar moneda
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await poolConnect;
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Moneda WHERE id_moneda = @id');
    res.json({ message: 'Moneda eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar moneda:', err);
    res.status(500).json({ message: 'Error al eliminar moneda' });
  }
});

module.exports = router;
