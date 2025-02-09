import { DataSource } from "typeorm";
import env from "dotenv";

env.config();

export const appDataSource = new DataSource({
  type: "postgres",
  // host: process.env.PG_HOST,
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.DATABASE,
  entities: [],
  synchronize: true,
  logging: true,
});
