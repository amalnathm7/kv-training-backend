import FileController from "../controller/file.controller";

const fileController = new FileController();
const fileRoute = fileController.router;

export { fileRoute };