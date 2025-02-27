"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFormCart = exports.getItemsFromCart = exports.addToCart = void 0;
const database_1 = require("../config/database");
const cart_1 = require("../entities/cart");
const cartDataSource = database_1.appDataSource.getRepository(cart_1.ProductCart);
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity, userId, productId } = req.body;
    console.log("Repository Metadata:", cartDataSource.metadata.columns);
    try {
        const ifProductExist = yield cartDataSource.findOne({
            where: {
                userid: { id: userId },
                productid: { id: productId },
            },
        });
        console.log("ifProductExistifProductExist", ifProductExist);
        if (ifProductExist) {
            ifProductExist.quantity += quantity;
            console.log("ifProductExist.quantity", ifProductExist.quantity);
            yield cartDataSource.update({ productid: productId }, { quantity: ifProductExist.quantity });
            res
                .status(200)
                .json({ message: "Product quantity update successfully." });
        }
        else {
            yield cartDataSource.insert({
                productid: productId,
                quantity: quantity,
                userid: userId,
            });
            res.status(200).json({ message: "product is added in Cart" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addToCart = addToCart;
const getItemsFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const queryBuilder = cartDataSource.createQueryBuilder("product_cart");
        if (userId) {
            queryBuilder
                .leftJoinAndSelect("product_cart.productid", "product")
                .where("product_cart.userid = :userId", { userId });
        }
        else {
            queryBuilder
                .leftJoinAndSelect("product_cart.userid", "user")
                .leftJoinAndSelect("product_cart.productid", "product");
        }
        const result = yield queryBuilder.getMany();
        res.status(200).json({ "All Product": result });
    }
    catch (err) {
        res.status(500).json({ Error: err });
    }
});
exports.getItemsFromCart = getItemsFromCart;
const removeFormCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    try {
        const result = yield cartDataSource.delete({ productid: productId });
        res.status(200).json({ message: result });
    }
    catch (err) {
        res.status(500).json({ Error: err });
    }
});
exports.removeFormCart = removeFormCart;
