import { DataSource } from "typeorm";
import SnakeNamingStrategy from "typeorm-naming-strategy";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/../.env' });

const dataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
    entities: ["dist/entity/*.js"],
    migrations: ["dist/db/migrations/*.js"],
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;