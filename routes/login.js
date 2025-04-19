const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carga las variables de entorno

// Ruta para iniciar sesión
router.post('/', (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

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

    bcrypt.compare(contrasena, usuario.contrasena, (err, esValida) => {
      if (err) {
        console.error('❌ Error al verificar la contraseña:', err);
        return res.status(500).json({ error: 'Error al verificar la contraseña' });
      }

      if (!esValida) {
        return res.status(401).json({ mensaje: '❌ Contraseña incorrecta' });
      }

      // Si es válida, generar el token
      const payload = {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h' // Token válido por 2 horas
      });

      // Devolver token y datos del usuario (sin contraseña)
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
