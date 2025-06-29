router.get('/horario-reservas', (req, res) => {
  res.json({
    hora_inicio: '09:00',
    hora_fin: '17:00'
  });
});
