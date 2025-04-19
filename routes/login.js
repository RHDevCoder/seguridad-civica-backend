//routes/login.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

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

    // Comparar la contraseña ingresada con el hash almacenado
    bcrypt.compare(contrasena, usuario.contrasena, (err, esValida) => {
      if (err) {
        console.error('❌ Error al verificar la contraseña:', err);
        return res.status(500).json({ error: 'Error al verificar la contraseña' });
      }

      if (!esValida) {
        return res.status(401).json({ mensaje: '❌ Contraseña incorrecta' });
      }

      // Si todo está bien, devolver los datos del usuario (sin la contraseña)
      const { contrasena, ...usuarioSinContrasena } = usuario;
      res.json({ mensaje: '✅ Login exitoso', usuario: usuarioSinContrasena });
    });
  });
});

module.exports = router;
