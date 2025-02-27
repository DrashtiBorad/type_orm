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
exports.removeFaviouriteItems = exports.getFaviouriteItems = exports.addToFaviourite = void 0;
const database_1 = require("../config/database");
const favourite_1 = require("../entities/favourite");
const faviouriteDataSource = database_1.appDataSource.getRepository(favourite_1.Favourite);
const addToFaviourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, userId } = req.body;
    try {
        const isItemIsAddedInFaviourite = yield faviouriteDataSource.find(productId);
        console.log("isItemIsAddedInFaviourite", isItemIsAddedInFaviourite);
        if (isItemIsAddedInFaviourite.length === 0) {
            yield faviouriteDataSource.insert({
                productid: productId,
                userid: userId,
            });
            res.status(200).json({ message: "Item is added in faviourite" });
        }
        else {
            res.status(400).json({ message: "Item is already added in faviourite" });
        }
    }
    catch (err) {
        res.status(200).json({ Error: err });
    }
});
exports.addToFaviourite = addToFaviourite;
const getFaviouriteItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        let result = {};
        if (userId) {
            result = yield faviouriteDataSource.find(userId);
            console.log(result, "resultresultresult");
        }
        else {
            result = yield faviouriteDataSource
                .createQueryBuilder("favourite")
                .leftJoinAndSelect("favourite.userid", "user")
                .leftJoinAndSelect("favourite.productid", "product")
                .getMany();
        }
        res.status(200).json({ "All Favourite ": result });
    }
    catch (err) {
        res.status(200).json({ Error: err });
    }
});
exports.getFaviouriteItems = getFaviouriteItems;
const removeFaviouriteItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    try {
        const result = yield faviouriteDataSource.delete({ productid: productId });
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ Error: err });
    }
});
exports.removeFaviouriteItems = removeFaviouriteItems;
