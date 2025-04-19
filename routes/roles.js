// routes/roles.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los roles
router.get('/', (req, res) => {
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener roles:', err);
      return res.status(500).json({ error: 'Error al obtener roles' });
    }
    res.json(results);
  });
});

// Obtener un rol por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM roles WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener el rol:', err);
      return res.status(500).json({ error: 'Error al obtener el rol' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Rol no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un nuevo rol
router.post('/', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
  }
  db.query('INSERT INTO roles (nombre) VALUES (?)', [nombre], (err, result) => {
    if (err) {
      console.error('❌ Error al crear el rol:', err);
      return res.status(500).json({ error: 'Error al crear el rol' });
    }
    res.status(201).json({ mensaje: '✅ Rol creado correctamente', id: result.insertId });
  });
});

// Actualizar un rol por ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
  }
  db.query('UPDATE roles SET nombre = ? WHERE id = ?', [nombre, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el rol:', err);
      return res.status(500).json({ error: 'Error al actualizar el rol' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Rol no encontrado' });
    }
    res.json({ mensaje: '✅ Rol actualizado correctamente' });
  });
});

// Eliminar un rol por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM roles WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el rol:', err);
      return res.status(500).json({ error: 'Error al eliminar el rol' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Rol no encontrado' });
    }
    res.json({ mensaje: '🗑️ Rol eliminado correctamente' });
  });
});

module.exports = router;
