// routes/usuarios.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const verificarToken = require('../middlewares/auth'); // Middleware de autenticación JWT

// 🔐 GET: Obtener todos los usuarios (protegido)
router.get('/', verificarToken, (req, res) => {
  const query = 'SELECT * FROM usuarios';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    res.json(results);
  });
});

// 🔐 GET: Obtener un solo usuario por ID (protegido)
router.get('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM usuarios WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar el usuario' });
    if (results.length === 0) return res.status(404).json({ mensaje: '❌ Usuario no encontrado' });
    res.json(results[0]);
  });
});

// POST: Crear un nuevo usuario (no protegido, ya que se usa para registrar nuevos)
router.post('/', (req, res) => {
  const { nombre, apellido, celular, cedula, direccion, email, contrasena, tipo } = req.body;

  if (!nombre || !apellido || !celular || !cedula || !direccion || !email || !contrasena || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const saltRounds = 10;
  bcrypt.hash(contrasena, saltRounds, (err, hash) => {
    if (err) {
      console.error('❌ Error al encriptar la contraseña:', err);
      return res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }

    const query = `
      INSERT INTO usuarios (nombre, apellido, celular, cedula, direccion, email, contrasena, tipo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [nombre, apellido, celular, cedula, direccion, email, hash, tipo];

    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear el usuario' });
      res.status(201).json({ mensaje: '✅ Usuario creado correctamente', id: result.insertId });
    });
  });
});

// 🔐 PUT: Actualizar un usuario por ID (protegido)
router.put('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, celular, cedula, direccion, email, contrasena, tipo } = req.body;

  if (!nombre || !apellido || !celular || !cedula || !direccion || !email || !contrasena || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const saltRounds = 10;
  bcrypt.hash(contrasena, saltRounds, (err, hash) => {
    if (err) {
      console.error('❌ Error al encriptar la contraseña:', err);
      return res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }

    const query = `
      UPDATE usuarios
      SET nombre = ?, apellido = ?, celular = ?, cedula = ?, direccion = ?, email = ?, contrasena = ?, tipo = ?
      WHERE id = ?
    `;
    const values = [nombre, apellido, celular, cedula, direccion, email, hash, tipo, id];

    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar el usuario' });
      if (result.affectedRows === 0) return res.status(404).json({ mensaje: '❌ Usuario no encontrado' });
      res.json({ mensaje: '✅ Usuario actualizado correctamente' });
    });
  });
});

// 🔐 DELETE: Eliminar un usuario por ID (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM usuarios WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el usuario' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: '❌ Usuario no encontrado' });
    res.json({ mensaje: '🗑️ Usuario eliminado correctamente' });
  });
});

module.exports = router;
