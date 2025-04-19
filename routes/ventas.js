// routes/ventas.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las ventas
router.get('/', (req, res) => {
  const query = 'SELECT * FROM ventas';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener las ventas:', err);
      return res.status(500).json({ error: 'Error al obtener las ventas' });
    }
    res.json(results);
  });
});

// Obtener una venta por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM ventas WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener la venta:', err);
      return res.status(500).json({ error: 'Error al obtener la venta' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Venta no encontrada' });
    }
    res.json(results[0]);
  });
});

// Crear una nueva venta
router.post('/', (req, res) => {
  const { cliente_id, fecha_venta, fecha_instalacion, tipo_pago, analista_id, tecnico_id, direccion_envio } = req.body;

  if (!cliente_id || !tipo_pago || !analista_id || !direccion_envio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const query = `
    INSERT INTO ventas (cliente_id, fecha_venta, fecha_instalacion, tipo_pago, analista_id, tecnico_id, direccion_envio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [cliente_id, fecha_venta || new Date(), fecha_instalacion, tipo_pago, analista_id, tecnico_id, direccion_envio];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al registrar la venta:', err);
      return res.status(500).json({ error: 'Error al registrar la venta' });
    }
    res.status(201).json({ mensaje: '✅ Venta registrada correctamente', id: result.insertId });
  });
});

// Actualizar una venta por ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { cliente_id, fecha_venta, fecha_instalacion, tipo_pago, analista_id, tecnico_id, direccion_envio } = req.body;

  const query = `
    UPDATE ventas SET cliente_id = ?, fecha_venta = ?, fecha_instalacion = ?, tipo_pago = ?, analista_id = ?, tecnico_id = ?, direccion_envio = ?
    WHERE id = ?
  `;
  const values = [cliente_id, fecha_venta, fecha_instalacion, tipo_pago, analista_id, tecnico_id, direccion_envio, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar la venta:', err);
      return res.status(500).json({ error: 'Error al actualizar la venta' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Venta no encontrada' });
    }
    res.json({ mensaje: '✅ Venta actualizada correctamente' });
  });
});

// Eliminar una venta por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM ventas WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar la venta:', err);
      return res.status(500).json({ error: 'Error al eliminar la venta' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Venta no encontrada' });
    }
    res.json({ mensaje: '🗑️ Venta eliminada correctamente' });
  });
});

module.exports = router;
