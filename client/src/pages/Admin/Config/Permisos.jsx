import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../../styles/Permisos.css';

const PermisosConfig = () => {
  const [permisos, setPermisos] = useState([]);
  const [form, setForm] = useState({ nombre_permiso: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchPermisos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/permisos');
      setPermisos(res.data);
    } catch (err) {
      console.error('Error al obtener permisos:', err);
    }
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/permisos/${editandoId}`, form);
        setMensaje('✅ Permiso actualizado');
      } else {
        await axios.post('http://localhost:3001/api/permisos', form);
        setMensaje('✅ Permiso creado');
      }
      setForm({ nombre_permiso: '', descripcion: '' });
      setEditandoId(null);
      setMostrarFormulario(false);
      fetchPermisos();
    } catch (err) {
      console.error('Error al guardar permiso:', err);
      setMensaje('❌ Error al guardar');
    }
  };

  const handleEditar = (permiso) => {
    setEditandoId(permiso.id_permiso);
    setForm({
      nombre_permiso: permiso.nombre_permiso,
      descripcion: permiso.descripcion
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este permiso?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:3001/api/permisos/${id}`);
              setMensaje('✅ Permiso eliminado');
              fetchPermisos();
              setTimeout(() => setMensaje(''), 3000);
            } catch (err) {
              console.error('Error al eliminar permiso:', err);
              setMensaje('❌ Error al eliminar');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const handleCancelar = () => {
    setForm({ nombre_permiso: '', descripcion: '' });
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const permisosFiltrados = permisos.filter((permiso) =>
    permiso.nombre_permiso.toLowerCase().includes(busqueda.toLowerCase()) ||
    (permiso.descripcion?.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="permisos-container">
      <h2>Gestión de Permisos</h2>

      <div className="acciones-permisos">
        <button
          onClick={() => {
            if (mostrarFormulario) {
              handleCancelar();
            } else {
              setMostrarFormulario(true);
            }
          }}
        >
          {mostrarFormulario ? '➖ Cancelar' : '➕ Crear Nuevo Permiso'}
        </button>

        <input
          type="text"
          placeholder="🔍 Buscar permiso..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {mensaje && <p className="mensaje-alerta">{mensaje}</p>}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="permisos-form">
          <input
            type="text"
            name="nombre_permiso"
            placeholder="Nombre del permiso"
            value={form.nombre_permiso}
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
          <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
        </form>
      )}

      <div className="grid-permisos">
        {permisosFiltrados.map((permiso) => (
          <div className="tarjeta-permiso" key={permiso.id_permiso}>
            <h4>{permiso.nombre_permiso}</h4>
            <p>{permiso.descripcion || 'Sin descripción'}</p>
            <div className="acciones">
              <button onClick={() => handleEditar(permiso)}>✏️ Editar</button>
              <button onClick={() => handleEliminar(permiso.id_permiso)}>🗑️ Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermisosConfig;
