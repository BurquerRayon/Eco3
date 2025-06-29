const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const horarioPath = path.join(__dirname, '../config/horarioConfig.js');
const horario = require(horarioPath);

router.get('/horario-reservas', (req, res) => {
  const horarioPath = path.join(__dirname, '../config/horarioConfig.js');

  // Borrar caché del require
  delete require.cache[require.resolve(horarioPath)];

  const horario = require(horarioPath);
  res.json(horario);
});


router.put('/horario-reservas', (req, res) => {
  const { hora_inicio, hora_fin } = req.body;
  const nuevoHorario = `module.exports = { hora_inicio: "${hora_inicio}", hora_fin: "${hora_fin}" };`;
  fs.writeFile(horarioPath, nuevoHorario, (err) => {
    if (err) return res.status(500).json({ error: 'No se pudo guardar el horario' });
    res.json({ mensaje: 'Horario actualizado correctamente' });
  });
});

module.exports = router;
