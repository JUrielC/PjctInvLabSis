const express = require('express');
const app = express();
require('dotenv').config({path: 'backend/.env'});
const cors = require('cors');
app.use(cors());


app.listen(process.env.NODE_PORT, () => {
    console.log('server running '+ process.env.NODE_PORT);
});

app.use(express.json());
app.use('/herramientas', require('./routes/herramientas_routes'))
app.use('/tipo_herramienta', require('./routes/tipoHerramienta_routes'))
app.use('/login', require('./routes/login_routes'))
app.use('/origen', require('./routes/origen_routes'))


/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})
*/

/*NODE_PORT="3000"
HOST="bqvpx1qe8f1g2jhxyxjj-mysql.services.clever-cloud.com"
PORT="3306"
USER="ugpwh5vn4olvh15t"
PASSWORD="DHGMBoPlzbo6Q9rFxHRW"
DATABASE="bqvpx1qe8f1g2jhxyxjj"
JWT_SECRET = "589696852"*/