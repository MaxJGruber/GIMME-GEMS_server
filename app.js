require('dotenv').config()
require("./config/db.connection")

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require('mongoose')
const app = express();

const authRouter = require("./routes/auth.route")
const UserRouter = require("./routes/user.route")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
    );

app.use("/api/auth", authRouter)
app.use("/api/user", UserRouter)

app.use(function (req, res, next) {
    console.log('user in session : ', req.session.currentUser)
    next()
});

module.exports = app;
