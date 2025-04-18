// db.js

const mysql = require('mysql2');

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'S3gur1dadC!v1c@2024',
  database: 'seguridad_civica'
});

// Verificamos si la conexión fue exitosa
connection.connect((error) => {
  if (error) {
    console.error('❌ Error de conexión a MySQL:', error.message);
  } else {
    console.log('✅ Conexión exitosa a la base de datos MySQL');
  }
});

// Exportamos la conexión para reutilizarla
module.exports = connection;
