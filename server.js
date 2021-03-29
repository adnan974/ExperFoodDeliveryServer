const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');


const app = express();
const swagger = require('express-swagger-generator')(app);


app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

app.use("/api", require("./app/routes"));


swagger({
    swaggerDefinition: config.swagger.swaggerDefinition,
    basedir: __dirname, 
    files: ['./app/**/*.js']
});

app.listen(config.port, ()=> {
    console.log( `Listening on port ${config.port}`);
} )