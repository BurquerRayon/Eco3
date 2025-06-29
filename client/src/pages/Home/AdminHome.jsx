import React, { useEffect, useState } from 'react';
import '../../styles/AdminHome.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [estadisticas, setEstadisticas] = useState({
    usuarios: 0,
    reservas: 0,
    ingresos: 0,
    atracciones: 0,
    ingresosPorMesTotales: [],
  });

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/stats')
      .then(res => setEstadisticas(res.data))
      .catch(err => console.error('Error al cargar estadísticas:', err));
  }, []);

  // Función para ordenar los meses cronológicamente
  const sortMonths = (data) => {
    if (!data || data.length === 0) return [];

    const monthOrder = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    return [...data].sort((a, b) => {
      const [monthA, yearA] = a.mes.split(' ');
      const [monthB, yearB] = b.mes.split(' ');
      if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
      return monthOrder.indexOf(monthB.toLowerCase()) - monthOrder.indexOf(monthA.toLowerCase());
    });
  };

  const sortedData = sortMonths(estadisticas.ingresosPorMesTotales);

  const chartData = {
    labels: sortedData.map(item => item.mes),
    datasets: [
      {
        label: 'Ingresos ($)',
        data: sortedData.map(item => item.ingresos_mes),
        backgroundColor: 'rgba(46, 139, 87, 0.6)',
        borderColor: 'rgba(46, 139, 87, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ingresos Mensuales (Totales)',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monto ($)',
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mes',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Panel del Administrador</h1>
        <p>Bienvenido de nuevo. Gestiona el sistema desde aquí.</p>
      </header>

      <section className="resumen-grid">
        <div className="card resumen">
          <h3>Usuarios Registrados</h3>
          <p>{estadisticas.usuarios}</p>
        </div>

        <div className="card resumen">
          <h3>Reservas Totales</h3>
          <p>{estadisticas.reservas}</p>
        </div>

        <div className="card resumen">
          <h3>Ingresos Totales</h3>
          <p>${parseFloat(estadisticas.ingresos).toFixed(2)}</p>
        </div>

        <div className="card resumen">
          <h3>Atracciones</h3>
          <p>{estadisticas.atracciones}</p>
        </div>
      </section>

      <section className="grafica-ingresos">
        <h2>Ingresos por Mes</h2>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </section>

      <div className="ingresos-lista-container">
        <h3>Detalle por Mes</h3>
        <ul className="ingresos-lista">
          {sortedData.map((mes, index) => (
            <li key={index}>
              <strong>{mes.mes}:</strong> ${parseFloat(mes.ingresos_mes).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <section className="acciones-rapidas">
        <h2>Accesos Rápidos</h2>
        <div className="acciones-grid">
          <Link to="/admin/config" className="card acceso">⚙️ Configuración</Link>
          <Link to="/admin/Reservas" className="card acceso">📋 Reservas</Link>
          <Link to="/admin/usuarios" className="card acceso">👥 Usuarios</Link>
          <Link to="/admin/reportes" className="card acceso">📊 Reportes</Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
