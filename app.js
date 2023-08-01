// const http = require('http');
const express = require('express');

const server = express();

server.get('/hello', (req, res) => {
    console.log(req.url);
    res.status(200).send("Hello World!");
});

server.get('/*', (req, res) => {
    console.log(req.url);
    res.status(200).send("404 bro!");
});

// const server = http.createServer((req, res) => {
//     console.log(req.url);
//     res.writeHead(200);
//     res.end("Hello World!");
// });

server.listen(3000, () => {
    console.log("Server is listening to 3000");
});