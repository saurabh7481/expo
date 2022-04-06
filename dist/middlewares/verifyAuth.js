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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = process.env;
const models_1 = __importDefault(require("../models"));
const User = models_1.default.user;
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send("Unauthorized");
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, (_a = config.JWT_SECRET) !== null && _a !== void 0 ? _a : "");
        const user = yield User.findByPk(decode.id);
        if (user)
            req.user = user;
    }
    catch (err) {
        console.log(err);
        return res.status(401).send("Invalid Authorization");
    }
    return next();
});
exports.default = verifyAuth;
