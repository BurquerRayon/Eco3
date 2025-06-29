const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// ✅ Obtener todos los roles
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM Rol');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener roles:', err);
    res.status(500).json({ message: 'Error al obtener roles' });
  }
});

// ✅ Crear un nuevo rol
router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    await poolConnect;

    await pool.request()
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .query(`
        INSERT INTO Rol (nombre, descripcion)
        VALUES (@nombre, @descripcion)
      `);

    res.json({ message: 'Rol creado exitosamente' });

  } catch (err) {
    console.error('❌ Error al crear rol:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Actualizar un rol existente
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
        UPDATE Rol
        SET nombre = @nombre, descripcion = @descripcion
        WHERE id_rol = @id
      `);

    res.json({ message: 'Rol actualizado correctamente' });

  } catch (err) {
    console.error('❌ Error al actualizar rol:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Eliminar un rol
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await poolConnect;

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Rol WHERE id_rol = @id');

    res.json({ message: 'Rol eliminado' });

  } catch (err) {
    console.error('❌ Error al eliminar rol:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
