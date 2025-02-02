import "reflect-metadata";
import express from "express";
import cors from "cors";
import env from "dotenv";
import { DataSource } from "typeorm";
const app = express();
const port = 3003;
app.use(cors());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
env.config();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server started Successfully." });
});

export const appDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.DATABASE,
  entities: [],
  synchronize: true,
  logging: true,
});

appDataSource
  .initialize()
  .then(() => {
    console.log("connected");
    app.listen(port, () => {
      console.log(`server starting at port ${port}`);
    });
  })
  .catch((err) => console.log("err", err));
