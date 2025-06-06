import { DataSource } from "typeorm";
import env from "dotenv";
import { entities } from "../entities";

env.config();

export const appDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  port: 5432,
  host: "localhost",
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.DATABASE,
  entities: entities,
  synchronize: true,
  logging: true,
});
