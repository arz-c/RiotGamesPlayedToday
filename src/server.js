const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

const port = 80;

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
                //console.log(str);
                //console.log(req2.data);
                res.send(str);
            })
        });
        req2.end();
    })
})

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
})
