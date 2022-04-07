"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const models_1 = __importDefault(require("./models"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const plus_routes_1 = __importDefault(require("./routes/plus.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.use("/api", auth_routes_1.default);
app.use("/api/expense", expense_routes_1.default);
app.use("/api/plus", plus_routes_1.default);
app.use("/api/user", user_routes_1.default);
const PORT = process.env.PORT || 3000;
models_1.default.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
    });
});
