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

// modules init
const app = express();

app.use(bodyParser.json());

// server init
app.listen(port, () => {
    utils.success(`Listening on port ${port}!`);
});

//
// ─────────────────────────────────────────────────────────────────────────
//




//
// ────────────────────────────────────────────────────────── ROUTES ───────
//

app.get('/', (req, res) => {
    res.sendStatus(200);
});

//
// ─────────────────────────────────────────────────────────────────────────
//