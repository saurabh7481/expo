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
const models_1 = __importDefault(require("../models"));
const User = models_1.default.user;
const checkUserDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User.findOne({
            where: {
                username: req.body.username
            }
        });
        if (user) {
            return res.status(400).send({
                message: "Username is taken, try something else!"
            });
        }
        user = yield User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            return res.status(400).send({
                message: "Email is taken, try something else!"
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).send({
            message: "Oops! Something went wrong. Try again later"
        });
    }
});
exports.default = checkUserDetails;
