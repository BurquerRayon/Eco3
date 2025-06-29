import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BancariaForm = () => {
  const [bancos, setBancos] = useState([]);
  const [cuenta, setCuenta] = useState({
    id_banco: '',
    numero_cuenta: '',
    tipo_cuenta: 'ahorro' // 'ahorro' o 'corriente'
  });
  const [mensaje, setMensaje] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Cargar bancos disponibles
    axios.get('/api/bancos')
      .then(res => setBancos(res.data))
      .catch(err => console.error('Error al cargar bancos:', err));

    // Cargar datos existentes si existen
    if (user?.id_usuario) {
      axios.get(`/api/usuarios/${user.id_usuario}/cuenta-bancaria`)
        .then(res => {
          if (res.data) setCuenta(res.data);
        })
        .catch(err => console.error('Error al cargar cuenta bancaria:', err));
    }
  }, [user]);

  const handleChange = (e) => {
    setCuenta({ ...cuenta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/usuarios/${user.id_usuario}/cuenta-bancaria`, cuenta);
      setMensaje('✅ Información bancaria guardada correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      setMensaje('❌ Error al guardar la información bancaria');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="form-ajuste-cliente">
      <h3>Información Bancaria</h3>
      <p className="info-text">Configura tu cuenta bancaria para realizar pagos en el sistema</p>
      
      <form onSubmit={handleSubmit}>
        <label>Banco</label>
        <select
          name="id_banco"
          value={cuenta.id_banco}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un banco</option>
          {bancos.map(banco => (
            <option key={banco.id_banco} value={banco.id_banco}>
              {banco.nombre}
            </option>
          ))}
        </select>

        <label>Número de cuenta</label>
        <input
          type="text"
          name="numero_cuenta"
          value={cuenta.numero_cuenta}
          onChange={handleChange}
          required
        />

        <label>Tipo de cuenta</label>
        <select
          name="tipo_cuenta"
          value={cuenta.tipo_cuenta}
          onChange={handleChange}
          required
        >
          <option value="ahorro">Cuenta de Ahorros</option>
          <option value="corriente">Cuenta Corriente</option>
        </select>

        <button type="submit">Guardar Información Bancaria</button>
      </form>
      {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
    </div>
  );
};

export default BancariaForm;