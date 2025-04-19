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

// Rutas CRUD para la tabla de roles
const rutasRoles = require('./routes/roles');
app.use('/api/roles', rutasRoles);

// Rutas CRUD para la tabla de articulos
const rutasArticulos = require('./routes/articulos');
app.use('/api/articulos', rutasArticulos);

// Rutas CRUD para la tabla de ventas
const rutasVentas = require('./routes/ventas');
app.use('/api/ventas', rutasVentas);

// Rutas CRUD para la tabla de detalleVenta
const rutasDetalleVenta = require('./routes/detalleVenta');
app.use('/api/detalle-venta', rutasDetalleVenta);

// Rutas CRUD para la tabla de pagos
const rutasPagos = require('./routes/pagos');
app.use('/api/pagos', rutasPagos);

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
