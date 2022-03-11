const express = require("express");
const app = express();
const dotenv = require("dotenv");
const loggers=require("./config/logger")


dotenv.config({path:"./config.env"})

require("./db/conn");
app.use(express.json());
app.use(require("./router/auth"));
const user = require("./model/dataSchema");

app.use('/error', ((err, req, res, next) => {
    const response= res.status(500).json({
         error: true,
         message: err.message,
         data: null,
 
     })
     loggers.error("jdjdn")
 }))

module.exports=app;