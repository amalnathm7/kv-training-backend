import express, {NextFunction} from "express";
import HttpException from "../exception/http.exception";
import fs from "fs";
import path from "path";
import { ResponseWithLog } from "../utils/response.with.log";


class ResumeController {
    public router: express.Router;
    constructor() {
        this.router = express.Router();
        this.router.get("/:filePath", this.viewResume);
    }
    viewResume = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const filePath = `./uploads/` + req.params.filePath;
            const filename = req.params.filePath;

            if (!filePath) {
                throw new HttpException(400, "Incorrect filepath", "BAD REQUEST");
            }

            if (fs.existsSync(filePath)) {
                //const fileURL = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
                //res.json({ url: fileURL });
                res.sendFile(path.resolve(filePath));
            } else {
                throw new HttpException(400, "File not found", "BAD REQUEST");
            }
        } catch (error) {
            next(error);
        }
    }
}

export default ResumeController;