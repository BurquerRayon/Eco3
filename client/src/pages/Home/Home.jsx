import React from 'react';
import HomeGuest from './HomeGuest';
import HomeClient from './HomeClient';
import HomeEmployee from './HomeEmployee';
import AdminHome  from './AdminHome';
import { useAuth } from '../../context/AuthContext'; // Añadir

const Home = () => {
  const { user } = useAuth(); // Cambiar esto

  if (!user) {
    return <HomeGuest />;
  }

  if (user.rol === 'cliente') {
    return <HomeClient />;
  }

  if (user.rol === 'empleado') {
    return <HomeEmployee />;
  }

  if (user.role === 'admin') {
  return  <AdminHome />;
  }

  return <HomeGuest />;
};

export default Home;