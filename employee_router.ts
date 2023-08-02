import express, { Request, Response } from "express";
import { Employee } from './Employee';
import dataSource from "./data-source";
import { FindOptionsWhere, Like } from "typeorm";

const employeeRouter = express.Router();

employeeRouter.get('/', async (req: Request, res: Response) => {
    const employeeRepository = dataSource.getRepository(Employee);

    const nameFilter = req.query.name;
    const emailFilter = req.query.email;

    // const filters: FindOptionsWhere<Employee> = {};

    // if (nameFilter) {
    //     filters.name = Like("%" + nameFilter + "%")
    // }

    // const employees = await employeeRepository.find({
    //     where: filters
    // });

    // const employees = await employeeRepository.createQueryBuilder().where("name LIKE :name", {
    //     name: `${nameFilter}%` 
    // }).andWhere("email LIKE :email", {
    //     email: `%${emailFilter}%`
    // }).getMany();

    const qb = employeeRepository.createQueryBuilder();
    if (nameFilter) {
        qb.andWhere("name LIKE :name", { name: `${nameFilter}%` });
    }
    if (emailFilter) {
        qb.andWhere("email LIKE :email", { email: `%${emailFilter}%` });
    }

    const employees = await qb.getMany();

    res.status(200).send(employees);
});

employeeRouter.post('/', async (req: Request, res: Response) => {
    const employeeRepository = dataSource.getRepository(Employee);

    const newEmployee = new Employee();

    if (!req.body.name || !req.body.email) {
        res.status(400).send({ 'message': 'All fields are not supplied' });
    } else {
        newEmployee.name = req.body.name;
        newEmployee.email = req.body.email;
        const savedEmployee = await employeeRepository.save(newEmployee);
        res.status(201).send(savedEmployee);
    }
});

employeeRouter.get('/:id', async (req: Request, res: Response) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) });

    if (!employee) {
        res.status(404).send({ 'message': 'Employee not found!' });
    } else {
        res.status(200).send(employee);
    }
});

employeeRouter.put('/:id', async (req: Request, res: Response) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) });

    if (!employee) {
        res.status(404).send({ 'message': 'Employee not found!' });
    } else if (!req.body.name || !req.body.email) {
        res.status(400).send({ 'message': 'All fields are not supplied' });
    } else {
        employee.name = req.body.name;
        employee.email = req.body.email;
        await employeeRepository.save(employee);
        res.status(204).send();
    }
});

employeeRouter.patch('/:id', async (req: Request, res: Response) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) });

    if (!employee) {
        res.status(404).send({ 'message': 'Employee not found!' });
    } else {
        if (req.body.name) {
            employee.name = req.body.name;
        }
        if (req.body.email) {
            employee.email = req.body.email;
        }
        await employeeRepository.save(employee);
        res.status(204).send();
    }
});

employeeRouter.delete('/:id', async (req: Request, res: Response) => {
    const employeeRepository = dataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) });

    if (!employee) {
        res.status(404).send({ 'message': 'Employee not found!' });
    } else {
        await employeeRepository.softRemove(employee);
        res.status(204).send();
    }
});

export default employeeRouter;