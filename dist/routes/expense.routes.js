"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const verifyAuth_1 = __importDefault(require("../middlewares/verifyAuth"));
const expense_controller_1 = require("../controllers/expense.controller");
router.post("/addexpense", verifyAuth_1.default, expense_controller_1.addExpense);
exports.default = router;
