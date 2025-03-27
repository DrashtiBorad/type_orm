"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.appDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    port: 5432,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.DATABASE,
    entities: process.env.NODE_ENV === "production"
        ? ["dist/entities/*.js"]
        : ["src/entities/*.ts"],
    synchronize: true,
    logging: true,
});
