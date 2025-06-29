// HorarioReservasConfig.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../styles/HorarioReservasConfig.css';

const HorarioReservasConfig = () => {
  const [horaInicio, setHoraInicio] = useState('09');
  const [minutoInicio, setMinutoInicio] = useState('00');
  const [horaFin, setHoraFin] = useState('17');
  const [minutoFin, setMinutoFin] = useState('00');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const horas = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutos = ['00', '10', '20', '30', '40', '50'];

  useEffect(() => {
    const cargarHorario = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/config/horario-reservas');
        const [hIni, mIni] = res.data.hora_inicio.split(':');
        const [hFin, mFin] = res.data.hora_fin.split(':');
        setHoraInicio(hIni);
        setMinutoInicio(mIni);
        setHoraFin(hFin);
        setMinutoFin(mFin);
      } catch (err) {
        console.error('Error al cargar horario:', err);
      }
    };
    cargarHorario();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hora_inicio = `${horaInicio}:${minutoInicio}`;
    const hora_fin = `${horaFin}:${minutoFin}`;
    try {
      await axios.put('http://localhost:3001/api/config/horario-reservas', { hora_inicio, hora_fin });
      setMensaje('✅ Horario actualizado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al guardar horario:', err);
      setMensaje('❌ Error al guardar el horario');
    }
  };

  return (
    <div className="horario-container">
      <h2>Configuración de Horario de Reservas</h2>
      <form className="horario-form" onSubmit={handleSubmit}>
        <div className="hora-grupo">
          <label>Hora de inicio:</label>
          <div className="hora-selectores">
            <select value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)}>
              {horas.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span>:</span>
            <select value={minutoInicio} onChange={(e) => setMinutoInicio(e.target.value)}>
              {minutos.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="hora-grupo">
          <label>Hora de fin:</label>
          <div className="hora-selectores">
            <select value={horaFin} onChange={(e) => setHoraFin(e.target.value)}>
              {horas.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span>:</span>
            <select value={minutoFin} onChange={(e) => setMinutoFin(e.target.value)}>
              {minutos.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <button type="submit">Guardar Horario</button>
        {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
      </form>
    </div>
  );
};

export default HorarioReservasConfig;
