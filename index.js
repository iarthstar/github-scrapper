/**
 * @file index.js
 * @description Entry point of App
 * 
 * @author Arth Gajjar <iarthstar@gmail.com>
 */




//
// ────────────────────────────────────────────────────────── INIT APP ─────
//

const utils = require("./scripts/utils");
utils.initApp();

// env variables
const port = process.env.PORT || 8080;

// modules import
const express = require('express');
const bodyParser = require('body-parser');

//routes import
const issues = require('./routes/issues');

// modules init
const app = express();

app.use(bodyParser.json());

// server init
app.listen(port, () => {
    utils.success(`Serving on => http://localhost:${port}`);
});

//
// ─────────────────────────────────────────────────────────────────────────
//




//
// ────────────────────────────────────────────────────────── ROUTES ───────
//

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

app.use('/',issues);

//
// ─────────────────────────────────────────────────────────────────────────
//