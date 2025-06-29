import React from 'react';
import '../../styles/PasswordResetModal.css';

const PasswordResetModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="password-reset-modal-overlay">
      <div className="password-reset-modal">
        <div className="modal-header">
          <h3>Correo Enviado</h3>
          <button onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p>Hemos enviado un enlace para restablecer tu contraseña a tu correo electrónico.</p>
          <p>Revisa tu bandeja de entrada y la carpeta de spam.</p>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose}>Entendido</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;