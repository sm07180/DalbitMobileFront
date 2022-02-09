const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser')
const compression = require('compression')

const ssl = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem'),
};

const app = express();
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/dist",express.static(path.join(__dirname, './dist')));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
})
https.createServer(ssl, app).listen(443, err => {
    if (err) throw err;
    console.log("??")
});

