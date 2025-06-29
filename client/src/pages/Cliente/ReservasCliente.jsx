import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ReservaCliente.css';
import ClientePago from '../Cliente/ClientePago';

const ReservaCliente = () => {
  const [atracciones, setAtracciones] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [bloquearReservaDuplicada, setBloquearReservaDuplicada] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [reservaParaPagar, setReservaParaPagar] = useState(null);

  // Estados para filtros y paginación
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const user = JSON.parse(localStorage.getItem('user'));
  const id_turista = user?.id_turista;
  const navigate = useNavigate();

  // Función para formatear hora
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

  // Generar bloques horarios (sin las 17:00)
  const generarBloquesHorario = (inicio, fin) => {
    const bloques = [];
    let [h, m] = inicio.split(':').map(Number);
    const [hFin] = fin.split(':').map(Number);

    while (h < hFin || (h === hFin && m === 0)) {
      // Excluir el bloque de 17:00
      if (!(h === 17 && m === 0)) {
        bloques.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
      m += 30;
      if (m >= 60) {
        h += 1;
        m = 0;
      }
    }
    return bloques;
  };

  // Verificar reservas duplicadas
  const existeReservaDuplicada = (nuevoDetalle, indexActual = -1) => {
    return detalles.some((detalle, index) => 
      index !== indexActual &&
      detalle.id_atraccion &&
      detalle.id_atraccion === nuevoDetalle.id_atraccion &&
      detalle.fecha &&
      detalle.fecha === nuevoDetalle.fecha &&
      detalle.hora &&
      detalle.hora === nuevoDetalle.hora
    );
  };

  // Verificar reservas duplicadas contra la base de datos
  const verificarReservaDuplicadaEnBD = async (detalle) => {
    if (!detalle.id_atraccion || !detalle.fecha || !detalle.hora) return false;

    try {
      const response = await axios.get(`http://localhost:3001/api/reservas/turista/${id_turista}`, {
        params: {
          completo: 'true',
          id_atraccion: detalle.id_atraccion,
          fechaDesde: detalle.fecha,
          fechaHasta: detalle.fecha
        }
      });

      // Filtrar reservas que coincidan exactamente con fecha, hora y atracción
      // y que estén en estado pendiente o confirmado
      const reservasExistentes = response.data.filter(reserva => 
        reserva.fecha.split('T')[0] === detalle.fecha &&
        formatearHora(reserva.hora) === detalle.hora &&
        (reserva.estado === 'pendiente' || reserva.estado === 'confirmado')
      );

      return reservasExistentes.length > 0;
    } catch (err) {
      console.error('Error al verificar duplicados en BD:', err);
      return false;
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    axios.get('http://localhost:3001/api/atracciones')
      .then(res => setAtracciones(res.data))
      .catch(err => console.error('Error al cargar atracciones:', err));

    axios.get('http://localhost:3001/api/config/horario-reservas')
      .then(res => {
        const { hora_inicio, hora_fin } = res.data;
        setHorarios(generarBloquesHorario(hora_inicio, hora_fin));
      })
      .catch(() => setHorarios(generarBloquesHorario('09:00', '17:00')));

    if (id_turista) cargarHistorial();
  }, [id_turista]);

  // Aplicar filtros al historial
  useEffect(() => {
    if (historial.length > 0) {
      const filtrado = historial.filter((reserva) => {
        const coincideFecha = !filtroFecha || reserva.fecha?.split('T')[0] === filtroFecha;
        const coincideNombre = !filtroNombre || 
          reserva.nombre_atraccion?.toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideEstado = !filtroEstado || 
          reserva.estado?.toLowerCase() === filtroEstado.toLowerCase();
        return coincideFecha && coincideNombre && coincideEstado;
      });
      setHistorialFiltrado(filtrado);
      setPaginaActual(1);
    }
  }, [historial, filtroFecha, filtroNombre, filtroEstado]);

  // Manejar cambios en los detalles
  const handleDetalleChange = (index, field, value) => {
    const nuevaLista = [...detalles];
    nuevaLista[index][field] = value;

    if (field === 'id_atraccion') {
      const atraccion = atracciones.find(a => a.id_atraccion === parseInt(value));
      if (atraccion) nuevaLista[index].tarifa_unitaria = atraccion.precio;
    }

    // Verificar duplicados solo si todos los campos necesarios están completos
    if (field === 'id_atraccion' || field === 'fecha' || field === 'hora') {
      const detalleModificado = { ...nuevaLista[index] };

      // Solo verificar duplicados si el detalle está completo
      if (detalleModificado.id_atraccion && detalleModificado.fecha && detalleModificado.hora) {
        const esDuplicado = existeReservaDuplicada(detalleModificado, index);

        if (esDuplicado) {
          setMensaje('⚠️ Ya tienes una reserva para esta atracción en la misma fecha y hora');
          setBloquearReservaDuplicada(true);
        } else {
          // Reset the blocking state if no duplicates found
          setBloquearReservaDuplicada(false);
          setMensaje('');
        }
      } else {
        // Reset blocking if detail is incomplete
        setBloquearReservaDuplicada(false);
        setMensaje('');
      }
    }

    // Reset blocking when changing quantity (capacity might be valid now)
    if (field === 'cantidad') {
      setBloquearReservaDuplicada(false);
      setMensaje('');
    }

    // Calcular subtotal
    const cantidad = parseInt(nuevaLista[index].cantidad) || 0;
    const tarifa = parseFloat(nuevaLista[index].tarifa_unitaria) || 0;
    nuevaLista[index].subtotal = cantidad * tarifa;

    setDetalles(nuevaLista);
  };

  // Manejar cambio de fecha con validación
  const handleFechaChange = (e, index) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validar que no sea puedan realizar reservas los dias lunes (0 = lunes)
    if (selectedDate.getDay() === 0) {
      setMensaje('⚠️ No se permiten reservas los lunes. Por favor seleccione otro día.');

      const nuevaLista = [...detalles];
      nuevaLista[index].fecha = '';
      setDetalles(nuevaLista);

      return;
    }

    // Validar que la fecha no sea en el pasado
    if (selectedDate < today) {
      setMensaje('⚠️ No puedes reservar para fechas pasadas');
      return;
    }

    handleDetalleChange(index, 'fecha', e.target.value);
  };

  // Agregar nuevo detalle
  const agregarDetalle = () => {
    const nuevoDetalle = {
      id_atraccion: '',
      cantidad: 1,
      fecha: '',
      hora: horarios[0] || '09:00',
      tarifa_unitaria: 0,
      subtotal: 0
    };

    setDetalles(prev => [...prev, nuevoDetalle]);
    setBloquearReservaDuplicada(false);
    setMensaje('');
  };

  // Eliminar detalle
  const eliminarDetalle = (index) => {
    const nueva = detalles.filter((_, i) => i !== index);
    setDetalles(nueva);

    const hayDuplicados = nueva.some((detalle, idx) => 
      existeReservaDuplicada(detalle, idx)
    );

    setBloquearReservaDuplicada(hayDuplicados);
    if (!hayDuplicados) setMensaje('');
  };

  // Cancelar creación/edición
  const cancelarProceso = () => {
    setDetalles([]);
    setReservaEditando(null);
    setModoEdicion(false);
    setMostrarFormulario(false);
    setMensaje('');
    setBloquearReservaDuplicada(false);
  };

  // Cargar reserva para edición
  const cargarReservaParaEdicion = async (id_reserva) => {
    try {
      if (!id_reserva) {
        setMensaje('❌ No se proporcionó un ID de reserva válido');
        return;
      }

      setMensaje('Cargando reserva...');

      // Obtener información básica de la reserva
      const response = await axios.get(`http://localhost:3001/api/reservas/${id_reserva}`);
      const reserva = response.data;

      if (!reserva) {
        setMensaje('❌ No se encontró la reserva solicitada');
        return;
      }

      // Verificar si se puede editar
      if (reserva.estado === 'confirmado' && reserva.ediciones >= 1) {
        setMensaje('❌ Solo puedes editar una vez las reservas confirmadas');
        return;
      }

      if (reserva.estado === 'pendiente' && reserva.ediciones >= 2) {
        setMensaje('❌ Solo puedes editar máximo 2 veces las reservas pendientes');
        return;
      }

      if (reserva.estado === 'cancelado') {
        setMensaje('❌ No se pueden editar reservas canceladas');
        return;
      }

      // Obtener los detalles de la reserva
      const detallesReserva = await axios.get(`http://localhost:3001/api/reservas/${id_reserva}/detalles`);

      if (!detallesReserva.data || detallesReserva.data.length === 0) {
        setMensaje('❌ La reserva no tiene detalles asociados');
        return;
      }

      // Formatear los detalles
      const detallesFormateados = detallesReserva.data.map(d => ({
        id_atraccion: d.id_atraccion,
        cantidad: d.cantidad,
        fecha: d.fecha.split('T')[0],
        hora: formatearHora(d.hora),
        tarifa_unitaria: d.tarifa_unitaria,
        subtotal: d.subtotal
      }));

      // Actualizar estado
      setDetalles(detallesFormateados);
      setReservaEditando(id_reserva);
      setModoEdicion(true);
      setMostrarFormulario(true);
      setMensaje(`Editando reserva #${id_reserva}`);

    } catch (err) {
      console.error('Error al cargar reserva para edición:', err);
      setMensaje('❌ Error al cargar la reserva para edición');
    }
  };

  // Cancelar reserva existente
  const cancelarReserva = async (id_reserva) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/api/reservas/cancelar/${id_reserva}`);
      setMensaje(response.data.message || '✅ Reserva cancelada');
      cargarHistorial();
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Error al cancelar la reserva';
      setMensaje(msg);
      console.error('Error al cancelar reserva:', msg);
    }
  };

  // Enviar reserva (creación o edición)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for actual duplicates in the current form
    const hayDuplicadosEnFormulario = detalles.some((detalle, idx) => 
      existeReservaDuplicada(detalle, idx)
    );

    if (hayDuplicadosEnFormulario) {
      setMensaje('❌ Corrige las reservas duplicadas antes de continuar');
      return;
    }

    if (!id_turista) {
      setMensaje('❌ No se encontró el ID del usuario');
      return;
    }

    // Validar que no haya fechas en lunes
    const hayLunes = detalles.some(d => {
      if (!d.fecha) return false;
      const dia = new Date(d.fecha).getDay();
      return dia === 0; // 0 = Lunes
    });

    if (hayLunes) {
      setMensaje('❌ No se permiten reservas los lunes');
      return;
    }

    const esValido = detalles.every(d =>
      d.id_atraccion && d.cantidad > 0 && d.fecha && d.hora
    );

    if (!esValido) {
      setMensaje('❌ Complete todos los campos correctamente');
      return;
    }

    // Reset any previous blocking state before attempting submission
    setBloquearReservaDuplicada(false);

    try {
      if (modoEdicion && reservaEditando) {
        // Editar reserva existente
        const response = await axios.put(
          `http://localhost:3001/api/reservas/editar/${reservaEditando}`, 
          { id_turista, detalles }
        );

        setMensaje(response.data.message || '✅ Reserva actualizada');
        cancelarProceso();
        cargarHistorial();
      } else {
        // Crear nueva reserva
        const response = await axios.post(
          'http://localhost:3001/api/reservas/crear', 
          { id_turista, detalles }
        );

        setMensaje(response.data.message || '✅ Reserva creada');
        cancelarProceso();
        cargarHistorial();
      }
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Error al procesar la reserva';
      setMensaje(msg);
      // Don't permanently block the form - the user can adjust and try again
      console.error('Error en reserva:', msg);
    }
  };

  // Cargar historial de reservas
  const cargarHistorial = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/reservas/turista/${id_turista}`);
      setHistorial(res.data);
    } catch (err) {
      console.error('Error al cargar historial:', err);
    }
  };

  // Calcular total
  const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);

  // Paginación mejorada
  const totalPaginas = Math.ceil(historialFiltrado.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = paginaActual * elementosPorPagina;
  const historialPaginado = historialFiltrado.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  };

  const renderizarNumerosPagina = () => {
    const paginas = [];
    const paginasAMostrar = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(paginasAMostrar / 2));
    let fin = Math.min(totalPaginas, inicio + paginasAMostrar - 1);

    if (fin - inicio + 1 < paginasAMostrar) {
      inicio = Math.max(1, fin - paginasAMostrar + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(
        <button
          key={i}
          onClick={() => cambiarPagina(i)}
          className={`paginacion-numero ${paginaActual === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return paginas;
  };

  return (
    <div className="dashboard-container">
      <h2>Reservas</h2>

      <div className="panel-botones">
        <button 
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setMostrarFiltros(false);
            if (mostrarFormulario) cancelarProceso();
          }}
          className="btn-toggle-form"
        >
          {mostrarFormulario ? '➖ Ocultar Formulario' : '➕ Crear Nueva Reserva'}
        </button>

        <button 
          onClick={() => {
            setMostrarFiltros(!mostrarFiltros);
            setMostrarFormulario(false);
            cancelarProceso();
          }}
          className="btn-toggle-form"
        >
          {mostrarFiltros ? '➖ Ocultar Búsqueda' : '🔍 Buscar Reservas'}
        </button>

        <button 
          onClick={() => navigate('/client/historial')}
          className="btn-toggle-form"
        >
          📋 Ver Historial Completo
        </button>
      </div>

      {mostrarFiltros && (
        <div className="filtros-reserva">
          <h3>Filtrar Reservas</h3>
          <div className="filtros-grid">
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              placeholder="Filtrar por fecha"
            />

            <input
              type="text"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              placeholder="Filtrar por atracción"
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      )}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="reserva-form">
          <p className="info-dias">
            <strong>Horario de reservas:</strong> Martes a Domingo<br />
            <span className="cerrado-lunes">❌ Los lunes el parque permanece cerrado</span>
          </p>

          {modoEdicion && (
            <div className="modo-edicion-info">
              <strong>Editando reserva #{reservaEditando}</strong>
            </div>
          )}

          {detalles.map((detalle, idx) => {
            const esDuplicado = existeReservaDuplicada(detalle, idx);
            const esFechaInvalida = detalle.fecha && new Date(detalle.fecha).getDay() === 0;

            return (
              <div 
                key={idx} 
                className={`reserva-linea ${esDuplicado || esFechaInvalida ? 'error-duplicado' : ''}`}
              >
                <select
                  value={detalle.id_atraccion}
                  onChange={(e) => handleDetalleChange(idx, 'id_atraccion', e.target.value)}
                  required
                >
                  <option value="">Seleccione una atracción</option>
                  {atracciones
                    .filter(a => !detalles.some((d, dIdx) => 
                      dIdx !== idx && d.id_atraccion === a.id_atraccion
                    ))
                    .map(a => (
                      <option key={a.id_atraccion} value={a.id_atraccion}>
                        {a.nombre} - ${a.precio}
                      </option>
                    ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={detalle.cantidad}
                  onChange={(e) => handleDetalleChange(idx, 'cantidad', e.target.value)}
                  required
                />

                <input
                  type="date"
                  value={detalle.fecha}
                  onChange={(e) => handleFechaChange(e, idx)}
                  className={esFechaInvalida ? 'fecha-invalida' : ''}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />

                <select
                  value={detalle.hora}
                  onChange={(e) => handleDetalleChange(idx, 'hora', e.target.value)}
                  required
                >
                  {horarios.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>

                <span>Subtotal: ${detalle.subtotal.toFixed(2)}</span>

                {detalles.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => eliminarDetalle(idx)}
                    className="btn-eliminar"
                  >
                    🗑
                  </button>
                )}
              </div>
            );
          })}

          <div className="acciones-formulario">
            <button type="button" onClick={agregarDetalle} className="btn-agregar">
              + Agregar Atracción
            </button>
            <h4>Total: ${total.toFixed(2)}</h4>

            <div className="botones-accion">
              <button 
                type="button" 
                onClick={cancelarProceso}
                className="boton-cancelar"
              >
                Cancelar
              </button>

              <button 
                type="submit" 
                disabled={
                  detalles.some((detalle, idx) => existeReservaDuplicada(detalle, idx)) ||
                  detalles.some(d => d.fecha && new Date(d.fecha).getDay() === 0)
                }
                className="btn-confirmar"
              >
                {modoEdicion ? 'Actualizar Reserva' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
        </form>
      )}

      <h3>Mis Reservas Activas</h3>
      {mensaje && (
        <p className={`mensaje ${mensaje.includes('✅') ? 'exito' : 'error'}`}>
          {mensaje}
        </p>
      )}

      <table className="tabla-reservas">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Atracción</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Estado</th>
            <th>Ediciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historialPaginado.length === 0 ? (
            <tr><td colSpan="8">No hay reservas que coincidan con los filtros.</td></tr>
          ) : (
            historialPaginado.map((r, idx) => (
              <tr key={idx}>
                <td>{r.fecha?.split('T')[0]}</td>
                <td>{formatearHora(r.hora)}</td>
                <td>{r.nombre_atraccion}</td>
                <td>{r.cantidad}</td>
                <td>${r.subtotal?.toFixed(2)}</td>
                <td>{r.estado}</td>
                <td>{r.ediciones}</td>
                <td className="acciones-reserva">
                  {r.estado !== 'cancelado' && (
                    <>
                      <button 
                        onClick={() => cargarReservaParaEdicion(r.id_reserva)}
                        disabled={
                          (r.estado === 'confirmado' && r.ediciones >= 1) ||
                          (r.estado === 'pendiente' && r.ediciones >= 2)
                        }
                        title={
                          (r.estado === 'confirmado' && r.ediciones >= 1) ? 
                          'Solo puedes editar 1 vez las reservas confirmadas' :
                          (r.estado === 'pendiente' && r.ediciones >= 2) ?
                          'Solo puedes editar máximo 2 veces las reservas pendientes' :
                          'Editar reserva'
                        }
                      >
                        ✏️
                      </button>

                      {r.estado !== 'confirmado' && (
                        <button 
                          onClick={() => cancelarReserva(r.id_reserva)}
                          title="Cancelar reserva"
                        >
                          ❌
                        </button>
                      )}

                      {r.estado === 'pendiente' && (
                        <button 
                          onClick={() => setReservaParaPagar(r)}
                          title="Ir a pagar esta reserva"
                        >
                          💳
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className="paginacion-containerNav">
          <button 
            onClick={() => cambiarPagina(1)} 
            disabled={paginaActual === 1}
            className="paginacion-control"
          >
            «
          </button>
          <button 
            onClick={() => cambiarPagina(paginaActual - 1)} 
            disabled={paginaActual === 1}
            className="paginacion-control"
          >
            ‹
          </button>

          {renderizarNumerosPagina()}

          <button 
            onClick={() => cambiarPagina(paginaActual + 1)} 
            disabled={paginaActual === totalPaginas}
            className="paginacion-control"
          >
            ›
          </button>
          <button 
            onClick={() => cambiarPagina(totalPaginas)} 
            disabled={paginaActual === totalPaginas}
            className="paginacion-control"
          >
            »
          </button>

          <span className="paginacion-info">
            Página {paginaActual} de {totalPaginas}
          </span>
        </div>
      )}
      {reservaParaPagar && (
        <ClientePago 
          reserva={reservaParaPagar} 
          onCerrar={() => setReservaParaPagar(null)} 
        />
      )}
    </div>
  );
};

export default ReservaCliente;