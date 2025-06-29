import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AdminReservas.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroHora, setFiltroHora] = useState({ horaInicio: '', horaFin: '' });
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    obtenerReservas();
  }, []);

  const obtenerReservas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/reservas/admin');
      setReservas(res.data);
    } catch (err) {
      console.error('Error al cargar reservas:', err);
    }
  };

const cambiarEstadoReserva = async (id, nuevoEstado) => {
  const confirmacion = window.confirm(`¿Seguro que deseas marcar esta reserva como ${nuevoEstado}?`);
  if (!confirmacion) return;

  try {
    await axios.put(`http://localhost:3001/api/reservas/estado/${id}`, { estado: nuevoEstado });
    obtenerReservas();
  } catch (err) {
    console.error('Error al cambiar estado:', err);
  }
};

  const formatearHora = (hora) => {
    if (!hora) return '';
    if (hora.includes('T')) {
      return hora.split('T')[1].slice(0, 5); // "1970-01-01T19:10:00.000Z" -> "19:10"
    }
    return hora.slice(0, 5); // "19:10:00.0000000" -> "19:10"
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    const coincideFecha = !filtroFecha || reserva.fecha?.startsWith(filtroFecha);
    const horaFormateada = formatearHora(reserva.hora);
    const coincideHora =
      (!filtroHora.horaInicio || horaFormateada >= filtroHora.horaInicio) &&
      (!filtroHora.horaFin || horaFormateada <= filtroHora.horaFin);
    const coincideEstado = !filtroEstado || reserva.estado === filtroEstado;
    return coincideFecha && coincideHora && coincideEstado;
  });

  const exportarPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Reporte de Reservas', 14, 15);

  const headers = [['Cliente', 'Atracción', 'Fecha', 'Hora', 'Cantidad', 'Subtotal', 'Estado']];

  const datos = reservasFiltradas.map((r) => [
    r.nombre_cliente,
    r.nombre_atraccion,
    r.fecha.split('T')[0],
    formatearHora(r.hora),
    r.cantidad,
    `$${r.subtotal.toFixed(2)}`,
    r.estado
  ]);

  autoTable(doc, {
    head: headers,
    body: datos,
    startY: 25,
    theme: 'striped',
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255]
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    }
  });

  doc.save('reporte-reservas.pdf');
};

const exportarExcel = () => {
  const worksheetData = reservasFiltradas.map(r => ({
    Cliente: r.nombre_cliente,
    Atracción: r.nombre_atraccion,
    Fecha: r.fecha.split('T')[0],
    Hora: formatearHora(r.hora),
    Cantidad: r.cantidad,
    Subtotal: r.subtotal,
    Estado: r.estado
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'reservas.xlsx');
};


  return (
    <div className="admin-reservas-container">
            <Link to="/admin/dashboard" className="btn-volver">Volver al Dashboard</Link>
      <h2>Gestión de Reservas</h2>

      <div className="filtros">
        <div className="filtro-grupo">
          <label>Fecha:</label>
          <input type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
        </div>

        <div className="filtro-grupo">
          <label>Hora desde:</label>
          <input
            type="time"
            value={filtroHora.horaInicio}
            onChange={(e) => setFiltroHora(prev => ({ ...prev, horaInicio: e.target.value }))}
          />
        </div>

        <div className="filtro-grupo">
          <label>Hora hasta:</label>
          <input
            type="time"
            value={filtroHora.horaFin}
            onChange={(e) => setFiltroHora(prev => ({ ...prev, horaFin: e.target.value }))}
          />
        </div>

        <div className="filtro-grupo">
          <label>Estado:</label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="acciones-exportar">
          <button onClick={exportarPDF} className="btn-exportar">📄 Exportar PDF</button>
          <button onClick={exportarExcel}className="btn-exportar">📊 Exportar a Excel</button>
        </div>
      </div>

      <table className="tabla-admin-reservas">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Atracción</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservasFiltradas.length === 0 ? (
            <tr><td colSpan="8">No hay reservas</td></tr>
          ) : reservasFiltradas.map((r, i) => (
            <tr key={i}>
              <td>{r.nombre_cliente}</td>
              <td>{r.nombre_atraccion}</td>
              <td>{r.fecha?.split('T')[0]}</td>
              <td>{formatearHora(r.hora)}</td>
              <td>{r.cantidad}</td>
              <td>${r.subtotal?.toFixed(2)}</td>
              <td>{r.estado}</td>
              <td>
                {r.estado === 'pendiente' && (
                  <>
                    <button onClick={() => cambiarEstadoReserva(r.id_reserva, 'confirmado')}>✅</button>
                    <button onClick={() => cambiarEstadoReserva(r.id_reserva, 'cancelado')}>❌</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservas;
