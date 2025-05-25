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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.otpVerify = exports.sendOtp = exports.logIn = exports.registration = void 0;
const database_1 = require("../config/database");
const otp_1 = require("../entities/otp");
const user_1 = require("../entities/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const userDataSource = database_1.appDataSource.getRepository(user_1.User);
const OtpDataSource = database_1.appDataSource.getRepository(otp_1.Otp);
const jwtPrivateKey = process.env.JSON_KEY;
const registration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirmPassword, role } = req.body;
    try {
        const user = yield userDataSource.find({
            where: {
                email: email,
            },
        });
        if (user.length > 0) {
            return res.status(400).json({ error: "Email is already registered." });
        }
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ error: "Password and ConfirmPassword do not match." });
        }
        const result = yield userDataSource.insert({
            name,
            email,
            password,
            role,
        });
        jsonwebtoken_1.default.sign({ result }, jwtPrivateKey, { expiresIn: "1h" }, (error, token) => {
            if (token) {
                res.status(200).json({ result, auth: token });
            }
            else if (error) {
                console.log("error in jwt token", error);
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.registration = registration;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const result = yield userDataSource.find({
            where: {
                email: email,
                password: password,
            },
        });
        if (result.length > 0) {
            jsonwebtoken_1.default.sign({ result }, jwtPrivateKey, { expiresIn: "1h" }, (error, token) => {
                if (token) {
                    res.status(200).json({ result, auth: token });
                }
                else if (error) {
                    console.log("error in jwt token", error);
                }
            });
        }
        else {
            res.status(400).json({ error: "Please Enter valid Email and password" });
        }
    }
    catch (err) {
        res.send(400).json({ error: err });
    }
});
exports.logIn = logIn;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userDataSource.findOne({ where: { email: email } });
    if (!user) {
        return res.status(400).json({ error: "Email is not registered." });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_USER_EMAIL,
                pass: process.env.AUTH_USER_PASSWORD,
            },
        });
        const info = transporter.sendMail({
            from: process.env.AUTH_USER_EMAIL,
            to: email,
            subject: "send mail",
            html: `OTP is ${otpCode}`,
        });
        yield OtpDataSource.delete({ email });
        OtpDataSource.save({ email, otpCode, expiredAt: expireAt });
        res.status(200).json({ message: "OTP sent Successfully", otpCode });
    }
    catch (err) {
        res.send(400).json("Failed to send mail");
    }
});
exports.sendOtp = sendOtp;
const otpVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const storedOtps = yield OtpDataSource.find({ where: { email } });
    const storedOtp = storedOtps[0];
    const expiredTime = new Date(storedOtp.expiredAt);
    if (!storedOtp) {
        res.status(400).json({ error: "OTP not found or expir]ed" });
    }
    if (new Date(Date.now()) > expiredTime) {
        yield OtpDataSource.delete({ email: email });
        res.status(400).json({ error: "OTP expired" });
    }
    if (otp === storedOtp.otpCode) {
        const token = jsonwebtoken_1.default.sign({ email }, jwtPrivateKey, {
            expiresIn: "1h",
        });
        yield OtpDataSource.delete({ email: email });
        res.status(200).json({
            message: "OTP verified successfully",
            token,
        });
    }
    else {
        res.status(500).json({ eror: "Invalid OTP." });
    }
});
exports.otpVerify = otpVerify;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword } = req.body;
    const token = req.headers["authorization"];
    if (!token) {
        res.status(401).json({ error: "Authorization header is missing" });
    }
    const extractedToken = token === null || token === void 0 ? void 0 : token.split(" ")[1];
    console.log("extractedTokenextractedToken", extractedToken);
    try {
        const decoded = jsonwebtoken_1.default.verify(extractedToken, jwtPrivateKey);
        const { result } = decoded;
        const { email } = result;
        if (password === confirmPassword) {
            const result = yield userDataSource.update(email, { password });
            res.status(200).json(result);
        }
        else {
            res
                .status(500)
                .json({ error: "Password and ConfirmPassword is not match." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.resetPassword = resetPassword;
