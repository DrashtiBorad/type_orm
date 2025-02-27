"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./src/config/database");
const route_1 = require("./src/api/route");
const app = (0, express_1.default)();
const port = 3003;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(route_1.router);
dotenv_1.default.config();
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
database_1.appDataSource
    .initialize()
    .then(() => {
    console.log("connected");
    app.listen(port, () => {
        console.log(`server starting at port ${port}`);
    });
})
    .catch((err) => console.log("err", err));
