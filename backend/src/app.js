const express = require("express");
const authRoutes = require('./routes/auth.routes');
const cookieParser = require("cookie-parser")
const app = express();
app.use(express.json()); //middleware
app.use(cookieParser());

app.use('/api/auth',authRoutes)

module.exports = app;