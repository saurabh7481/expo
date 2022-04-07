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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.login = exports.signUp = void 0;
/* eslint-disable no-mixed-spaces-and-tabs */
const models_1 = __importDefault(require("../models"));
const User = models_1.default.user;
const ResetPasswordRequest = models_1.default.ResetPasswordRequest;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const path_1 = __importDefault(require("path"));
mail_1.default.setApiKey((_a = process.env.SENDGRID_KEY) !== null && _a !== void 0 ? _a : "");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.create({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: bcryptjs_1.default.hashSync(req.body.password, 8),
            subscription: "standard"
        });
        if (user)
            res.send({ message: "User registered successfully!" });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { email, password } = req.body;
    const user = yield User.findOne({
        where: {
            email: email
        }
    });
    if (!user)
        return res.status(404).json({ error: "User does not exists" });
    const validPass = yield bcryptjs_1.default.compare(password, user.password);
    if (!validPass)
        return res.status(401).json({ error: "Invalid Credentials" });
    const token = jsonwebtoken_1.default.sign({ id: user.id }, (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : "");
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 90000)
    });
    const { username, subscription } = user;
    return res.status(200).json({ token, user: { username, email, subscription } });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield User.findOne({
            where: {
                email: email
            }
        });
        const req_id = crypto_1.default.randomUUID();
        yield user.createResetpasswordrequest({
            id: req_id,
            isActive: true
        });
        const url = `http://localhost:3000/api/password/resetpassword/${req_id}`;
        const msg = {
            to: email,
            from: "saurabh7481@gmail.com",
            subject: "Your reset password link",
            text: "Here is your reset password link",
            html: `<h3>Here is your reset password link<h3><br/><br/>${url}`,
        };
        const response = yield mail_1.default.send(msg);
        res.json({ success: true, response: response });
    }
    catch (err) {
        res.json({ success: false, error: err });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const req_id = req.params.id;
        const request = yield ResetPasswordRequest.findByPk(req_id);
        if (request.isActive) {
            console.log(path_1.default.join(__dirname, "..", "/utils/resetPassword.html"));
            res.sendFile(path_1.default.join(__dirname, "..", "/utils/resetPassword.html"));
        }
        else {
            res.json({ success: false, message: "Something went wrong! Please try again." });
        }
    }
    catch (err) {
        res.json({ success: false, message: "Something went wrong! Please try again." });
    }
});
exports.resetPassword = resetPassword;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield User.findOne({
            where: {
                email: email
            }
        });
        const newPass = bcryptjs_1.default.hashSync(req.body.password, 8);
        user.password = newPass;
        yield user.save();
        const request = yield ResetPasswordRequest.findOne({
            user_id: user.id
        });
        request.isActive = false;
        yield request.save();
        res.status(200).json({ success: true, message: "Password updated!" });
    }
    catch (error) {
        res.json({ error: error });
    }
});
exports.updatePassword = updatePassword;
const logout = (req, res) => {
    res.clearCookie("token");
    return res.redirect("/");
};
exports.logout = logout;
