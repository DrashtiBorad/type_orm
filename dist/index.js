"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
app.use("/", route_1.router);
console.log({
    NODE_ENV: process.env.NODE_ENV,
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
