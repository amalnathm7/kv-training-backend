import { DataSource } from "typeorm";
import SnakeNamingStrategy from "typeorm-naming-strategy";
import { Employee } from "../entity/employee.entity";
import Address from "../entity/address.entity";

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 8765,
    username: "postgres",
    password: "postgres",
    database: "training",
    entities: ["dist/entity/*.js"],
    migrations: ["dist/db/migrations/*.js"],
    // logging: true,
    namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;