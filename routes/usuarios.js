// routes/usuarios.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // Importamos la conexión a la base de datos

// Obtener todos los usuarios
router.get('/', (req, res) => {
  const query = 'SELECT * FROM usuarios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

// Registrar nuevo usuario
router.post('/', (req, res) => {
  const { nombre, apellido, celular, cedula, direccion, email, contrasena, tipo } = req.body;

  if (!nombre || !apellido || !celular || !cedula || !direccion || !email || !contrasena || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    INSERT INTO usuarios (nombre, apellido, celular, cedula, direccion, email, contrasena, tipo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [nombre, apellido, celular, cedula, direccion, email, contrasena, tipo];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al insertar el usuario:', err);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
    res.status(201).json({ mensaje: '✅ Usuario creado correctamente', id: result.insertId });
  });
});

// Actualizar usuario por ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, celular, cedula, direccion, email, contrasena, tipo } = req.body;

  if (!nombre || !apellido || !celular || !cedula || !direccion || !email || !contrasena || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    UPDATE usuarios
    SET nombre = ?, apellido = ?, celular = ?, cedula = ?, direccion = ?, email = ?, contrasena = ?, tipo = ?
    WHERE id = ?
  `;
  const values = [nombre, apellido, celular, cedula, direccion, email, contrasena, tipo, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el usuario:', err);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Usuario no encontrado' });
    }

    res.json({ mensaje: '✅ Usuario actualizado correctamente' });
  });
});

// Eliminar usuario por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM usuarios WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el usuario:', err);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Usuario no encontrado' });
    }

    res.json({ mensaje: '🗑️ Usuario eliminado correctamente' });
  });
});

// Obtener usuario por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM usuarios WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al buscar el usuario:', err);
      return res.status(500).json({ error: 'Error al buscar el usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Usuario no encontrado' });
    }

    res.json(results[0]);
  });
});

module.exports = router;
