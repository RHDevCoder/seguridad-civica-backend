// index.js

// Requerimos Express y creamos una instancia de la aplicación
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para analizar solicitudes JSON entrantes
app.use(express.json());

// Ruta base para verificar que la API está funcionando
app.get('/', (req, res) => {
  res.send('🚨 API Seguridad Cívica funcionando correctamente.');
});

// Rutas del módulo de usuarios
const rutasUsuarios = require('./routes/usuarios');
app.use('/api/usuarios', rutasUsuarios);

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
