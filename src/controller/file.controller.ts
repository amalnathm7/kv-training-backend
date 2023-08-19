import express, { NextFunction } from 'express';
import authenticate from '../middleware/authenticate.middleware';
import { RequestWithUser } from '../utils/request.with.user';
import { ResponseWithLog } from '../utils/response.with.log';
import { JsonResponseUtil } from '../utils/json.response.util';
import uploadFileMiddleware from '../middleware/upload.middleware';
import HttpException from '../exception/http.exception';

class FileController {
    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.router.post("/upload", authenticate, this.uploadResume);
    }

    uploadResume = async (req: RequestWithUser, res: ResponseWithLog, next: NextFunction) => {
        try {
            await uploadFileMiddleware(req, res);

            if (!req.file) {
                throw new HttpException(400, 'No file selected', 'BAD REQUEST');
            }

            JsonResponseUtil.sendJsonResponse200(res, { resume: req.filePath });
        } catch (error) {
            next(error);
        }
    }
}

export default FileController;