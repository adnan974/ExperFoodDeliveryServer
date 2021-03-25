const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config')

const app = express();


app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

const MainRouter = require("express").Router();
require("./app/routes")(MainRouter)
app.use("/api", MainRouter);



app.listen(config.port, ()=> {
    console.log( `Listening on port ${config.port}`);
} )