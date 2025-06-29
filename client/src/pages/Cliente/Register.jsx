import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Register.css';
import Footer from '../../components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    confirmar: ''
  });

  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmar) {
      return setMensaje('❌ Las contraseñas no coinciden');
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', {
        nombre: formData.nombre,
        correo: formData.correo,
        contrasena: formData.contrasena
      });

      setMensaje(res.data.message || '✅ Registro exitoso. Revisa tu correo.');
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      console.error(err);
      setMensaje(err.response?.data?.message || '❌ Error al registrar');
    }
  };

  return (
    <div className="page-wrapper">
      <main className="content">
        <div className="form-container">
          <h2>Registro</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" id="nombre" placeholder="Nombre" onChange={handleChange} required />
            <input type="email" id="correo" placeholder="Correo electrónico" onChange={handleChange} required />
            <input type="password" id="contrasena" placeholder="Contraseña" onChange={handleChange} required />
            <input type="password" id="confirmar" placeholder="Confirmar contraseña" onChange={handleChange} required />
            <button type="submit">Registrarse</button>
          </form>
          <p>{mensaje}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
