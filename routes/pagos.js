// routes/pagos.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los pagos
router.get('/', (req, res) => {
  db.query('SELECT * FROM pagos', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener pagos:', err);
      return res.status(500).json({ error: 'Error al obtener pagos' });
    }
    res.json(results);
  });
});

// Obtener un pago por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pagos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener el pago:', err);
      return res.status(500).json({ error: 'Error al obtener el pago' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Pago no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un nuevo pago
router.post('/', (req, res) => {
  const { venta_id, auxiliar_id, fecha_pago, numero_cuota, valor } = req.body;
  if (!venta_id || !auxiliar_id || !fecha_pago || !numero_cuota || !valor) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  const query = `
    INSERT INTO pagos (venta_id, auxiliar_id, fecha_pago, numero_cuota, valor)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [venta_id, auxiliar_id, fecha_pago, numero_cuota, valor];
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al crear el pago:', err);
      return res.status(500).json({ error: 'Error al crear el pago' });
    }
    res.status(201).json({ mensaje: '✅ Pago creado correctamente', id: result.insertId });
  });
});

// Actualizar un pago por ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { venta_id, auxiliar_id, fecha_pago, numero_cuota, valor } = req.body;
  if (!venta_id || !auxiliar_id || !fecha_pago || !numero_cuota || !valor) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  const query = `
    UPDATE pagos
    SET venta_id = ?, auxiliar_id = ?, fecha_pago = ?, numero_cuota = ?, valor = ?
    WHERE id = ?
  `;
  const values = [venta_id, auxiliar_id, fecha_pago, numero_cuota, valor, id];
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el pago:', err);
      return res.status(500).json({ error: 'Error al actualizar el pago' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Pago no encontrado' });
    }
    res.json({ mensaje: '✅ Pago actualizado correctamente' });
  });
});

// Eliminar un pago por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM pagos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el pago:', err);
      return res.status(500).json({ error: 'Error al eliminar el pago' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Pago no encontrado' });
    }
    res.json({ mensaje: '🗑️ Pago eliminado correctamente' });
  });
});

module.exports = router;
