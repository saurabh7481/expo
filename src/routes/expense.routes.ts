import express from "express";
const router = express.Router();

import verifyAuth from "../middlewares/verifyAuth";
import {addExpense} from "../controllers/expense.controller";

router.post( "/addexpense", verifyAuth, addExpense );

export default router;