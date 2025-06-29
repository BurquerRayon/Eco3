import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../../styles/Atracciones.css';
import { useNavigate } from 'react-router-dom';

const AtraccionesConfig = () => {
  const [atracciones, setAtracciones] = useState([]);
  const [atraccionesFiltradas, setAtraccionesFiltradas] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', duracion: '', max_personas: '', precio: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchAtracciones = async () => {
    try {
      setCargando(true);
      const res = await axios.get('http://localhost:3001/api/atracciones');
      setAtracciones(res.data);
      setAtraccionesFiltradas(res.data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener atracciones:', err);
      setError('Error al cargar las atracciones');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const fetchAtracciones = async () => {
      try {
        setCargando(true);
        const res = await axios.get('http://localhost:3001/api/atracciones');
        setAtracciones(res.data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener atracciones:', err);
        setError('Error al cargar las atracciones');
      } finally {
        setCargando(false);
      }
    };

  fetchAtracciones();
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/atracciones/${editandoId}`, form);
        setMensaje('Atracción actualizada correctamente');
      } else {
        await axios.post('http://localhost:3001/api/atracciones', form);
        setMensaje('Atracción creada exitosamente');
      }

      setForm({ nombre: '', descripcion: '', duracion: '', max_personas: '', precio: '' });
      setEditandoId(null);
      setMostrarFormulario(false);
      fetchAtracciones();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al guardar atracción:', err);
      setMensaje(err.response?.data?.message || 'Error al guardar la atracción');
    }
  };

  const handleEditar = (atraccion) => {
    setEditandoId(atraccion.id_atraccion);
    setForm({
      nombre: atraccion.nombre,
      descripcion: atraccion.descripcion,
      duracion: atraccion.duracion,
      max_personas: atraccion.max_personas,
      precio: atraccion.precio
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta atracción?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:3001/api/atracciones/${id}`);
              setMensaje('Atracción eliminada correctamente');
              fetchAtracciones();
              setTimeout(() => setMensaje(''), 3000);
            } catch (err) {
              console.error('Error al eliminar atracción:', err);
              setMensaje('Error al eliminar la atracción');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm({ nombre: '', descripcion: '', duracion: '', max_personas: '', precio: '' });
    setMostrarFormulario(false);
  };

  // 🟢 Buscar atracciones por nombre
useEffect(() => {
  const texto = busqueda.trim().toLowerCase();

  if (!texto) {
    setAtraccionesFiltradas(atracciones);
  } else {
    const filtradas = atracciones.filter((a) =>
      a.nombre.toLowerCase().includes(texto)
    );
    setAtraccionesFiltradas(filtradas);
  }
}, [busqueda, atracciones]);

  return (
    <div className="atracciones-admin-container">
      <h2>Gestión de Atracciones</h2>

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'exito'}`}>
          {mensaje}
        </div>
      )}

      <button
        className="btn-toggle-form"
        onClick={() => {
          setMostrarFormulario(!mostrarFormulario);
          setEditandoId(null);
          setForm({ nombre: '', descripcion: '', duracion: '', max_personas: '', precio: '' });
        }}
      >
        {mostrarFormulario ? '➖ Ocultar Formulario' : '➕ Crear Nueva Atracción'}
      </button>

      {/* 🔍 Buscador */}
      <div className="busqueda-container">
  <input
    type="text"
    placeholder="🔍 Buscar atracción por nombre..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />
  {busqueda && (
    <button onClick={() => setBusqueda('')} className="btn-limpiar">✖</button>
  )}
</div>


      {mostrarFormulario && (
        <form id="formulario-atraccion" onSubmit={handleSubmit} className="form-atraccion">
          <h3>{editandoId ? 'Editar Atracción' : 'Crear Nueva Atracción'}</h3>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duración:</label>
              <input type="text" name="duracion" value={form.duracion} onChange={handleChange} placeholder="Ej: 30 minutos" />
            </div>
            <div className="form-group">
              <label>Máx. personas:</label>
              <input type="number" name="max_personas" value={form.max_personas} onChange={handleChange} min="1" />
            </div>
            <div className="form-group">
              <label>Precio ($):</label>
              <input type="number" name="precio" value={form.precio} onChange={handleChange} min="0" step="0.01" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-guardar">{editandoId ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={cancelarEdicion} className="btn-cancelar">Cancelar</button>
          </div>
        </form>
      )}

      <div className="listado-atracciones">
        <h3>Atracciones Existentes</h3>
        {cargando ? (
          <div className="cargando">Cargando atracciones...</div>
        ) : error ? (
          <div className="error-carga">{error}</div>
        ) : atraccionesFiltradas.length === 0 ? (
          <div className="sin-resultados">No hay atracciones registradas</div>
        ) : (
          <div className="grid-atracciones">
            {atraccionesFiltradas.map((atraccion) => (
              <div key={atraccion.id_atraccion} className="tarjeta-atraccion">
                <div className="atraccion-content">
                  <h4>{atraccion.nombre}</h4>
                  <p className="descripcion">{atraccion.descripcion}</p>
                  <div className="detalles-atraccion">
                    <div className="detalle"><span className="etiqueta">Duración:</span> {atraccion.duracion || 'No especificada'}</div>
                    <div className="detalle"><span className="etiqueta">Capacidad:</span> {atraccion.max_personas || 'No especificado'} personas</div>
                    <div className="detalle"><span className="etiqueta">Precio:</span> ${atraccion.precio || '0.00'}</div>
                  </div>
                </div>
                <div className="acciones-atraccion">
                  <button onClick={() => handleEditar(atraccion)} className="btn-editar">Editar</button>
                  <button onClick={() => handleEliminar(atraccion.id_atraccion)} className="btn-eliminar">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AtraccionesConfig;
