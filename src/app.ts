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
import applicationRoute from "./route/application.route";
import { resumeRoute } from "./route/resume.route";
import { CronJob } from "cron";
import winstonLogger from "./utils/winston.logger";

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
server.use('/applications', applicationRoute);
server.use('/uploads',resumeRoute);
server.use(errorMiddleware);

const PORT = 3000;

(async () => {
    await dataSource.initialize();

    const bonusHandler = async () => {
        try {
            winstonLogger.log({
                level: 'info',
                timeStamp: new Date(),
                message: 'Checking for Eligible Referrals for Bonus.'
            });
        } catch (error) {
            winstonLogger.log({
                level: 'error',
                timeStamp: new Date(),
                message: `Error checking bonus: ${error}`,
            });
        }
    }

    const bonusHandlerJob = new CronJob("0 0 * * *", bonusHandler)

    bonusHandlerJob.start();

    server.listen(PORT, () => {
        console.log(`Server is listening to ${PORT}`);
    });
})();
