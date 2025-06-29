const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Obtener todos los permisos
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM Permiso ORDER BY id_permiso DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener permisos:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear permiso
router.post('/', async (req, res) => {
  const { nombre_permiso, descripcion } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('nombre_permiso', nombre_permiso)
      .input('descripcion', descripcion)
      .query('INSERT INTO Permiso (nombre_permiso, descripcion) VALUES (@nombre_permiso, @descripcion)');
    res.json({ message: 'Permiso creado correctamente' });
  } catch (err) {
    console.error('Error al crear permiso:', err);
    res.status(500).json({ message: 'Error al crear permiso' });
  }
});

// Editar permiso
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_permiso, descripcion } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('id', id)
      .input('nombre_permiso', nombre_permiso)
      .input('descripcion', descripcion)
      .query('UPDATE Permiso SET nombre_permiso = @nombre_permiso, descripcion = @descripcion WHERE id_permiso = @id');
    res.json({ message: 'Permiso actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar permiso:', err);
    res.status(500).json({ message: 'Error al actualizar permiso' });
  }
});

// Eliminar permiso
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Permiso WHERE id_permiso = @id');
    res.json({ message: 'Permiso eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar permiso:', err);
    res.status(500).json({ message: 'Error al eliminar permiso' });
  }
});

module.exports = router;
