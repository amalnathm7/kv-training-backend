import { Request } from "express";
import { UploadedFile } from "express-fileupload"; 

export interface RequestWithUser extends Request {
    name: string,
    email: string,
    role: string,
    file: UploadedFile,
    filePath: string
}