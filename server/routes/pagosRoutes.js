const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db/connection');

//=================
// Registrar pago
//==================

router.post('/registrar', async (req, res) => {
  const { 
    id_reserva, 
    id_turista,
    id_metodo_pago, 
    id_moneda, 
    monto,
    id_tarjeta
  } = req.body;

  if (!id_reserva || !id_turista || !id_metodo_pago || !id_moneda || !monto) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    await poolConnect;

    // Verificar reserva
    const reservaCheck = await pool.request()
      .input('id_reserva', id_reserva)
      .query('SELECT estado, pagado FROM Reservas WHERE id_reserva = @id_reserva');

    if (reservaCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const { estado, pagado } = reservaCheck.recordset[0];
    if (estado === 'cancelado') {
      return res.status(400).json({ message: 'Reserva cancelada' });
    }
    if (pagado) {
      return res.status(400).json({ message: 'La reserva ya fue pagada' });
    }

    // Registrar pago
    const pagoResult = await pool.request()
      .input('id_reserva', id_reserva)
      .input('id_turista', id_turista)
      .input('id_metodo_pago', id_metodo_pago)
      .input('id_moneda', id_moneda)
      .input('monto', monto)
      .input('id_tarjeta', id_tarjeta)
      .input('codigo_autorizacion', 'SIM-' + Math.random().toString(36).substr(2, 8).toUpperCase())
      .input('estado', 'completado')
      .query(`
        INSERT INTO Pagos (
          id_reserva, 
          id_turista,
          id_metodo_pago, 
          id_moneda, 
          monto,
          id_tarjeta,
          codigo_autorizacion,
          estado,
          fecha
        ) 
        VALUES (
          @id_reserva,
          @id_turista,
          @id_metodo_pago,
          @id_moneda,
          @monto,
          @id_tarjeta,
          @codigo_autorizacion,
          @estado,
          GETDATE()
        )
      `);

    // Actualizar reserva
    await pool.request()
      .input('id_reserva', id_reserva)
      .query(`
        UPDATE Reservas 
        SET estado = 'confirmado', pagado = 1 
        WHERE id_reserva = @id_reserva
      `);

    res.json({ message: '✅ Pago registrado correctamente' });

  } catch (err) {
    console.error('Error al registrar pago:', err);
    res.status(500).json({ message: 'Error interno al registrar pago' });
  }
});

// ===============================
// Obtener tarjetas de un turista
//================================
router.get('/tarjetas/:id_turista', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .input('id_turista', req.params.id_turista)
      .query('SELECT * FROM Tarjeta_Cliente WHERE id_turista = @id_turista AND activa = 1');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener tarjetas:', err);
    res.status(500).json({ message: 'Error al obtener tarjetas' });
  }
});

// Registrar nueva tarjeta
router.post('/tarjetas/registrar', async (req, res) => {
  try {
    await poolConnect;
    console.log('Datos recibidos para tarjeta:', req.body);
    
    const result = await pool.request()
      .input('id_turista', req.body.id_turista)
      .input('ultimos_digitos', req.body.ultimos_digitos)
      .input('tipo_tarjeta', req.body.tipo_tarjeta)
      .input('nombre_titular', req.body.nombre_titular)
      .input('fecha_vencimiento', req.body.fecha_vencimiento)
      .query(`
        INSERT INTO Tarjeta_Cliente (
          id_turista, ultimos_digitos, tipo_tarjeta, 
          nombre_titular, fecha_vencimiento, activa
        ) 
        VALUES (
          @id_turista, @ultimos_digitos, @tipo_tarjeta,
          @nombre_titular, @fecha_vencimiento, 1
        );
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    console.log('Tarjeta registrada con ID:', result.recordset[0].id);
    res.json({ 
      success: true,
      id: result.recordset[0].id
    });
    
  } catch (err) {
    console.error('Error en registro de tarjeta:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar tarjeta',
      error: err.message 
    });
  }
});


// En pagosRoutes.js
router.get('/test', (req, res) => {
  res.json({ status: 'API funcionando', timestamp: new Date() });
});

module.exports = router;