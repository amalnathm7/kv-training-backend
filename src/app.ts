import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });
import "reflect-metadata";
import express from 'express'
import loggerMiddleware from "./middleware/logger.middleware";
import dataSource from "./db/postgres.db";
import employeeRoute from "./route/employee.route";
import errorMiddleware from "./middleware/error.middleware";
import { departmentRoute } from "./route/department.route";
import { roleRoute } from "./route/role.route";

const server = express();
server.use(express.json());
server.use(loggerMiddleware);
server.use('/api/roles', roleRoute);
server.use('/employees', employeeRoute);
server.use('/departments', departmentRoute);
server.use(errorMiddleware);

const PORT = 3000;

(async () => {
    await dataSource.initialize();

    server.listen(PORT, () => {
        console.log(`Server is listening to ${PORT}`);
    });
})();