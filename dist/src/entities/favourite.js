"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favourite = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const products_1 = require("./products");
let Favourite = class Favourite {
};
exports.Favourite = Favourite;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", Number)
], Favourite.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.id),
    (0, typeorm_1.JoinColumn)({ name: "userid" }),
    __metadata("design:type", user_1.User)
], Favourite.prototype, "userid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => products_1.Product, (product) => product.id, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "productid" }),
    __metadata("design:type", products_1.Product)
], Favourite.prototype, "productid", void 0);
exports.Favourite = Favourite = __decorate([
    (0, typeorm_1.Entity)()
], Favourite);
