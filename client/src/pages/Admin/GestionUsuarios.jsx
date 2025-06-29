import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/GestionUsuarios.css';
import { Link } from 'react-router-dom';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: '', correo: '', contrasena: '', id_rol: 1 });
  const [editandoId, setEditandoId] = useState(null);
  const [usuarioEditandoRol, setUsuarioEditandoRol] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // ====================
  // Cargar usuarios y roles
  // ====================
  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/auth/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      console.error('❌ Error al cargar usuarios:', err);
    }
  };

  const cargarRoles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/roles');
      setRoles(res.data);
    } catch (err) {
      console.error('❌ Error al cargar roles:', err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  // ====================
  // Crear o actualizar
  // ====================
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/auth/usuarios/${editandoId}`, formulario);
        setMensaje('✅ Usuario actualizado');
      } else {
        await axios.post('http://localhost:3001/api/auth/crear-usuario', formulario);
        setMensaje('✅ Usuario creado');
      }

      setFormulario({ nombre: '', correo: '', contrasena: '', id_rol: 1 });
      setEditandoId(null);
      setMostrarFormulario(false);
      cargarUsuarios();
    } catch (err) {
      console.error('❌ Error al guardar usuario:', err);
      setMensaje('❌ Error al guardar usuario');
    }
  };

  // ====================
  // Eliminar
  // ====================
  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const res = await axios.delete(`http://localhost:3001/api/auth/usuarios/${id}`);
        setMensaje(res.data.message || '🗑️ Usuario eliminado');
        cargarUsuarios();
      } catch (err) {
        console.error('❌ Error al eliminar usuario:', err.response?.data || err.message);
        setMensaje(err.response?.data?.message || '❌ No se pudo eliminar el usuario');
      }
    }
  };

  useEffect(() => {
  if (mensaje) {
    const timer = setTimeout(() => setMensaje(''), 5000);
    return () => clearTimeout(timer);
  }
}, [mensaje]);

  // ====================
  // Filtro de búsqueda
  // ====================
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    roles.find(r => r.id_rol === u.id_rol)?.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="gestion-usuarios">
      <div className="usuarios-header">
        <h2>Gestión de Usuarios</h2>
        <Link to="/admin/dashboard" className="dashboard-button">
          Volver al Dashboard
        </Link>
      </div>

      <div className="acciones-superiores">
        <button onClick={() => {
          setMostrarFormulario(!mostrarFormulario);
          setEditandoId(null);
          setFormulario({ nombre: '', correo: '', contrasena: '', id_rol: 2 });
        }}>
          {mostrarFormulario ? 'Cancelar' : '➕ Crear Usuario'}
        </button>

        <input
          type="text"
          placeholder="🔍 Buscar por nombre, correo o rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="formulario-usuario">
          <input name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} required />
          <input name="correo" placeholder="Correo" value={formulario.correo} onChange={handleChange} required />
          {!editandoId && (
            <input name="contrasena" type="password" placeholder="Contraseña" value={formulario.contrasena} onChange={handleChange} required />
          )}
          <select name="id_rol" value={formulario.id_rol} onChange={handleChange}>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</option>
            ))}
          </select>
          <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
          {mensaje && <p>{mensaje}</p>}
        </form>
      )}

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>
                {usuarioEditandoRol === u.id_usuario ? (
                  <select
                    value={u.id_rol}
                    onChange={async (e) => {
                      try {
                        await axios.put(`http://localhost:3001/api/auth/usuarios/${u.id_usuario}`, {
                          nombre: u.nombre,
                          correo: u.correo,
                          id_rol: e.target.value
                        });
                        setMensaje('✅ Rol actualizado');
                        setUsuarioEditandoRol(null);
                        cargarUsuarios();
                      } catch (err) {
                        console.error('❌ Error al cambiar rol:', err);
                        setMensaje('❌ Error al actualizar el rol');
                      }
                    }}
                  >
                    {roles.map((rol) => (
                      <option key={rol.id_rol} value={rol.id_rol}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    {roles.find((r) => r.id_rol === u.id_rol)?.nombre || 'Desconocido'}
                  </>
                )}
              </td>
              <td>
                {usuarioEditandoRol === u.id_usuario ? (
                  <button onClick={() => setUsuarioEditandoRol(null)} className="btn-cancelar">Cancelar</button>
                ) : (
                  <>
                    <button onClick={() => setUsuarioEditandoRol(u.id_usuario)} className="btn-editar">Editar Rol</button>
                    <button onClick={() => eliminarUsuario(u.id_usuario)} className="btn-eliminar">Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;
