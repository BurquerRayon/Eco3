import React, { useState } from 'react';
import axios from 'axios';
import '../styles/VerifyModal.css';

const VerifyModal = ({ email, onSuccess, onClose }) => {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!token) {
      setMessage('❌ Por favor ingresa el código de verificación');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/auth/verify?token=${token}`);
      setMessage(response.data.message || '✅ Verificación exitosa');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    setResendLoading(true);
    setResendMessage('');
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/resend-verification', {
        email: email
      });
      
      setResendMessage(response.data.message || '✅ Nuevo código enviado a tu correo');
    } catch (err) {
      setResendMessage(err.response?.data?.message || '❌ Error al reenviar el código');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-modal-overlay">
      <div className="verify-modal">
        <button className="verify-modal-close" onClick={onClose}>×</button>
        
        <h2>Verifica tu correo electrónico</h2>
        <p>Hemos enviado un código de verificación de 15 caracteres a <strong>{email}</strong></p>
        <p>Por favor revisa tu bandeja de entrada y spam.</p>
        
        <form onSubmit={handleVerify}>
          <div className="verify-input-group">
            <label htmlFor="verification-code">Código de verificación:</label>
            <input
              type="text"
              id="verification-code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ingresa el código de 15 caracteres"
              maxLength="15"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>
        
        {message && (
          <p className={`verify-message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
        
        <div className="verify-footer">
          <p>¿No recibiste el código?</p>
          <button 
            className="resend-link"
            onClick={handleResendToken}
            disabled={resendLoading}
          >
            {resendLoading ? 'Enviando...' : 'Reenviar código'}
          </button>
          {resendMessage && (
            <p className={`resend-message ${resendMessage.includes('❌') ? 'error' : 'success'}`}>
              {resendMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;