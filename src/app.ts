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
import cors from "cors";
import { fileRoute } from "./route/file.route";
import openingRoute from "./route/opening.route";
import referralRoute from "./route/referral.route";
import applicatoinRoute from "./route/application.route";

const server = express();
server.use(cors());
server.use(express.json());
server.use(loggerMiddleware);
server.use('/roles', roleRoute);
server.use('/employees', employeeRoute);
server.use('/departments', departmentRoute);
server.use('/files', fileRoute)
server.use('/openings', openingRoute);
server.use('/referrals', referralRoute);
server.use('/applications', applicatoinRoute);
server.use(errorMiddleware);

const PORT = 3000;

(async () => {
    await dataSource.initialize();

    server.listen(PORT, () => {
        console.log(`Server is listening to ${PORT}`);
    });
})();