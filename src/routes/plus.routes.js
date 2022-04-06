const express = require( "express" );
const router = express.Router();

const verifyAuth = require( "../middlewares/verifyAuth" );
const plusController = require( "../controllers/plus.controller" );
const verifySubscription = require( "../middlewares/verifySubscription" );

router.post( "/createOrder", verifyAuth, plusController.createOrder );
router.post( "/verifyOrder", verifyAuth, plusController.verifyOrder );
router.get( "/download", verifyAuth, verifySubscription, plusController.downloadExpenses );
router.get( "/expensefiles", verifyAuth, verifySubscription, plusController.getExpenseFiles );
router.get("/expenses", verifyAuth, verifySubscription, plusController.getAllExpenses);


module.exports = router;