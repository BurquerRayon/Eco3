import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../styles/ReportesAdmin.css';
import { Link } from 'react-router-dom';

const ReportesAdmin = () => {
  const [stats, setStats] = useState(null);
  const [filtroAnio, setFiltroAnio] = useState('Todos');
  const [filtroAtraccion, setFiltroAtraccion] = useState('Todas');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="loading">Cargando estadísticas...</p>;

  // Extraer años y atracciones únicas
  const aniosDisponibles = [...new Set(stats.ingresosPorMes.map(m => m.anio))];
  const atraccionesDisponibles = [...new Set(stats.ingresosPorMes.map(m => m.atraccion))];

  // Aplicar filtros
  const ingresosFiltrados = stats.ingresosPorMes.filter(m => {
    const cumpleAnio = filtroAnio === 'Todos' || m.anio === parseInt(filtroAnio);
    const cumpleAtraccion = filtroAtraccion === 'Todas' || m.atraccion === filtroAtraccion;
    return cumpleAnio && cumpleAtraccion;
  });

  // Ordenar por año y mes
  const ingresosOrdenados = [...ingresosFiltrados].sort((a, b) => {
    if (a.anio !== b.anio) return a.anio - b.anio;
    return a.mes_numero - b.mes_numero;
  });

  // Datos para la gráfica
  const chartData = {
    labels: ingresosOrdenados.map(m => `${m.mes} ${m.anio}`),
    datasets: [{
      label: 'Ingresos mensuales',
      data: ingresosOrdenados.map(m => m.ingresos_mes),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderRadius: 5,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Ingresos por Mes' }
    }
  };

  // Exportar a Excel
  const exportarExcel = () => {
    const datosFormateados = ingresosOrdenados.map(item => ({
      Mes: item.mes,
      Año: item.anio,
      Atracción: item.atraccion,
      Ingresos: `$${item.ingresos_mes.toFixed(2)}`
    }));

    const ws = XLSX.utils.json_to_sheet(datosFormateados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ingresos');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'reporte-ingresos.xlsx');
  };

  // Exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Ingresos Mensuales', 14, 15);

    const headers = [['Mes', 'Año', 'Atracción', 'Ingresos']];
    const datos = ingresosOrdenados.map(m => [
      m.mes,
      m.anio.toString(),
      m.atraccion,
      `$${m.ingresos_mes.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: headers,
      body: datos,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: [75, 192, 192],
        textColor: [255, 255, 255]
      }
    });

    doc.save('reporte-ingresos.pdf');
  };

  return (
    <div className="reportes-container">
      <Link to="/admin/dashboard" className="btn-volver">Volver al Dashboard</Link>
      <h2 className="titulo-reportes">Panel de Reportes</h2>

      <div className="tarjetas-container">
        <div className="tarjeta">Usuarios<br /><span>{stats.usuarios}</span></div>
        <div className="tarjeta">Reservas<br /><span>{stats.reservas}</span></div>
        <div className="tarjeta">Atracciones<br /><span>{stats.atracciones}</span></div>
        <div className="tarjeta">Ingresos Totales<br /><span>${stats.ingresos.toFixed(2)}</span></div>
      </div>

      <div className="filtros-reportes">
        <div className="filtro">
          <label>Año: </label>
          <select value={filtroAnio} onChange={(e) => setFiltroAnio(e.target.value)}>
            <option value="Todos">Todos</option>
            {aniosDisponibles.map((anio, idx) => (
              <option key={idx} value={anio}>{anio}</option>
            ))}
          </select>
        </div>

        <div className="filtro">
          <label>Atracción: </label>
          <select value={filtroAtraccion} onChange={(e) => setFiltroAtraccion(e.target.value)}>
            <option value="Todas">Todas</option>
            {atraccionesDisponibles.map((atr, idx) => (
              <option key={idx} value={atr}>{atr}</option>
            ))}
          </select>
        </div>

        <div className="botones-exportar">
          <button onClick={exportarExcel}>Exportar Excel</button>
          <button onClick={exportarPDF}>Exportar PDF</button>
        </div>
      </div>

      <div className="grafica-ingresos">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <h3 className="subtitulo">Ingresos Mensuales</h3>
      <table className="tabla-ingresos">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Año</th>
            <th>Atracción</th>
            <th>Ingresos</th>
          </tr>
        </thead>
        <tbody>
          {ingresosOrdenados.map((mes, index) => (
            <tr key={index}>
              <td>{mes.mes}</td>
              <td>{mes.anio}</td>
              <td>{mes.atraccion}</td>
              <td>${mes.ingresos_mes.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportesAdmin;
