import ResumeController from "../controller/resume.controller";

const resumeController = new ResumeController();
const resumeRoute = resumeController.router;

export { resumeRoute };