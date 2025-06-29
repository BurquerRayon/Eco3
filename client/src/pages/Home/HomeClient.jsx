import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaMapMarkedAlt, FaUserEdit, FaImages, FaLeaf, FaArrowRight } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../../styles/HomeClient.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomeClient = () => {
  const { user } = useAuth();
  const [atraccionesData, setAtraccionesData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/stats')
      .then(res => setAtraccionesData(res.data.reservasPorAtraccion || []))
      .catch(err => console.error('Error al cargar datos:', err));
  }, []);

  const chartData = {
    labels: atraccionesData.map(item => item.atraccion),
    datasets: [
      {
        data: atraccionesData.map(item => item.total_reservas),
        backgroundColor: [
          '#4BC0C0',
          '#36A2EB',
          '#FFCE56',
          '#FF6384',
          '#9966FF',
          '#FF9F40',
          '#8AC24A',
          '#607D8B'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Popularidad de Atracciones',
        font: {
          size: 16
        }
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="cliente-home-container">
      <header className="cliente-home-header">
        <h1>Bienvenido, {user?.nombre || 'Turista'}</h1>
        <p>Explora, reserva y disfruta de la experiencia EcoMaravillas.</p>
      </header>

      <section className="cliente-home-grid">
        <div className="cliente-card" onClick={() => window.location.href = '/client/reservas'}>
          <FaCalendarAlt className="icono-card" />
          <h3>Reservar atracción</h3>
          <p>Agenda tu próxima visita a nuestras rutas ecológicas.</p>
        </div>

        <div className="cliente-card" onClick={() => window.location.href = '/map'}>
          <FaMapMarkedAlt className="icono-card" />
          <h3>Ver Mapa</h3>
          <p>Descubre hábitats y atracciones disponibles.</p>
        </div>

        <div className="cliente-card" onClick={() => window.location.href = '/gallery'}>
          <FaImages className="icono-card" />
          <h3>Galería de Especies</h3>
          <p>Observa la fauna y flora destacada de la reserva.</p>
        </div>

        <div className="cliente-card" onClick={() => window.location.href = '/client/config'}>
          <FaUserEdit className="icono-card" />
          <h3>Ajustes del Perfil</h3>
          <p>Actualiza tu información personal y preferencias.</p>
        </div>
      </section>

      <section className="atracciones-populares">
        <h2>Atracciones más populares</h2>
        <div className="atracciones-container">
          <div className="grafica-container">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          <div className="lista-atracciones">
            <h3>Ranking de Atracciones</h3>
            <ul>
              {atraccionesData.map((atraccion, index) => (
                <li key={index}>
                  <span className="ranking">{index + 1}.</span>
                  <span className="nombre">{atraccion.atraccion}</span>
                  <span className="reservas">{atraccion.total_reservas || 0} reservas</span>
                  <span className="precio">${parseFloat(atraccion.precio).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button 
          className="destacado-button"
          onClick={() => window.location.href = '/client/reservas'}>
          Reservar Ahora <FaArrowRight className="icono-destacado" />
        </button>
          </div>
        </div>
      </section>

      <section className="cliente-info-extra">
        <h2>🌿 ¿Por qué EcoMaravillas?</h2>
        <ul>
          <li><strong>Compromiso ambiental:</strong> Todas nuestras actividades están certificadas ecológicamente.</li>
          <li><strong>Seguridad y comodidad:</strong> Reservas fáciles desde casa.</li>
          <li><strong>Educación ambiental:</strong> Participa en nuestras campañas de concientización.</li>
        </ul>
      </section>

      <footer className="cliente-footer">
        <p>&copy; {new Date().getFullYear()} EcoMaravillas. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomeClient;