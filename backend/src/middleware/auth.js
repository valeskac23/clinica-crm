const jwt = require('jsonwebtoken')

const { User } = require('../models/user')

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ message: 'No tienes permiso para realizar esta acción, contacta al administrador del sistema' })

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decodedToken
      next()
    } catch (error) {
      res.status(401).json({ message: 'No tienes permiso para realizar esta acción, contacta al administrador del sistema' })
    }
  }
}

module.exports = authMiddleware