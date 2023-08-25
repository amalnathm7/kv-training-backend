import express, { NextFunction } from "express";
import { JsonResponseUtil } from "../utils/json.response.util";
import { ResponseWithLog } from "../utils/response.with.log";
import validateMiddleware from "../middleware/validate.middleware";
import CreateApplicationDto from "../dto/create-application.dto";
import ApplicationService from "../service/application.service";
import authenticate from "../middleware/authenticate.middleware";
import { superAuthorize } from "../middleware/authorize.middleware";
import UpdateApplicationDto from "../dto/update-application.dto";
import SetApplication from "../dto/set-application.dto";
import { CandidateStatus } from "../utils/status.enum";

class ApplicationController {
    public router: express.Router;

    constructor(private applicationService: ApplicationService) {
        this.router = express.Router();
        this.router.post("/", validateMiddleware(CreateApplicationDto), this.createApplication);
        this.router.get("/", authenticate, superAuthorize, this.getAllApplications);
        this.router.get("/:id", this.getApplicationById);
        this.router.put("/:id", authenticate, superAuthorize, validateMiddleware(SetApplication), this.setApplication);
        this.router.patch("/:id", authenticate, superAuthorize, validateMiddleware(UpdateApplicationDto), this.updateApplication);
        this.router.delete("/:id", authenticate, superAuthorize, this.deleteApplication);
    }

    getAllApplications = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const offset = Number(req.query.offset ?? 0);
            const pageLength = Number(req.query.length ?? 0);
            const role = (req.query.role ?? '') as string;
            const email = (req.query.email ?? '') as string;
            const status = CandidateStatus[(req.query.status ?? '').toString().replace(' ', '_').toUpperCase()];
            const openingId = (req.query.openingId ?? '') as string;
            const referrals = await this.applicationService.getAllApplications(offset, pageLength, email, role, status, openingId);
            referrals.push(offset);
            JsonResponseUtil.sendJsonResponse200(res, referrals);
        } catch (error) {
            next(error);
        }
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

    setApplication = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const applicationId = req.params.id;
            const employee = await this.applicationService.updateApplication(applicationId, res.dto as UpdateApplicationDto);
            const response = employee ? { id: employee.id } : {};
            JsonResponseUtil.sendJsonResponse200(res, response);
        } catch (error) {
            next(error);
        }
    }

    updateApplication = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const applicationId = req.params.id;
            const employee = await this.applicationService.updateApplication(applicationId, res.dto as UpdateApplicationDto);
            const response = employee ? { id: employee.id } : {};
            JsonResponseUtil.sendJsonResponse200(res, response);
        } catch (error) {
            next(error);
        }
    }

    deleteApplication = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const applicationId = req.params.id;
            await this.applicationService.deleteApplication(applicationId);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }
}

export default ApplicationController;
