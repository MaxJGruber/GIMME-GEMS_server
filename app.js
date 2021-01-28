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
const cors = require("cors");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

const corsOptions = { origin: process.env.FRONTEND_URL, credentials: true};
app.use(cors(corsOptions));

// REQUIRING ALL ROUTE FILES
const authRouter = require("./routes/auth.route")
const userRouter = require("./routes/user.route")
const treeRouter = require("./routes/tree.route")
const orderRouter = require("./routes/order.route")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// We've require MongoStore to enable session usage throughout our app
app.use(
    session({
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
    );

// USING ALL ROUTE FILES 
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/tree", treeRouter)
app.use("/api/order", orderRouter)

app.use(function (req, res, next) {
    console.log('user in session : ', req.session.currentUser)
    next()
});

module.exports = app;
