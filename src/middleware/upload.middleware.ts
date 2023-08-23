import util from 'util';
import multer from 'multer';
import filesystem from 'fs';

const folderPath = './uploads';
const key = 'file';
const maxSize = 5 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!filesystem.existsSync(folderPath)) {
            filesystem.mkdirSync(folderPath);
        }
        callback(null, folderPath);
    },
    filename: (req, file, callback) => {
        const filePath = Date.now() + '_' + file.originalname;
        callback(null, filePath);
        req.filePath = filePath;
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single(key);

let uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;