// routes/articulos.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middlewares/auth'); // 🔐 Middleware para protección

// 🔐 Obtener todos los artículos
router.get('/', verificarToken, (req, res) => {
  db.query('SELECT * FROM articulos', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener artículos:', err);
      return res.status(500).json({ error: 'Error al obtener artículos' });
    }
    res.json(results);
  });
});

// 🔐 Obtener un artículo por ID
router.get('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM articulos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener el artículo:', err);
      return res.status(500).json({ error: 'Error al obtener el artículo' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Artículo no encontrado' });
    }
    res.json(results[0]);
  });
});

// 🔐 Crear un nuevo artículo
router.post('/', verificarToken, (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
  }
  db.query('INSERT INTO articulos (nombre, precio) VALUES (?, ?)', [nombre, precio], (err, result) => {
    if (err) {
      console.error('❌ Error al crear el artículo:', err);
      return res.status(500).json({ error: 'Error al crear el artículo' });
    }
    res.status(201).json({ mensaje: '✅ Artículo creado correctamente', id: result.insertId });
  });
});

// 🔐 Actualizar un artículo por ID
router.put('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
  }
  db.query('UPDATE articulos SET nombre = ?, precio = ? WHERE id = ?', [nombre, precio, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el artículo:', err);
      return res.status(500).json({ error: 'Error al actualizar el artículo' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Artículo no encontrado' });
    }
    res.json({ mensaje: '✅ Artículo actualizado correctamente' });
  });
});

// 🔐 Eliminar un artículo por ID
router.delete('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM articulos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el artículo:', err);
      return res.status(500).json({ error: 'Error al eliminar el artículo' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Artículo no encontrado' });
    }
    res.json({ mensaje: '🗑️ Artículo eliminado correctamente' });
  });
});

module.exports = router;
