import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext'; 
//Homes
import Home from '../pages/Home/Home';
import HomeClient from '../pages/Home/HomeClient';
import HomeEmployee from '../pages/Home/HomeEmployee';
import AdminHome from '../pages/Home/AdminHome';
//basics
import Login from '../pages/Login';
import Registro from '../pages/Cliente/Register';
import Navbar from '../components/Navbar';
import Mapa from '../pages/Cliente/Map';
import Galeria from '../pages/Cliente/Gallery';
import Nosotros from '../pages/About';
import NotFound from '../pages/NotFound';
import Verify from '../pages/Verify';
//Empleados
import ReportesE from '../pages/Empleados/Reports';
import GestionReservasE from '../pages/Empleados/GestionReservas';
//admins
import ReportesA from '../pages/Admin/ReportsAdmin';
import Dashboard from '../pages/Admin/Dashboard';
import GestionReservasAdmin  from '../pages/Admin/AdminReservas';
import GestionUsuarios from '../pages/Admin/GestionUsuarios';
import ConfigA from '../pages/Admin/Config';
//admins Config
import AtraccionesConfig  from '../pages/Admin/Config/Atracciones';
import MonedasConfig  from '../pages/Admin/Config/Monedas';
import NacionalidadesConfig  from '../pages/Admin/Config/Nacionalidades';
import PermisosConfig  from '../pages/Admin/Config/Permisos';
import RolesConfig  from '../pages/Admin/Config/Roles';
import ReportesConfig  from '../pages/Admin/Config/TiposDeReportes';
import ConfigHoras  from '../pages/Admin/Config/HorarioReservasConfig';

// Cliente
import ReservasCliente from '../pages/Cliente/ReservasCliente';
import ConfigC from '../pages/Cliente/Config';
import HistorialReservas from '../pages/Cliente/HistorialReservas';
import ClientePago from '../pages/Cliente/ClientePago';
// Cliente Config
import DatosPC from '../pages/Cliente/Config/DatosPersonales';
// import ContactoForm from '../pages/Cliente/Config/ContactoForm';
import BancariaForm from '../pages/Cliente/Config/BancariaForm';
import DocumentosForm from '../pages/Cliente/Config/DocumentosForm';


// Importa los nuevos componentes al inicio del archivo
import ForgotPassword from '../pages/Cliente/ForgotPassword';
import ResetPassword from '../pages/Cliente/ResetPassword';



const AppRouter = () => {
  return (
    <AuthProvider> {/* Envuelve todo con AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* Rutas de Empleados */}
        <Route path="/Employee/reportes" element={<ReportesE />} />
        <Route path="/Employee/reservas" element={<GestionReservasE />} />
        
        {/* Rutas de administrador */}
        <Route path="/admin/config" element={<ConfigA />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/Reservas" element={<GestionReservasAdmin />} />
        <Route path="/admin/reportes" element={<ReportesA />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
       {/* Rutas de COnfig-administrador */}
        <Route path="/admin/ajustes/roles" element={<RolesConfig />} />
        <Route path="/admin/ajustes/permisos" element={<PermisosConfig />} />
        <Route path="/admin/ajustes/atracciones" element={<AtraccionesConfig />} />
        <Route path="/admin/ajustes/monedas" element={<MonedasConfig />} />
        <Route path="/admin/ajustes/reportes" element={<ReportesConfig />} />
        <Route path="/admin/ajustes/nacionalidades" element={<NacionalidadesConfig />} />
        <Route path="/admin/ajustes/configuracionhoras" element={<ConfigHoras />} />

        {/* Rutas de Paginas Home */}
        <Route path="/home/client" element={<HomeClient />} />
        <Route path="/home/employee" element={<HomeEmployee />} />
        <Route path="/home/admin" element={<AdminHome />} />

        {/* Rutas de Paginas de Reportes */}
        <Route path="/about" element={<Nosotros/>} />

        {/* Rutas de Paginas de Reservas */}
        <Route path="/client/reservas" element={<ReservasCliente />} />
        <Route path="/client/historial" element={<HistorialReservas />} />
        <Route path="/perfil" element={<DatosPC />} />
        <Route path="/client/config" element={<ConfigC />} />
        <Route path="/map" element={<Mapa />} />
        <Route path="/gallery" element={<Galeria />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/cliente/pago/:id_reserva" element={<ClientePago />} />

        {/* Rutas de Config Cliente */}
        <Route path="/cliente/config/datos-personales" element={<DatosPC />} />
        {/* <Route path="/cliente/config/contacto" element={<ContactoForm />} /> */}
        <Route path="/cliente/config/bancaria" element={<BancariaForm />} />
        <Route path="/cliente/config/documentos" element={<DocumentosForm />} />

        {/* Ruta para errores 404 */}
        <Route path="*" element={<NotFound />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
