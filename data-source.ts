
import { DataSource } from "typeorm";
import SnakeNamingStrategy from "typeorm-naming-strategy";
import { Employee } from "./Employee";

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 8765,
    username: "postgres",
    password: "postgres",
    database: "training",
    entities: [Employee],
    synchronize: true,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;