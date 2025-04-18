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
    res.json(results); // Enviamos los usuarios en formato JSON
  });
});

// Iniciamos el servidor en el puerto definido (por defecto 3000)
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
