import express, { NextFunction } from "express";
import authenticate from "../middleware/authenticate.middleware";
import { authorize, superAuthorize } from "../middleware/authorize.middleware";
import validateMiddleware from "../middleware/validate.middleware";
import UpdateOpeningDto from "../dto/update-opening.dto";
import { ResponseWithLog } from "../utils/response.with.log";
import { JsonResponseUtil } from "../utils/json.response.util";
import OpeningService from "../service/opening.service";
import CreateOpeningDto from "../dto/create-opening.dto";

class OpeningController {
    public router: express.Router;

    constructor(private openingService: OpeningService) {
        this.router = express.Router();
        this.router.post("/", authenticate, superAuthorize, validateMiddleware(CreateOpeningDto), this.createOpening);
        this.router.get("/", authenticate, authorize, this.getAllOpenings);
        this.router.get("/:id", authenticate, authorize, this.getOpeningById);
        this.router.put("/:id", authenticate, superAuthorize, validateMiddleware(CreateOpeningDto), this.setOpening);
        this.router.patch("/:id", authenticate, superAuthorize, validateMiddleware(UpdateOpeningDto), this.updateOpening);
        this.router.delete("/:id", authenticate,superAuthorize, this.deleteOpening);
    }

    getAllOpenings = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const offset = Number(req.query.offset ? req.query.offset : 0);
            const pageLength = Number(req.query.length ? req.query.length : 10);
            const openings = await this.openingService.getAllOpenings(offset, pageLength);
            JsonResponseUtil.sendJsonResponse200(res, openings);
        } catch (error) {
            next(error);
        }
    }

    getOpeningById =  async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const openingId = req.params.id;
            const opening = await this.openingService.getOpeningById(openingId);
            JsonResponseUtil.sendJsonResponse200(res, opening);
        } catch (error) {
            next(error);
        }
    }

    createOpening = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const newOpening = await this.openingService.createOpening(res.dto as CreateOpeningDto);
            JsonResponseUtil.sendJsonResponse201(res, newOpening);
        } catch (error) {
            next(error);
        }
    }

    setOpening = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const openingId = req.params.id;
            await this.openingService.updateOpening(openingId, res.dto as UpdateOpeningDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }

    updateOpening = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const openingId = req.params.id;
            await this.openingService.updateOpening(openingId, res.dto as UpdateOpeningDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }

    deleteOpening = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const openingId = req.params.id;
            await this.openingService.deleteOpening(openingId);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }
}

export default OpeningController;