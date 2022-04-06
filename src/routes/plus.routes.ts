import express from "express";
const router = express.Router();

import verifyAuth from "../middlewares/verifyAuth";
import plusController from "../controllers/plus.controller";
import verifySubscription from "../middlewares/verifySubscription";

router.post( "/createOrder", verifyAuth, plusController.createOrder );
router.post( "/verifyOrder", verifyAuth, plusController.verifyOrder );
router.get( "/download", verifyAuth, verifySubscription, plusController.downloadExpenses );
router.get( "/expensefiles", verifyAuth, verifySubscription, plusController.getExpenseFiles );
router.get("/expenses", verifyAuth, verifySubscription, plusController.getAllExpenses);


export default router;