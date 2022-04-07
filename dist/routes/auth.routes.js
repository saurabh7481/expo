"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const checkUserDetails_1 = __importDefault(require("../middlewares/checkUserDetails"));
const auth_controller_1 = require("../controllers/auth.controller");
router.post("/signup", checkUserDetails_1.default, auth_controller_1.signUp);
router.post("/login", auth_controller_1.login);
router.post("/password/forgotpassword", auth_controller_1.forgotPassword);
router.get("/password/resetpassword/:id", auth_controller_1.resetPassword);
router.post("/password/updatepassword", auth_controller_1.updatePassword);
router.get("/logout", auth_controller_1.logout);
exports.default = router;
