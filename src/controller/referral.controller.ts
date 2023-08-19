import express, { NextFunction } from "express";
import { JsonResponseUtil } from "../utils/json.response.util";
import authenticate from "../middleware/authenticate.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { ResponseWithLog } from "../utils/response.with.log";
import validateMiddleware from "../middleware/validate.middleware";
import { RequestWithUser } from "../utils/request.with.user";
import CreateReferralDto from "../dto/create-referral.dto";
import UpdateReferralDto from "../dto/update-referral.dto";
import ReferralService from "../service/referral.service";
import SetReferralDto from "../dto/set-referral.dto";

class ReferralController {
    public router: express.Router;

    constructor(private referralService: ReferralService) {
        this.router = express.Router();
        this.router.post("/", authenticate, authorize, validateMiddleware(CreateReferralDto), this.createReferral);
        this.router.get("/", authenticate, authorize, this.getAllReferrals);
        this.router.get("/me", authenticate, this.getMyReferrals);
        this.router.get("/:id", authenticate, authorize, this.getReferralById);
        this.router.put("/:id", authenticate, authorize, validateMiddleware(SetReferralDto), this.setReferral);
        this.router.patch("/:id", authenticate, authorize, validateMiddleware(UpdateReferralDto), this.updateReferral);
        this.router.delete("/:id", authenticate, authorize, this.deleteReferral);
    }

    getMyReferrals = async (req: RequestWithUser, res: ResponseWithLog, next: NextFunction) => {
        try {
            const myReferrals = await this.referralService.getReferralsReferredByEmail(req.email);
            JsonResponseUtil.sendJsonResponse200(res, myReferrals);
        } catch (error) {
            next(error);
        }
    }

    getAllReferrals = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const offset = Number(req.query.offset ?? 0);
            const pageLength = Number(req.query.length ?? 0);
            const role = (req.query.role ?? '') as string;
            const email = (req.query.email ?? '') as string;
            const referrals = await this.referralService.getAllReferrals(offset, pageLength, email, role);
            referrals.push(offset);
            JsonResponseUtil.sendJsonResponse200(res, referrals);
        } catch (error) {
            next(error);
        }
    }

    getReferralById = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const referralId = req.params.id;
            const referral = await this.referralService.getReferralById(referralId);
            JsonResponseUtil.sendJsonResponse200(res, referral);
        } catch (error) {
            next(error);
        }
    }

    createReferral = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const newReferral = await this.referralService.createReferral(res.dto as CreateReferralDto);
            JsonResponseUtil.sendJsonResponse201(res, newReferral);
        } catch (error) {
            next(error);
        }
    }

    setReferral = async (req: RequestWithUser, res: ResponseWithLog, next: NextFunction) => {
        try {
            const referralId = req.params.id;
            await this.referralService.updateReferral(referralId, req.role, req.email, res.dto as UpdateReferralDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }

    updateReferral = async (req: RequestWithUser, res: ResponseWithLog, next: NextFunction) => {
        try {
            const referralId = req.params.id;
            await this.referralService.updateReferral(referralId, req.role, req.email, res.dto as UpdateReferralDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }

    deleteReferral = async (req: RequestWithUser, res: ResponseWithLog, next: NextFunction) => {
        try {
            const referralId = req.params.id;
            await this.referralService.deleteReferral(referralId, req.role, req.email);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }
}

export default ReferralController;