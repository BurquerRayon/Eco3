import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import Footer from '../components/Footer';
import VerifyModal from './VerifyModal'; // Nuevo componente modal

const Login = () => {
  const [formData, setFormData] = useState({ 
    correo: '', 
    contrasena: '' 
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (mensaje) setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    if (!formData.correo || !formData.contrasena) {
      setMensaje('⚠️ Completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', formData);
      
      if (response.data.success) {
        const { token, user: responseUser } = response.data;
        
        const userData = {
          id_usuario: responseUser.id,
          id_turista: responseUser.id_turista,
          correo: responseUser.email,
          nombre: responseUser.nombre,
          rol: responseUser.rol,
          verificado: responseUser.verificado
        };

        login(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        const redirectPath = {
          admin: '/home/admin',
          empleado: '/home/employee',
          cliente: '/home/client'
        }[responseUser.rol?.toLowerCase()] || '/';

        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Error en login:', err);
      
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setUserEmail(formData.correo);
        setVerificationToken(err.response?.data?.verificationToken || '');
        setShowVerifyModal(true);
      } else {
        setMensaje(`❌ ${err.response?.data?.message || 'Error en el inicio de sesión'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerifyModal(false);
    setMensaje('✅ Correo verificado. Por favor inicia sesión nuevamente.');
  };

  return (
    <div className="login-page-wrapper">
      <main className="login-content">
        <div className="login-container">
          <div className="login-box">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
             <div className="login-form-group">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="contrasena">Contraseña</label>
                <input
                  type="password"
                  id="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Ingresar'}
              </button>

              <div className="login-links">
              <button
                type="button"
                className="login-link-btn"
                onClick={() => navigate('/forgot-password')}
              >
                ¿Olvidaste tu contraseña?
              </button>

                <button
                  type="button"
                  className="login-link-btn"
                  onClick={() => navigate('/registro')}
                >
                  ¿No tienes cuenta? Regístrate
                </button>
              </div>
            </form>

            {mensaje && (
              <p className={`login-message ${mensaje.includes('❌') ? 'error' : 'info'}`}>
                {mensaje}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Modal de verificación */}
      {showVerifyModal && (
        <VerifyModal
          email={userEmail}
          onSuccess={handleVerificationSuccess}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
      <Footer />
    </div>
  );
};

export default Login;