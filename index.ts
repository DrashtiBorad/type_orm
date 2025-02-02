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

appDataSource
  .initialize()
  .then(() => {
    console.log("connected");
    app.listen(port, () => {
      console.log(`server starting at port ${port}`);
    });
  })
  .catch((err) => console.log("err", err));
