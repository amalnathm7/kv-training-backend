import express from 'express';
import employeeRouter from './employee_router';
import loggerMiddleware from './loggerMiddleware';

const server = express();
server.use(express.json());
server.use(loggerMiddleware);
server.use('/employees', employeeRouter);

server.get('/*', (req, res) => {
    res.status(404).send("Nothing here!");
});

server.listen(3000, () => {
    console.log("Server is listening to 3000");
});