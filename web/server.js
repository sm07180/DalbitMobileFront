const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const compression = require('compression')
const urlencode = require('urlencode');
const axios = require("axios");

const ssl = {
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem'),
};

const app = express();
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/dist",express.static(path.join(__dirname, './dist')));

app.get("*", async (req, res) => {
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
    try {
        const aaa = axios.create({
            baseURL:'https://devapi.dalbitlive.com',
            headers: {
                authToken: req.cookies.authToken,
                'custom-header': req.cookies['custom-header'],
                'content-type':  'application/json',
                cookie: req.headers.cookie
            },
            params: null,
            data:null,
            withCredentials: true,
        });

        let https1 = await aaa.get('/token')
        if(https1.data.result === 'success'){
            indexHtml = indexHtml.replace("#authData", JSON.stringify(https1.data.data))
        }else{
            indexHtml = indexHtml.replace("#authData", "")
        }
    } catch (e) {
        console.log(e)
    }
    res.send(indexHtml);
})
https.createServer(ssl, app).listen(443, err => {
    if (err) throw err;
    console.log("??")
});


/*
<textarea name="customHeader" id="customHeader" style="display:none;">#customHeader</textarea>
<textarea name="redirectUrl" id="redirectUrl" style="display:none;">#redirectUrl</textarea>
<textarea name="authData" id="authData" style="display:none;">#authData</textarea>
*/
