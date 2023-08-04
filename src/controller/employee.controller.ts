import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../dto/create-employee.dto";
import { validate } from "class-validator";
import ValidationException from "../exception/validation.exception";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import LoginEmployeeDto from "../dto/login-employee.dto";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";

class EmployeeController {
    public router: express.Router;

    constructor(private employeeService: EmployeeService) {
        this.router = express.Router();
        this.router.post("/", authenticate, authorize, this.createEmployee);
        this.router.get("/", authenticate, this.getAllEmployees);
        this.router.get("/:id", authenticate, this.getEmployeeById);
        this.router.put("/:id", authenticate, this.setEmployee);
        this.router.patch("/:id", authenticate, this.updateEmployee);
        this.router.delete("/:id", authenticate, authorize, this.deleteEmployee);
        this.router.post("/login", this.loginEmployee);
    }

    loginEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const loginEmployeeDto = plainToInstance(LoginEmployeeDto, req.body);
            const errors = await validate(loginEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                const token = await this.employeeService.loginEmployee(loginEmployeeDto);
                res.status(200).send({ data: token });
            }
        } catch (error) {
            next(error);
        }
    }

    getAllEmployees = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employees = await this.employeeService.getAllEmployees();
            res.status(200).send(employees);
        } catch (e) {
            next(e);
        }
    }

    getEmployeeById = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeById(employeeId);
            res.status(200).send(employee);
        } catch (error) {
            next(error);
        }
    }

    createEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                const newEmployee = await this.employeeService.createEmployee(createEmployeeDto);
                res.status(201).send(newEmployee);
            }
        } catch (error) {
            next(error);
        }
    }

    setEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.employeeService.updateEmployee(employeeId, createEmployeeDto);
                res.status(204).send();
            }
        } catch (error) {
            next(error);
        }
    }

    updateEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
            const errors = await validate(updateEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.employeeService.updateEmployee(employeeId, updateEmployeeDto);
                res.status(204).send();
            }
        } catch (error) {
            next(error);
        }
    }

    deleteEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            await this.employeeService.deleteEmployee(employeeId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;