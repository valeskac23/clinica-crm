//rutas para la guardias

const express = require('express');
const router = express.Router();
const Shift = require('../models/guardia'); // Asegúrate de tener el modelo creado

// @route   GET /api/shifts
// @desc    Obtener todas las guardias con datos del médico
router.get('/', async (req, res) => {
  try {
    // El .populate('userId') es la clave: busca el nombre y color en la tabla de Usuarios
    const shifts = await Shift.find().populate('userId', 'name color');
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener guardias' });
  }
});

// @route   POST /api/shifts
// @desc    Crear una nueva guardia
router.post('/', async (req, res) => {
  try {
    const { title, start, end, userId } = req.body;
    const newShift = new Shift({ title, start, end, userId });
    const shift = await newShift.save();
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al guardar la guardia');
  }
});

// Editar guardia (el endpoint que faltaba)
router.put('/:id', async (req, res) => {
  try {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shift) return res.status(404).json({ msg: 'Guardia no encontrada' });
    res.json(shift);
  } catch (err) {
    res.status(500).send('Error al actualizar');
  }
});

// Eliminar guardia
router.delete('/:id', async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) return res.status(404).json({ msg: 'Guardia no encontrada' });
    res.json({ msg: 'Guardia eliminada correctamente' });
  } catch (err) {
    res.status(500).send('Error al eliminar');
  }
});


// solicitud de cambio de guardia
/*router.post('/request-change', async (req, res) => {
  const { requesterId, targetUserId, originalDate, desiredDate, role } = req.body;

  try {
    // Aquí registrarías la solicitud en una nueva colección "Requests"
    // Y dispararías el envío de correos o notificaciones push
    console.log(`Notificando a colega ${targetUserId} y al supervisor sobre cambio de ${role}`);

    res.status(200).json({ msg: "Solicitud enviada correctamente" });
  } catch (err) {
    res.status(500).json({ msg: "Error al procesar solicitud" });
  }
});*/




module.exports = router;