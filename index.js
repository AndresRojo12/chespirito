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

const optionCors = {
  origin: '*',
};

app.use(cors(optionCors));

app.use(express.static(path.join(__dirname, 'frontend', 'build'))); // Cambia 'frontend/build' según sea necesario

// Ruta para el archivo index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html')); // Asegúrate de que esta ruta sea correcta
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
