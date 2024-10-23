const express = require('express');
const dotenv = require('dotenv');
const path = require('path')
const cors = require('cors');
const { logError, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/errorHandler');

const routerApi = require('./routes');

require('./utils/auth');
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const optionCors = {
//   origin: '*',
// };

const whitelist = ['http://localhost:3001', 'http://chespirito-dev.us-east-1.elasticbeanstalk.com/'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // Permite incluir cookies y encabezados de autenticación en las solicitudes
};

app.use(cors(corsOptions));

// Servir archivos estáticos de la aplicación frontend (Nuxt.js)
const nuxtDistPath = path.join(__dirname, './frontend/dist');
app.use(express.static(nuxtDistPath));

// Ruta para servir el archivo HTML principal de la aplicación frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(nuxtDistPath, 'index.html'));
});


app.get('/',(req, res) => {
    res.send('Hola servidor');
})

routerApi(app);

app.use(logError);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port , () => {
    console.log(`La app se escucha por el puerto ${port}`);
})
