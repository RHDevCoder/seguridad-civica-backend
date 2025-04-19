// routes/login.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ruta para iniciar sesión
router.post('/', (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  // Buscar el usuario por email
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('❌ Error al buscar el usuario:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Usuario no encontrado' });
    }

    const usuario = results[0];

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    bcrypt.compare(contrasena, usuario.contrasena, (err, esValida) => {
      if (err) {
        console.error('❌ Error al verificar la contraseña:', err);
        return res.status(500).json({ error: 'Error al verificar la contraseña' });
      }

      if (!esValida) {
        return res.status(401).json({ mensaje: '❌ Contraseña incorrecta' });
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
        process.env.JWT_SECRET,
        { expiresIn: '4h' }
      );

      // Retornar usuario sin la contraseña
      const { contrasena, ...usuarioSinContrasena } = usuario;

      res.json({
        mensaje: '✅ Login exitoso',
        token,
        usuario: usuarioSinContrasena
      });
    });
  });
});

module.exports = router;
