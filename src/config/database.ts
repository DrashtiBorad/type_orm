import { DataSource } from "typeorm";
import env from "dotenv";

env.config();

export const appDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.DATABASE,
  entities: ["dist/src/entities/*.js"],
  synchronize: true,
  logging: true,
});
