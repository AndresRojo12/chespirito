const express = require('express');
const path = require('path');
const cors = require('cors');
const {
  logError,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/errorHandler');

const routerApi = require('./routes');

require('./utils/auth');
const app = express();

const port = process.env.PORT || 3000;

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]  // En producción, solo permite el origen del frontend
  : ['*'];  // En desarrollo, permite todos los orígenes

const optionCors = {
  origin: allowedOrigins,
  credentials: true, // Si necesitas enviar cookies o encabezados de autorización
};

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors(optionCors));

routerApi(app);
// Servir archivos estáticos de la aplicación frontend (Nuxt.js)
const nuxtDistPath = path.join(__dirname, './frontend/dist');
app.use(express.static(nuxtDistPath));

// Ruta para servir el archivo HTML principal de la aplicación frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(nuxtDistPath, 'index.html'));
});

app.get('/', (req, res) => {
  res.send('Hola servidor');
});

app.use(logError);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`La app se escucha por el puerto ${port}`);
});
