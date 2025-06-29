const fs = require('fs');
const path = require('path');
const horarioPath = path.join(__dirname, '../config/horarioConfig.js');

let horario = require('../config/horarioConfig');

exports.obtenerHorario = (req, res) => {
  res.json(horario);
};

exports.actualizarHorario = (req, res) => {
  const { hora_inicio, hora_fin } = req.body;
  if (!hora_inicio || !hora_fin) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }

  const nuevoHorario = { hora_inicio, hora_fin };
  const contenido = `module.exports = ${JSON.stringify(nuevoHorario, null, 2)};\n`;

  fs.writeFile(horarioPath, contenido, 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar el horario:', err);
      return res.status(500).json({ error: 'Error al guardar el horario' });
    }
    horario = nuevoHorario;
    res.json({ mensaje: 'Horario actualizado correctamente', horario });
  });
};
