// auth.js

// Importo el paquete jsonwebtoken para trabajar con JWT
const jwt = require('jsonwebtoken');

// Cargo las variables de entorno desde el archivo .env
require('dotenv').config();

// Middleware personalizado para verificar el token de autenticación en las rutas protegidas
function verificarToken(req, res, next) {
  // Extraigo el encabezado 'Authorization' de la solicitud HTTP
  const authHeader = req.headers['authorization'];
  
  // Verifico si el encabezado está presente y si comienza con "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: '🔒 Token no proporcionado o mal formado.' });
  }

  // Obtengo el token removiendo la palabra 'Bearer'
  const token = authHeader.split(' ')[1];

  // Verifico la validez del token usando la clave secreta del archivo .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Si hay error (token inválido o expirado), devuelvo un error 403 (Prohibido)
      return res.status(403).json({ mensaje: '❌ Token inválido o expirado.' });
    }

    // Si el token es válido, lo decodifico y lo guardo en req.usuario para usarlo más adelante
    req.usuario = decoded;

    // Paso al siguiente middleware o función en la ruta
    next();
  });
}

// Exporto el middleware para poder usarlo en otros archivos de rutas
module.exports = verificarToken;
