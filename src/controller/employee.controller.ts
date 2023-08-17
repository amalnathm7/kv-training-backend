import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import CreateEmployeeDto from "../dto/create-employee.dto";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import LoginEmployeeDto from "../dto/login-employee.dto";
import { JsonResponseUtil } from "../utils/json.response.util";
import authenticate from "../middleware/authenticate.middleware";
import { authorize, superAuthorize } from "../middleware/authorize.middleware";
import { ResponseWithLog } from "../utils/response.with.log";
import validateMiddleware from "../middleware/validate.middleware";
import { parseJwt } from "../utils/jwt.parser";
import winstonLogger from "../utils/winston.logger";

class EmployeeController {
    public router: express.Router;

    constructor(private employeeService: EmployeeService) {
        this.router = express.Router();
        this.router.post("/", authenticate, superAuthorize, validateMiddleware(CreateEmployeeDto), this.createEmployee);
        this.router.get("/", authenticate, authorize, this.getAllEmployees);
        this.router.get("/profile", authenticate, this.getProfile);
        this.router.get("/:id", authenticate, authorize, this.getEmployeeById);
        this.router.put("/:id", authenticate, superAuthorize, validateMiddleware(CreateEmployeeDto), this.setEmployee);
        this.router.patch("/:id", authenticate, superAuthorize, validateMiddleware(UpdateEmployeeDto), this.updateEmployee);
        this.router.delete("/:id", authenticate, superAuthorize, this.deleteEmployee);
        this.router.post("/login", validateMiddleware(LoginEmployeeDto), this.loginEmployee);
    }

    getProfile = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const payload = parseJwt(req.headers.authorization.split(' ')[1]);
            const username = payload.username;
            const profile = await this.employeeService.getEmployeeByUsername(username);
            JsonResponseUtil.sendJsonResponse200(res, profile);
        } catch (error) {
            next(error);
        }
    }

    loginEmployee = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const token = await this.employeeService.loginEmployee(res.dto as LoginEmployeeDto);
            JsonResponseUtil.sendJsonResponse200(res, token);
        } catch (error) {
            next(error);
        }
    }

    getAllEmployees = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const offset = Number(req.query.offset ? req.query.offset : 0);
            const pageLength = Number(req.query.length ? req.query.length : 10);
            const employees = await this.employeeService.getAllEmployees(offset, pageLength);
            employees.push(offset);
            JsonResponseUtil.sendJsonResponse200(res, employees);
        } catch (e) {
            next(e);
        }
    }

    getEmployeeById = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const employeeId = req.params.id;
            const employee = await this.employeeService.getEmployeeById(employeeId);
            JsonResponseUtil.sendJsonResponse200(res, employee);
        } catch (error) {
            next(error);
        }
    }

    createEmployee = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const newEmployee = await this.employeeService.createEmployee(res.dto as CreateEmployeeDto);
            JsonResponseUtil.sendJsonResponse201(res, newEmployee);
        } catch (error) {
            next(error);
        }
    }

    setEmployee = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const employeeId = req.params.id;
            await this.employeeService.updateEmployee(employeeId, res.dto as UpdateEmployeeDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }

    updateEmployee = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const employeeId = req.params.id;
            await this.employeeService.updateEmployee(employeeId, res.dto as UpdateEmployeeDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }

    deleteEmployee = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const employeeId = req.params.id;
            await this.employeeService.deleteEmployee(employeeId);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;