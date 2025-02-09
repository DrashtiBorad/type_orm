import "reflect-metadata";
import express from "express";
import cors from "cors";
import env from "dotenv";
import { appDataSource } from "./src/config/database";
import { router } from "./src/api/route";
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
app.use(router);
env.config();
console.log({
  pg_Host: process.env.PG_HOST,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.DATABASE,
  jsonKey: process.env.JSON_KEY,
  email: process.env.AUTH_USER_EMAIL,
  json_password: process.env.AUTH_USER_PASSWORD,
  bucketName: process.env.BUCKET_NAME,
  awsKey: process.env.AWS_ACCESSKEY_ID,
  seceretKey: process.env.AWS_SECRET_ACCESS_KEY,
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
