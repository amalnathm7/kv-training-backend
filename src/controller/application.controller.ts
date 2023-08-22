import express, { NextFunction } from "express";
import { JsonResponseUtil } from "../utils/json.response.util";
import { ResponseWithLog } from "../utils/response.with.log";
import validateMiddleware from "../middleware/validate.middleware";
import CreateApplicationDto from "../dto/create-application.dto";
import ApplicationService from "../service/application.service";

class ApplicationController {
    public router: express.Router;

    constructor(private applicationService: ApplicationService) {
        this.router = express.Router();
        this.router.post("/", validateMiddleware(CreateApplicationDto), this.createApplication);
        this.router.get("/:id", this.getApplicationById);
    }

    getApplicationById = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const applicationId = req.params.id;
            const applicatoin = await this.applicationService.getApplicationById(applicationId);
            JsonResponseUtil.sendJsonResponse200(res, applicatoin);
        } catch (error) {
            next(error);
        }
    }

    createApplication = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const newApplication = await this.applicationService.createApplication(res.dto as CreateApplicationDto);
            JsonResponseUtil.sendJsonResponse201(res, newApplication);
        } catch (error) {
            next(error);
        }
    }
}

export default ApplicationController;
