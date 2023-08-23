import express, { NextFunction } from 'express';
import { RequestWithUser } from '../utils/request.with.user';
import { ResponseWithLog } from '../utils/response.with.log';
import { JsonResponseUtil } from '../utils/json.response.util';
import uploadFileMiddleware from '../middleware/upload.middleware';
import HttpException from '../exception/http.exception';
import fs from "fs";

class FileController {
    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.router.post("/upload", this.uploadResume);
        this.router.get("/check", this.checkResumeExists);
    }

    uploadResume = async (req: RequestWithUser, res: ResponseWithLog, next: NextFunction) => {
        try {
            await uploadFileMiddleware(req, res);

            if (!req.file) {
                throw new HttpException(400, 'No file selected', 'BAD REQUEST');
            }

            JsonResponseUtil.sendJsonResponse200(res, { file: req.filePath });
        } catch (error) {
            next(error);
        }
    }

    checkResumeExists = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const filePath = (req.query.filePath || '') as string;
            const fileExists = fs.existsSync(filePath);
            JsonResponseUtil.sendJsonResponse200(res, { fileExists });
        } catch (error) {
            next(error);
        }
    }
}

export default FileController;
