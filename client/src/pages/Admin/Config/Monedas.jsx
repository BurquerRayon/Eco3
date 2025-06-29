import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../../styles/MonedasConfig.css';

const MonedasConfig = () => {
  const [monedas, setMonedas] = useState([]);
  const [form, setForm] = useState({ nombre: '', simbolo: '$', codigo_iso: '', tasa_cambio: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchMonedas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/monedas');
      setMonedas(res.data);
    } catch (err) {
      console.error('Error al obtener monedas:', err);
    }
  };

  useEffect(() => {
    fetchMonedas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = {
      ...form,
      simbolo: form.simbolo.trim() || '$'
    };

    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/api/monedas/${editandoId}`, datos);
        setMensaje('✅ Moneda actualizada correctamente');
      } else {
        await axios.post('http://localhost:3001/api/monedas', datos);
        setMensaje('✅ Moneda creada exitosamente');
      }

      setForm({ nombre: '', simbolo: '$', codigo_iso: '', tasa_cambio: '' });
      setEditandoId(null);
      setMostrarFormulario(false);
      fetchMonedas();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al guardar moneda:', err);
      setMensaje('❌ Error al guardar moneda');
    }
  };

  const handleEditar = (moneda) => {
    setEditandoId(moneda.id_moneda);
    setForm({
      nombre: moneda.nombre,
      simbolo: moneda.simbolo,
      codigo_iso: moneda.codigo_iso,
      tasa_cambio: moneda.tasa_cambio
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    confirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta moneda?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:3001/api/monedas/${id}`);
              setMensaje('✅ Moneda eliminada correctamente');
              fetchMonedas();
              setTimeout(() => setMensaje(''), 3000);
            } catch (err) {
              console.error('Error al eliminar moneda:', err);
              setMensaje('❌ Error al eliminar la moneda');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const handleCancelar = () => {
    setForm({ nombre: '', simbolo: '$', codigo_iso: '', tasa_cambio: '' });
    setEditandoId(null);
    setMostrarFormulario(false);
  };

  const monedasFiltradas = monedas.filter((m) =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.codigo_iso.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="monedas-container">
      <h2>Gestión de Monedas</h2>

      <div className="acciones-monedas">
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
          {mostrarFormulario ? '➖ Cancelar' : '➕ Crear Nueva Moneda'}
        </button>
        
        <input
          type="text"
          placeholder="🔍 Buscar moneda..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {mensaje && <p className="mensaje-alerta">{mensaje}</p>}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="moneda-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="simbolo"
            placeholder="Símbolo"
            value={form.simbolo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="codigo_iso"
            placeholder="Código ISO"
            value={form.codigo_iso}
            onChange={handleChange}
            maxLength={3}
            required
          />
          <input
            type="number"
            name="tasa_cambio"
            placeholder="Tasa de cambio"
            value={form.tasa_cambio}
            onChange={handleChange}
            step="0.0001"
            required
          />
          <button type="submit" className="btn-guardar">
            {editandoId ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      )}

      <div className="grid-monedas">
        {monedasFiltradas.map((m) => (
          <div key={m.id_moneda} className="tarjeta-moneda">
            <h4>{m.nombre} ({m.codigo_iso})</h4>
            <p>Tasa de cambio: {m.simbolo}{m.tasa_cambio}</p>
            <div className="acciones">
              <button onClick={() => handleEditar(m)}>✏️ Editar</button>
              <button onClick={() => handleEliminar(m.id_moneda)}>🗑️ Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonedasConfig;