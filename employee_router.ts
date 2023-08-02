import express from "express";
import { Employee } from './Employee';

const employeeRouter = express.Router();
let count = 2;
const employees: Employee[] = [
    {
        id: 1,
        name: 'John',
        email: 'john@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
    }, {
        id: 2,
        name: 'Jerry',
        email: 'jerry@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

employeeRouter.get('/', (req, res) => {
    res.status(200).send(employees);
});

employeeRouter.get('/:id', (req, res) => {
    const employee = employees.find((employee) => employee.id.toString() === req.params.id);

    if (employee === undefined) {
        res.status(404).send('Employee not found!');
    }
    else {
        res.status(200).send(employee);
    }
});

employeeRouter.put('/:id', (req, res) => {
    const employee = employees.find((employee) => employee.id.toString() === req.params.id);

    if (employee === undefined) {
        res.status(404).send('Employee not found!');
    } else if (req.body.name === undefined || req.body.email === undefined) {
        res.status(400).send("Enter all employee details!");
    } else {
        employee.name = req.body.name;
        employee.email = req.body.email;
        employee.updatedAt = new Date();
        res.status(204).send();
    }
});

employeeRouter.patch('/:id', (req, res) => {
    console.log(req.body);

    const employee = employees.find((employee) => employee.id.toString() === req.params.id);

    if (employee === undefined) {
        res.status(404).send('Employee not found!');
    } else {
        if (req.body.name !== undefined) {
            employee.name = req.body.name;
        }
        if (req.body.email !== undefined) {
            employee.email = req.body.email;
        }
        employee.updatedAt = new Date();
        res.status(204).send();
    }
});

employeeRouter.delete('/:id', (req, res) => {
    const employee = employees.find((employee) => employee.id.toString() === req.params.id);

    if (employee === undefined) {
        res.status(404).send('Employee not found!');
    }
    else {
        employees.splice(employees.indexOf(employee));
        res.status(204).send();
    }
});

employeeRouter.post('/', (req, res) => {
    const newEmployee = new Employee();
    newEmployee.id = ++count;
    newEmployee.name = req.body.name;
    newEmployee.email = req.body.email;
    newEmployee.createdAt = new Date();
    newEmployee.updatedAt = new Date();

    employees.push(newEmployee);

    res.status(201).send(newEmployee);
});

export default employeeRouter;