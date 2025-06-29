const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

// Obtener permisos de un rol
router.get('/:id_rol', async (req, res) => {
  const { id_rol } = req.params;
  try {
    await poolConnect;
    const result = await pool.request()
      .input('id_rol', id_rol)
      .query(`
        SELECT P.id_permiso, P.nombre_permiso, P.descripcion
        FROM Permiso P
        INNER JOIN Rol_Permiso RP ON P.id_permiso = RP.id_permiso
        WHERE RP.id_rol = @id_rol
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener permisos del rol:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Asignar permiso a un rol
router.post('/', async (req, res) => {
  const { id_rol, id_permiso } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('id_rol', id_rol)
      .input('id_permiso', id_permiso)
      .query('INSERT INTO Rol_Permiso (id_rol, id_permiso) VALUES (@id_rol, @id_permiso)');
    res.json({ message: 'Permiso asignado al rol correctamente' });
  } catch (err) {
    console.error('Error al asignar permiso:', err);
    res.status(500).json({ message: 'Error al asignar permiso' });
  }
});

// Eliminar permiso de un rol
router.delete('/', async (req, res) => {
  const { id_rol, id_permiso } = req.body;
  try {
    await poolConnect;
    await pool.request()
      .input('id_rol', id_rol)
      .input('id_permiso', id_permiso)
      .query('DELETE FROM Rol_Permiso WHERE id_rol = @id_rol AND id_permiso = @id_permiso');
    res.json({ message: 'Permiso removido del rol correctamente' });
  } catch (err) {
    console.error('Error al eliminar permiso del rol:', err);
    res.status(500).json({ message: 'Error al eliminar permiso del rol' });
  }
});

module.exports = router;
