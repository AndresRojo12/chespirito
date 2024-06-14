const express = require('express');
const dotenv = require('dotenv');

const { checkApiKey } = require('./middlewares/auth.handler');

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.get('/', checkApiKey, (req, res) => {
    res.send('Hola servidor');
})

app.listen(port , () => {
    console.log(`La app se escucha por el puerto ${port}`);
})
