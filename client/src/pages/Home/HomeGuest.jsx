import React, { useEffect, useState } from 'react';
import '../../styles/HomeGuest.css';
import Carrusel from '../../components/Carousel';
import Footer from '../../components/Footer';
import { FaLeaf, FaMapMarkedAlt, FaImage, FaInfoCircle, FaSignInAlt } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomeGuest = () => {
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
    <div className="page-wrapper">
      <main className="content">
        <section className="hero">
          <h1>Bienvenido a EcoMaravillas</h1>
          <p>Conéctate con la naturaleza de forma única y sostenible.</p>
          <div className="home-buttons">
            <button className="map-button" onClick={() => window.location.href = '/map'}>
              <FaMapMarkedAlt /> Ver Mapa de Atracciones y Hábitats
            </button>

            <button className="gallery-button" onClick={() => window.location.href = '/gallery'}>
              <FaImage /> Galería de Especies
            </button>
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
            onClick={() => window.location.href = '/login'}
          >
            Iniciar Sesión / Reservar <FaSignInAlt className="icono-destacado" />
          </button>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2>¿Qué es EcoMaravillas?</h2>
          <p>
            EcoMaravillas es un destino turístico ecológico que combina aventura, educación ambiental
            y conservación. Aquí puedes reservar experiencias únicas en hábitats naturales y descubrir
            la biodiversidad que nos rodea.
          </p>
        </section>

        <section className="benefits-section">
          <h2>¿Por qué visitarnos?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <FaLeaf className="icon" />
              <h3>Turismo Sostenible</h3>
              <p>Apoya proyectos de conservación y educación ambiental.</p>
            </div>
            <div className="benefit-card">
              <FaMapMarkedAlt className="icon" />
              <h3>Aventuras Inolvidables</h3>
              <p>Recorre senderos, hábitats naturales y reservas protegidas.</p>
            </div>
            <div className="benefit-card">
              <FaInfoCircle className="icon" />
              <h3>Educación Ambiental</h3>
              <p>Aprende sobre especies nativas y su ecosistema.</p>
            </div>
          </div>
        </section>

        <section className="carousel-section">
          <h2>Explora Visualmente</h2>
          <Carrusel />
        </section>

        <section className="cta-section">
          <h2>¿Listo para vivir la experiencia?</h2>
          <p>Reserva tu próxima aventura ecológica en solo unos clics.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomeGuest;