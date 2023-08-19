import { Request } from "express";
import { UploadedFile } from "express-fileupload"; 

export interface RequestWithUser extends Request {
    name: string,
    username: string,
    role: string,
    file: UploadedFile,
    filePath: string
}