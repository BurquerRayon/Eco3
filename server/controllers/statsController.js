const { sql, pool, poolConnect } = require('../db/connection');

const obtenerEstadisticas = async (req, res) => {
  try {
    await poolConnect;

    const usuarios = await pool.request().query('SELECT COUNT(*) AS total FROM Usuario');
    const reservas = await pool.request().query('SELECT COUNT(*) AS total FROM Reservas');
    const atracciones = await pool.request().query('SELECT COUNT(*) AS total FROM Atraccion');

    const ingresosTotales = await pool.request().query(`
      SELECT SUM(r.total_pago_estimado) AS ingresos_totales
      FROM reservas r
      JOIN Reserva_Detalles rd ON r.id_reserva = rd.id_reserva
      WHERE r.estado != 'cancelada'
    `);

    // ➤ Ingresos por mes y atracción (para ReportesAdmin)
    const ingresosPorMes = await pool.request().query(`
      SET LANGUAGE Spanish;
      SELECT 
        DATENAME(MONTH, rd.fecha) AS mes,
        MONTH(rd.fecha) AS mes_numero,
        YEAR(rd.fecha) AS anio,
        a.nombre AS atraccion,
        SUM(r.total_pago_estimado) AS ingresos_mes
      FROM reservas r
      JOIN Reserva_Detalles rd ON r.id_reserva = rd.id_reserva
      JOIN Atraccion a ON rd.id_atraccion = a.id_atraccion
      WHERE r.estado != 'cancelada'
      GROUP BY DATENAME(MONTH, rd.fecha), MONTH(rd.fecha), YEAR(rd.fecha), a.nombre
      ORDER BY YEAR(rd.fecha), MONTH(rd.fecha)
    `);

    // ➤ Ingresos totales por mes (para HomeAdmin)
    const ingresosPorMesTotales = await pool.request().query(`
      SET LANGUAGE Spanish;
      SELECT 
        DATENAME(MONTH, rd.fecha) + ' ' + CAST(YEAR(rd.fecha) AS VARCHAR) AS mes,
        MONTH(rd.fecha) AS mes_numero,
        YEAR(rd.fecha) AS anio,
        SUM(r.total_pago_estimado) AS ingresos_mes
      FROM reservas r
      JOIN Reserva_Detalles rd ON r.id_reserva = rd.id_reserva
      WHERE r.estado != 'cancelada'
      GROUP BY DATENAME(MONTH, rd.fecha), MONTH(rd.fecha), YEAR(rd.fecha)
      ORDER BY YEAR(rd.fecha), MONTH(rd.fecha)
    `);


    // ➤ Reservas por atracción (para ReportesAdmin)
    const reservasPorAtraccion = await pool.request().query(`
      SELECT 
        a.nombre AS atraccion,
        COUNT(rd.id_detalle_reserva) AS total_reservas,
        a.precio
      FROM Atraccion a
      LEFT JOIN Reserva_Detalles rd ON a.id_atraccion = rd.id_atraccion
      LEFT JOIN reservas r ON rd.id_reserva = r.id_reserva
      WHERE r.estado IS NULL OR r.estado != 'cancelada'
      GROUP BY a.nombre, a.precio
      ORDER BY total_reservas DESC
    `);

    res.json({
      usuarios: usuarios.recordset[0].total,
      reservas: reservas.recordset[0].total,
      atracciones: atracciones.recordset[0].total,
      ingresos: ingresosTotales.recordset[0].ingresos_totales || 0,
      ingresosPorMesTotales: ingresosPorMesTotales.recordset,
      ingresosPorMes: ingresosPorMes.recordset,

      reservasPorAtraccion: reservasPorAtraccion.recordset

    });

  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = {
  obtenerEstadisticas
};
