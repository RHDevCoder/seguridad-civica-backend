// index.js

// Requerimos Express para crear el servidor
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Conectamos la base de datos MySQL
const db = require('./db');

// Middleware para que el servidor entienda JSON en las solicitudes
app.use(express.json());

// Ruta principal de prueba para verificar que el servidor responde
app.get('/', (req, res) => {
  res.send('🚨 API Seguridad Cívica funcionando correctamente.');
});

// Ruta para obtener todos los usuarios registrados en la base de datos
app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

// Ruta para registrar un nuevo usuario
app.post('/api/usuarios', (req, res) => {
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

// Ruta para actualizar un usuario por ID
app.put('/api/usuarios/:id', (req, res) => {
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

  // Ruta para eliminar un usuario por ID
app.delete('/api/usuarios/:id', (req, res) => {
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
  
// Iniciamos el servidor en el puerto definido (por defecto 3000)
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
