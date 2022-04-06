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
exports.addExpense = void 0;
const addExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield req.user.createExpense({
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
        });
        if (expense)
            res.send({ message: "Expense Added!" });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.addExpense = addExpense;
