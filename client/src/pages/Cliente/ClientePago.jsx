import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/PagoCliente.css';

const ClientePago = ({ reserva, onCerrar, onPagoExitoso }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tarjeta: '',
    vencimiento: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tarjetasRegistradas, setTarjetasRegistradas] = useState([]);
  const [usarTarjetaGuardada, setUsarTarjetaGuardada] = useState('');
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  // Cargar tarjetas registradas
  useEffect(() => {
    const cargarTarjetas = async () => {
      try {
        const response = await axios.get(`/api/tarjetas/${user.id_turista}`);
        setTarjetasRegistradas(response.data);
      } catch (error) {
        console.error('Error al cargar tarjetas:', error);
      }
    };
    
    if (reserva) cargarTarjetas();
  }, [reserva, user.id_turista]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'tarjeta') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    if (name === 'vencimiento') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Nombre del titular es requerido';
    }
    
    if (!formData.tarjeta.trim()) {
      newErrors.tarjeta = 'Número de tarjeta es requerido';
    } else if (formData.tarjeta.replace(/\s/g, '').length < 16) {
      newErrors.tarjeta = 'Número de tarjeta incompleto';
    }
    
    if (!formData.vencimiento) {
      newErrors.vencimiento = 'Fecha de vencimiento es requerida';
    } else {
      const [month, year] = formData.vencimiento.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.vencimiento = 'Formato inválido (MM/YY)';
      }
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV es requerido';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV debe tener 3-4 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const determinarTipoTarjeta = (numero) => {
    const num = numero.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return 'otro';
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    

      // Agrega esto al inicio de tu handleSubmit
      try {
        const testConnection = await axios.get('/api/pagos/test');
        console.log('Conexión API OK:', testConnection.data);
      } catch (err) {
        console.error('Error conectando al backend:', err);
      }



    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Registrar tarjeta si el usuario eligió guardarla
      if (guardarTarjeta) {
        console.log('Intentando registrar tarjeta...', {
          id_turista: user.id_turista,
          ultimos_digitos: formData.tarjeta.slice(-4),
          tipo_tarjeta: determinarTipoTarjeta(formData.tarjeta),
          nombre_titular: formData.nombre,
          fecha_vencimiento: formData.vencimiento
        });

        const tarjetaResponse = await axios.post('/api/tarjetas/registrar', {
          id_turista: user.id_turista,
          ultimos_digitos: formData.tarjeta.slice(-4),
          tipo_tarjeta: determinarTipoTarjeta(formData.tarjeta),
          nombre_titular: formData.nombre,
          fecha_vencimiento: formData.vencimiento
        });
        console.log('Tarjeta registrada:', tarjetaResponse.data);
      }

      // 2. Procesar pago
      console.log('Preparando datos para pago:', {
        id_reserva: reserva.id_reserva,
        id_turista: user.id_turista,
        id_metodo_pago: 1,
        id_moneda: 1,
        monto: reserva.subtotal,
        id_tarjeta: guardarTarjeta ? formData.tarjeta.slice(-4) : null
      });

      const pagoResponse = await axios.post('/api/pagos/registrar', {
        id_reserva: reserva.id_reserva,
        id_turista: user.id_turista,
        id_metodo_pago: 1, // ID para tarjeta de crédito
        id_moneda: 1, // ID para moneda principal
        monto: reserva.subtotal,
        id_tarjeta: guardarTarjeta ? formData.tarjeta.slice(-4) : null
      });
      
      console.log('Respuesta del pago:', pagoResponse.data);
      
      alert(`✅ ${pagoResponse.data.message}`);
      onCerrar();
      if (onPagoExitoso) onPagoExitoso();
      
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Detalles del error:',
        error.response?.data || error.message
      );
      alert(`❌ Error al procesar el pago: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!reserva) return null;

  return (
    <div className="modal-pago-overlay">
      <div className="modal-pago">
        <button className="modal-cerrar" onClick={onCerrar}>✖</button>
        <h2>Procesar Pago</h2>

        <div className="modal-contenido">
          <div className="modal-resumen">
            <h3>Resumen de Reserva</h3>
            <ul>
              <li><strong>Atracción:</strong> {reserva.nombre_atraccion}</li>
              <li><strong>Fecha:</strong> {reserva.fecha?.split('T')[0]}</li>
              <li><strong>Hora:</strong> {reserva.hora?.substring(0, 5)}</li>
              <li><strong>Cantidad:</strong> {reserva.cantidad} personas</li>
              <li><strong>Total:</strong> ${reserva.subtotal?.toFixed(2)}</li>
            </ul>
          </div>

          <div className="modal-formulario">
            {tarjetasRegistradas.length > 0 ? (
              <>
                <h3>Selecciona método de pago</h3>
                <select
                  value={usarTarjetaGuardada}
                  onChange={(e) => setUsarTarjetaGuardada(e.target.value)}
                  className="select-tarjetas"
                >
                  <option value="">Selecciona una tarjeta guardada</option>
                  {tarjetasRegistradas.map(t => (
                    <option key={t.id_tarjeta} value={t.id_tarjeta}>
                      {t.tipo_tarjeta} ****{t.ultimos_digitos} - {t.nombre_titular}
                    </option>
                  ))}
                  <option value="nueva">Usar nueva tarjeta</option>
                </select>

                {usarTarjetaGuardada === 'nueva' && (
                  <FormularioTarjeta 
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    guardarTarjeta={guardarTarjeta}
                    setGuardarTarjeta={setGuardarTarjeta}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}
              </>
            ) : (
              <FormularioTarjeta 
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                guardarTarjeta={guardarTarjeta}
                setGuardarTarjeta={setGuardarTarjeta}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para el formulario de tarjeta
const FormularioTarjeta = ({
  formData,
  handleChange,
  errors,
  guardarTarjeta,
  setGuardarTarjeta,
  handleSubmit,
  isSubmitting
}) => (
  <form onSubmit={handleSubmit}>
    <h3>Información de Pago</h3>

    <div className="form-group">
      <label htmlFor="nombre">Nombre en la tarjeta</label>
      <input
        id="nombre"
        name="nombre"
        type="text"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ej. Juan Pérez"
        className={errors.nombre ? 'input-error' : ''}
      />
      {errors.nombre && <span className="error-message">{errors.nombre}</span>}
    </div>

    <div className="form-group">
      <label htmlFor="tarjeta">Número de tarjeta</label>
      <input
        id="tarjeta"
        name="tarjeta"
        type="text"
        value={formData.tarjeta}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        maxLength="19"
        className={errors.tarjeta ? 'input-error' : ''}
      />
      {errors.tarjeta && <span className="error-message">{errors.tarjeta}</span>}
    </div>

    <div className="form-row">
      <div className="form-group">
        <label htmlFor="vencimiento">Vencimiento (MM/YY)</label>
        <input
          id="vencimiento"
          name="vencimiento"
          type="text"
          value={formData.vencimiento}
          onChange={handleChange}
          placeholder="MM/YY"
          maxLength="5"
          className={errors.vencimiento ? 'input-error' : ''}
        />
        {errors.vencimiento && <span className="error-message">{errors.vencimiento}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cvv">CVV</label>
        <input
          id="cvv"
          name="cvv"
          type="password"
          value={formData.cvv}
          onChange={handleChange}
          placeholder="123"
          maxLength="4"
          className={errors.cvv ? 'input-error' : ''}
        />
        {errors.cvv && <span className="error-message">{errors.cvv}</span>}
      </div>
    </div>

    <div className="guardar-tarjeta">
      <input
        type="checkbox"
        id="guardarTarjeta"
        checked={guardarTarjeta}
        onChange={(e) => setGuardarTarjeta(e.target.checked)}
      />
      <label htmlFor="guardarTarjeta">Guardar esta tarjeta para futuros pagos</label>
    </div>

    <div className="tarjetas-aceptadas">
      <span>Tarjetas aceptadas:</span>
      <div className="tarjetas-iconos">
        <span className="tarjeta-icono visa">Visa</span>
        <span className="tarjeta-icono mastercard">Mastercard</span>
        <span className="tarjeta-icono amex">Amex</span>
      </div>
    </div>

    <button
      type="submit"
      className="btn-pagar"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Procesando...' : 'Pagar ahora'}
    </button>
  </form>
);

export default ClientePago;