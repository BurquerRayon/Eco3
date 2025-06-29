import React from 'react';
import '../../styles/Dashboard.css';
import { Link } from 'react-router-dom';
import { FaUser, FaClipboardList, FaChartBar, FaCog } from 'react-icons/fa';

const Dashboard = () => {
  return (
<div className="dashboard-container">
      <h2 className="dashboard-title">Panel de Control del Administrador</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <FaUser className="icon" />
          <h3>Gestión de Usuarios</h3>
          <p>Administra los perfiles de usuarios registrados.</p>
          <Link to="/admin/usuarios" className="btn-dashboard">Ir</Link>
        </div>

        <div className="dashboard-card">
          <FaClipboardList className="icon" />
          <h3>Gestión de Reservas</h3>
          <p>Visualiza y modifica las reservas realizadas.</p>
          <Link to="/admin/Reservas" className="btn-dashboard">Ir</Link>
        </div>

        <div className="dashboard-card">
          <FaChartBar className="icon" />
          <h3>Reportes</h3>
          <p>Revisa reportes de ocupación, ventas y más.</p>
          <Link to="/admin/reportes" className="btn-dashboard">Ir</Link>
        </div>

        <div className="dashboard-card">
          <FaCog className="icon" />
          <h3>Configuración</h3>
          <p>Preferencias y ajustes del sistema.</p>
          <Link to="/admin/config" className="btn-dashboard">Ir</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
