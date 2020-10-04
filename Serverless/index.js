const express = require('express');
const app = express();
const Api = require('./routes/Api');
const bodyParser = require('body-parser');
const cors = require('cors');

//Permite llamadas cors para evitar errores desde localhost 
app.use(cors());
//Definimos que las llamadas con body sean parseadas con JSON 
app.use(bodyParser.json());

//Definimos el puerto en el que se cargara el servidor 
const PORT = 5567;
app.listen(PORT, () => {console.log(`Servidor corriendo en ${PORT}`);});

//Llamado a las rutas de los EndPoints
app.use('/api',Api);

//Exportamos el componente
module.exports = {app};