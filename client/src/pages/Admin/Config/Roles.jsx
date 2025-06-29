import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../../styles/RolesConfig.css';

const RolesConfig = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/roles');
      setRoles(res.data);
    } catch (err) {
      console.error('Error al obtener roles:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/roles/${editandoId}`, form);
        setMensaje('✅ Rol actualizado');
      } else {
        await axios.post('http://localhost:3001/api/roles', form);
        setMensaje('✅ Rol creado');
      }
      setForm({ nombre: '', descripcion: '' });
      setEditandoId(null);
      setMostrarFormulario(false);
      fetchRoles();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error guardando rol:', err);
      setMensaje('❌ Error al guardar');
    }
  };

  const handleEditar = (rol) => {
    setEditandoId(rol.id_rol);
    setForm({ nombre: rol.nombre, descripcion: rol.descripcion });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este rol?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:3001/api/roles/${id}`);
              setMensaje('✅ Rol eliminado correctamente');
              fetchRoles();
              setTimeout(() => setMensaje(''), 3000);
            } catch (err) {
              console.error('Error al eliminar rol:', err);
              setMensaje('❌ Error al eliminar el rol');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const handleCancelar = () => {
    setForm({ nombre: '', descripcion: '' });
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const rolesFiltrados = roles.filter((rol) =>
    rol.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    rol.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="roles-container">
      <h2>Gestión de Roles</h2>

      <div className="acciones-roles">
        <button
          className="btn-toggle-form"
          onClick={() => {
            if (mostrarFormulario) {
              handleCancelar();
            } else {
              setMostrarFormulario(true);
            }
          }}
        >
          {mostrarFormulario ? '➖ Cancelar' : '➕ Crear Nuevo Rol'}
        </button>

        <input
          type="text"
          placeholder="🔍 Buscar rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {mensaje && <p className="mensaje-alerta">{mensaje}</p>}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="roles-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del rol"
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
          <button type="submit" className="btn-guardar">{editandoId ? 'Actualizar' : 'Crear'}</button>
        </form>
      )}

      <div className="grid-roles">
        {rolesFiltrados.map((rol) => (
          <div className="tarjeta-rol" key={rol.id_rol}>
            <h4>{rol.nombre}</h4>
            <p>{rol.descripcion || 'Sin descripción'}</p>
            <div className="acciones">
              <button onClick={() => handleEditar(rol)}>✏️ Editar</button>
              <button onClick={() => handleEliminar(rol.id_rol)}>🗑️ Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesConfig;