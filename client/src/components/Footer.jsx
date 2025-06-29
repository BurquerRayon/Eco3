// src/components/Footer.jsx
import '../styles/Footer.css';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 EcoMaravillas - Todos los derechos reservados</p>

        <ul className="footer-links">
          <li><Link to="/about">🌱 Sobre Nosotros</Link></li>
          {/* Puedes agregar más links aquí */}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
