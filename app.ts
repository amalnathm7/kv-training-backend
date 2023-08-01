// const http = require('http');
import express from 'express';

const server = express();

server.get('/hello', (req, res) => {
    // console.log(req.url);
    // const data = "amal";

    // const data1 = {
    //     name: "name1",
    //     profile: {
    //         age: 20
    //     }
    // };

    // // console.log(data.profile);
    // console.log(data1.profile.age);

    res.status(200).send("Hello World!");
});

server.get('/*', (req, res) => {
    // console.log(req.url);
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