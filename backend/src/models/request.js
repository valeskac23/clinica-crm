const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  // El médico que inicia la solicitud
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // El colega (mismo rol) con quien se quiere cambiar
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Referencia a la guardia original (opcional, pero recomendado)
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift'
  },
  // Fecha en la que el solicitante desea realizar la guardia
  desiredDate: {
    type: String, // O Date, según uses en tu calendario
    required: true
  },
  // Motivo del cambio
  reason: {
    type: String
  },
  // ESTADO DEL FLUJO (Clave para tu requerimiento)
  status: {
    type: String,
    enum: [
      'pending_colleague', // Inicial: Solo el colega puede verla/aceptarla
      'pending_admin',     // El colega aceptó: Ahora el supervisor la visualiza
      'approved',          // El supervisor dio el visto bueno final
      'rejected'           // Alguien en la cadena (colega o admin) rechazó
    ],
    default: 'pending_colleague'
  },
  // Historial de fechas (para auditoría)
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Request', RequestSchema);