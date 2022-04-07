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
const razorpay_1 = __importDefault(require("../utils/razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const user_controller_1 = __importDefault(require("./user.controller"));
const ITEM_PER_PAGE = 5;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency, receipt, notes } = req.body;
    try {
        const order = yield razorpay_1.default.orders.create({
            amount,
            currency,
            receipt,
            notes,
        });
        if (order) {
            res.json({ order: order, key: process.env.RAZORPAY_ID });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});
const verifyOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const key_secret = process.env.RAZORPAY_SECRET;
    const hmac = crypto_1.default.createHmac("sha256", key_secret !== null && key_secret !== void 0 ? key_secret : "");
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");
    if (razorpay_signature === generated_signature) {
        user_controller_1.default.changeUserSubscription(req.user, razorpay_order_id);
        res.json({ success: true, message: "Payment has been verified" });
    }
    else
        res.json({ success: false, message: "Payment verification failed" });
});
const downloadExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `Expense-${req.user.id}-${new Date()}.txt`;
        const fileUrl = yield upoloadToS3(stringifiedExpenses, fileName);
        yield req.user.createExpensefile({
            url: fileUrl,
            name: fileName,
        });
        res.status(200).json({ success: true, url: fileUrl });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});
const upoloadToS3 = (data, name) => {
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: process.env.IAM_USERID,
        secretAccessKey: process.env.IAM_SECRET,
    });
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: name,
        Body: data,
        ACL: "public-read",
    };
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.Location);
        });
    });
};
const getExpenseFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || ITEM_PER_PAGE;
        const startIdx = (page - 1) * limit;
        const lastIdx = page * limit;
        const result = {
            next: undefined,
            previous: undefined,
            files: undefined
        };
        const files = yield req.user.getExpensefiles();
        if (lastIdx < files.length) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIdx > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        const paginatedFiles = yield req.user.getExpensefiles({
            offset: startIdx,
            limit: limit,
        });
        result.files = paginatedFiles;
        res.status(200).json({ success: true, result: result });
    }
    catch (err) {
        res.json({ success: false, error: err });
    }
});
const getAllExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || ITEM_PER_PAGE;
        const startIdx = (page - 1) * limit;
        const lastIdx = page * limit;
        const result = {
            next: undefined,
            previous: undefined,
            expenses: undefined
        };
        const expenses = yield req.user.getExpenses();
        if (lastIdx < expenses.length) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIdx > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        const paginatedExpenses = yield req.user.getExpenses({
            offset: startIdx,
            limit: limit,
        });
        result.expenses = paginatedExpenses;
        res.status(200).json({ success: true, result: result });
    }
    catch (err) {
        res.json({ success: false, error: err });
    }
});
exports.default = {
    createOrder,
    verifyOrder,
    downloadExpenses,
    getAllExpenses,
    getExpenseFiles
};
