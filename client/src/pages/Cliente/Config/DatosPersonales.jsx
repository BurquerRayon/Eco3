import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Corregido: importar desde react-router-dom
import { useAuth } from '../../../context/AuthContext';
//import '../styles/DatosPersonales.css';

const DatosPersonales = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    fecha_nacimiento: '',
    edad: '',
    telefono: '',
    id_nacionalidad: '',
    id_sexo: ''
  });
  
  const [options, setOptions] = useState({
    nacionalidades: [],
    sexos: []
  });
  
  const [uiState, setUiState] = useState({
    loading: true,
    message: { text: '', type: '' }
  });

  const navigate = useNavigate(); // Correctamente importado de react-router-dom
  const { user } = useAuth();

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar autenticación primero
        if (!user?.id_usuario) {
          navigate('/login');
          return;
        }

        setUiState(prev => ({ ...prev, loading: true }));
        
        const [userData, nacionalidades, sexos] = await Promise.all([
          axios.get(`http://localhost:3001/api/cliente/datos/${user.id_usuario}`),
          axios.get('http://localhost:3001/api/cliente/nacionalidades'),
          axios.get('http://localhost:3001/api/cliente/sexos')
        ]);

        setFormData({
          nombre: userData.data.nombre || '',
          apellido: userData.data.apellido || '',
          cedula: userData.data.cedula || '',
          fecha_nacimiento: userData.data.fecha_nacimiento?.split('T')[0] || '',
          edad: userData.data.edad || '',
          telefono: userData.data.telefono || '',
          id_nacionalidad: userData.data.id_nacionalidad || '',
          id_sexo: userData.data.id_sexo || ''
        });

        setOptions({
          nacionalidades: nacionalidades.data || [],
          sexos: sexos.data || []
        });

        setUiState({ loading: false, message: { text: '', type: '' } });
      } catch (error) {
        console.error('Error cargando datos:', error);
        setUiState({
          loading: false,
          message: {
            text: error.response?.data?.message || 'Error cargando datos',
            type: 'error'
          }
        });
        
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    loadData();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fecha_nacimiento') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({
        ...prev,
        fecha_nacimiento: value,
        edad: age > 0 ? age : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUiState(prev => ({ ...prev, message: { text: 'Guardando...', type: 'info' } }));
      
      await axios.put(
        `http://localhost:3001/api/cliente/datos/${user.id_usuario}`,
        formData
      );
      
      setUiState(prev => ({
        ...prev,
        message: { text: '✅ Datos actualizados', type: 'success' }
      }));
    } catch (error) {
      console.error('Error actualizando:', error);
      setUiState(prev => ({
        ...prev,
        message: {
          text: error.response?.data?.message || 'Error guardando cambios',
          type: 'error'
        }
      }));
    }
  };

  if (uiState.loading) {
    return (
      <div className="datos-personales-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="datos-personales-container">
      <h2>Mis Datos Personales</h2>
      
      {uiState.message.text && (
        <div className={`alert-message ${uiState.message.type}`}>
          {uiState.message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cédula</label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Edad</label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Nacionalidad</label>
          <select
            name="id_nacionalidad"
            value={formData.id_nacionalidad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione nacionalidad</option>
            {options.nacionalidades.map(n => (
              <option key={n.id_nacionalidad} value={n.id_nacionalidad}>
                {n.nombre} ({n.codigo_iso})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sexo</label>
          <select
            name="id_sexo"
            value={formData.id_sexo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione sexo</option>
            {options.sexos.map(s => (
              <option key={s.id_sexo} value={s.id_sexo}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default DatosPersonales;