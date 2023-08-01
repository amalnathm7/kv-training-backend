const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url);
    res.writeHead(200);
    res.end("Hello World!");
});

server.listen(3000, () => {
    console.log("Server is listening to 3000");
});