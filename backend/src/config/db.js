// ./src/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();
const { MONGODB_URI } = require('../../utils/config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    // Detener la aplicación si la base de datos falla
    process.exit(1);
  }
};

module.exports = connectDB;