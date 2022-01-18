// Requires

console.log('test');

const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();

// HTTPS SSL Certificate

const privateKey = fs.readFileSync('./bind/playedtoday.ddns.net/privkey1.pem', 'utf8');
const certificate = fs.readFileSync('./bind/playedtoday.ddns.net/cert1.pem', 'utf8');
const ca = fs.readFileSync('./bind/playedtoday.ddns.net/chain1.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
        ca: ca
};

const httpsServer = https.createServer(credentials, app);

// Serve

app.use('/serve', express.static(path.join(__dirname, 'serve')));

app.get('/', (req, res) => {
    console.log('Open request');
    res.sendFile(path.join(__dirname, 'serve/index.html'));
})

app.get('/api', (req, res) => {
    fs.readFile('bind/key.txt', (err, data) => {
        let url = "https://" + req.query.hostname + req.query.path.replace("$key", data);
        const req2 = https.get(url, res2 => {
            let str = '';
            res2.on('data', (d) => {
                str += d;
            })
            res2.on('end', () => {
                console.log(str);
                res.send(str);
            })
        });
        req2.end();
    })
})

httpsServer.listen(443);
