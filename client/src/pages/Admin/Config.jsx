import React, { useState } from 'react';
import '../../styles/ConfigAdmin.css';
import RolesConfig from './Config/Roles';
import PermisosConfig from './Config/Permisos';
import AtraccionesConfig from './Config/Atracciones';
import MonedasConfig from './Config/Monedas';
import ReportesConfig from './Config/TiposDeReportes';
import NacionalidadesConfig from './Config/Nacionalidades';
import HorarioReservasConfig from './Config/HorarioReservasConfig';
import { Link } from 'react-router-dom';

const Config = () => {
  const [formularioActivo, setFormularioActivo] = useState(null);

  const manejarSeleccion = (formulario) => {
    setFormularioActivo((prev) => (prev === formulario ? null : formulario));
  };

  return (
    <div className="ajustes-container">
      <div className="config-header">
        <h2>Configuraciones del Sistema</h2>

        <Link to="/admin/dashboard" className="dashboard-button">
          Volver al Dashboard
        </Link>

      </div>

      <div className="ajuste-grid">
        <button 
          className={`ajuste-card ${formularioActivo === 'roles' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('roles')}
        >
          Gestión de Roles
        </button>
        <button 
          className={`ajuste-card ${formularioActivo === 'permisos' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('permisos')}
        >
          Permisos
        </button>
        <button 
          className={`ajuste-card ${formularioActivo === 'atracciones' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('atracciones')}
        >
          Atracciones
        </button>
        <button 
          className={`ajuste-card ${formularioActivo === 'monedas' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('monedas')}
        >
          Monedas
        </button>
        <button 
          className={`ajuste-card ${formularioActivo === 'reportes' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('reportes')}
        >
          Tipos de Reporte
        </button>
        <button 
          className={`ajuste-card ${formularioActivo === 'nacionalidades' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('nacionalidades')}
        >
          Nacionalidades
        </button>
        <button 
          className={`ajuste-card ${formularioActivo === 'horarios' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('horarios')}
        >
          Horarios
        </button>
      </div>

      <div className="formulario-render">
        {formularioActivo && (
          <>
            <button
              className="cerrar-todo-button"
              onClick={() => setFormularioActivo(null)}
            >
              Cerrar Todo
            </button>
            
            {formularioActivo === 'roles' && <RolesConfig />}
            {formularioActivo === 'permisos' && <PermisosConfig />}
            {formularioActivo === 'atracciones' && <AtraccionesConfig />}
            {formularioActivo === 'monedas' && <MonedasConfig />}
            {formularioActivo === 'reportes' && <ReportesConfig />}
            {formularioActivo === 'nacionalidades' && <NacionalidadesConfig />}
            {formularioActivo === 'horarios' && <HorarioReservasConfig />}
          </>
        )}
      </div>
    </div>
  );
};

export default Config;