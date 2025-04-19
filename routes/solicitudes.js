// routes/solicitudes.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middlewares/auth'); // Protección con JWT

// 🔐 Obtener todas las solicitudes (protegido)
router.get('/', verificarToken, (req, res) => {
  db.query('SELECT * FROM solicitudes', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener las solicitudes:', err);
      return res.status(500).json({ error: 'Error al obtener las solicitudes' });
    }
    res.json(results);
  });
});

// 🔐 Obtener una solicitud por ID (protegido)
router.get('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM solicitudes WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener la solicitud:', err);
      return res.status(500).json({ error: 'Error al obtener la solicitud' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ Solicitud no encontrada' });
    }
    res.json(results[0]);
  });
});

// 🔓 Crear una nueva solicitud (pública, puede ser desde cliente sin logueo)
router.post('/', (req, res) => {
  const { cliente_id, tipo } = req.body;

  if (!cliente_id || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    INSERT INTO solicitudes (cliente_id, tipo)
    VALUES (?, ?)
  `;
  const values = [cliente_id, tipo];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al crear la solicitud:', err);
      return res.status(500).json({ error: 'Error al crear la solicitud' });
    }
    res.status(201).json({ mensaje: '✅ Solicitud creada correctamente', id: result.insertId });
  });
});

// 🔐 Actualizar una solicitud por ID (protegido)
router.put('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { cliente_id, tipo } = req.body;

  if (!cliente_id || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    UPDATE solicitudes
    SET cliente_id = ?, tipo = ?
    WHERE id = ?
  `;
  const values = [cliente_id, tipo, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar la solicitud:', err);
      return res.status(500).json({ error: 'Error al actualizar la solicitud' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Solicitud no encontrada' });
    }

    res.json({ mensaje: '✅ Solicitud actualizada correctamente' });
  });
});

// 🔐 Eliminar una solicitud por ID (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM solicitudes WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar la solicitud:', err);
      return res.status(500).json({ error: 'Error al eliminar la solicitud' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ Solicitud no encontrada' });
    }

    res.json({ mensaje: '🗑️ Solicitud eliminada correctamente' });
  });
});

module.exports = router;
