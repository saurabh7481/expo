"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const verifyAuth_1 = __importDefault(require("../middlewares/verifyAuth"));
const plus_controller_1 = __importDefault(require("../controllers/plus.controller"));
const verifySubscription_1 = __importDefault(require("../middlewares/verifySubscription"));
router.post("/createOrder", verifyAuth_1.default, plus_controller_1.default.createOrder);
router.post("/verifyOrder", verifyAuth_1.default, plus_controller_1.default.verifyOrder);
router.get("/download", verifyAuth_1.default, verifySubscription_1.default, plus_controller_1.default.downloadExpenses);
router.get("/expensefiles", verifyAuth_1.default, verifySubscription_1.default, plus_controller_1.default.getExpenseFiles);
router.get("/expenses", verifyAuth_1.default, verifySubscription_1.default, plus_controller_1.default.getAllExpenses);
exports.default = router;
