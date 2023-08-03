import { DataSource } from "typeorm";
import SnakeNamingStrategy from "typeorm-naming-strategy";
import { Employee } from "../entity/employee.entity";

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 8765,
    username: "postgres",
    password: "postgres",
    database: "training",
    entities: [Employee],
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;