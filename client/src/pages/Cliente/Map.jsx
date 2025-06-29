import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Map.css';
import Footer from '../../components/Footer'; // Asegúrate de que la ruta sea correcta
import '../../styles/Footer.css'; // si deseas estilos comunes

const Mapa = () => {
  const navigate = useNavigate(); // Para redireccionar

  return (
    <div className="page-wrapper">
      <main className="content">

      <div className="map-container">
      <button className="btn-salir" onClick={() => navigate('/')}>← Volver al Inicio</button>
      </div>

      <h2 className="map-title">Mapa Interactivo</h2>

      <div className="map-box">
        <div className="map-background">
          <p className="map-placeholder-text">[Aquí se mostraría el mapa]</p>

          {/* Ejemplo de marcadores visuales */}
          <div className="map-marker" style={{ top: '30%', left: '40%' }} title="Punto A" />
          <div className="map-marker" style={{ top: '60%', left: '55%' }} title="Punto B" />
        </div>

        {/* Panel lateral simulado */}
        <div className="map-sidebar">
          <h4>Lugares disponibles:</h4>
          <ul>
            <li>🦎 Área de iguanas</li>
            <li>🌳 Zona ecológica</li>
            <li>🦜 Avistamiento de aves</li>
          </ul>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
};

export default Mapa;
