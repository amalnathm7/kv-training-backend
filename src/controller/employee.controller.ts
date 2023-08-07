import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../dto/create-employee.dto";
import { validate } from "class-validator";
import ValidationException from "../exception/validation.exception";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import LoginEmployeeDto from "../dto/login-employee.dto";
import { JsonResponseUtil } from "../utils/json.response.util";
import authenticate from "../middleware/authenticate.middleware";
import { authorize, superAuthorize } from "../middleware/authorize.middleware";
import { ResponseWithTrace } from "../utils/response.with.trace";

class EmployeeController {
    public router: express.Router;

    constructor(private employeeService: EmployeeService) {
        this.router = express.Router();
        this.router.post("/", authenticate, superAuthorize, this.createEmployee);
        this.router.get("/", authenticate, authorize, this.getAllEmployees);
        this.router.get("/:id", authenticate, authorize, this.getEmployeeById);
        this.router.put("/:id", authenticate, superAuthorize, this.setEmployee);
        this.router.patch("/:id", authenticate, superAuthorize, this.updateEmployee);
        this.router.delete("/:id", authenticate, superAuthorize, this.deleteEmployee);
        this.router.post("/login", this.loginEmployee);
    }

    loginEmployee = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const loginEmployeeDto = plainToInstance(LoginEmployeeDto, req.body);
            const errors = await validate(loginEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                const token = await this.employeeService.loginEmployee(loginEmployeeDto);
                JsonResponseUtil.sendJsonResponse200(res, token, startTime);
            }
        } catch (error) {
            next(error);
        }
    }

    getAllEmployees = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const offset = Number(req.query.offset ? req.query.offset : 0);
            const startTime = new Date();
            const employees = await this.employeeService.getAllEmployees(offset);
            employees.push(offset);
            JsonResponseUtil.sendJsonResponse200(res, employees, startTime);
        } catch (e) {
            next(e);
        }
    }

    getEmployeeById = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const employeeId = req.params.id;
            const employee = await this.employeeService.getEmployeeById(employeeId);
            JsonResponseUtil.sendJsonResponse200(res, employee, startTime);
        } catch (error) {
            next(error);
        }
    }

    createEmployee = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                const newEmployee = await this.employeeService.createEmployee(createEmployeeDto);
                JsonResponseUtil.sendJsonResponse201(res, newEmployee, startTime);
            }
        } catch (error) {
            next(error);
        }
    }

    setEmployee = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const employeeId = req.params.id;
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.employeeService.updateEmployee(employeeId, createEmployeeDto);
                JsonResponseUtil.sendJsonResponse204(res, startTime);
            }
        } catch (error) {
            next(error);
        }
    }

    updateEmployee = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const employeeId = req.params.id;
            const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
            const errors = await validate(updateEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.employeeService.updateEmployee(employeeId, updateEmployeeDto);
                JsonResponseUtil.sendJsonResponse204(res, startTime);
            }
        } catch (error) {
            next(error);
        }
    }

    deleteEmployee = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const employeeId = req.params.id;
            await this.employeeService.deleteEmployee(employeeId);
            JsonResponseUtil.sendJsonResponse204(res, startTime);
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;