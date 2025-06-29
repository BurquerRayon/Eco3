import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/HistorialReservas.css';
import { 
  FaCalendarPlus, 
  FaFilter, 
  FaTimes, 
  FaAngleLeft, 
  FaAngleRight, 
  FaAngleDoubleLeft, 
  FaAngleDoubleRight,
  FaSearch,
  FaHistory
} from 'react-icons/fa';

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [atracciones, setAtracciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;
  const navigate = useNavigate();

  // Filtros
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
    id_atraccion: '',
    bloqueHorario: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const id_turista = user?.id_turista;

  // Cargar atracciones para el combobox
  useEffect(() => {
    const cargarAtracciones = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/atracciones');
        setAtracciones(res.data);
      } catch (err) {
        console.error('Error al cargar atracciones:', err);
      }
    };
    cargarAtracciones();
  }, []);

  // Generar bloques horarios para el filtro
  const generarBloquesHorario = () => {
    const bloques = [];
    for (let h = 9; h < 17; h++) {
      for (let m = 0; m < 60; m += 30) {
        const inicio = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const finM = m + 30;
        const finH = finM >= 60 ? h + 1 : h;
        const fin = `${String(finH).padStart(2, '0')}:${String(finM % 60).padStart(2, '0')}`;
        bloques.push(`${inicio} - ${fin}`);
      }
    }
    return bloques;
  };

  const bloquesHorarios = generarBloquesHorario();

  // Formatear hora
  const formatearHora = (horaObj) => {
    if (!horaObj) return '';
    
    if (typeof horaObj === 'string' && horaObj.match(/^\d{2}:\d{2}$/)) {
      return horaObj;
    }

    try {
      const date = new Date(horaObj);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    } catch (err) {
      console.error('Error al formatear hora:', err);
      return horaObj;
    }
  };

  // Obtener bloque horario
  const obtenerBloqueHorario = (hora) => {
    if (!hora) return '';
    
    const horaFormateada = formatearHora(hora);
    const [h, m] = horaFormateada.split(':').map(Number);
    
    const inicio = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    let finH = h;
    let finM = m + 30;
    
    if (finM >= 60) {
      finH += 1;
      finM -= 60;
    }
    
    const fin = `${String(finH).padStart(2, '0')}:${String(finM).padStart(2, '0')}`;
    return `${inicio} - ${fin}`;
  };

  // Cargar historial
  const cargarHistorial = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:3001/api/reservas/turista/${id_turista}?completo=true`;
      
      const params = new URLSearchParams();
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.id_atraccion) params.append('id_atraccion', filtros.id_atraccion);
      
      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      const res = await axios.get(url);
      
      // Aplicar filtros adicionales en el cliente
      let reservasFiltradas = res.data;
      
      if (filtros.bloqueHorario) {
        reservasFiltradas = reservasFiltradas.filter(reserva => {
          const bloqueReserva = obtenerBloqueHorario(reserva.hora);
          return bloqueReserva === filtros.bloqueHorario;
        });
      }
      
      setReservas(reservasFiltradas);
    } catch (err) {
      console.error('Error al cargar historial:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Resetear filtros
  const resetFiltros = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
      id_atraccion: '',
      bloqueHorario: ''
    });
    setPaginaActual(1);
  };

  // Cargar datos al montar y cuando cambian los filtros
  useEffect(() => {
    if (id_turista) {
      cargarHistorial();
    }
  }, [id_turista, filtros]);

  // Paginación
  const totalPaginas = Math.ceil(reservas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = paginaActual * elementosPorPagina;
  const reservasPaginadas = reservas.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Renderizar paginación
  const renderizarPaginacion = () => {
    const botones = [];
    const paginasAMostrar = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(paginasAMostrar / 2));
    let fin = Math.min(totalPaginas, inicio + paginasAMostrar - 1);

    if (fin - inicio + 1 < paginasAMostrar) {
      inicio = Math.max(1, fin - paginasAMostrar + 1);
    }

    if (inicio > 1) {
      botones.push(
        <button
          key="first"
          onClick={() => cambiarPagina(1)}
          className="paginacion-control"
          title="Primera página"
        >
          <FaAngleDoubleLeft/>
        </button>
      );
    }

    for (let i = inicio; i <= fin; i++) {
      botones.push(
        <button
          key={i}
          onClick={() => cambiarPagina(i)}
          className={`paginacion-numero ${paginaActual === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (fin < totalPaginas) {
      botones.push(
        <button
          key="last"
          onClick={() => cambiarPagina(totalPaginas)}
          className="paginacion-control"
          title="Última página"
        >
          <FaAngleDoubleRight/>
        </button>
      );
    }

    return botones;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando historial de reservas...</p>
      </div>
    );
  }

  return (
    <div className="historial-container">
      <header className="historial-header">
        <div className="header-title">
          <FaHistory className="header-icon" />
          <h1>Historial de Reservas</h1>
        </div>
        
        <div className="header-actions">
          <button onClick={() => navigate('/home/client')}
            className="btn-nueva-reserva"
          > 
          Inicio
          </button>
          
          <button 
            onClick={() => navigate('/client/reservas')} 
            className="btn-nueva-reserva"
          >
            <FaCalendarPlus /> Nueva Reserva
          </button>
          
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`btn-filtros ${mostrarFiltros ? 'active' : ''}`}
          >
            {mostrarFiltros ? <FaTimes /> : <FaFilter />}
            {mostrarFiltros ? 'Ocultar Filtros' : 'Filtrar'}
          </button>
        </div>
      </header>

      {/* Panel de Filtros */}
      {mostrarFiltros && (
        <div className="filtros-panel">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label htmlFor="fechaDesde">Desde:</label>
              <input
                id="fechaDesde"
                type="date"
                name="fechaDesde"
                value={filtros.fechaDesde}
                onChange={handleFiltroChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="filtro-group">
              <label htmlFor="fechaHasta">Hasta:</label>
              <input
                id="fechaHasta"
                type="date"
                name="fechaHasta"
                value={filtros.fechaHasta}
                onChange={handleFiltroChange}
                min={filtros.fechaDesde || ''}
              />
            </div>
            
            <div className="filtro-group">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                name="estado"
                value={filtros.estado}
                onChange={handleFiltroChange}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            
            <div className="filtro-group">
              <label htmlFor="id_atraccion">Atracción:</label>
              <select
                id="id_atraccion"
                name="id_atraccion"
                value={filtros.id_atraccion}
                onChange={handleFiltroChange}
              >
                <option value="">Todas las atracciones</option>
                {atracciones.map(atraccion => (
                  <option key={atraccion.id_atraccion} value={atraccion.id_atraccion}>
                    {atraccion.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filtro-group">
              <label htmlFor="bloqueHorario">Bloque Horario:</label>
              <select
                id="bloqueHorario"
                name="bloqueHorario"
                value={filtros.bloqueHorario}
                onChange={handleFiltroChange}
              >
                <option value="">Todos los bloques</option>
                {bloquesHorarios.map((bloque, index) => (
                  <option key={index} value={bloque}>{bloque}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filtros-actions">
            <button 
              onClick={resetFiltros}
              className="btn-limpiar"
              disabled={!Object.values(filtros).some(val => val !== '')}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="historial-content">
        {reservas.length === 0 ? (
          <div className="empty-state">
            <FaSearch className="empty-icon" />
            <h3>No se encontraron reservas</h3>
            <p>
              {Object.values(filtros).some(val => val !== '') 
                ? 'Intenta con otros criterios de búsqueda' 
                : 'Aún no tienes reservas registradas'}
            </p>
          </div>
        ) : (
          <>
            <div className="reservas-table-container">
              <table className="reservas-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Bloque Horario</th>
                    <th>Atracción</th>
                    <th>Personas</th>
                    <th>Subtotal</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservasPaginadas.map((reserva, index) => (
                    <tr key={index}>
                      <td>{reserva.fecha?.split('T')[0]}</td>
                      <td>{formatearHora(reserva.hora)}</td>
                      <td>{obtenerBloqueHorario(reserva.hora)}</td>
                      <td>{reserva.nombre_atraccion}</td>
                      <td>{reserva.cantidad}</td>
                      <td>${reserva.subtotal?.toFixed(2)}</td>
                      <td>
                        <span className={`estado-badge estado-${reserva.estado?.toLowerCase()}`}>
                          {reserva.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="paginacion-container">
                <div className="paginacion-controls">
                  <button 
                    onClick={() => cambiarPagina(1)} 
                    disabled={paginaActual === 1}
                    className="paginacion-control"
                    title="Primera página"
                  >
                    <FaAngleDoubleLeft/>
                  </button>
                  <button 
                    onClick={() => cambiarPagina(paginaActual - 1)} 
                    disabled={paginaActual === 1}
                    className="paginacion-control"
                    title="Página anterior"
                  >
                    <FaAngleLeft/>
                  </button>
                  
                  {renderizarPaginacion()}
                  
                  <button 
                    onClick={() => cambiarPagina(paginaActual + 1)} 
                    disabled={paginaActual === totalPaginas}
                    className="paginacion-control"
                    title="Página siguiente"
                  >
                    <FaAngleRight/>
                  </button>
                  <button 
                    onClick={() => cambiarPagina(totalPaginas)} 
                    disabled={paginaActual === totalPaginas}
                    className="paginacion-control"
                    title="Última página"
                  >
                    <FaAngleDoubleRight/>
                  </button>
                </div>
                
                <div className="paginacion-info">
                  Mostrando {indiceInicio + 1}-{Math.min(indiceFin, reservas.length)} de {reservas.length} reservas
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HistorialReservas;