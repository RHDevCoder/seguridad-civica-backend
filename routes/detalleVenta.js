// routes/detalleVenta.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middlewares/auth'); // 🛡️ Middleware de autenticación

// 🔐 Obtener todos los detalles de venta (protegido)
router.get('/', verificarToken, (req, res) => {
  db.query('SELECT * FROM detalle_venta', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener los detalles de venta:', err);
      return res.status(500).json({ error: 'Error al obtener los detalles de venta' });
    }
    res.json(results);
  });
});

// 🔐 Obtener un detalle de venta por ID (protegido)
router.get('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM detalle_venta WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener el detalle de venta:', err);
      return res.status(500).json({ error: 'Error al obtener el detalle de venta' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Detalle de venta no encontrado' });
    }
    res.json(results[0]);
  });
});

// 🔐 Crear un nuevo detalle de venta (protegido)
router.post('/', verificarToken, (req, res) => {
  const { venta_id, articulo_id, cantidad, precio_unitario } = req.body;

  if (!venta_id || !articulo_id || !cantidad || !precio_unitario) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    INSERT INTO detalle_venta (venta_id, articulo_id, cantidad, precio_unitario)
    VALUES (?, ?, ?, ?)
  `;
  const values = [venta_id, articulo_id, cantidad, precio_unitario];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al crear el detalle de venta:', err);
      return res.status(500).json({ error: 'Error al crear el detalle de venta' });
    }
    res.status(201).json({ mensaje: '✅ Detalle de venta creado correctamente', id: result.insertId });
  });
});

// 🔐 Actualizar un detalle de venta por ID (protegido)
router.put('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { venta_id, articulo_id, cantidad, precio_unitario } = req.body;

  if (!venta_id || !articulo_id || !cantidad || !precio_unitario) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    UPDATE detalle_venta
    SET venta_id = ?, articulo_id = ?, cantidad = ?, precio_unitario = ?
    WHERE id = ?
  `;
  const values = [venta_id, articulo_id, cantidad, precio_unitario, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el detalle de venta:', err);
      return res.status(500).json({ error: 'Error al actualizar el detalle de venta' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Detalle de venta no encontrado' });
    }

    res.json({ mensaje: '✅ Detalle de venta actualizado correctamente' });
  });
});

// 🔐 Eliminar un detalle de venta por ID (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM detalle_venta WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el detalle de venta:', err);
      return res.status(500).json({ error: 'Error al eliminar el detalle de venta' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Detalle de venta no encontrado' });
    }
    res.json({ mensaje: '🗑️ Detalle de venta eliminado correctamente' });
  });
});

module.exports = router;
