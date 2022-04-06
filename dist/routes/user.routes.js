"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const verifyAuth_1 = __importDefault(require("../middlewares/verifyAuth"));
const verifySubscription_1 = __importDefault(require("../middlewares/verifySubscription"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
router.get("/getsubscription", verifyAuth_1.default, user_controller_1.default.getUserSubscription);
router.get("/leaderboard", verifyAuth_1.default, verifySubscription_1.default, user_controller_1.default.getLeaderboard);
exports.default = router;
