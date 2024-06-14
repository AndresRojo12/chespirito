const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const routerApi = require('./routes');
//const { checkApiKey } = require('./middlewares/auth.handler');

require('./utils/auth'); // Asegúrate de que este archivo existe y se carga correctamente
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/',(req, res) => {
    res.send('Hola servidor');
})

routerApi(app);

app.listen(port , () => {
    console.log(`La app se escucha por el puerto ${port}`);
})
