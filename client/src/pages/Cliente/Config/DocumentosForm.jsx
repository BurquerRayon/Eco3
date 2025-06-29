import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentosForm = () => {
  const [documentos, setDocumentos] = useState({
    tipo_documento: 'cedula',
    numero_documento: '',
    fecha_emision: '',
    fecha_expiracion: '',
    foto_frontal: null,
    foto_reverso: null
  });
  const [mensaje, setMensaje] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.id_usuario) {
      axios.get(`/api/usuarios/${user.id_usuario}/documentos`)
        .then(res => {
          if (res.data) setDocumentos(res.data);
        })
        .catch(err => console.error('Error al cargar documentos:', err));
    }
  }, [user]);

  const handleChange = (e) => {
    setDocumentos({ ...documentos, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocumentos({ ...documentos, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(documentos).forEach(key => {
      if (documentos[key] !== null) {
        formData.append(key, documentos[key]);
      }
    });

    try {
      await axios.post(`/api/usuarios/${user.id_usuario}/documentos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMensaje('✅ Documentos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setMensaje('❌ Error al guardar los documentos');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="form-ajuste-cliente">
      <h3>Documentos Personales</h3>
      <p className="info-text">Sube tus documentos para verificación y configuración de moneda</p>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Tipo de Documento</label>
        <select
          name="tipo_documento"
          value={documentos.tipo_documento}
          onChange={handleChange}
          required
        >
          <option value="cedula">Cédula</option>
          <option value="pasaporte">Pasaporte</option>
          <option value="licencia">Licencia de Conducir</option>
        </select>

        <label>Número de Documento</label>
        <input
          type="text"
          name="numero_documento"
          value={documentos.numero_documento}
          onChange={handleChange}
          required
        />

        <label>Fecha de Emisión</label>
        <input
          type="date"
          name="fecha_emision"
          value={documentos.fecha_emision}
          onChange={handleChange}
          required
        />

        <label>Fecha de Expiración</label>
        <input
          type="date"
          name="fecha_expiracion"
          value={documentos.fecha_expiracion}
          onChange={handleChange}
          required
        />

        <label>Foto Frontal del Documento</label>
        <input
          type="file"
          name="foto_frontal"
          onChange={handleFileChange}
          accept="image/*"
          required={!documentos.foto_frontal}
        />

        <label>Foto Reverso del Documento</label>
        <input
          type="file"
          name="foto_reverso"
          onChange={handleFileChange}
          accept="image/*"
          required={!documentos.foto_reverso}
        />

        <button type="submit">Guardar Documentos</button>
      </form>
      {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
    </div>
  );
};

export default DocumentosForm;