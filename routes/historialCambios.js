// routes/historialCambios.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los cambios registrados
router.get('/', (req, res) => {
  db.query('SELECT * FROM historial_cambios', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener el historial de cambios:', err);
      return res.status(500).json({ error: 'Error al obtener el historial' });
    }
    res.json(results);
  });
});

// Obtener un cambio por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM historial_cambios WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener el cambio:', err);
      return res.status(500).json({ error: 'Error al obtener el cambio' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Cambio no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un nuevo cambio
router.post('/', (req, res) => {
  const { usuario_id, tipo_cambio, detalle_cambio } = req.body;

  if (!usuario_id || !tipo_cambio || !detalle_cambio) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    INSERT INTO historial_cambios (usuario_id, tipo_cambio, detalle_cambio)
    VALUES (?, ?, ?)
  `;
  const values = [usuario_id, tipo_cambio, detalle_cambio];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al crear el cambio:', err);
      return res.status(500).json({ error: 'Error al crear el cambio' });
    }
    res.status(201).json({ mensaje: '✅ Cambio registrado correctamente', id: result.insertId });
  });
});

// Actualizar un cambio por ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { usuario_id, tipo_cambio, detalle_cambio } = req.body;

  if (!usuario_id || !tipo_cambio || !detalle_cambio) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    UPDATE historial_cambios
    SET usuario_id = ?, tipo_cambio = ?, detalle_cambio = ?
    WHERE id = ?
  `;
  const values = [usuario_id, tipo_cambio, detalle_cambio, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el cambio:', err);
      return res.status(500).json({ error: 'Error al actualizar el cambio' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Cambio no encontrado' });
    }

    res.json({ mensaje: '✅ Cambio actualizado correctamente' });
  });
});

// Eliminar un cambio por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM historial_cambios WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el cambio:', err);
      return res.status(500).json({ error: 'Error al eliminar el cambio' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Cambio no encontrado' });
    }

    res.json({ mensaje: '🗑️ Cambio eliminado correctamente' });
  });
});

module.exports = router;
