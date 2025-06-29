// src/pages/Verify.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Verify.css';

const Verify = () => {
  const [mensaje, setMensaje] = useState('Verificando cuenta...');
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verifyToken = (token) => {
    if (!token) {
      setMensaje('❌ Token no proporcionado');
      return;
    }

    axios.get(`http://localhost:3001/api/auth/verify?token=${token}`)
      .then(res => {
        setMensaje(res.data.message || '✅ Verificado correctamente');
        setTimeout(() => navigate('/login'), 2500);
      })
      .catch(err => {
        setMensaje(err.response?.data?.message || '❌ Error al verificar cuenta');
        setShowTokenInput(true);
      });
  };

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyToken(token);
    } else {
      setShowTokenInput(true);
    }
  }, [searchParams, navigate]);

  const handleManualVerification = (e) => {
    e.preventDefault();
    verifyToken(tokenInput);
  };

  return (
    <div className="verify-container">
      <h2>{mensaje}</h2>
      
      {showTokenInput && (
        <div className="token-input-container">
          <p>Ingresa manualmente tu código de verificación:</p>
          <form onSubmit={handleManualVerification}>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Pega aquí tu código de verificación"
            />
            <button type="submit">Verificar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Verify;