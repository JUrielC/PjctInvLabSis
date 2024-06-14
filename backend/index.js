const express = require('express');
const app = express();
require('dotenv').config({path: 'backend/.env'});
const cors = require('cors');
app.use(cors()); 


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



app.use(express.json());
app.use('/herramientas', require('./routes/herramientas_routes'))
app.use('/tipo_herramienta', require('./routes/tipoHerramienta_routes'))
app.use('/login', require('./routes/login_routes'))
app.use('/origen', require('./routes/origen_routes'))
app.use('/bajas', require('./routes/bajas_routes'))
app.use('/prestamos', require('./routes/prestamo_routes'))
app.use('/usuarios', require('./routes/usuarios_routes'))
app.use('/solicitantes', require('./routes/solicitantes_routes'))
app.use('/carreras', require('./routes/carreras_routes'))

app.listen(process.env.NODE_PORT, () => {
    console.log('server running '+ process.env.NODE_PORT);
});






