"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const cart_1 = require("./cart");
const categories_1 = require("./categories");
const favourite_1 = require("./favourite");
const otp_1 = require("./otp");
const products_1 = require("./products");
const user_1 = require("./user");
exports.entities = [
    user_1.User,
    cart_1.ProductCart,
    categories_1.Categories,
    favourite_1.Favourite,
    otp_1.Otp,
    products_1.Product,
];
