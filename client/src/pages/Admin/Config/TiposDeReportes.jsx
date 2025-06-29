import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../../styles/ReportesConfig.css';

const ReportesConfig = () => {
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchTipos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/reportes');
      setTipos(res.data);
    } catch (err) {
      console.error('Error al obtener tipos:', err);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancelar = () => {
    setForm({ nombre: '', descripcion: '' });
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/reportes/${editandoId}`, form);
        setMensaje('✅ Tipo de reporte actualizado');
      } else {
        await axios.post('http://localhost:3001/api/reportes', form);
        setMensaje('✅ Tipo de reporte creado');
      }

      setForm({ nombre: '', descripcion: '' });
      setEditandoId(null);
      setMostrarFormulario(false);
      fetchTipos();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al guardar tipo:', err);
      setMensaje('❌ Error al guardar');
    }
  };

  const handleEditar = (tipo) => {
    setEditandoId(tipo.id_tipo_reporte);
    setForm({ nombre: tipo.nombre, descripcion: tipo.descripcion });
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este tipo de reporte?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:3001/api/reportes/${id}`);
              setMensaje('✅ Tipo de reporte eliminado correctamente');
              fetchTipos();
              setTimeout(() => setMensaje(''), 3000);
            } catch (err) {
              console.error('Error al eliminar tipo:', err);
              setMensaje('❌ Error al eliminar');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const tiposFiltrados = tipos.filter((tipo) =>
    tipo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    tipo.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="reportes-config-container">
      <h2>Gestión de Tipos de Reporte</h2>

      <div className="acciones-reportes">
        <button className="btn-toggle-form" onClick={() => {
          if (mostrarFormulario) {
            handleCancelar();
          } else {
            setMostrarFormulario(true);
          }
        }}>
          {mostrarFormulario ? '➖ Cancelar' : '➕ Crear Tipo de Reporte'}
        </button>

        <input
          type="text"
          placeholder="🔍 Buscar tipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {mensaje && <p className="mensaje-alerta">{mensaje}</p>}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="reportes-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del tipo"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
          />
          <div className="acciones-form">
            <button type="submit" className="btn-guardar">
              {editandoId ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid-tipos">
        {tiposFiltrados.map((tipo) => (
          <div className="tarjeta-tipo" key={tipo.id_tipo_reporte}>
            <h4>{tipo.nombre}</h4>
            <p>{tipo.descripcion || 'Sin descripción'}</p>
            <div className="acciones">
              <button onClick={() => handleEditar(tipo)}>✏️ Editar</button>
              <button onClick={() => handleEliminar(tipo.id_tipo_reporte)}>🗑️ Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportesConfig;
