const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const authRoutes = require('./router/auth.js');
const requestsRoutes = require('./router/notifications.js')
const { PORT } = require('../utils/config.js')
const app = express();


// Conectar base de datos
connectDB();

// Middleware
app.use(cors())

app.use(express.json());

// Rutas
app.use('/api/users', authRoutes);
app.use('/api/shifts', require('./router/shifts')); // Solo para el calendario
app.use('/api/requests', requestsRoutes);           // Para cambios y notificaciones





app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});