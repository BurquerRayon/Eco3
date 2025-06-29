import React, { useState } from 'react';
import axios from 'axios';

const ReenviarVerificacion = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await axios.post('http://localhost:3001/api/auth/reenviar-verificacion', { correo });
      setMensaje(`✅ ${res.data.message}`);
    } catch (err) {
      setMensaje(`❌ ${err.response?.data?.message || 'Error al reenviar verificación'}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Reenviar Verificación</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <button type="submit">Reenviar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default ReenviarVerificacion;
