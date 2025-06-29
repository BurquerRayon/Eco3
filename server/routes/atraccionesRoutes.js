const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// ✅ Obtener todas las atracciones
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM Atraccion');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener atracciones:', err);
    res.status(500).json({ message: 'Error al obtener atracciones' });
  }
});

// ✅ Crear una nueva atracción
router.post('/', async (req, res) => {
  const { nombre, descripcion, duracion, max_personas, precio } = req.body;

  try {
    await poolConnect;

    await pool.request()
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('duracion', duracion)
      .input('max_personas', max_personas)
      .input('precio', precio)
      .query(`
        INSERT INTO Atraccion (nombre, descripcion, duracion, max_personas, precio)
        VALUES (@nombre, @descripcion, @duracion, @max_personas, @precio)
      `);

    res.json({ message: 'Atracción creada exitosamente' });

  } catch (err) {
    console.error('❌ Error al crear atracción:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Actualizar una atracción existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, duracion, max_personas, precio } = req.body;

  try {
    await poolConnect;

    await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('duracion', duracion)
      .input('max_personas', max_personas)
      .input('precio', precio)
      .query(`
        UPDATE Atraccion
        SET nombre = @nombre, 
            descripcion = @descripcion,
            duracion = @duracion,
            max_personas = @max_personas,
            precio = @precio
        WHERE id_atraccion = @id
      `);

    res.json({ message: 'Atracción actualizada correctamente' });

  } catch (err) {
    console.error('❌ Error al actualizar atracción:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Eliminar una atracción
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await poolConnect;

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Atraccion WHERE id_atraccion = @id');

    res.json({ message: 'Atracción eliminada' });

  } catch (err) {
    console.error('❌ Error al eliminar atracción:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;