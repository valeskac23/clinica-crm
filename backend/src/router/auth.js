const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// crear usuario
router.post('/create', async (req, res) => {
  try {
    const { name, email, password, role, color } = req.body;

    // 1. Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'El usuario ya existe' });

    // 2. Crear instancia y encriptar contraseña
    user = new User({ name, email, password, role, color });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.json({ msg: 'Usuario creado exitosamente', user });
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar usuario
router.put('/update/:id', async (req, res) => {
  try {
    const { name, email, role, color } = req.body;
    // Buscamos y actualizamos por ID
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, color },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ msg: 'Usuario actualizado exitosamente', user });
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

// ELIMINAR usuario (Confirmado)
router.delete('/delete/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).send("Error al eliminar usuario");
  }
});

// obtener todos los usuarios
router.get('/get', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});


// login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Buscar si el usuario existe
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }

    // 2. Comparar la contraseña enviada con la de la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // 3. Responder con los datos del usuario (y un token si usas JWT)
    res.json({
      msg: 'Login exitoso',
      token: "clave_secreta_para_tokens",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        color: user.color
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});



// Obtener solo usuarios que son médicos o enfermeras
router.get('/doctors', async (req, res) => {
  try {
    // Buscamos usuarios cuyo rol NO sea admin (o específicamente medico/enfermera)
    const doctors = await User.find({ role: { $ne: 'admin' } }).select('name role color');
    res.json(doctors);
  } catch (err) {
    res.status(500).send('Error al obtener el personal');
  }
});

module.exports = router;