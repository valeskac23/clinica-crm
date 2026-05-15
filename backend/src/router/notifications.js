//ruta para el registro de notificaciones
// /api/notifications

const express = require('express');
const router = express.Router();
const ShiftRequest = require('../models/request');
const User = require('../models/User');

// @route   POST /api/requests/request-change
// @desc    Crear una nueva solicitud de cambio
router.post('/request-change', async (req, res) => {
  try {
    const { requesterId, targetUserId, desiredDate, reason } = req.body;

    if (!requesterId || !targetUserId || !desiredDate) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    const newRequest = new ShiftRequest({
      requesterId,
      targetUserId,
      desiredDate,
      reason,
      status: 'pending_colleague'
    });

    await newRequest.save();
    res.status(201).json({ msg: "Solicitud creada con éxito", data: newRequest });
  } catch (err) {
    console.error("Error en POST request-change:", err);
    res.status(500).json({ msg: "Error al procesar la solicitud", error: err.message });
  }
});



// @route   POST /api/requests/respond
// @desc    Aceptar o Rechazar una solicitud (Médico o Supervisor)
router.post('/respond', async (req, res) => {
  try {
    const { requestId, action, userRole } = req.body;

    // 1. Buscar la solicitud
    const request = await ShiftRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }

    // 2. Lógica de estados según tu requerimiento
    if (action === 'reject') {
      request.status = 'rejected';
    } else if (action === 'accept') {
      if (userRole !== 'admin') {
        // Es un médico aceptando -> Pasa a revisión del supervisor
        request.status = 'pending_admin';
      } else {
        // Es el supervisor aceptando -> Solo si ya fue aceptada por el colega
        if (request.status === 'pending_admin') {
          request.status = 'approved';
          // OPCIONAL: Aquí puedes agregar la lógica para cambiar los dueños de las guardias
        } else {
          return res.status(400).json({ msg: "El colega debe aceptar primero antes de que el supervisor apruebe" });
        }
      }
    }

    request.resolvedAt = Date.now();
    await request.save();

    res.json({ msg: `Solicitud ${action}ada con éxito`, status: request.status });

  } catch (err) {
    console.error("Error en respond:", err);
    res.status(500).json({ msg: "Error al procesar respuesta", error: err.message });
  }
});
// @route   GET /api/requests/my-notifications/:userId
//rutas para la notificaciones
router.get('/my-notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    let query = {};
    if (user.role === 'admin') {
      query = { status: 'pending_admin' };
    } else {
      query = { targetUserId: userId, status: 'pending_colleague' };
    }

    const notifications = await ShiftRequest.find(query)
      .populate('requesterId', 'name role')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener notificaciones" });
  }
});




module.exports = router;
