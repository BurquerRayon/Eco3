require('dotenv').config();

const express = require('express');
const cors = require('cors');

// ✅ Rutas
const rolesRoutes = require('./routes/rolesRoutes');
const atraccionesRoutes = require('./routes/atraccionesRoutes');
const permisosRoutes = require('./routes/permisosRoutes');
const rolPermisosRoutes = require('./routes/rolPermisosRoutes');
const monedasRoutes = require('./routes/monedasRoutes');
const reportTypesRoutes = require('./routes/reportesTipoRoutes');
const nacionalidadesRoutes = require('./routes/nacionalidadesRoutes');
const reservasRoutes = require('./routes/reservaRoutes');
const configRoutes = require('./routes/configRoutes');
const adminRoutes = require('./routes/adminRoutes');

const pagosRoutes = require('./routes/pagosRoutes');

// ✅ Conexión SQL Server
const { poolConnect, pool } = require('./db/connection');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Ruta de prueba para base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT GETDATE() AS now');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error en la base de datos' });
  }
});

// ✅ Rutas principales
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cliente', require('./routes/clientesRoutes'));
app.use('/api/roles', rolesRoutes);
app.use('/api/atracciones', atraccionesRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/rol-permisos', rolPermisosRoutes);
app.use('/api/monedas', monedasRoutes);
app.use('/api/reportes', reportTypesRoutes);
app.use('/api/nacionalidades', nacionalidadesRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/config', configRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/pagos', pagosRoutes);


// ✅ Inicio del servidor
const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
