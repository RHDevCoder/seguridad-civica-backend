// index.js

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
const db = require('./db');

// Middleware
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('🚨 API Seguridad Cívica funcionando correctamente.');
});

// Rutas
const rutasUsuarios = require('./routes/usuarios');
app.use('/api/usuarios', rutasUsuarios);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
