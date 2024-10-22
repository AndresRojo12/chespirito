require('dotenv').config();

const { Client } = require('pg');

const USER = encodeURIComponent(process.env.DB_USER);
const PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);
const URI = `postgres://${USER}:${PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const client = new Client({
  connectionString: URI,
});

client.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos!');
    return client.query('SELECT NOW()'); // Realiza una consulta simple
  })
  .then(res => {
    console.log('Hora actual de la base de datos:', res.rows[0]);
  })
  .catch(err => {
    console.error('Error de conexión a la base de datos:', err.stack);
  })
  .finally(() => {
    client.end(); // Cierra la conexión
  });
