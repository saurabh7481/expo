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
const changeUserSubscription = (user, order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.update({ subscription: "plus", orderID: order_id }, {
            where: {
                id: user.id
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});
const getUserSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(req.user.subscription);
});
const getLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {};
        const users = yield User.findAll();
        yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            let totalExp = 0;
            try {
                const expenses = yield user.getExpenses();
                expenses.forEach((exp) => totalExp += exp.amount);
            }
            catch (err) {
                console.log(err);
            }
            data[user.username] = totalExp;
        })));
        res.status(200).json({ expenses: data });
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = {
    changeUserSubscription,
    getUserSubscription,
    getLeaderboard
};
