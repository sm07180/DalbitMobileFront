const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser')
const compression = require('compression')
const urlencode = require('urlencode');
const ssl = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem'),
};

const app = express();
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/dist",express.static(path.join(__dirname, './dist')));
app.get("*", (req, res) => {
    let indexHtml = fs.readFileSync('./dist/index.html','utf-8');
    const customHeader = req.headers['custom-header'];
    const redirecturl = req.headers['redirecturl'];
    if(customHeader){
        indexHtml = indexHtml.replace("#customHeader", urlencode.decode(customHeader))
    }else{
        indexHtml = indexHtml.replace("#customHeader", "")
    }
    if(redirecturl){
        indexHtml = indexHtml.replace("#redirectUrl", urlencode.decode(redirecturl))
    }else{
        indexHtml = indexHtml.replace("#redirectUrl", "")
    }
    res.send(indexHtml);
})
https.createServer(ssl, app).listen(443, err => {
    if (err) throw err;
    console.log("??")
});

