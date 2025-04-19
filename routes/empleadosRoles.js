// routes/empleadosRoles.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middlewares/auth'); // 🔐 Middleware de autenticación

// 🔐 Obtener todos los roles de un empleado específico por su ID
router.get('/empleado/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT r.nombre AS rol
    FROM empleados_roles er
    JOIN roles r ON er.rol_id = r.id
    WHERE er.empleado_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener roles del empleado:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: '❌ El empleado no tiene roles asignados o no existe' });
    }

    const roles = results.map(r => r.rol);
    res.json(roles);
  });
});

// 🔐 Asignar un rol a un empleado
router.post('/', verificarToken, (req, res) => {
  const { empleado_id, rol_id } = req.body;

  if (!empleado_id || !rol_id) {
    return res.status(400).json({ error: 'Se requiere empleado_id y rol_id' });
  }

  const query = 'INSERT INTO empleados_roles (empleado_id, rol_id) VALUES (?, ?)';

  db.query(query, [empleado_id, rol_id], (err, result) => {
    if (err) {
      console.error('❌ Error al asignar rol:', err);
      return res.status(500).json({ error: 'Error al asignar rol' });
    }
    res.status(201).json({ mensaje: '✅ Rol asignado correctamente', id: result.insertId });
  });
});

// 🔐 Eliminar un rol asignado a un empleado
router.delete('/', verificarToken, (req, res) => {
  const { empleado_id, rol_id } = req.body;

  if (!empleado_id || !rol_id) {
    return res.status(400).json({ error: 'Se requiere empleado_id y rol_id' });
  }

  const query = 'DELETE FROM empleados_roles WHERE empleado_id = ? AND rol_id = ?';

  db.query(query, [empleado_id, rol_id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el rol asignado:', err);
      return res.status(500).json({ error: 'Error al eliminar el rol asignado' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: '❌ No se encontró esa asignación' });
    }

    res.json({ mensaje: '🗑️ Rol eliminado correctamente del empleado' });
  });
});

module.exports = router;
