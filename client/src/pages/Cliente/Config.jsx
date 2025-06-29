import React, { useState } from 'react';
import '../../styles/ClientConfig.css';
import DatosPersonales from '../Cliente/Config/DatosPersonales';
//import ContactoForm from '../Cliente/Config/ContactoForm';
import BancariaForm from '../Cliente/Config/BancariaForm';
import DocumentosForm from '../Cliente/Config/DocumentosForm';
import { Link } from 'react-router-dom';

const ClienteAjustes = () => {
  const [formularioActivo, setFormularioActivo] = useState(null);

  const manejarSeleccion = (formulario) => {
    setFormularioActivo((prev) => (prev === formulario ? null : formulario));
  };

  return (
    <div className="ajustes-container">
      <div className="config-header">
        <h2>Ajustes de Cuenta</h2>
        <Link to="/home/client" className="dashboard-button">
          Volver al Inicio
        </Link>
      </div>
      
      <div className="ajuste-grid">
        <button
          className={`ajuste-card ${formularioActivo === 'datos' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('datos')}
        >
          Datos Personales
        </button>
        
        <button
          className={`ajuste-card ${formularioActivo === 'contacto' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('contacto')}
        >
          Información de Contacto
        </button>
        
        <button
          className={`ajuste-card ${formularioActivo === 'bancaria' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('bancaria')}
        >
          Información Bancaria
        </button>
        
        <button
          className={`ajuste-card ${formularioActivo === 'documentos' ? 'active' : ''}`}
          onClick={() => manejarSeleccion('documentos')}
        >
          Documentos Personales
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

            {formularioActivo === 'datos' && <DatosPersonales />}
            {/* Aquí puedes agregar los otros formularios */}
            {/* {formularioActivo === 'contacto' && <ContactoForm />} */}
            {formularioActivo === 'bancaria' && <BancariaForm />}
            {formularioActivo === 'documentos' && <DocumentosForm />}
          </>
        )}
      </div>
    </div>
  );
};

export default ClienteAjustes;